CREATE DATABASE  numdiagcmsdb;

CREATE TYPE question_type AS ENUM ('choix_multiple', 'choix_simple', 'entier');

CREATE TABLE Questionnaires (
  id SERIAL PRIMARY KEY,
  label VARCHAR NOT NULL,
  description TEXT NOT NULL,
  code INTEGER NOT NULL,
  version VARCHAR NOT NULL,
  insight VARCHAR NOT NULL,
  tooltip VARCHAR NOT NULL,
  scoremax INTEGER NOT NULL
);

CREATE TABLE Sections (
    id SERIAL PRIMARY KEY,
    questionnaire_id INTEGER NOT NULL,
    label VARCHAR NOT NULL,
    description TEXT NOT NULL,
    position INTEGER NOT NULL,
    tooltip VARCHAR NOT NULL,
    scoremax INTEGER NOT NULL,
    FOREIGN KEY (questionnaire_id) REFERENCES Questionnaire(id) ON DELETE CASCADE
);

CREATE TABLE Questions (
    id SERIAL PRIMARY KEY,
    section_id INTEGER NOT NULL,
    label VARCHAR NOT NULL,
    questionType question_type NOT NULL,
    position INTEGER NOT NULL,
    page INTEGER NOT NULL,
    tooltip VARCHAR NOT NULL,
    coeff INTEGER NOT NULL,
    FOREIGN KEY (section_id) REFERENCES Section(id) ON DELETE CASCADE
);

CREATE TABLE Reponses (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    label VARCHAR NOT NULL,
    position INTEGER NOT NULL,
    tooltip VARCHAR NOT NULL,
    valeurScore INTEGER NOT NULL,
    FOREIGN KEY (question_id) REFERENCES Question(id) ON DELETE CASCADE
);

-- Recommandation en fonction du questionnaire
CREATE TABLE Recommandations (
    id SERIAL PRIMARY KEY,
    questionnaire_id INTEGER NOT NULL,
    min INTEGER NOT NULL,
    max INTEGER NOT NULL,
    reco TEXT NOT NULL,
    FOREIGN KEY (questionnaire_id) REFERENCES Questionnaire(id) ON DELETE CASCADE
);

-- Dépendances entre les sections et les réponses
CREATE TABLE SectionDependencies (
    section_id INTEGER NOT NULL,
    reponse_id INTEGER NOT NULL,
    PRIMARY KEY (section_id, reponse_id),
    FOREIGN KEY (section_id) REFERENCES Section(id) ON DELETE CASCADE,
    FOREIGN KEY (reponse_id) REFERENCES Reponse(id) ON DELETE CASCADE
);


-- Dépendances entre les questions et les réponses
CREATE TABLE QuestionDependencies (
    question_id INTEGER NOT NULL,
    reponse_id INTEGER NOT NULL,
    PRIMARY KEY (question_id, reponse_id),
    FOREIGN KEY (question_id) REFERENCES Question(id) ON DELETE CASCADE,
    FOREIGN KEY (reponse_id) REFERENCES Reponse(id) ON DELETE CASCADE
);

CREATE TABLE Tags (
    questionnaire_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    PRIMARY KEY (questionnaire_id, question_id),
    FOREIGN KEY (questionnaire_id) REFERENCES Questionnaire(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Question(id) ON DELETE CASCADE
);

CREATE TABLE Tranches (
    id SERIAL PRIMARY KEY,
    reponse_id INTEGER NOT NULL,
    min INTEGER NOT NULL,
    max INTEGER NOT NULL,
    value INTEGER NOT NULL,
    FOREIGN KEY (reponse_id) REFERENCES Reponse(id) ON DELETE CASCADE
);
