import { numdiagPool, toHeroPool, connectToDatabase, executeQuery } from '../database/client.js'

function getQuestionnaireById(req, res) {
    const { id } = req.params;
    const query = 'SELECT * FROM questionnaires WHERE id = $1';
    executeQuery(numdiagPool, query, [id])
        .then(result => {
            if (result.length === 0) {
                return res.status(404).json({ error: 'Questionnaire not found' });
            }
            res.json(result[0]);
        })
        .catch(error => {
            console.error('Error fetching questionnaire:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
}


async function getAllInfosQuestionnaire(idQuestionnaire) {
    // Récupération du questionnaire
    const [questionnaire] = await executeQuery(
        numdiagPool,
        'SELECT * FROM questionnaires WHERE id = $1',
        [idQuestionnaire]
    );
    if (!questionnaire) return null;

    // Récupération des sections
    const sections = await executeQuery(
        numdiagPool,
        'SELECT * FROM sections WHERE questionnaire_id = $1 ORDER BY id',
        [idQuestionnaire]
    );

    // Récupération des questions (pour toutes les sections en une seule fois)
    const questions = await executeQuery(
        numdiagPool,
        'SELECT * FROM questions WHERE section_id = ANY($1) ORDER BY position',
        [sections.map(s => s.id)]
    );

    // Récupération des réponses (pour toutes les questions en une seule fois)
    const reponses = await executeQuery(
        numdiagPool,
        'SELECT * FROM reponses WHERE question_id = ANY($1) ORDER BY position',
        [questions.map(q => q.id)]
    );

    // On indexe les réponses par question_id
    const reponsesByQuestion = {};
    for (const rep of reponses) {
        if (!reponsesByQuestion[rep.question_id]) {
            reponsesByQuestion[rep.question_id] = [];
        }
        reponsesByQuestion[rep.question_id].push(rep);
    }

    // On indexe les questions par section_id
    const questionsBySection = {};
    for (const q of questions) {
        q.reponses = reponsesByQuestion[q.id] || [];
        if (!questionsBySection[q.section_id]) {
            questionsBySection[q.section_id] = [];
        }
        questionsBySection[q.section_id].push(q);
    }

    // On rattache les questions à leur section
    for (const s of sections) {
        s.questions = questionsBySection[s.id] || [];
    }

    // On rattache les sections au questionnaire
    questionnaire.sections = sections;

    return questionnaire;
}

function getSectionofQuestionnaire(idQuestionnaire) {
    return executeQuery(numdiagPool, 'SELECT * FROM sections WHERE id_questionnaire = $1', [idQuestionnaire])
}

function getAllQuestionnaires(req, res) {
    const query = 'SELECT * FROM questionnaires';
    executeQuery(numdiagPool, query)
        .then(result => res.json(result))
        .catch(error => {
            console.error('Error fetching questionnaires:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
}

function getAllQuestionnaireResume() {
    const query = 'SELECT id, label, isactive, ispublished, created_at FROM questionnaires';
    return executeQuery(numdiagPool, query);
}

function updateQuestionnaireInfo(idQuestionnaire, label = null, description = null, insight = null, tooltip=null, code=null, isactive=null, default_question_type=null) {
    const fields = []
    const values = []
    let index = 1

    if (label !== null) {
        fields.push(`label = $${index++}`)
        values.push(label)
    }
    if (description !== null) {
        fields.push(`description = $${index++}`)
        values.push(description)
    }
    if (insight !== null) {
        fields.push(`insight = $${index++}`)
        values.push(insight)
    }
    if (tooltip !== null) {
        fields.push(`tooltip = $${index++}`)
        values.push(tooltip)
    }
    if (code !== null && code !== "") {
        fields.push(`code = $${index++}`)
        values.push(code)
    } else if (code === "") {
        fields.push(`code = $${index++}`)
        values.push(null)
    }
    if (isactive !== null) {
        fields.push(`isactive = $${index++}`)
        values.push(isactive)
    }
    if (default_question_type !== null && default_question_type !== "") {
        fields.push(`default_question_type = $${index++}`)
        values.push(default_question_type)
    } else if (default_question_type === "") {
        fields.push(`default_question_type = $${index++}`)
        values.push(null)
    }

    values.push(idQuestionnaire);

    executeQuery(numdiagPool, `UPDATE Questionnaires SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`, values)
  }

  function createQuestionnaire(label = null, description = null, insight = null, tooltip = null, code = null, default_question_type= null) {
    const fields = [];
    const placeholders=[];
    const values = [];
    let index = 1;

    if (label !== null && label!=='') {
      fields.push(`label`);
      placeholders.push(`$${index++}`);
      values.push(label);
    }
    if (description !== null && description!=='') {
      fields.push(`description`);
      placeholders.push(`$${index++}`);
      values.push(description);
    }
    if (insight !== null && insight!=='') {
      fields.push(`insight`);
      placeholders.push(`$${index++}`);
      values.push(insight);
    }
    if (tooltip !== null && tooltip!=='') {
      fields.push(`tooltip`);
      placeholders.push(`$${index++}`);
      values.push(tooltip);
    }
    if (code !== null && code!=='') {
      fields.push(`code`);
      placeholders.push(`$${index++}`);
      values.push(code);
    }

    if (default_question_type !== null && default_question_type!=='') {
      fields.push(`default_question_type`);
      placeholders.push(`$${index++}`);
      values.push(default_question_type);
    }

     return executeQuery(
        numdiagPool,
        `INSERT INTO Questionnaires (${fields.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
        values
    )
}



async function getAllQuestionsByQuestionnaire(questionnaireId) {
  try {
    // Requête pour récupérer toutes les questions d'un questionnaire avec leurs réponses
    const query = `
      SELECT
        q.id as question_id,
        q.label as question_label,
        q.questionType as question_type,
        q.position as question_position,
        q.page as question_page,
        q.tooltip as question_tooltip,
        q.coeff as question_coeff,
        q.mandatory as question_mandatory,
        r.id as answer_id,
        r.label as answer_label,
        r.position as answer_position,
        r.tooltip as answer_tooltip,
        r.plafond as answer_plafond,
        r.recommandation as answer_recommandation,
        r.valeurScore as answer_value_score
      FROM Questions q
      INNER JOIN Sections s ON q.section_id = s.id
      LEFT JOIN Reponses r ON q.id = r.question_id
      WHERE s.questionnaire_id = $1
      ORDER BY q.position ASC, r.position ASC
    `;

    const result = await executeQuery(numdiagPool,query, [questionnaireId]);

    // Transformation des données pour le format attendu
    const questionsMap = new Map();

    result.forEach(row => {
      const questionId = row.question_id;

      // Si la question n'existe pas encore dans le Map, on l'ajoute
      if (!questionsMap.has(questionId)) {
        questionsMap.set(questionId, {
          id: questionId,
          label: row.question_label,
          questiontype: row.question_type.replace('_', '-'), // Conversion choix_multiple -> choix-multiple
          position: row.question_position,
          page: row.question_page,
          tooltip: row.question_tooltip,
          coeff: row.question_coeff,
          mandatory: row.question_mandatory,
          answers: []
        });
      }

      // Si il y a une réponse associée, on l'ajoute
      if (row.answer_id) {
        const question = questionsMap.get(questionId);
        question.answers.push({
          id: row.answer_id,
          text: row.answer_label,
          value: row.answer_label.toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, ''),
          position: row.answer_position,
          tooltip: row.answer_tooltip,
          plafond: row.answer_plafond,
          recommandation: row.answer_recommandation,
          valeurScore: row.answer_value_score
        });
      }
    });

    // Conversion du Map en array
    return Array.from(questionsMap.values());

  } catch (error) {
    console.error('Error in getAllQuestionsByQuestionnaire:', error);
    throw error;
  }
}
const getDependenciesForQuestion = async (questionId) => {
  try {
    const query = `
      SELECT
        r.question_id,
        qd.reponse_id as answer_id
      FROM QuestionDependencies qd
      INNER JOIN Reponses r ON qd.reponse_id = r.id
      WHERE qd.question_id = $1
      ORDER BY r.question_id, qd.reponse_id
    `;

    const result = await executeQuery(numdiagPool, query, [questionId]);

    // Transformation des résultats en tableau de clés de dépendance
    // Maintenant question_id correspond à la question associée à la réponse
    const dependencies = result.map(row => {
        return `${row.question_id}_${row.answer_id}`;
    });

    return dependencies;

  } catch (error) {
    console.error('Error in getDependenciesForQuestion:', error);
    throw error;
  }
};



const publishQuestionnaire = async (questionnaire_id) => {
  try {
    const query = `
      UPDATE
        Questionnaires
      SET isPublished = $2
      WHERE id = $1
    `;

    const result = await executeQuery(numdiagPool, query, [questionnaire_id, true]);

    // Transformation des résultats en tableau de clés de dépendance
    // Maintenant question_id correspond à la question associée à la réponse

    return {result, success: true};

  } catch (error) {
    console.error('Error in publishQuestionnaire:', error);
    throw error;
  }
};

const exportJson = async (id) => {

  try {
    // 1. Récupérer le questionnaire
    const questionnaires = await executeQuery(
      numdiagPool,
      "SELECT id, label, description, code, version, scoremax FROM Questionnaires WHERE id = $1 AND isactive = TRUE",
      [id]
    );
    if (questionnaires.length === 0) {
      throw new Error("Questionnaire non trouvé");
    }
    const questionnaire = questionnaires[0];
    // 2. Récupérer toutes les sections
    const sections = await executeQuery(
      numdiagPool,
      `SELECT id, label, description, tooltip, scoremax
       FROM Sections
       WHERE questionnaire_id = $1 AND isactive = TRUE
       ORDER BY id`,
      [id]
    );
    // 3. Pour chaque section, récupérer les dépendances
    const sectionDependencies = await executeQuery(
      numdiagPool,
      `SELECT sd.section_id, r.id as reponse_id, r.label as reponse_label, q.id as question_id
       FROM SectionDependencies sd
       JOIN Reponses r ON sd.reponse_id = r.id
       JOIN Questions q ON r.question_id = q.id
       WHERE sd.section_id = ANY($1)`,
      [sections.map(s => s.id)]
    );
    // 4. Récupérer toutes les questions avec leurs dépendances
    const questions = await executeQuery(
      numdiagPool,
      `SELECT q.id, q.section_id, q.label, q.questiontype, q.position, q.page,
              q.tooltip, q.coeff, q.mandatory
       FROM Questions q
       WHERE q.section_id = ANY($1)
       ORDER BY q.section_id, q.position`,
      [sections.map(s => s.id)]
    );
    // 5. Récupérer les dépendances des questions
    const questionDependencies = await executeQuery(
      numdiagPool,
      `SELECT qd.question_id, r.id as reponse_id, r.label as reponse_label,
              q.id as parent_question_id
       FROM QuestionDependencies qd
       JOIN Reponses r ON qd.reponse_id = r.id
       JOIN Questions q ON r.question_id = q.id
       WHERE qd.question_id = ANY($1)`,
      [questions.map(q => q.id)]
    );
    // 6. Récupérer toutes les réponses
    const reponses = await executeQuery(
      numdiagPool,
      `SELECT id, question_id, label, position, tooltip, plafond, recommandation, valeurscore
       FROM Reponses
       WHERE question_id = ANY($1)
       ORDER BY question_id, position`,
      [questions.map(q => q.id)]
    );
    // 7. Récupérer les tranches pour les questions de type 'entier'
    const tranches = await executeQuery(
      numdiagPool,
      `SELECT question_id, min, max, value, tooltip, plafond, recommandation
       FROM ReponsesTranches
       WHERE question_id = ANY($1)
       ORDER BY question_id, min`,
      [questions.map(q => q.id)]
    );
    // 8. Récupérer les tags
    const tags = await executeQuery(
      numdiagPool,
      `SELECT t.question_id, t.label, d.label as document_label
       FROM Tags t
       JOIN Documents d ON t.document_id = d.id
       WHERE t.question_id = ANY($1)`,
      [questions.map(q => q.id)]
    );
    // Construction du JSON de sortie
    const audit = {
      audit: {
        id: questionnaire.id,
        code: questionnaire.code || `AUDIT_${questionnaire.id}`,
        name: questionnaire.label,
        description: questionnaire.description || "",
        form: []
      }
    };
    // Mapper les types de questions
    const mapQuestionType = (dbType) => {
      const typeMapping = {
        'choix_simple': 'single_choice',
        'choix_multiple': 'multiple_choice',
        'entier': 'range',
        'libre': 'free_answer'
      };
      return typeMapping[dbType] || 'free_answer';
    };
    // Construire chaque section
    for (const section of sections) {
      const sectionObj = {
        id: section.id,
        name: section.label,
        description: section.description || "",
        help: section.tooltip || "",
        questions: []
      };
      // Ajouter dependsOn si la section a des dépendances
      const sectionDeps = sectionDependencies.filter(sd => sd.section_id === section.id);
      if (sectionDeps.length > 0) {
        // Pour simplifier, on prend la première dépendance
        // Dans un cas réel, il faudrait gérer les dépendances multiples
        const dep = sectionDeps[0];
        const parentQuestion = questions.find(q => q.id === dep.question_id);
        sectionObj.dependsOn = {
          code: `Q${dep.question_id}`,
          operator: "equals",
          value: dep.reponse_label
        };
      }
      // Récupérer les questions de cette section (triées par position)
      const sectionQuestions = questions.filter(q => q.section_id === section.id);
      for (const question of sectionQuestions) {
        const questionObj = {
          id: question.id,
          code: `Q${question.id}`,
          title: question.label,
          description: question.tooltip || "",
          type: mapQuestionType(question.questiontype),
          mandatory: question.mandatory,
          tags: []
        };
        // Ajouter le coefficient si présent
        if (question.coeff && question.coeff !== 1) {
          questionObj.coefficient = question.coeff;
        }
        // Ajouter les tags
        const questionTags = tags.filter(t => t.question_id === question.id);
        if (questionTags.length > 0) {
          questionObj.tags = questionTags.map(t => t.label);
        }
        // Ajouter dependsOn si la question a des dépendances
        const questionDeps = questionDependencies.filter(qd => qd.question_id === question.id);
        if (questionDeps.length > 0) {
          const dep = questionDeps[0];
          questionObj.dependsOn = {
            code: `Q${dep.parent_question_id}`,
            operator: "equals",
            value: dep.reponse_label
          };
        }
        // Gérer les options selon le type de question
        if (question.questiontype === 'entier') {
          // Questions de type range
          const questionTranches = tranches.filter(t => t.question_id === question.id);
          questionObj.options = questionTranches.map(t => ({
            min: t.min,
            max: t.max,
            unit: "",
            score: t.value,
            ...(t.plafond && { ceiling: t.plafond })
          }));
        } else if (question.questiontype !== 'libre') {
          // Questions à choix (simple ou multiple)
          const questionReponses = reponses.filter(r => r.question_id === question.id);
          questionObj.options = questionReponses.map(r => ({
            label: r.label,
            score: r.valeurscore || 0,
            code: `Q${question.id}_R${r.id}`,
            ...(r.plafond && { ceiling: r.plafond })
          }));
        }
        // Ne pas ajouter options si c'est une question libre
        if (question.questiontype === 'libre') {
          delete questionObj.options;
        }
        sectionObj.questions.push(questionObj);
      }
      audit.audit.form.push(sectionObj);
    }
    // Retourner le JSON formaté
    return audit;
  } catch (error) {
    console.error("Erreur lors de l'export du questionnaire:", error);
  }
}

async function displaySponsor({questionnaireId, sponsorsDisplay}) {
    if (sponsorsDisplay) {
      console.log("ici")
      try {
        const display = await executeQuery(
        numdiagPool,
        "UPDATE questionnaires SET isFunded =  false WHERE id = $1;",
        [questionnaireId]
        );
      } catch (error) {
        console.error("Erreur lors du changement d'état d'affichage des sponsors:", error);
      }
    } else {
      try {
        const display = await executeQuery(
        numdiagPool,
        "UPDATE questionnaires SET isFunded = true WHERE id = $1;",
        [questionnaireId]
        );
      } catch (error) {
        console.error("Erreur lors du changement d'état d'affichage des sponsors:", error);
      }
    }
}

async function clientLogo({url, name, questionnaireId}) {
  console.log("ici")
  let logoClientId=0
  // on commence par désactiver le logo existant pour le questionnaire => current_logo set to false
  try {
      // si existe déjà une entrée avec même questionnaireID et même logo, ne sera pas écrit => primary key constraint
      // AJOUTER : si le questionnaire a déjà une image en current_logo : changer en false
      const currentLogoQuestionnaire = await executeQuery(
          numdiagPool,
          "UPDATE JoinClientLogoQuestionnaires SET current_logo = false WHERE questionnaire_id = $1;",
          [questionnaireId]
          );
    } catch (error) {
        console.error("Erreur lors de la mise à jour des statuts des logos:", error);
  }

    //on vérifie si on a déjà le logo en db (avec le nom de fichier) => si oui on set son current_logo à true et on return
  try {
    const clientImageName = await executeQuery(
        numdiagPool,
        "SELECT * FROM clientLogo WHERE client_name = $1;",
        [name]
        );
    console.log("image name", clientImageName)
    if (clientImageName.length >0) {
      const current_logo_id = clientImageName[0].id;
      try {
        const changeCurrent = await executeQuery(
            numdiagPool,
            "UPDATE JoinClientLogoQuestionnaires SET current_logo = true WHERE questionnaire_id = $1 AND clientlogo_id = $2;",
            [questionnaireId, current_logo_id]
            );
      } catch (error) {
          console.error("Erreur lors de la mise à jour des statuts des logos:", error);
      }
      return ;
    }
  } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'url logo client:", error);
  }


  try {
    logoClientId = await executeQuery(
        numdiagPool,
        "INSERT INTO clientlogo  (url_logo, client_name) VALUES ($1, $2) RETURNING id;",
        [url,name]
        );
    } catch (error) {
          console.error("Erreur lors de l'enregistrement de l'url logo client:", error);
    }

    try {
      const joinLogoQuestionnaire = await executeQuery(
          numdiagPool,
          "INSERT INTO JoinClientLogoQuestionnaires (questionnaire_id, clientlogo_id, current_logo) VALUES ($1, $2, $3);",
          [questionnaireId,logoClientId[0].id, true]
          );
    } catch (error) {
          console.error("Erreur lors de l'insertion de l'url logo client:", error);
    }
}

async function searchLogoByName(name) {
  try {
      const logo = await executeQuery(
          numdiagPool,
          "SELECT * FROM clientlogo WHERE client_name=$1;",
          [name]
          );
      if (logo.length > 0) {
         return logo[0];
       } else {return '';}
    } catch (error) {
          console.error("Erreur lors de l'insertion de l'url logo client:", error);
    }

}
async function searchLogo(questionnaireId) {
  let logo=[]
  try {
      logo = await executeQuery(
          numdiagPool,
          "SELECT clientlogo_id FROM joinclientlogoquestionnaires WHERE questionnaire_id=$1 AND current_logo=true;",
          [questionnaireId]
          );
        } catch (error) {
          console.error("Erreur lors de la recherche dans table jointure:", error);
        }

  try {
      const clientName = await executeQuery(
          numdiagPool,
          "SELECT client_name FROM clientlogo WHERE id=$1;",
          [logo[0].clientlogo_id]
          );

      return clientName[0].client_name;
    } catch (error) {
          console.error("Erreur lors de la recherche du nom de fichier du logo:", error);
    }
}




export {
    createQuestionnaire,
    getQuestionnaireById,
    getAllInfosQuestionnaire,
    getAllQuestionnaires,
    getAllQuestionnaireResume,
    getSectionofQuestionnaire,
    updateQuestionnaireInfo,
    getAllQuestionsByQuestionnaire,
    getDependenciesForQuestion,
    publishQuestionnaire,
    exportJson,
    displaySponsor,
    clientLogo,
    searchLogoByName,
    searchLogo
}
