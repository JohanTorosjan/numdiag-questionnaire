-- Dataset for CMS Database
-- Mapped from toherodb-population-test.sql to cms-database structure

-- Insert Questionnaires (mapped from audit table)
INSERT INTO Questionnaires (id, label, description, code, version, insight, tooltip, scoremax, isPublished) VALUES
(1, 'Audit RGPD', 'Évaluation complète de la conformité RGPD', 1, '1.0', 'Analyse détaillée de la conformité aux exigences du RGPD', NULL, 100, true),
(2, 'Audit AI Act', 'Évaluation complète de la conformité AI Act', 2, '1.0', 'Analyse détaillée de la conformité aux exigences du AI Act', NULL, 100, true);

-- Insert Sections (mapped from Section table)
INSERT INTO Sections (id, questionnaire_id, label, description, tooltip, scoremax) VALUES
(1, 1, 'Collecte des Donnees', 'oiia', 'Oui', 40),
(2, 2, 'Traitement des donnees', 'oiia','Oui', 40),
(3, 2, 'Transparence et responsabilite', 'oi', 'Non', 25);
-- INSERT INTO Sections (id, questionnaire_id, label, description, position, tooltip, scoremax) VALUES
-- (1, 1, 'Collecte des Donnees', 'oiia', 1, 'Oui', 40),
-- (2, 2, 'Traitement des donnees', 'oiia', 1, 'Oui', 40),
-- (3, 2, 'Transparence et responsabilite', 'oi', 3, 'Non', 25);

-- Insert Questions (mapped from Question table)
INSERT INTO Questions (id, section_id, label, questionType, position, page, tooltip, coeff, theme) VALUES
-- Questions for Section 1 (RGPD - Collecte des Donnees)
(1, 1, 'Quel type de donnees recoltez-vous ?', 'choix_multiple', 1, 1, 'o', 2, NULL),
(2, 1, 'Avertissez-vous les utilisateur.ice.s des donnees que vous recoltez ?', 'choix_simple', 2, 1, 'o', 1, NULL),
(3, 1, 'Pendant combien de temps conservez-vous les donnees utilisateurs ?', 'choix_multiple', 3, 1, 'o', 2, NULL),
(4, 1, 'Avertissez-vous les utilisateur.ice.s de la duree de conservation de leurs donnees ?', 'choix_simple', 4, 1, 'o', 1, NULL),

-- Questions for Section 2 (AI Act - Traitement des donnees)
(5, 2, 'Combien d employes sont presents dans votre entreprise', 'entier', 1, 1, 'o', 1, NULL),
(6, 2, 'Les utilisateur.ice.s possedent-ils un moyen de supprimer leurs donnees ?', 'choix_simple', 2, 1, 'o', 2, NULL),
(7, 2, 'Les utilisateur.ice.s peuvent-ils modifier leurs donnees ?', 'choix_simple', 3, 1, 'o', 2, NULL),
(8, 2, 'Les utilisateur.ice.s peuvent-ils acceder a leurs donnees ?', 'choix_simple', 4, 1, 'o', 2, NULL),

-- Questions for Section 3 (AI Act - Transparence et responsabilite)
(9, 3, 'Utilisez-vous des outils avec l intelligence artificielle ?', 'choix_simple', 1, 1, 'o', 2, NULL),
(10, 3, 'Quels outils d intelligence artificielle utilisez vous ?', 'choix_multiple', 2, 1, 'o', 2, NULL),
(11, 3, 'Vos employes possedent-ils une certification IA ?', 'choix_simple', 3, 1, 'o', 2, NULL),
(12, 3, 'Traitez vous des donnees client avec l IA ?', 'choix_simple', 4, 1, 'o', 2, NULL);

-- Insert Reponses (mapped from reponse table)
INSERT INTO Reponses (id, question_id, label, position, tooltip, plafond, recommandation, valeurScore) VALUES
-- Responses for Question 1
(1, 1, 'Identite Regalienne', 1, 'o', 10, NULL, 10),
(2, 1, 'Donnees geographiques', 2, 'o', 10, NULL, 5),
(3, 1, 'Adresse IP', 3, 'o', 10, NULL, 5),
(4, 1, 'Adresse email', 4, 'o', 10, NULL, 5),
(5, 1, 'Numero de telephone', 5, 'o', 10, NULL, 5),

-- Responses for Question 2
(6, 2, 'Oui', 1, 'o', 10, NULL, 5),
(7, 2, 'Non', 2, 'o', 10, NULL, 5),

-- Responses for Question 3
(8, 3, 'Moins de 6 mois', 1, 'o', 5, NULL, 5),
(9, 3, '6 mois a 1 an', 2, 'o', 10, NULL, 10),
(10, 3, '1 a 3 ans', 3, 'o', 15, NULL, 15),
(11, 3, 'Plus de 3 ans', 4, 'o', 20, NULL, 20),

-- Responses for Question 4
(12, 4, 'Oui', 1, 'o', 20, NULL, 20),
(13, 4, 'Non', 2, 'o', -10, NULL, -10),

