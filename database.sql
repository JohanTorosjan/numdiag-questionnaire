CREATE DATABASE  numdiagcmsdb;

CREATE TYPE question_type AS ENUM ('choix_multiple', 'choix_simple', 'entier');

CREATE TABLE Questionnaire (
  id SERIAL PRIMARY KEY,
  lable VARCHAR NOT NULL,
  description TEXT NOT NULL,
  code INTEGER NOT NULL,
  version VARCHAR NOT NULL,
  insight VARCHAR NOT NULL,
  tooltip VARCHAR NOT NULL,
  scoremax INTEGER NOT NULL
);

CREATE TABLE Section (
    id SERIAL PRIMARY KEY,
    questionnaire_id INTEGER NOT NULL,
    lable VARCHAR NOT NULL,
    description TEXT NOT NULL,
    position INTEGER NOT NULL,
    tooltip VARCHAR NOT NULL,
    scoremax INTEGER NOT NULL,
    FOREIGN KEY (questionnaire_id) REFERENCES Questionnaire(id) ON DELETE CASCADE
);

CREATE TABLE Question (
    id SERIAL PRIMARY KEY,
    section_id INTEGER NOT NULL,
    lable VARCHAR NOT NULL,
    questionType question_type NOT NULL,
    position INTEGER NOT NULL,
    page INTEGER NOT NULL,
    tooltip VARCHAR NOT NULL,
    coeff INTEGER NOT NULL,
    FOREIGN KEY (section_id) REFERENCES Section(id) ON DELETE CASCADE
);

CREATE TABLE Reponse (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    lable VARCHAR NOT NULL,
    position INTEGER NOT NULL,
    tooltip VARCHAR NOT NULL,
    valeurScore INTEGER NOT NULL,
    FOREIGN KEY (question_id) REFERENCES Question(id) ON DELETE CASCADE
);

-- Recommandation en fonction du questionnaire
CREATE TABLE Recommandation (
    id SERIAL PRIMARY KEY,
    questionnaire_id INTEGER NOT NULL,
    min INTEGER NOT NULL,
    max INTEGER NOT NULL,
    reco TEXT NOT NULL, 
    FOREIGN KEY (questionnaire_id) REFERENCES Questionnaire(id) ON DELETE CASCADE
);

-- Dépendances entre les sections et les réponses
CREATE TABLE SectionDep (
    section_id INTEGER NOT NULL,
    reponse_id INTEGER NOT NULL,
    PRIMARY KEY (section_id, reponse_id),
    FOREIGN KEY (section_id) REFERENCES Section(id) ON DELETE CASCADE,
    FOREIGN KEY (reponse_id) REFERENCES Reponse(id) ON DELETE CASCADE
);


-- Dépendances entre les questions et les réponses
CREATE TABLE QuestionDep (
    question_id INTEGER NOT NULL,
    reponse_id INTEGER NOT NULL,
    PRIMARY KEY (question_id, reponse_id),
    FOREIGN KEY (question_id) REFERENCES Question(id) ON DELETE CASCADE,
    FOREIGN KEY (reponse_id) REFERENCES Reponse(id) ON DELETE CASCADE
);

CREATE TABLE Tag (
    questionnaire_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    PRIMARY KEY (questionnaire_id, question_id),
    FOREIGN KEY (questionnaire_id) REFERENCES Questionnaire(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES Question(id) ON DELETE CASCADE
);

CREATE TABLE Tranche (
    id SERIAL PRIMARY KEY,
    reponse_id INTEGER NOT NULL,
    min INTEGER NOT NULL,
    max INTEGER NOT NULL,
    value INTEGER NOT NULL,
    FOREIGN KEY (reponse_id) REFERENCES Reponse(id) ON DELETE CASCADE
);

