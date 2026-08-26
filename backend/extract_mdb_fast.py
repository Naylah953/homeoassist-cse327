"""
HomeoAssist — acid.mdb Fast Extractor
Uses Access COM with GetRows() bulk fetch for maximum speed.

Usage: python extract_mdb_fast.py
"""

import win32com.client
import os, sys, time

MDB_PATH = r'C:\Users\USER\Downloads\homeoassist-cse327-main\homeoassist-cse327-main\acid.mdb'
OUT_DIR  = r'C:\Users\USER\Downloads\homeoassist-cse327-main\homeoassist-cse327-main\backend'

BATCH_SIZE = 1000  # rows per INSERT statement

def esc(val):
    """Escape a value for SQL."""
    if val is None:
        return 'NULL'
    if isinstance(val, bool):
        return 'TRUE' if val else 'FALSE'
    if isinstance(val, (int, float)):
        return str(int(val)) if isinstance(val, float) and val == int(val) else str(val)
    import datetime
    if isinstance(val, datetime.datetime):
        return f"'{val.strftime('%Y-%m-%d %H:%M:%S')}'"
    if isinstance(val, datetime.date):
        return f"'{val.strftime('%Y-%m-%d')}'"
    return "'" + str(val).replace("'", "''") + "'"

def export_table_fast(access, sql_query, out_path, pg_table, pg_cols):
    """
    Export using Access DoCmd.RunSQL / OpenRecordset with GetRows().
    GetRows() returns a 2D tuple (column, row) — much faster than row-by-row.
    """
    db = access.CurrentDb()
    rs = db.OpenRecordset(sql_query)
    
    if rs.EOF:
        print(f'  EMPTY — skipping {pg_table}')
        rs.Close()
        return 0

    col_str = ', '.join(pg_cols)
    total = 0
    
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(f'-- HomeoAssist seed: {pg_table}\n')
        f.write(f'-- Source: acid.mdb\n\n')
        
        while not rs.EOF:
            # GetRows(n) returns tuple-of-tuples (col_index, row_index)
            data = rs.GetRows(BATCH_SIZE)
            if not data:
                break
            
            num_cols = len(data)
            num_rows = len(data[0])
            
            rows_sql = []
            for row_i in range(num_rows):
                vals = [esc(data[col_i][row_i]) for col_i in range(num_cols)]
                rows_sql.append(f'({", ".join(vals)})')
            
            f.write(f'INSERT INTO {pg_table} ({col_str}) VALUES\n')
            f.write(',\n'.join(rows_sql))
            f.write(';\n\n')
            total += num_rows
    
    rs.Close()
    return total

