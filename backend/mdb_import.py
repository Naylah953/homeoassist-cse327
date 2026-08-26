"""
HomeoAssist — acid.mdb -> PostgreSQL direct importer (pure Python).

No MS Access / COM required: reads the Jet 4 MDB with access-parser
and bulk-inserts into PostgreSQL with psycopg2.

Usage:  python mdb_import.py
"""

import os
import sys

from access_parser import AccessParser
import psycopg2
from psycopg2.extras import execute_values

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))

# ── load backend/.env (no dotenv dependency) ────────────────
def _load_env():
    p = os.path.join(HERE, ".env")
    if os.path.exists(p):
        for line in open(p, encoding="utf-8"):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

_load_env()

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

# ── table map: (mdb_table, pg_table, {mdb_col_lower: pg_col}, int_cols, pk_col) ──
SYMPTOM_COLS = {
    "s_id": "s_id", "d_id": "d_id", "rub_id": "rub_id",
    "s_bname": "s_bname", "s_name": "s_name", "sbr_id": "sbr_id",
}
SYMPTOM_INTS = ["s_id", "d_id", "rub_id", "sbr_id"]

TABLES = [
    ("sbr01",    "symptom_rubrics",
     {"sbr_id": "sbr_id", "sbr_btxt": "sbr_btxt", "sbr_txt": "sbr_txt"},
     ["sbr_id"], "sbr_id"),
    ("bsbr01",   "b_symptom_rubrics",
     {"sbr_id": "sbr_id", "sbr_btxt": "sbr_btxt", "sbr_txt": "sbr_txt"},
     ["sbr_id"], "sbr_id"),
    ("sbr01cc",  "sbr01cc",
     {"sbr_id": "sbr_id", "sbr_btxt": "sbr_btxt", "sbr_txt": "sbr_txt"},
     ["sbr_id"], "sbr_id"),
    ("medi",     "medicines_mdb",
     {"m_id": "m_id", "m_txt": "m_txt", "m_btxt": "m_btxt", "m_du": "m_du"},
     ["m_id"], "m_id"),
    ("dose",     "dose",
     {"dos_id": "dos_id", "dos_btxt": "dos_btxt", "dos_etxt": "dos_etxt", "dose2": "dose2"},
     ["dos_id"], "dos_id"),
    ("potency",  "potency",
     {"pot_id": "pot_id", "pot_txt": "pot_txt"},
     ["pot_id"], "pot_id"),
    ("bcomplain", "bcomplain", SYMPTOM_COLS, SYMPTOM_INTS, "s_id"),
    ("complain",  "complain",  SYMPTOM_COLS, SYMPTOM_INTS, "s_id"),
    ("disease",   "disease",   SYMPTOM_COLS, SYMPTOM_INTS, "s_id"),
    ("bdisMedi",  "b_dis_medi",
     {"sd_id": "sd_id", "s_id": "s_id", "m_id": "m_id", "m_v": "m_v"},
     ["sd_id", "s_id", "m_id", "m_v"], "sd_id"),
    ("disMedi",   "dis_medi",
     {"sd_id": "sd_id", "s_id": "s_id", "m_id": "m_id", "m_v": "m_v"},
     ["sd_id", "s_id", "m_id", "m_v"], "sd_id"),
    ("mAn01",     "m_antidote",
     {"man_id": "man_id", "m_id": "m_id", "m_an": "m_an"},
     ["man_id", "m_id", "m_an"], "man_id"),
    ("mCo01",     "m_compare",
     {"mco_id": "mco_id", "m_id": "m_id", "m_co": "m_co"},
     ["mco_id", "m_id", "m_co"], "mco_id"),
    # NOTE: mFo01's ID column is literally named MIn_ID in the MDB (copy-paste
    # quirk in the original database) — rename it to mfo_id here.
    ("mFo01",     "m_followup",
     {"min_id": "mfo_id", "m_id": "m_id", "m_fo": "m_fo"},
     ["mfo_id", "m_id", "m_fo"], "mfo_id"),
    ("mIn01",     "m_indication",
     {"min_id": "min_id", "m_id": "m_id", "m_in": "m_in"},
     ["min_id", "m_id", "m_in"], "min_id"),
]

# NOT NULL columns with missing source values -> sensible defaults
DEFAULTS = {
    "bcomplain": {
        "rub_id": 1,    # 11 rows have NULL rub_ID; 1 = main heading
        "s_name": "",   # Bengali-only symptom rows lack the English name
    },
}

