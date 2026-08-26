"""
HomeoAssist — acid.mdb -> PostgreSQL Direct Importer
Reads every homeopathic table from acid.mdb via Access COM
and bulk-inserts them straight into the PostgreSQL homeoassist DB.

Usage:  python mdb_to_pg.py
"""

import win32com.client
import psycopg2
import psycopg2.extras
import os, sys

# Avoid UnicodeEncodeError on Windows cp1252 consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# ── Config (prefer backend/.env) ────────────────────────────
_ENV = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(_ENV):
    for _line in open(_ENV, encoding="utf-8"):
        _line = _line.strip()
        if not _line or _line.startswith("#") or "=" not in _line:
            continue
        _k, _v = _line.split("=", 1)
        os.environ.setdefault(_k.strip(), _v.strip())

MDB_PATH = os.environ.get(
    "MDB_PATH",
    r"C:\Users\USER\Downloads\homeoassist-cse327-main\homeoassist-cse327-main\acid.mdb",
)

PG = dict(
    host=os.environ.get("DB_HOST", "127.0.0.1"),
    port=int(os.environ.get("DB_PORT", "5432")),
    dbname=os.environ.get("DB_NAME", "homeoassist"),
    user=os.environ.get("DB_USER", "postgres"),
    password=os.environ.get("DB_PASSWORD", ""),
    connect_timeout=10,
)

BATCH_SIZE = 500   # rows per executemany batch

# ── Table map: Access table → (PG table, column rename dict) ─
# Column renames: {access_col_name: pg_col_name}  (lowercase match)
TABLE_MAP = [
    # (access_table,  pg_table,       {access_col: pg_col})
    ('sbr01',    'symptom_rubrics',   {'sbr_id':'sbr_id','sbr_btxt':'sbr_btxt','sbr_txt':'sbr_txt'}),
    ('bsbr01',   'b_symptom_rubrics', {'sbr_id':'sbr_id','sbr_btxt':'sbr_btxt','sbr_txt':'sbr_txt'}),
    ('sbr01cc',  'sbr01cc',           {'sbr_id':'sbr_id','sbr_btxt':'sbr_btxt','sbr_txt':'sbr_txt'}),
    ('medi',     'medicines_mdb',     {'m_id':'m_id','m_txt':'m_txt','m_btxt':'m_btxt','m_du':'m_du'}),
    ('dose',     'dose',              {'dos_id':'dos_id','dos_btxt':'dos_btxt','dos_etxt':'dos_etxt','dose2':'dose2'}),
    ('potency',  'potency',           {'pot_id':'pot_id','pot_txt':'pot_txt'}),
    ('bcomplain','bcomplain',         {'s_id':'s_id','d_id':'d_id','rub_id':'rub_id',
                                       's_bname':'s_bname','s_name':'s_name','sbr_id':'sbr_id'}),
    ('complain', 'complain',          {'s_id':'s_id','d_id':'d_id','rub_id':'rub_id',
                                       's_bname':'s_bname','s_name':'s_name','sbr_id':'sbr_id'}),
    ('disease',  'disease',           {'s_id':'s_id','d_id':'d_id','rub_id':'rub_id',
                                       's_bname':'s_bname','s_name':'s_name','sbr_id':'sbr_id'}),
    ('bdismedi', 'b_dis_medi',        {'sd_id':'sd_id','s_id':'s_id','m_id':'m_id','m_v':'m_v'}),
    ('dismedi',  'dis_medi',          {'sd_id':'sd_id','s_id':'s_id','m_id':'m_id','m_v':'m_v'}),
    ('man01',    'm_antidote',        {'man_id':'man_id','m_id':'m_id','m_an':'m_an'}),
    ('mco01',    'm_compare',         {'mco_id':'mco_id','m_id':'m_id','m_co':'m_co'}),
    ('mfo01',    'm_followup',        {'mfo_id':'mfo_id','m_id':'m_id','m_fo':'m_fo'}),
    ('min01',    'm_indication',      {'min_id':'min_id','m_id':'m_id','m_in':'m_in'}),
]

def get_col_map(rs, col_map):
    """
    Return (access_field_indices, pg_column_names) aligned lists.
    Matches Access column names case-insensitively against col_map keys.
    """
    access_fields = []
    pg_cols       = []
    for i in range(rs.Fields.Count):
        aname = rs.Fields(i).Name
        key   = aname.lower()
        # Try exact lower match, then strip leading/trailing underscores
        pg_col = col_map.get(key) or col_map.get(key.strip('_'))
        if pg_col is None:
            # fallback: just use the lowercased access name
            pg_col = key
        access_fields.append(i)
        pg_cols.append(pg_col)
    return access_fields, pg_cols


def ensure_database():
    """Create the target database if it does not exist."""
    admin = dict(PG)
    target = admin.pop("dbname")
    admin["dbname"] = "postgres"
    conn = psycopg2.connect(**admin)
    conn.autocommit = True
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_database WHERE datname=%s", (target,))
    if not cur.fetchone():
        cur.execute(f'CREATE DATABASE "{target}"')
        print(f"  Created database: {target}")
    else:
        print(f"  Database exists: {target}")
    conn.close()


