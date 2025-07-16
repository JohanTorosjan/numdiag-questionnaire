CREATE DATABASE  numdiagcmsdb;

CREATE TYPE question_type AS ENUM ('choix_multiple', 'choix_simple', 'entier');

CREATE TABLE Questionnaires (
  id SERIAL PRIMARY KEY,
  label VARCHAR NOT NULL,
  description TEXT,
  code INTEGER NOT NULL,
  version VARCHAR NOT NULL,
  insight VARCHAR,
  tooltip VARCHAR,
  scoremax INTEGER NOT NULL,
  nbPages INTEGER NOT NULL DEFAULT 1,
  isPublished BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Sections (
    id SERIAL PRIMARY KEY,
    questionnaire_id INTEGER NOT NULL,
    label VARCHAR NOT NULL,
    description TEXT,
    position INTEGER NOT NULL,
    tooltip VARCHAR,
    scoremax INTEGER NOT NULL,
    FOREIGN KEY (questionnaire_id) REFERENCES Questionnaires(id) ON DELETE CASCADE
);

CREATE TABLE Questions (
    id SERIAL PRIMARY KEY,
    section_id INTEGER NOT NULL,
    label VARCHAR NOT NULL,
    questionType question_type NOT NULL,
    position INTEGER NOT NULL,
    page INTEGER NOT NULL,
    tooltip VARCHAR,
    coeff INTEGER NOT NULL,
    theme VARCHAR,
    FOREIGN KEY (section_id) REFERENCES Sections(id) ON DELETE CASCADE
);

CREATE TABLE Reponses (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    label VARCHAR NOT NULL,
    position INTEGER NOT NULL,
    tooltip VARCHAR,
    plafond INTEGER,
    recommandation TEXT,
    valeurScore INTEGER NOT NULL,
    FOREIGN KEY (question_id) REFERENCES Questions(id) ON DELETE CASCADE
);

-- Recommandation en fonction du questionnaire
CREATE TABLE RecommandationsQuestionnaires (
    id SERIAL PRIMARY KEY,
    questionnaire_id INTEGER NOT NULL,
    min INTEGER NOT NULL,
    max INTEGER NOT NULL,
    recommandation TEXT NOT NULL,
    FOREIGN KEY (questionnaire_id) REFERENCES Questionnaires(id) ON DELETE CASCADE
);

CREATE TABLE RecommandationsReponses (
    id SERIAL PRIMARY KEY,
    reponse_id INTEGER NOT NULL,
    recommandation TEXT NOT NULL,
    FOREIGN KEY (reponse_id) REFERENCES Reponses(id) ON DELETE CASCADE
);

-- Dépendances entre les sections et les réponses
CREATE TABLE SectionDependencies (
    section_id INTEGER NOT NULL,
    reponse_id INTEGER NOT NULL,
    PRIMARY KEY (section_id, reponse_id),
    FOREIGN KEY (section_id) REFERENCES Sections(id) ON DELETE CASCADE,
    FOREIGN KEY (reponse_id) REFERENCES Reponses(id) ON DELETE CASCADE
);


-- Dépendances entre les questions et les réponses
CREATE TABLE QuestionDependencies (
    question_id INTEGER NOT NULL,
    reponse_id INTEGER NOT NULL,
    PRIMARY KEY (question_id, reponse_id),
    FOREIGN KEY (question_id) REFERENCES Questions(id) ON DELETE CASCADE,
    FOREIGN KEY (reponse_id) REFERENCES Reponses(id) ON DELETE CASCADE
);


CREATE TABLE Documents (
    id SERIAL PRIMARY KEY,
    questionnaire_id INTEGER NOT NULL,
    label VARCHAR NOT NULL,
    description TEXT,
    file_path VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (questionnaire_id) REFERENCES Questionnaires(id) ON DELETE CASCADE
);

CREATE TABLE Tags (
    document_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    PRIMARY KEY (document_id, question_id),
    FOREIGN KEY (document_id) REFERENCES Documents(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Questions(id) ON DELETE CASCADE
);

CREATE TABLE Tranches (
    id SERIAL PRIMARY KEY,
    reponse_id INTEGER NOT NULL,
    min INTEGER NOT NULL,
    max INTEGER NOT NULL,
    value INTEGER NOT NULL,
    FOREIGN KEY (reponse_id) REFERENCES Reponses(id) ON DELETE CASCADE
);