def main():
    print('🔌 Connecting to acid.mdb via Access COM...')
    access = win32com.client.Dispatch('Access.Application')
    access.Visible = False
    access.OpenCurrentDatabase(MDB_PATH, False)
    print('✅ Connected\n')

    tables = [
        # (access_sql, out_file, pg_table, pg_columns)
        (
            'SELECT s_ID, d_ID, rub_ID, s_bname, s_name, sbr_ID FROM bcomplain ORDER BY s_ID',
            'bcomplain_full_seed.sql',
            'bcomplain',
            ['s_id','d_id','rub_id','s_bname','s_name','sbr_id']
        ),
        (
            'SELECT s_ID, d_ID, rub_ID, s_bname, s_name, sbr_ID FROM complain ORDER BY s_ID',
            'complain_seed.sql',
            'complain',
            ['s_id','d_id','rub_id','s_bname','s_name','sbr_id']
        ),
        (
            'SELECT s_ID, d_ID, rub_ID, s_bname, s_name, sbr_ID FROM disease ORDER BY s_ID',
            'disease_seed.sql',
            'disease',
            ['s_id','d_id','rub_id','s_bname','s_name','sbr_id']
        ),
        (
            'SELECT sd_ID, s_ID, m_ID, m_v FROM bdisMedi ORDER BY sd_ID',
            'bdismedi_seed.sql',
            'b_dis_medi',
            ['sd_id','s_id','m_id','m_v']
        ),
        (
            'SELECT M_ID, M_txt, M_btxt, M_Du FROM medi ORDER BY M_ID',
            'medi_from_mdb_seed.sql',
            'medicines_mdb',
            ['m_id','m_txt','m_btxt','m_du']
        ),
        (
            'SELECT sbr_ID, sbr_btxt, sbr_txt FROM sbr01 ORDER BY sbr_ID',
            'sbr01_seed.sql',
            'symptom_rubrics_mdb',
            ['sbr_id','sbr_btxt','sbr_txt']
        ),
        (
            'SELECT sbr_ID, sbr_btxt, sbr_txt FROM bsbr01 ORDER BY sbr_ID',
            'bsbr01_seed.sql',
            'b_symptom_rubrics',
            ['sbr_id','sbr_btxt','sbr_txt']
        ),
        (
            'SELECT dos_ID, dos_btxt, dos_etxt, dose2 FROM dose ORDER BY dos_ID',
            'dose_seed.sql',
            'dose',
            ['dos_id','dos_btxt','dos_etxt','dose2']
        ),
        (
            'SELECT pot_ID, pot_txt FROM potency ORDER BY pot_ID',
            'potency_seed.sql',
            'potency',
            ['pot_id','pot_txt']
        ),
        (
            'SELECT MAn_ID, M_ID, M_An FROM mAn01 ORDER BY MAn_ID',
            'man01_seed.sql',
            'm_antidote',
            ['man_id','m_id','m_an']
        ),
        (
            'SELECT MCo_ID, M_ID, M_Co FROM mCo01 ORDER BY MCo_ID',
            'mco01_seed.sql',
            'm_compare',
            ['mco_id','m_id','m_co']
        ),
        (
            'SELECT MIn_ID, M_ID, M_Fo FROM mFo01 ORDER BY MIn_ID',
            'mfo01_seed.sql',
            'm_followup',
            ['mfo_id','m_id','m_fo']
        ),
        (
            'SELECT MIn_ID, M_ID, M_In FROM mIn01 ORDER BY MIn_ID',
            'min01_seed.sql',
            'm_indication',
            ['min_id','m_id','m_in']
        ),
        (
            'SELECT sbr_ID, sbr_btxt, sbr_txt FROM sbr01cc ORDER BY sbr_ID',
            'sbr01cc_seed.sql',
            'sbr01cc',
            ['sbr_id','sbr_btxt','sbr_txt']
        ),
    ]

    # Large tables — export separately with warning
    large_tables = [
        (
            'SELECT sd_ID, s_ID, M_ID, m_v FROM disMedi ORDER BY sd_ID',
            'dismedi_seed.sql',
            'dis_medi',
            ['sd_id','s_id','m_id','m_v']
        ),
    ]

    try:
        for sql_q, out_file, pg_table, pg_cols in tables:
            t0 = time.time()
            out_path = os.path.join(OUT_DIR, out_file)
            print(f'📦 Exporting {pg_table}...')
            n = export_table_fast(access, sql_q, out_path, pg_table, pg_cols)
            t1 = time.time()
            print(f'   ✅ {n} rows → {out_file} ({t1-t0:.1f}s)')

        print('\n📦 Exporting large table: dis_medi (434k rows — may take a few minutes)...')
        for sql_q, out_file, pg_table, pg_cols in large_tables:
            t0 = time.time()
            out_path = os.path.join(OUT_DIR, out_file)
            n = export_table_fast(access, sql_q, out_path, pg_table, pg_cols)
            t1 = time.time()
            print(f'   ✅ {n} rows → {out_file} ({t1-t0:.1f}s)')

    finally:
        access.CloseCurrentDatabase()
        access.Quit()
        print('\n🎉 All exports complete!')

if __name__ == '__main__':
    main()
