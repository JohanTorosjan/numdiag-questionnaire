-- DROP DATABASE database;

CREATE DATABASE toherocmsdb;

CREATE TYPE activite AS ENUM ('actif', 'inactif');
CREATE TYPE etat AS ENUM ('en_cours', 'termine');
CREATE TYPE question_type AS ENUM ('choix_multiple', 'choix_simple', 'entier');

CREATE TABLE Entreprise(
    idEntreprise SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    siret BIGINT NOT NULL,
    adresse1 VARCHAR NOT NULL,
    adresse2 VARCHAR NOT NULL,
    code_postal INT NOT NULL,
    ville VARCHAR NOT NULL
);

CREATE TABLE Audit(
    idAudit SERIAL PRIMARY KEY,
    audit_code INT NOT NULL,
    audit_nom VARCHAR NOT NULL,
    audit_description VARCHAR NOT NULL,
    audit_version VARCHAR NOT NULL,
    audit_insight TEXT NOT NULL,
    audit_tooltype VARCHAR NOT NULL,
    audit_score_max INT NOT NULL
);

CREATE TABLE Tranche(
    idTranche SERIAL PRIMARY KEY,
    idQuestionReponse INT NOT NULL,
    min INT NOT NULL,
    max INT NOT NULL,
    value INT,
    -- -- valid_range int4range,
    -- CHECK(
    --     lower(value) >= -100 AND
    --     upper(value) <= 100
    -- ),
    plafond INT NOT NULL
);

CREATE TABLE Section(
    idSection SERIAL PRIMARY KEY,
    idAudit INT NOT NULL,
    section_nom VARCHAR NOT NULL,
    section_description TEXT NOT NULL,
    -- section_position TEXT NOT NULL,
    section_aide TEXT NOT NULL,
    section_reponse_aide TEXT NOT NULL,
    section_score_max INT NOT NULL,
    -- section_coeff FLOAT NOT NULL, -- A voir...
    FOREIGN KEY (idAudit) REFERENCES Audit(idAudit) ON DELETE CASCADE
);

CREATE TABLE AuditDiagnostic(
    idAuditDiagnostic SERIAL PRIMARY KEY,
    idEntreprise INT NOT NULL,
    idAudit INT NOT NULL,
    statut etat DEFAULT 'en_cours',
    scoreGlobal INT NOT NULL,
    FOREIGN KEY (idEntreprise) REFERENCES Entreprise(idEntreprise) ON DELETE CASCADE,
    FOREIGN KEY (idAudit) REFERENCES Audit(idAudit) ON DELETE CASCADE
);

CREATE TABLE Utilisateur(
    idUtilisateur SERIAL PRIMARY KEY,
    idEntreprise INT NOT NULL,
    idAuditDiagnostic INT NOT NULL,
    nom VARCHAR NOT NULL,
    prenom VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    statut activite DEFAULT 'actif',
    type VARCHAR NOT NULL,
    FOREIGN KEY (idEntreprise) REFERENCES Entreprise(idEntreprise) ON DELETE CASCADE,
    FOREIGN KEY (idAuditDiagnostic) REFERENCES AuditDiagnostic(idAuditDiagnostic) ON DELETE CASCADE
);

CREATE TABLE SectionAudit(
    idSectionAudit SERIAL PRIMARY KEY,
    idAudit INT NOT NULL,
    idSection INT NOT NULL,
    FOREIGN KEY (idAudit) REFERENCES Audit(idAudit) ON DELETE CASCADE,
    FOREIGN KEY (idSection) REFERENCES Section(idSection) ON DELETE CASCADE
);


CREATE TABLE Question(
    idQuestion SERIAL PRIMARY KEY,
    idSection INT NOT NULL,
    question_type question_type DEFAULT 'choix_multiple' NOT NULL,
    question_position TEXT NOT NULL,
    question_label VARCHAR NOT NULL,
    question_aide VARCHAR NOT NULL,
    question_coeff FLOAT,
    FOREIGN KEY (idSection) REFERENCES Section(idSection) ON DELETE CASCADE
);

CREATE TABLE DocumentTag(
    idDocumentTag SERIAL PRIMARY KEY,
    tag VARCHAR NOT NULL,
    idQuestion INT NOT NULL,
    FOREIGN KEY (idQuestion) REFERENCES Question(idQuestion) ON DELETE CASCADE
);

CREATE TABLE AuditResultatReponse(
    idAuditeResultatReponse SERIAL PRIMARY KEY,
    idQuestion INT NOT NULL,
    idAuditDiagnostic INT NOT NULL,
    flat_question TEXT NOT NULL,
    score INT NOT NULL,
    malus INT NOT NULL,
    flat_section TEXT NOT NULL,
    flat_tag VARCHAR NOT NULL,
    FOREIGN KEY (idQuestion) REFERENCES Question(idQuestion) ON DELETE CASCADE,
    FOREIGN KEY (idAuditDiagnostic) REFERENCES AuditDiagnostic(idAuditDiagnostic) ON DELETE CASCADE
);

CREATE TABLE FlatResponse(
    idFlatResponse SERIAL PRIMARY KEY,
    flat_response TEXT NOT NULL,
    idAuditeResultatReponse INT NOT NULL,
    FOREIGN KEY (idAuditeResultatReponse) REFERENCES AuditResultatReponse(idAuditeResultatReponse) ON DELETE CASCADE
);


CREATE TABLE Reponse(
    idReponse SERIAL PRIMARY KEY,
    idQuestion INT NOT NULL,
    label VARCHAR NOT NULL,
    position INT NOT NULL,
    tooltip TEXT NOT NULL,
    value INT NOT NULL,
    -- valid_range int4range,
    -- CHECK(
    --     lower(value) >= -100 AND
    --     upper(value) <= 100
    -- ),
    plafond INT NOT NULL,
    FOREIGN KEY (idQuestion) REFERENCES Question(idQuestion) ON DELETE CASCADE
);

CREATE TABLE TrancheReponse(
    idTrancheReponse SERIAL PRIMARY KEY,
    idReponse INT NOT NULL,
    idTranche INT NOT NULL,
    FOREIGN KEY (idReponse) REFERENCES Reponse(idReponse) ON DELETE CASCADE,
    FOREIGN KEY (idTranche) REFERENCES Tranche(idTranche) ON DELETE CASCADE
);

CREATE TABLE Document (
    idDocument SERIAL PRIMARY KEY,
    document_type VARCHAR NOT NULL,
    idEntreprise INT NOT NULL,
    document BYTEA NOT NULL,
    documentName VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (idEntreprise) REFERENCES Entreprise(idEntreprise) ON DELETE CASCADE
);
