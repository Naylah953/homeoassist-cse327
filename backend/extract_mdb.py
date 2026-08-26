"""
HomeoAssist — acid.mdb Full Data Extractor
Reads all tables from acid.mdb and writes SQL seed files.

Usage: python extract_mdb.py
"""

import win32com.client
import os
import sys

MDB_PATH = r'C:\Users\USER\Downloads\homeoassist-cse327-main\homeoassist-cse327-main\acid.mdb'
OUT_DIR  = r'C:\Users\USER\Downloads\homeoassist-cse327-main\homeoassist-cse327-main\backend'

BATCH_SIZE = 500  # rows per INSERT

def esc(val):
    """Escape a value for SQL insertion."""
    if val is None:
        return 'NULL'
    if isinstance(val, bool):
        return 'TRUE' if val else 'FALSE'
    if isinstance(val, (int, float)):
        return str(val)
    # String — escape single quotes
    return "'" + str(val).replace("'", "''") + "'"

def export_table(db, tname, out_path, pg_table, col_map=None):
    """
    Export an Access table to a SQL INSERT file.
    col_map: dict of {access_col: pg_col} for renaming columns.
    """
    rs = db.OpenRecordset(tname)
    if rs.EOF:
        print(f'  {tname}: EMPTY — skipping')
        rs.Close()
        return 0

    rs.MoveLast()
    total = rs.RecordCount
    rs.MoveFirst()

    # Get field names
    access_cols = [rs.Fields(i).Name for i in range(rs.Fields.Count)]
    pg_cols = []
    for c in access_cols:
        if col_map and c in col_map:
            pg_cols.append(col_map[c])
        else:
            pg_cols.append(c.lower())

    col_str = ', '.join(pg_cols)

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(f'-- HomeoAssist seed: {pg_table} ({total} rows)\n')
        f.write(f'-- Source: acid.mdb → {tname}\n\n')

        rows_written = 0
        batch = []

        while not rs.EOF:
            vals = []
            for i in range(rs.Fields.Count):
                vals.append(esc(rs.Fields(i).Value))
            batch.append(f'({", ".join(vals)})')
            rs.MoveNext()
            rows_written += 1

            if len(batch) >= BATCH_SIZE:
                f.write(f'INSERT INTO {pg_table} ({col_str}) VALUES\n')
                f.write(',\n'.join(batch))
                f.write(';\n\n')
                batch = []

        if batch:
            f.write(f'INSERT INTO {pg_table} ({col_str}) VALUES\n')
            f.write(',\n'.join(batch))
            f.write(';\n\n')

    rs.Close()
    print(f'  ✅ {tname} → {os.path.basename(out_path)}  ({rows_written} rows)')
    return rows_written

