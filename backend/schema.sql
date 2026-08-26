-- HomeoAssist PostgreSQL Schema
-- Run this file first to create all tables

-- Drop tables if they exist (for clean re-runs)
DROP TABLE IF EXISTS emergency_calls CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS prescription_medicines CASCADE;
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
-- MDB reference tables
DROP TABLE IF EXISTS dis_medi CASCADE;
DROP TABLE IF EXISTS b_dis_medi CASCADE;
DROP TABLE IF EXISTS complain CASCADE;
DROP TABLE IF EXISTS disease CASCADE;
DROP TABLE IF EXISTS bcomplain CASCADE;
DROP TABLE IF EXISTS m_antidote CASCADE;
DROP TABLE IF EXISTS m_compare CASCADE;
DROP TABLE IF EXISTS m_followup CASCADE;
DROP TABLE IF EXISTS m_indication CASCADE;
DROP TABLE IF EXISTS medicines_mdb CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS b_symptom_rubrics CASCADE;
DROP TABLE IF EXISTS sbr01cc CASCADE;
DROP TABLE IF EXISTS symptom_rubrics CASCADE;
DROP TABLE IF EXISTS dose CASCADE;
DROP TABLE IF EXISTS potency CASCADE;

-- ============================================================
-- SYMPTOM RUBRICS TABLE (from acid.mdb → sbr01 table)
-- Categories: Mind, Head, Eye, Ear, etc.
-- ============================================================
CREATE TABLE symptom_rubrics (
    sbr_id      INTEGER PRIMARY KEY,
    sbr_txt     VARCHAR(255) NOT NULL,        -- English name (e.g. Mind, Head)
    sbr_btxt    VARCHAR(500),                  -- Bengali name
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- BCOMPLAIN TABLE (from acid.mdb → bcomplain table)
-- Homeopathic repertory: symptom entries with Bengali & English names
-- s_ID    : unique symptom row ID
-- d_ID    : parent symptom ID (groups sub-symptoms under a heading)
-- rub_ID  : 1 = main heading, 2 = sub-symptom
-- sbr_ID  : foreign key → symptom_rubrics (chapter: Mind, Head, Eye…)
-- ============================================================
CREATE TABLE bcomplain (
    s_id        INTEGER PRIMARY KEY,
    d_id        INTEGER,
    rub_id      SMALLINT NOT NULL DEFAULT 1,   -- 1=heading, 2=sub
    s_bname     TEXT,                           -- Bengali symptom name
    s_name      TEXT NOT NULL,                  -- English symptom name
    sbr_id      INTEGER REFERENCES symptom_rubrics(sbr_id) ON DELETE SET NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_bcomplain_sbr ON bcomplain(sbr_id);
CREATE INDEX idx_bcomplain_d_id ON bcomplain(d_id);
CREATE INDEX idx_bcomplain_rub ON bcomplain(rub_id);

-- ============================================================
-- MEDICINES TABLE (from acid.mdb → medi table)
-- ============================================================
CREATE TABLE medicines (
    m_id        SERIAL PRIMARY KEY,
    m_txt       VARCHAR(255) NOT NULL,        -- English name
    m_btxt      VARCHAR(500),                  -- Bengali name
    m_du        BOOLEAN DEFAULT FALSE,         -- Featured/main medicine flag
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ADMINS TABLE
-- ============================================================
CREATE TABLE admins (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(100) UNIQUE NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,         -- hashed
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- DOCTORS TABLE
-- ============================================================
CREATE TABLE doctors (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password        VARCHAR(255) NOT NULL,     -- hashed
    reg_no          VARCHAR(100) UNIQUE NOT NULL,
    specialty       VARCHAR(255),
    qualifications  VARCHAR(500),
    bio             TEXT,
    experience_yrs  INTEGER DEFAULT 0,
    rating          DECIMAL(3,2) DEFAULT 0.0,
    review_count    INTEGER DEFAULT 0,
    fee             DECIMAL(10,2) DEFAULT 0,
    phone           VARCHAR(50),
    address         TEXT,
    is_available    BOOLEAN DEFAULT TRUE,
    is_verified     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- PATIENTS TABLE
-- ============================================================
CREATE TABLE patients (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) UNIQUE,
    password    VARCHAR(255) NOT NULL,         -- hashed
    phone       VARCHAR(50),
    age         INTEGER,
    gender      VARCHAR(20),
    address     TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- APPOINTMENTS TABLE
-- ============================================================
CREATE TABLE appointments (
    id              SERIAL PRIMARY KEY,
    patient_id      INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id       INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    type            VARCHAR(20) CHECK (type IN ('online', 'in-person')) DEFAULT 'online',
    status          VARCHAR(20) CHECK (status IN ('upcoming', 'completed', 'cancelled')) DEFAULT 'upcoming',
    fee             DECIMAL(10,2),
    is_paid         BOOLEAN DEFAULT FALSE,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- PRESCRIPTIONS TABLE
-- ============================================================
CREATE TABLE prescriptions (
    id              SERIAL PRIMARY KEY,
    patient_id      INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id       INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
    appointment_id  INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
    diagnosis       TEXT,
    notes           TEXT,
    status          VARCHAR(20) CHECK (status IN ('active', 'completed')) DEFAULT 'active',
    is_verified     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- PRESCRIPTION MEDICINES (many-to-many: prescription ↔ medicine)
-- ============================================================
CREATE TABLE prescription_medicines (
    id              SERIAL PRIMARY KEY,
    prescription_id INTEGER REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_id     INTEGER REFERENCES medicines(m_id) ON DELETE RESTRICT,
    potency         VARCHAR(50),               -- e.g. 30C, 200C, 6C
    dosage          VARCHAR(255),              -- e.g. 3 times/day
    duration        VARCHAR(100),              -- e.g. 7 days
    notes           TEXT
);

-- ============================================================
-- COMPLAINTS TABLE
-- ============================================================
CREATE TABLE complaints (
    id          SERIAL PRIMARY KEY,
    filed_by    VARCHAR(50),                   -- 'patient' or 'doctor'
    filer_id    INTEGER,                       -- patient_id or doctor_id
    against     VARCHAR(50),                   -- 'doctor' or 'patient'
    against_id  INTEGER,
    subject     VARCHAR(500),
    description TEXT,
    status      VARCHAR(20) CHECK (status IN ('open', 'resolved', 'dismissed')) DEFAULT 'open',
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor ON prescriptions(doctor_id);
CREATE INDEX idx_medicines_name ON medicines(m_txt);

-- ============================================================
-- MEDICINES_MDB TABLE (from acid.mdb → homeopathic formulary)
-- ============================================================
CREATE TABLE medicines_mdb (
    m_id    INTEGER PRIMARY KEY,
    m_txt   VARCHAR(500),       -- English name
    m_btxt  VARCHAR(500),       -- Bengali name
    m_du    VARCHAR(255)        -- duration/note field from mdb
);

CREATE INDEX idx_medicines_mdb_txt  ON medicines_mdb(m_txt);
CREATE INDEX idx_medicines_mdb_btxt ON medicines_mdb(m_btxt);

-- ============================================================
-- DOSE & POTENCY reference tables
-- ============================================================
CREATE TABLE dose (
    dos_id   INTEGER PRIMARY KEY,
    dos_btxt VARCHAR(255),
    dos_etxt VARCHAR(255),
    dose2    VARCHAR(255)
);

CREATE TABLE potency (
    pot_id  INTEGER PRIMARY KEY,
    pot_txt VARCHAR(100)
);

-- ============================================================
-- BENGALI SYMPTOM RUBRIC CHAPTERS
-- ============================================================
CREATE TABLE b_symptom_rubrics (
    sbr_id   INTEGER PRIMARY KEY,
    sbr_btxt VARCHAR(255),
    sbr_txt  VARCHAR(255)
);

CREATE TABLE sbr01cc (
    sbr_id   INTEGER PRIMARY KEY,
    sbr_btxt VARCHAR(255),
    sbr_txt  VARCHAR(255)
);

-- ============================================================
-- ENGLISH REPERTORY SYMPTOMS (complain = English, disease = alt table)
-- ============================================================
CREATE TABLE complain (
    s_id    INTEGER PRIMARY KEY,
    d_id    INTEGER,
    rub_id  INTEGER,
    s_bname TEXT,
    s_name  TEXT,
    sbr_id  INTEGER REFERENCES symptom_rubrics(sbr_id) ON DELETE SET NULL
);

CREATE INDEX idx_complain_sbr ON complain(sbr_id);
CREATE INDEX idx_complain_d   ON complain(d_id);
CREATE INDEX idx_complain_sname ON complain(s_name);

CREATE TABLE disease (
    s_id    INTEGER PRIMARY KEY,
    d_id    INTEGER,
    rub_id  INTEGER,
    s_bname TEXT,
    s_name  TEXT,
    sbr_id  INTEGER REFERENCES symptom_rubrics(sbr_id) ON DELETE SET NULL
);

CREATE INDEX idx_disease_sbr ON disease(sbr_id);
CREATE INDEX idx_disease_d   ON disease(d_id);

-- ============================================================
-- SYMPTOM → MEDICINE JUNCTION TABLES
-- ============================================================

-- Bengali symptoms → medicines (from b_dis_medi in mdb)
CREATE TABLE b_dis_medi (
    sd_id   INTEGER PRIMARY KEY,
    s_id    INTEGER REFERENCES bcomplain(s_id) ON DELETE CASCADE,
    m_id    INTEGER REFERENCES medicines_mdb(m_id) ON DELETE CASCADE,
    m_v     INTEGER   -- grade: 1=small, 2=medium, 3=high
);

CREATE INDEX idx_bdismedi_s ON b_dis_medi(s_id);
CREATE INDEX idx_bdismedi_m ON b_dis_medi(m_id);

-- English symptoms → medicines (from dis_medi in mdb)
CREATE TABLE dis_medi (
    sd_id   INTEGER PRIMARY KEY,
    s_id    INTEGER REFERENCES disease(s_id) ON DELETE CASCADE,
    m_id    INTEGER REFERENCES medicines_mdb(m_id) ON DELETE CASCADE,
    m_v     INTEGER
);

CREATE INDEX idx_dismedi_s ON dis_medi(s_id);
CREATE INDEX idx_dismedi_m ON dis_medi(m_id);

-- ============================================================
-- MEDICINE RELATIONSHIP TABLES
-- ============================================================

CREATE TABLE m_antidote (
    man_id INTEGER PRIMARY KEY,
    m_id   INTEGER REFERENCES medicines_mdb(m_id) ON DELETE CASCADE,
    m_an   INTEGER   -- antidote medicine id
);

CREATE INDEX idx_antidote_m ON m_antidote(m_id);

CREATE TABLE m_compare (
    mco_id INTEGER PRIMARY KEY,
    m_id   INTEGER REFERENCES medicines_mdb(m_id) ON DELETE CASCADE,
    m_co   INTEGER
);

CREATE INDEX idx_compare_m ON m_compare(m_id);

CREATE TABLE m_followup (
    mfo_id INTEGER PRIMARY KEY,
    m_id   INTEGER REFERENCES medicines_mdb(m_id) ON DELETE CASCADE,
    m_fo   INTEGER
);

CREATE INDEX idx_followup_m ON m_followup(m_id);

CREATE TABLE m_indication (
    min_id INTEGER PRIMARY KEY,
    m_id   INTEGER REFERENCES medicines_mdb(m_id) ON DELETE CASCADE,
    m_in   INTEGER   -- indicated medicine id
);

CREATE INDEX idx_indication_m ON m_indication(m_id);

-- ============================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================
CREATE TABLE subscriptions (
    id              SERIAL PRIMARY KEY,
    patient_id      INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    plan            VARCHAR(20) CHECK (plan IN ('basic', 'pro', 'clinic')) NOT NULL,
    price           DECIMAL(10,2) NOT NULL,
    status          VARCHAR(20) CHECK (status IN ('active', 'expired', 'cancelled')) DEFAULT 'active',
    started_at      TIMESTAMP DEFAULT NOW(),
    expires_at      TIMESTAMP,
    payment_ref     VARCHAR(255),
    gateway         VARCHAR(50),              -- sslcommerz | bkash | nagad | stripe
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- CHAT SESSIONS TABLE (AI Symptom Collection)
-- ============================================================
CREATE TABLE chat_sessions (
    id              SERIAL PRIMARY KEY,
    patient_id      INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id       INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
    appointment_id  INTEGER REFERENCES appointments(id) ON DELETE SET NULL,
    summary         TEXT,                     -- AI-generated symptom summary
    status          VARCHAR(20) CHECK (status IN ('active', 'completed')) DEFAULT 'active',
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- CHAT MESSAGES TABLE
-- ============================================================
CREATE TABLE chat_messages (
    id              SERIAL PRIMARY KEY,
    session_id      INTEGER REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role            VARCHAR(10) CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
    content         TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- EMERGENCY CALLS TABLE
-- ============================================================
CREATE TABLE emergency_calls (
    id              SERIAL PRIMARY KEY,
    patient_id      INTEGER REFERENCES patients(id) ON DELETE SET NULL,
    patient_name    VARCHAR(255),
    patient_phone   VARCHAR(50),
    symptoms        TEXT,
    priority        VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    assigned_doctor INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
    status          VARCHAR(20) CHECK (status IN ('waiting', 'routing', 'connected', 'resolved', 'missed')) DEFAULT 'waiting',
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    resolved_at     TIMESTAMP
);

CREATE INDEX idx_subscriptions_patient ON subscriptions(patient_id);
CREATE INDEX idx_chat_sessions_patient ON chat_sessions(patient_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_emergency_status ON emergency_calls(status);