-- Responses for Question 5 (entier type - we'll create placeholder responses for the range)
(14, 5, '0', 1, 'o', 20, NULL, 20),
(15, 5, '100', 2, 'o', -10, NULL, -10),

-- Responses for Question 6
(16, 6, 'Oui', 1, 'o', 20, NULL, 20),
(17, 6, 'Non', 2, 'o', -10, NULL, -10),

-- Responses for Question 7
(18, 7, 'Oui', 1, 'o', 20, NULL, 20),
(19, 7, 'Non', 2, 'o', -10, NULL, -10),

-- Responses for Question 8
(20, 8, 'Oui', 1, 'o', 20, NULL, 20),
(21, 8, 'Non', 2, 'o', -10, NULL, -10),

-- Responses for Question 9
(22, 9, 'Oui', 1, 'o', 20, NULL, 20),
(23, 9, 'Non', 2, 'o', -10, NULL, -10),

-- Responses for Question 10
(24, 10, 'LLM', 1, 'o', 10, NULL, 10),
(25, 10, 'Generation d image', 2, 'o', 10, NULL, 10),
(26, 10, 'Reconnaissance d image', 3, 'o', 10, NULL, 10),
(27, 10, 'Autre', 4, 'o', 5, NULL, 5),

-- Responses for Question 11
(28, 11, 'Oui', 1, 'o', 20, NULL, 20),
(29, 11, 'Non', 2, 'o', -10, NULL, -10),

-- Responses for Question 12
(30, 12, 'Oui', 1, 'o', 20, NULL, 20),
(31, 12, 'Non', 2, 'o', -10, NULL, -10);

-- Insert Tranches (mapped from tranche table)
-- Note: The original tranche referenced idQuestionReponse=4, which corresponds to our Question 5 (entier type)
-- We'll map this to one of the responses for Question 5
INSERT INTO Tranches (id, reponse_id, min, max, value) VALUES
(1, 14, 0, 5, 1),
(2, 14, 6, 15, 2),
(3, 14, 16, 50, 16),
(4, 14, 51, 999, 4);

-- Insert Documents (based on DocumentTag references)
INSERT INTO Documents (id, label, description, file_path) VALUES
(1, 'Document RGPD 1', 'Documentation RGPD première partie', '/documents/rgpd_1.pdf'),
(2, 'Document RGPD 2', 'Documentation RGPD deuxième partie', '/documents/rgpd_2.pdf'),
(3, 'Document IA Act 1', 'Documentation IA Act première partie', '/documents/ia_act_1.pdf'),
(4, 'Document IA Act 2', 'Documentation IA Act deuxième partie', '/documents/ia_act_2.pdf'),
(5, 'Document IA Act 3', 'Documentation IA Act troisième partie', '/documents/ia_act_3.pdf'),
(6, 'Document IA Act 4', 'Documentation IA Act quatrième partie', '/documents/ia_act_4.pdf'),
(7, 'Document IA Act 5', 'Documentation IA Act cinquième partie', '/documents/ia_act_5.pdf'),
(8, 'Document IA Act 6', 'Documentation IA Act sixième partie', '/documents/ia_act_6.pdf'),
(9, 'Document IA Act 7', 'Documentation IA Act septième partie', '/documents/ia_act_7.pdf'),
(10, 'Document IA Act 8', 'Documentation IA Act huitième partie', '/documents/ia_act_8.pdf'),
(11, 'Document IA Act 9', 'Documentation IA Act neuvième partie', '/documents/ia_act_9.pdf'),
(12, 'Document IA Act 10', 'Documentation IA Act dixième partie', '/documents/ia_act_10.pdf');

-- Insert Tags (mapped from DocumentTag table)
INSERT INTO Tags (label, document_id, question_id) VALUES
('DOC_RGPD_1', 1, 1),
('DOC_RGPD_2', 2, 2),
('DOC_IA_ACT_1', 3, 2),
('DOC_IA_ACT_2', 4, 4),
('DOC_IA_ACT_3', 5, 5),
('DOC_IA_ACT_4', 6, 6),
('DOC_AI_ACT_5', 7, 7),
('DOC_AI_ACT_6', 8, 8),
('DOC_AI_ACT_7', 9, 9),
('DOC_AI_ACT_8', 10, 10),
('DOC_AI_ACT_9', 11, 11),
('DOC_AI_ACT_10', 12, 12);

-- Reset sequences to ensure future inserts work correctly
SELECT setval('questionnaires_id_seq', (SELECT MAX(id) FROM Questionnaires));
SELECT setval('sections_id_seq', (SELECT MAX(id) FROM Sections));
SELECT setval('questions_id_seq', (SELECT MAX(id) FROM Questions));
SELECT setval('reponses_id_seq', (SELECT MAX(id) FROM Reponses));
SELECT setval('tranches_id_seq', (SELECT MAX(id) FROM Tranches));
SELECT setval('documents_id_seq', (SELECT MAX(id) FROM Documents));