def main():
    print('🔌 Connecting to acid.mdb via Access COM...')
    access = win32com.client.Dispatch('Access.Application')
    access.Visible = False
    access.OpenCurrentDatabase(MDB_PATH, False)
    db = access.CurrentDb()
    print('✅ Connected\n')

    try:
        # ── 1. bcomplain (7,289 rows) ─────────────────────────
        print('📦 Exporting bcomplain...')
        export_table(db, 'bcomplain',
            os.path.join(OUT_DIR, 'bcomplain_full_seed.sql'),
            'bcomplain',
            col_map={'s_ID':'s_id','d_ID':'d_id','rub_ID':'rub_id',
                     's_bname':'s_bname','s_name':'s_name','sbr_ID':'sbr_id'})

        # ── 2. complain — English symptom rubric (65,348 rows) ──
        print('📦 Exporting complain (English symptoms)...')
        export_table(db, 'complain',
            os.path.join(OUT_DIR, 'complain_seed.sql'),
            'complain',
            col_map={'s_ID':'s_id','d_ID':'d_id','rub_ID':'rub_id',
                     's_bname':'s_bname','s_name':'s_name','sbr_ID':'sbr_id'})

        # ── 3. disease / symp (symptom list, 65,440 rows) ───────
        print('📦 Exporting disease (symptoms with disease link)...')
        export_table(db, 'disease',
            os.path.join(OUT_DIR, 'disease_seed.sql'),
            'disease',
            col_map={'s_ID':'s_id','d_ID':'d_id','rub_ID':'rub_id',
                     's_bname':'s_bname','s_name':'s_name','sbr_ID':'sbr_id'})

        # ── 4. bdisMedi — Bengali symptom ↔ medicine (65,795 rows) ─
        print('📦 Exporting bdisMedi (Bengali symptom-medicine links)...')
        export_table(db, 'bdisMedi',
            os.path.join(OUT_DIR, 'bdismedi_seed.sql'),
            'b_dis_medi',
            col_map={'sd_ID':'sd_id','s_ID':'s_id','m_ID':'m_id','m_v':'m_v'})

        # ── 5. disMedi — disease ↔ medicine (434,532 rows) ──────
        print('📦 Exporting disMedi (disease-medicine links, large)...')
        export_table(db, 'disMedi',
            os.path.join(OUT_DIR, 'dismedi_seed.sql'),
            'dis_medi',
            col_map={'sd_ID':'sd_id','s_ID':'s_id','M_ID':'m_id','m_v':'m_v'})

        # ── 6. medi — medicines (1,612 rows) ────────────────────
        print('📦 Exporting medi (medicines)...')
        export_table(db, 'medi',
            os.path.join(OUT_DIR, 'medi_from_mdb_seed.sql'),
            'medicines',
            col_map={'M_ID':'m_id','M_txt':'m_txt','M_btxt':'m_btxt','M_Du':'m_du'})

        # ── 7. sbr01 — symptom rubrics (38 rows) ────────────────
        print('📦 Exporting sbr01 (symptom rubrics)...')
        export_table(db, 'sbr01',
            os.path.join(OUT_DIR, 'sbr01_seed.sql'),
            'symptom_rubrics',
            col_map={'sbr_ID':'sbr_id','sbr_btxt':'sbr_btxt','sbr_txt':'sbr_txt'})

        # ── 8. bsbr01 — Bengali symptom rubrics (25 rows) ───────
        print('📦 Exporting bsbr01 (Bengali rubrics)...')
        export_table(db, 'bsbr01',
            os.path.join(OUT_DIR, 'bsbr01_seed.sql'),
            'b_symptom_rubrics',
            col_map={'sbr_ID':'sbr_id','sbr_btxt':'sbr_btxt','sbr_txt':'sbr_txt'})

        # ── 9. dose (8 rows) ─────────────────────────────────────
        print('📦 Exporting dose...')
        export_table(db, 'dose',
            os.path.join(OUT_DIR, 'dose_seed.sql'),
            'dose',
            col_map={'dos_ID':'dos_id','dos_btxt':'dos_btxt','dos_etxt':'dos_etxt','dose2':'dose2'})

        # ── 10. potency (20 rows) ────────────────────────────────
        print('📦 Exporting potency...')
        export_table(db, 'potency',
            os.path.join(OUT_DIR, 'potency_seed.sql'),
            'potency',
            col_map={'pot_ID':'pot_id','pot_txt':'pot_txt'})

        # ── 11. mAn01 — medicine antidotes (787 rows) ───────────
        print('📦 Exporting mAn01 (medicine antidotes)...')
        export_table(db, 'mAn01',
            os.path.join(OUT_DIR, 'man01_seed.sql'),
            'm_antidote',
            col_map={'MAn_ID':'man_id','M_ID':'m_id','M_An':'m_an'})

        # ── 12. mCo01 — medicine comparisons (154 rows) ─────────
        print('📦 Exporting mCo01 (medicine comparisons)...')
        export_table(db, 'mCo01',
            os.path.join(OUT_DIR, 'mco01_seed.sql'),
            'm_compare',
            col_map={'MCo_ID':'mco_id','M_ID':'m_id','M_Co':'m_co'})

        # ── 13. mFo01 — medicine follow-up (1,251 rows) ─────────
        print('📦 Exporting mFo01 (medicine follow-up)...')
        export_table(db, 'mFo01',
            os.path.join(OUT_DIR, 'mfo01_seed.sql'),
            'm_followup',
            col_map={'MIn_ID':'mfo_id','M_ID':'m_id','M_Fo':'m_fo'})

        # ── 14. mIn01 — medicine indications (96 rows) ──────────
        print('📦 Exporting mIn01 (medicine indications)...')
        export_table(db, 'mIn01',
            os.path.join(OUT_DIR, 'min01_seed.sql'),
            'm_indication',
            col_map={'MIn_ID':'min_id','M_ID':'m_id','M_In':'m_in'})

        # ── 15. admin (1 row) ────────────────────────────────────
        print('📦 Exporting admin...')
        export_table(db, 'admin',
            os.path.join(OUT_DIR, 'admin_mdb_seed.sql'),
            'mdb_admin',
            col_map={'a_ID':'a_id','co_name':'co_name','Pro_name':'pro_name',
                     'co_address':'co_address','co_pass':'co_pass',
                     'u_name':'u_name','u_dig':'u_dig','u_chamber':'u_chamber',
                     'u_address':'u_address','u_pass':'u_pass',
                     'u_bname':'u_bname','u_bdig':'u_bdig','u_baddress':'u_baddress',
                     'p_ID':'p_id','p_date':'p_date'})

        # ── 16. sbr01cc — small chapter subset (9 rows) ─────────
        print('📦 Exporting sbr01cc...')
        export_table(db, 'sbr01cc',
            os.path.join(OUT_DIR, 'sbr01cc_seed.sql'),
            'sbr01cc',
            col_map={'sbr_ID':'sbr_id','sbr_btxt':'sbr_btxt','sbr_txt':'sbr_txt'})

    finally:
        access.CloseCurrentDatabase()
        access.Quit()
        print('\n🎉 All exports complete!')

if __name__ == '__main__':
    main()
