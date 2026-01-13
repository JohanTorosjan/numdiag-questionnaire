import express from 'express'
import cors from 'cors'

import { numdiagPool, toHeroPool, connectToDatabase, executeQuery, initNumdiagDatabase, populateNumdiagDatabase } from './database/client.js'
import { getQuestionnaireById, createQuestionnaire, getAllQuestionnaires, getAllInfosQuestionnaire, getAllQuestionnaireResume, updateQuestionnaireInfo, getAllQuestionsByQuestionnaire,getDependenciesForQuestion, publishQuestionnaire } from './questionnaire/questionnaire.js'
import { getAllQuestionBySection} from './questionnaire/section.js'
import {updateQuestion,updatePositions,deleteReponses,createQuestion, deleteQuestion} from './questionnaire/question.js'
import {createSection, updateSection} from './questionnaire/section.js'
import {
    addReponsesTranches,
    getReponsesTranchesByQuestion,
    updateReponsesTranches,
    deleteReponsesTranches
} from './questionnaire/reponsesTranches.js'
import { createReco, getAllReco, updateReco, deleteReco } from './questionnaire/recommandation.js'
import { updateReponse,createReponse,deleteSingleReponse} from './questionnaire/reponse.js'
import { createSession,launchSession,getSessionQuestionnaire,updateSession, getScore, trySessionCode, getQuestionnaireCode } from './session/session.js'
import { getAllPublics,getAllPublicsActive, createPublic, getAllThemes,getAllThemesActive, createTheme, updateTheme, activationTheme, updatePublic, activationPublic, createThemePublicQuestionnaire, associatedThemesAndPublics, updateAssociatedThemesAndPublics } from './questionnaire/themePublic.js'

const app = express()
const port = 3008

app.use(express.json())

