-- HomeoAssist — Symptom Rubrics Seed Data (38 records from acid.mdb sbr01 table)
-- Run AFTER schema.sql:
--   psql -U postgres -d homeoassist -f backend/rubrics_seed.sql

ALTER SEQUENCE symptom_rubrics_sbr_id_seq RESTART WITH 1;

INSERT INTO symptom_rubrics (sbr_id, sbr_txt, sbr_btxt) OVERRIDING SYSTEM VALUE VALUES
(1,  'Mind',               'gb'),
(2,  'Vertigo',            'wk‡ivN~Y©b'),
(3,  'Head',               'g¯—K'),
(4,  'Eye',                'P¶z'),
(5,  'Vision',             '`„wókw³'),
(6,  'Ear',                'KY©'),
(7,  'Hearing',            'kªeYkw³'),
(8,  'Nose',               'bvwmKv'),
(9,  'Face',               'gyLgÊj'),
(10, 'Mouth',              'gyLMnŸi'),
(11, 'Teeth',              '`š—'),
(12, 'Throat',             'Mjbvjx'),
(13, 'External Throat',    'evn¨Mj‡`k'),
(14, 'Stomach',            'cvK¯'jx'),
(15, 'Abdomen',            'D`i'),
(16, 'Rectum',             'mijvš¿'),
(17, 'Stool',              'gj'),
(18, 'Bladder',            'gyÎ_jx'),
(19, 'Kidneys',            'gyÎMÖwš''),
(20, 'Prostate',           'cÖ‡óUMÖš—'),
(21, 'Urethra',            'gyÎgvM©'),
(22, 'Uring',              'gyÎ'),
(23, 'Genitalia Male',     'Rb‡bw›`ªq'),
(24, 'Genitalia Female',   '¯¿x-Rb‡bw›`ªq'),
(25, 'Larynx & Trachea',   'k¦vmbvjxIK'),
(26, 'Respiration',        'k¦vmwµqv'),
(27, 'Cough',              'Kvwk'),
(28, 'Expectoration',      'M‡qi DVv'),
(29, 'Chest',              'e¶‡`k'),
(30, 'Back',               'c„ó'),
(31, 'Extremities',        'n¯'c`vw`'),
(32, 'Sleep',              'wb`ªv'),
(33, 'Chill',              'kxZve¯'v'),
(34, 'Fever',              'R¡i'),
(35, 'Perspiration',       'N¤§©'),
(36, 'Skin',               'P¤§©'),
(37, 'Generalities',       'mvaviYj¶Y'),
(38, 'New Addition',       'bZzb ms‡hvM');

-- Reset sequence to next available ID
SELECT setval('symptom_rubrics_sbr_id_seq', (SELECT MAX(sbr_id) FROM symptom_rubrics));