# FK safety: pg_table -> [(col, parent_pg_table, on_missing)]
#   "null" = set column to NULL (nullable FK), "skip" = drop the row
FK_RULES = {
    "bcomplain":  [("sbr_id", "symptom_rubrics", "null")],
    "complain":   [("sbr_id", "symptom_rubrics", "null")],
    "disease":    [("sbr_id", "symptom_rubrics", "null")],
    "b_dis_medi": [("s_id", "bcomplain", "skip"), ("m_id", "medicines_mdb", "skip")],
    "dis_medi":   [("s_id", "disease", "skip"),   ("m_id", "medicines_mdb", "skip")],
    "m_antidote": [("m_id", "medicines_mdb", "skip"), ("m_an", "medicines_mdb", "skip")],
    "m_compare":  [("m_id", "medicines_mdb", "skip"), ("m_co", "medicines_mdb", "skip")],
    "m_followup": [("m_id", "medicines_mdb", "skip"), ("m_fo", "medicines_mdb", "skip")],
    "m_indication": [("m_id", "medicines_mdb", "skip"), ("m_in", "medicines_mdb", "skip")],
}

PAGE_SIZE = 1000


def coerce(v, is_int):
    """Normalize an MDB value for PostgreSQL."""
    if v is None:
        return None
    if isinstance(v, bytes):
        v = v.decode("utf-8", "replace")
    if is_int:
        try:
            return int(float(v))
        except (TypeError, ValueError):
            return None
    return v


def main():
    print("=" * 60)
    print("  acid.mdb -> PostgreSQL  (pure Python, no MS Access)")
    print("=" * 60)

    db = AccessParser(MDB_PATH)
    conn = psycopg2.connect(**PG)
    cur = conn.cursor()
    print(f"Connected to {PG['dbname']} @ {PG['host']}\n")

    pk_sets = {}   # pg_table -> set of PK values (for FK validation)
    grand_total = 0

    for mdb_name, pg_name, col_map, int_cols, pk_col in TABLES:
        try:
            t = db.get_table(mdb_name)
            data = t.parse()
            # real column names are the keys of the parsed data dict
            mdb_cols = list(data.keys())
            nrows = len(next(iter(data.values()))) if data else 0
        except Exception as e:
            print(f"[{mdb_name} -> {pg_name}] PARSE ERROR: {e}")
            continue

        # align columns case-insensitively
        lc_data = {c.lower(): data[c] for c in data}
        pg_cols, src_cols, ints = [], [], []
        for mc in mdb_cols:
            pc = col_map.get(mc.lower())
            if pc is None:
                continue
            pg_cols.append(pc)
            src_cols.append(mc.lower())
            ints.append(pc in int_cols)

        fk_rules = FK_RULES.get(pg_name, [])

        insert_sql = (
            f"INSERT INTO {pg_name} ({', '.join(pg_cols)}) "
            f"VALUES %s ON CONFLICT DO NOTHING"
        )

        rows, skipped, nulled = [], 0, 0
        defaults = DEFAULTS.get(pg_name, {})
        for i in range(nrows):
            row = [coerce(lc_data[sc][i], ic) for sc, ic in zip(src_cols, ints)]

            for j, pc in enumerate(pg_cols):
                if row[j] is None and pc in defaults:
                    row[j] = defaults[pc]

            drop = False
            for col, parent, action in fk_rules:
                idx = pg_cols.index(col)
                v = row[idx]
                if v is not None and v not in pk_sets.get(parent, set()):
                    if action == "null":
                        row[idx] = None
                        nulled += 1
                    else:
                        drop = True
                        skipped += 1
                        break
            if not drop:
                rows.append(tuple(row))

        try:
            inserted = 0
            for start in range(0, len(rows), PAGE_SIZE):
                chunk = rows[start:start + PAGE_SIZE]
                execute_values(cur, insert_sql, chunk, page_size=PAGE_SIZE)
                inserted += len(chunk)
            conn.commit()
        except Exception as e:
            conn.rollback()
            print(f"[{mdb_name} -> {pg_name}] INSERT ERROR: {e}")
            continue

        # track PKs of this table for later FK validation
        pk_idx = pg_cols.index(pk_col)
        pk_sets[pg_name] = {r[pk_idx] for r in rows if r[pk_idx] is not None}

        grand_total += inserted
        extra = []
        if skipped:
            extra.append(f"{skipped} rows dropped (bad FK)")
        if nulled:
            extra.append(f"{nulled} sbr_id nulled")
        suffix = f"  ({'; '.join(extra)})" if extra else ""
        print(f"[{mdb_name} -> {pg_name}] {inserted:,}/{nrows:,} rows{suffix}")

    cur.close()
    conn.close()
    print(f"\nDone — {grand_total:,} rows imported.")


if __name__ == "__main__":
    main()