var corsOptions = {
  origin: 'http://127.0.0.1:8081',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

app.use(express.json());

app.get('/', (req, res) => {
  res.json('Hello World !')
})

app.get('/numdiag', async (req, res) => {
  try {
    await connectToDatabase(numdiagPool)
    const result = await executeQuery(numdiagPool, 'SELECT * from questionnaires', [])
    res.json(result)
  } catch (error) {
    console.error('Error querying numdiag database:', error)
    res.status(500).send('Error querying numdiag database')
  }
})

app.get('/tohero', async (req, res) => {
  try {
    await connectToDatabase(toHeroPool)
    const result = await executeQuery(toHeroPool, 'SELECT 1', [])
    res.json(result)
  } catch (error) {
    console.error('Error querying tohero database:', error)
    res.status(500).send('Error querying tohero database')
  }
})

app.get('/questionnaire/:questionnaireId', async (req, res) => {
  const { questionnaireId } = req.params
  try {
    const questionnaire = await getAllInfosQuestionnaire(questionnaireId)
    res.json(questionnaire)
  } catch (error) {
    console.error('Error fetching questionnaire:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/question/:questionId', async (req, res) => {
  const { questionId } = req.params
  try {
    const question = await getAllInfosQuestion(questionId)
    res.json(question)
  } catch (error) {
    console.error('Error fetching question:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/sections/:sectionId', async (req, res) => {
  const { sectionId } = req.params
  try {
    const questions = await getAllQuestionBySection(sectionId)
    res.json({ questions })
  } catch (error) {
    console.error('Error fetching section questions:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/questionnairesResume', async (req, res) => {
  try {
    const questionnaires = await getAllQuestionnaireResume()
    res.json(questionnaires)
  } catch (error) {
    console.error('Error fetching questionnaires resume:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/initDatabase', async (req, res) => {
  try {
    await initNumdiagDatabase()
    res.status(200).json({ message: 'Database initialized successfully' })
  } catch (error) {
    console.error('Error initializing database:', error)
    res.status(500).json({ error: 'Failed to initialize database' })
  }
})

app.post('/populateDatabase', async (req, res) => {
  try {
    await populateNumdiagDatabase()
    res.status(200).json({ message: 'Database populated successfully' })
  } catch (error) {
    console.error('Error populating database:', error)
    res.status(500).json({ error: 'Failed to populate database' })
  }
})

app.get('/questions/:questionnaireId', async (req, res) => {
  const { questionnaireId } = req.params
  try {
    const questions = await getAllQuestionsByQuestionnaire(questionnaireId)
    res.json(questions)
  } catch (error) {
    console.error('Error fetching questionnaire:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})



app.get('/questions/dependencies/:question', async (req, res) => {
  try {
    const questions = await getDependenciesForQuestion(req.params.question)
    res.json(questions)
  } catch (error) {
    console.error('Error fetching questionnaire:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.put('/questions/:id', async (req, res) => {
  try {
    const questionId = req.params.id;

    const {
      section_id,
      label,
      questiontype,
      position,
      page,
      tooltip,
      coeff,
      mandatory,
      dependencies // Array de reponse_id : ['2_6', '3_4']
    } = req.body;



    const updatedQuestion =  await updateQuestion(questionId,section_id,label,questiontype,tooltip,coeff,mandatory,dependencies)
    res.status(200).json(updatedQuestion)
  } catch (error) {
    console.error('Error populating database:', error)
    res.status(500).json({ error: 'Failed to populate database' })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.put('/updateQuestionnaire/:questionnaireId', async (req, res) => {
  const { questionnaireId } = req.params;
  const { label, description, insight, tooltip, code, isactive } = req.body; // Get data from request body
  try {
    const questionnaireUpdate = await updateQuestionnaireInfo(questionnaireId, label, description, insight, tooltip, code, isactive)
    res.status(200).json({ message: 'Questionnaire Updated successfully' })
  } catch (error) {
    console.error('Error updating questionnaire infos:', error)
    res.status(500).json({ error: 'Failed to update questionnaire' })
  }
})

app.post('/createQuestionnaire', async (req,res) => {
  const { label, description, insight, tooltip, code } = req.body; // Get data from request body
  try {
    const questionnaireCreate = await createQuestionnaire(label, description, insight, tooltip, code)
    res.status(200).json({success: true, questionnaire: questionnaireCreate[0]})
  } catch (error) {
    console.error('Error creating questionnaire:', error)
    res.status(500).json({ error: 'Failed to create questionnaire' })
  }
})


app.put('/updateSection/:sectionId', async (req, res) => {
  const { sectionId } = req.params;  // Fixed: was idSection, but route param is sectionId
  const { label, description, tooltip, nbpages, isActive } = req.body;

  try {
    console.log('section_id:', sectionId);
    // Get max position
    // const lastSectionResult = await executeQuery(
    //   numdiagPool,
    //   `SELECT MAX(position) FROM Sections WHERE questionnaire_id = $1`,
    //   [questionnaireId]
    // )

    const sectionUpdate = await updateSection(
      sectionId,
      {label,
      description,
      tooltip,
      nbpages,
      isActive}
    )

    console.log('Section has been updated: ',sectionUpdate);
    res.status(200).json({success: true})
  }
  catch (error) {
    console.error('Error updating section infos:', error)
    sectionUpdate.status(500).json({ error: 'Failed to update section' })
  }
})

app.put('/questions/:questionId/position', async (req, res) => {
  const { questionId } = req.params;
  const { position: newPosition, page: newPage } = req.body;

  try{
    const positionsUpdated = await updatePositions(questionId,newPosition,newPage)
    res.status(200).json(positionsUpdated)
  }
  catch(err){
    console.error('Error updating positions:', err)
    res.status(500).json({ error: 'Failed to update positions' })
  }

});

app.post('/createSection', async (req,res) => {
  let { questionnaire_id, label, description, tooltip, nbPages } = req.body; // Get data from request body
  try {
    const SectionCreate = await createSection( questionnaire_id, label, description, tooltip, nbPages )
    console.log('Section has been created: ',SectionCreate);
    res.status(200).json({success: true})
  } catch (error) {
    console.error('Error creating section:', error)
    res.status(500).json({ error: 'Failed to create section' })
  }
})


app.delete('/questions/:questionId/deleteReponses', async (req, res) => {
    const { questionId } = req.params

    try {
        const result = await deleteReponses(questionId)
        res.status(200).json({
            success: true,
            message: 'Reponses deleted successfully',
            data: result
        })
    } catch (error) {
        console.error('Error deleting reponses:', error)
        res.status(500).json({ error: 'Failed to delete reponses' })
    }
})


// Sauvegarder les tranches pour une question
app.post('/questions/:questionId/tranches', async (req, res) => {
    const { questionId } = req.params
    const { tranches } = req.body

    try {
        const result = await addReponsesTranches(questionId, tranches)
        res.status(200).json({
            success: true,
            message: 'Tranches saved successfully',
            data: result
        })
    } catch (error) {
        console.error('Error saving tranches:', error)
        res.status(500).json({ error: 'Failed to save tranches' })
    }
})

// Récupérer les tranches d'une question
app.get('/questions/:questionId/tranches', async (req, res) => {
    const { questionId } = req.params

    try {
        const tranches = await getReponsesTranchesByQuestion(questionId)
        res.json(tranches)
    } catch (error) {
        console.error('Error fetching tranches:', error)
        res.status(500).json({ error: 'Failed to fetch tranches' })
    }
})

// Mettre à jour les tranches d'une question
app.put('/questions/:questionId/tranches', async (req, res) => {
    const { questionId } = req.params
    const { tranches } = req.body

    try {
        const result = await updateReponsesTranches(questionId, tranches)
        res.status(200).json({
            success: true,
            message: 'Tranches updated successfully',
            data: result
        })
    } catch (error) {
        console.error('Error updating tranches:', error)
        res.status(500).json({ error: 'Failed to update tranches' })
    }
})

// Supprimer les tranches d'une question
app.delete('/questions/:questionId/tranches', async (req, res) => {
    const { questionId } = req.params

    try {
        const result = await deleteReponsesTranches(questionId)
        res.status(200).json({
            success: true,
            message: 'Tranches deleted successfully',
            data: result
        })
    } catch (error) {
        console.error('Error deleting tranches:', error)
        res.status(500).json({ error: 'Failed to delete tranches' })
    }
})

app.put('/reponses/:reponseId', async (req, res) => {
    const { reponseId } = req.params;
    const { label, tooltip, plafond, recommandation, valeurScore } = req.body;
    console.log(label, tooltip, plafond, recommandation, valeurScore )
    try {

        const result = await updateReponse(
            reponseId,
            label,
            tooltip,
            plafond,
            recommandation,
            valeurScore
        )
        res.status(200).json({
            success: true,
            message: 'Reponse updated successfully',
            data: result[0]
        })
    } catch (error) {
        console.error('Error updating reponse:', error)
        res.status(500).json({ error: 'Failed to update reponse' })
    }
})

/////////////////////////////
// Recommandations

app.post('/createreco', async (req,res) => {
  let { recommandation, min, max, questionnaire_id } = req.body; // Get data from request body
  try {
    const RecoCreate = await createReco( questionnaire_id, recommandation, min, max )
    console.log('Recommandation has been created: ',RecoCreate);
    res.status(200).json({success: true})
  } catch (error) {
    console.error('Error creating recommandation:', error)
    res.status(500).json({ error: 'Failed to create recommandation' })
  }
})

app.get('/recommandations/:questionnaireId', async (req, res) => {
  const { questionnaireId } = req.params
  try {
    const recommandations = await getAllReco(questionnaireId)
    res.json({ recommandations })
  } catch (error) {
    console.error('Error fetching recommandations:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.put('/updatereco/:recoId', async (req, res) => {
  const { recoId } = req.params;  // Fixed: was idSection, but route param is recoId
  const { recommandation, min, max } = req.body;

  try {
    console.log('recommandation_id:', recoId);
    // Get max position
    // const lastSectionResult = await executeQuery(
    //   numdiagPool,
    //   `SELECT MAX(position) FROM Sections WHERE questionnaire_id = $1`,
    //   [questionnaireId]
    // )

    const recoUpdate = await updateReco(recoId, { recommandation, min, max })

    console.log('recommandation has been updated: ',recoUpdate);
    res.status(200).json({success: true})
  }
  catch (error) {
    console.error('Error updating recommandation infos:', error)
    recoUpdate.status(500).json({ error: 'Failed to update recommandation' })
  }
})


app.delete('/deletereco/:recoId', async (req, res) => {
  const { recoId } = req.params;  // Fixed: was idSection, but route param is recoId

  try {
    console.log('recommandation_id:', recoId);

    const recoDelete = await deleteReco(recoId)

    console.log('recommandation has been deleted: ',recoDelete);
    res.status(200).json({success: true})
  }
  catch (error) {
    console.error('Error deleting recommandation infos:', error)
    recoDelete.status(500).json({ error: 'Failed to delete recommandation' })
  }
})


// Route POST pour créer une question
app.post('/questions', async (req, res) => {
    const {
        section_id,
        label,
        questiontype,
        position,
        page,
        tooltip,
        coeff,
        mandatory,
    } = req.body;

    try {
        const result = await createQuestion(
            section_id,
            label,
            questiontype,
            position,
            page,
            tooltip,
            coeff,
            mandatory,
        );

        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            data: result
        });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Failed to create question' });
    }
});



// Route POST pour créer une réponse
app.post('/reponses', async (req, res) => {
    const {
        question_id,
        label,
        tooltip,
        plafond,
        recommandation,
        valeurScore
    } = req.body;

    try {
        const result = await createReponse(
            question_id,
            label,
            tooltip,
            plafond,
            recommandation,
            valeurScore
        );

        res.status(201).json({
            success: true,
            message: 'Reponse created successfully',
            data: result
        });
    } catch (error) {
        console.error('Error creating reponse:', error);
        res.status(500).json({ error: 'Failed to create reponse' });
    }
});


app.delete('/questions/:questionId/', async (req, res) => {
    const { questionId } = req.params
    try{
   const response = await deleteQuestion(questionId)
    res.status(200).json({
            success: true,
            message: 'question deleted successfully',
            data: response
        });
  }
    catch(e){
      console.log(e)
       res.status(500).json({ error: 'Failed to delete question'});

    }
})


app.delete('/reponse/:reponseId/', async (req, res) => {
    const { reponseId } = req.params
    try{
   const response = await deleteSingleReponse(reponseId)
    res.status(200).json({
            success: true,
            message: 'reponse deleted successfully',
            data: response
        });
  }
    catch(e){
      console.log(e)
       res.status(500).json({ error: 'Failed to delete reponse'});

    }
})


app.post('/session/:id_questionnaire',async (req,res) => {
    const { id_questionnaire } = req.params;
    try {
        const result = await createSession(id_questionnaire)
        res.status(200).json({
            success: true,
            message: 'Session saved successfully',
            data: result
        })
    } catch (error) {
        console.error('Error saving session:', error)
        res.status(500).json({ error: 'Failed to save session' })
    }
})

app.put('/session/start/:id_session',async (req,res) => {
    const { id_session } = req.params;
    try {
        const result = await launchSession(id_session)
        res.status(200).json({
            success: true,
            message: 'Session updated successfully',
            data: result
        })
    } catch (error) {
        console.error('Error saving session:', error)
        res.status(500).json({ error: 'Failed to save session' })
    }
})

app.get('/session/questionnaire/:id_session',async (req,res) => {
    const { id_session } = req.params;
    try {
        const result = await getSessionQuestionnaire(id_session)
        res.status(200).json({
            success: true,
            message: 'Session questionnaire getted successfully',
            data: result
        })
    } catch (error) {
        console.error('Error getting session questionnaire:', error)
        res.status(500).json({ error: 'Failed to get session questionnaire' })
    }
})

app.put('/session/:id_session', async (req, res) => {
    const { id_session } = req.params;
    const sessionData = req.body; // Récupérer les données du body

    try {
        const result = await updateSession(id_session, sessionData);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Session updated successfully',
                data: result.data
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('Error updating session:', error);
        res.status(500).json({ error: 'Failed to update session' });
    }
});

app.get('/score/:id_session',async (req,res) => {
    const { id_session } = req.params;
    try {
      // console.log("ici tu es dans le back score")
        const result = await getScore(id_session)
        res.status(200).json({
            success: true,
            message: 'Score computed and got successfully',
            data: result
        })
    } catch (error) {
        console.error('Error getting score:', error)
        res.status(500).json({ error: 'Failed to compute and get score' })
    }
})


app.put('/publish/:questionnaire_id', async (req, res) => {
  const { questionnaire_id } = req.params;

  try {
    const result = await publishQuestionnaire(questionnaire_id);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Questionnaire published succesfully',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error publishing questionnaire:', error);
    res.status(500).json({ error: 'Failed to publish questionnaire' });
  }
});

app.post('/sessioncode/:id_session',async (req,res) => {
    const { id_session } = req.params;
    const { code } = req.body;
    try {
        const result = await trySessionCode({id_session, code})
        console.log("Code passed back validation:", result)
        res.status(200).json({
            success: true,
            message: 'Session code ok',
            data: result
        })
    } catch (error) {
        console.error('Error getting session code:', error)
        res.status(500).json({ error: 'Failed to get session code' })
    }
})

app.get('/code/:id_questionnaire',async (req,res) => {
    const { id_questionnaire } = req.params;
    try {
        const result = await getQuestionnaireCode(id_questionnaire)
        console.log("Code got from questionnaire",id_questionnaire,":", result)
        res.status(200).json({
            success: true,
            message: 'Code from questionnaire exist',
            data: result
        })
    } catch (error) {
        console.error('Error getting questionnaire code:', error)
        res.status(500).json({ error: 'Failed to get questionnaire code' })
    }
})

app.get("/questionnaires/:id/export", async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Récupérer le questionnaire
    const questionnaires = await executeQuery(
      numdiagPool,
      "SELECT id, label, description, code, version, scoremax FROM Questionnaires WHERE id = $1 AND isactive = TRUE",
      [id]
    );
    if (questionnaires.length === 0) {
      return res.status(404).json({ error: "Questionnaire non trouvé" });
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
              q.tooltip, q.coeff, q.mandatory,
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
    res.json(audit);
  } catch (error) {
    console.error("Erreur lors de l'export du questionnaire:", error);
    res.status(500).json({
      error: "Erreur lors de l'export du questionnaire",
      details: error.message
    });
  }
});

app.get('/publics',async (req,res) => {

    try {
      // console.log("ici tu es dans le back score")
        const result = await getAllPublics()
        res.status(200).json({
            success: true,
            message: 'All publics loaded',
            data: result
        })
    } catch (error) {
        console.error('Error getting publics:', error)
        res.status(500).json({ error: 'Failed to get publics' })
    }
})
app.get('/activepublics',async (req,res) => {

    try {
      // console.log("ici tu es dans le back score")
        const result = await getAllPublicsActive()
        res.status(200).json({
            success: true,
            message: 'All active publics loaded',
            data: result
        })
    } catch (error) {
        console.error('Error getting active publics:', error)
        res.status(500).json({ error: 'Failed to get active publics' })
    }
})

app.post('/createPublic',async (req,res) => {
    const { label } = req.body;
    try {
        const result = await createPublic(label)
        console.log("New public created:", result)
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        console.error('Error creating public:', error)
        res.status(500).json({ error: 'Failed to create public' })
    }
})

app.get('/themes',async (req,res) => {

    try {
      // console.log("ici tu es dans le back score")
        const result = await getAllThemes()
        res.status(200).json({
            success: true,
            message: 'All themes loaded',
            data: result
        })
    } catch (error) {
        console.error('Error getting themes:', error)
        res.status(500).json({ error: 'Failed to get themes' })
    }
})
app.get('/activethemes',async (req,res) => {

    try {
      // console.log("ici tu es dans le back score")
        const result = await getAllThemesActive()
        res.status(200).json({
            success: true,
            message: 'All active themes loaded',
            data: result
        })
    } catch (error) {
        console.error('Error getting active themes:', error)
        res.status(500).json({ error: 'Failed to get active themes' })
    }
})

app.post('/createTheme',async (req,res) => {
    const { label } = req.body;
    try {
        const result = await createTheme(label)
        console.log("New theme created:", result)
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        console.error('Error creating theme:', error)
        res.status(500).json({ error: 'Failed to create theme' })
    }
})

app.put('/updateTheme/:themeId', async (req, res) => {
  const { themeId } = req.params;
  const { label } = req.body; // Get data from request body
  try {
    const themeUpdate = await updateTheme(themeId, label)
    res.status(200).json({ message: 'Theme label Updated successfully' })
  } catch (error) {
    console.error('Error updating theme label:', error)
    res.status(500).json({ error: 'Failed to update theme label' })
  }
})

app.post('/deactivateTheme/:themeId', async (req, res) => {
  console.log("Hello")
  const { themeId } = req.params;
  const { themeState } = req.body; // Get data from request body
  try {
    const themeActivate = await activationTheme(themeId, themeState)
    res.status(200).json({ message: 'Theme activation Updated successfully' })
  } catch (error) {
    console.error('Error updating theme activation:', error)
    res.status(500).json({ error: 'Failed to update theme activation' })
  }
})

app.put('/updatePublic/:publicId', async (req, res) => {
  const { publicId } = req.params;
  const { label } = req.body; // Get data from request body
  try {
    const publicUpdate = await updatePublic(publicId, label)
    res.status(200).json({ message: 'public label Updated successfully' })
  } catch (error) {
    console.error('Error updating public label:', error)
    res.status(500).json({ error: 'Failed to update public label' })
  }
})

app.post('/deactivatePublic/:publicId', async (req, res) => {
  console.log("Hello")
  const { publicId } = req.params;
  const { publicState } = req.body; // Get data from request body
  try {
    const publicActivate = await activationPublic(publicId, publicState)
    res.status(200).json({ message: 'public activation Updated successfully' })
  } catch (error) {
    console.error('Error updating public activation:', error)
    res.status(500).json({ error: 'Failed to update public activation' })
  }
})

app.post('/themePublicQuestionnaire',async (req,res) => {
    const { theme, publicSelect, questionnaire_id } = req.body;
    try {
        const result = await createThemePublicQuestionnaire({ theme, publicSelect, questionnaire_id })
        console.log("Theme and publics saved for questionnaire:", questionnaire_id)
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        console.error('Error creating theme:', error)
        res.status(500).json({ error: 'Failed to create theme' })
    }
})

app.get('/associatedThemesAndPublics/:questionnaireId', async (req,res) => {
  const { questionnaireId } = req.params;
  try {
    const themesAndPublics = await associatedThemesAndPublics(questionnaireId);
    res.status(200).json({themesAndPublics})
  } catch (error) {
    console.error('Error finding themes and publics:', error)
    res.status(500).json({ error: 'Failed to find themes and publics for questionnaire' })
  }
})

app.post('/questionnaireThemesAndPublics/:questionnaireId', async (req,res) => {
  const { questionnaireId } = req.params;
  const { theme, publicSelect } = req.body;
  try {
    const themesAndPublics = await updateAssociatedThemesAndPublics({questionnaireId, theme, publicSelect});
    res.status(200).json({themesAndPublics})
  } catch (error) {
    console.error('Error finding themes and publics:', error)
    res.status(500).json({ error: 'Failed to update themes and publics for questionnaire' })
  }
})