def import_table(db, access_name, pg_name, col_map, pg_cur):
    """Open an Access recordset and copy all rows into PostgreSQL."""
    print(f"  [{access_name} -> {pg_name}] ...", end=" ", flush=True)

    # Try the exact name, then title-case variants
    rs = None
    for try_name in [access_name, access_name.capitalize(),
                     access_name[0].upper() + access_name[1:]]:
        try:
            rs = db.OpenRecordset(try_name)
            break
        except Exception:
            pass

    if rs is None:
        print("NOT FOUND in MDB - skipping")
        return 0

    if rs.EOF:
        print("EMPTY")
        rs.Close()
        return 0

    rs.MoveLast()
    total = rs.RecordCount
    rs.MoveFirst()

    # Build normalised col_map: lower-case keys
    lc_map = {k.lower(): v for k, v in col_map.items()}
    field_indices, pg_cols = get_col_map(rs, lc_map)
    col_str      = ', '.join(pg_cols)
    placeholders = ', '.join(['%s'] * len(pg_cols))
    insert_sql   = f'INSERT INTO {pg_name} ({col_str}) VALUES ({placeholders}) ON CONFLICT DO NOTHING'

    inserted = 0
    batch    = []

    while not rs.EOF:
        row = tuple(rs.Fields(i).Value for i in field_indices)
        batch.append(row)

        if len(batch) >= BATCH_SIZE:
            pg_cur.executemany(insert_sql, batch)
            inserted += len(batch)
            batch = []
            print('.', end='', flush=True)

        rs.MoveNext()

    if batch:
        pg_cur.executemany(insert_sql, batch)
        inserted += len(batch)

    rs.Close()
    print(f"OK  {inserted}/{total} rows")
    return inserted


def run_schema(pg_conn):
    """Drop & recreate all tables via schema.sql."""
    schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")
    if not os.path.exists(schema_path):
        print("  ERROR: schema.sql not found — cannot create tables")
        return False
    with open(schema_path, encoding="utf-8") as f:
        sql = f.read()
    cur = pg_conn.cursor()
    cur.execute(sql)
    pg_conn.commit()
    print("  schema.sql executed — all tables created")
    return True


def main():
    print("=" * 60)
    print("  HomeoAssist  acid.mdb -> PostgreSQL  Direct Import")
    print("=" * 60)

    # ── Ensure DB exists ───────────────────────────────────
    print("\nEnsuring PostgreSQL database...")
    try:
        ensure_database()
    except Exception as e:
        print(f"  ERROR ensuring database: {e}")
        sys.exit(1)

    # ── Connect to PostgreSQL ──────────────────────────────
    print("\nConnecting to PostgreSQL...")
    try:
        pg_conn = psycopg2.connect(**PG)
        pg_conn.autocommit = False
        print("  Connected")
    except Exception as e:
        print(f"  ERROR: PostgreSQL connection failed: {e}")
        sys.exit(1)

    # ── Run schema ─────────────────────────────────────────
    print("\nRunning schema.sql...")
    if not run_schema(pg_conn):
        pg_conn.close()
        sys.exit(1)

    # ── Connect to Access ──────────────────────────────────
    print("\nOpening acid.mdb via Access COM...")
    try:
        access = win32com.client.Dispatch("Access.Application")
        access.Visible = False
        access.OpenCurrentDatabase(MDB_PATH, False)
        db = access.CurrentDb()
        print("  acid.mdb opened")
    except Exception as e:
        print(f"  ERROR: Access COM failed: {e}")
        pg_conn.close()
        sys.exit(1)

    # ── Import each table ──────────────────────────────────
    print("\nImporting MDB tables...")
    cur = pg_conn.cursor()
    total_rows = 0
    errors = []

    for access_name, pg_name, col_map in TABLE_MAP:
        try:
            n = import_table(db, access_name, pg_name, col_map, cur)
            pg_conn.commit()
            total_rows += n
        except Exception as e:
            pg_conn.rollback()
            msg = f"{access_name} -> {pg_name}: {e}"
            errors.append(msg)
            print(f"\n  ERROR: {msg}")

    # ── Close Access ───────────────────────────────────────
    try:
        access.CloseCurrentDatabase()
        access.Quit()
    except Exception:
        pass

    # ── Summary ────────────────────────────────────────────
    print("\nRow counts in PostgreSQL:")
    mdb_tables = [t[1] for t in TABLE_MAP]
    for tbl in mdb_tables:
        try:
            cur.execute(f"SELECT COUNT(*) FROM {tbl}")
            count = cur.fetchone()[0]
            print(f"   {tbl:<25} {count:>8,}")
        except Exception:
            print(f"   {tbl:<25}  (error)")

    pg_conn.commit()
    pg_conn.close()

    print(f"\n{'=' * 60}")
    if errors:
        print(f"Completed with {len(errors)} error(s):")
        for e in errors:
            print(f"   - {e}")
    else:
        print(f"All done!  {total_rows:,} MDB rows imported into PostgreSQL.")
    print("=" * 60)


if __name__ == '__main__':
    main()
