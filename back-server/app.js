import express from 'express'
import cors from 'cors'

import { numdiagPool, toHeroPool, connectToDatabase, executeQuery, initNumdiagDatabase, populateNumdiagDatabase } from './database/client.js'
import { getQuestionnaireById, createQuestionnaire, getAllQuestionnaires, getAllInfosQuestionnaire, getAllQuestionnaireResume, updateQuestionnaireInfo, getAllQuestionsByQuestionnaire,getDependenciesForQuestion } from './questionnaire/questionnaire.js'
import { getAllQuestionBySection} from './questionnaire/section.js'
import {updateQuestion,updatePositions,deleteReponses,createQuestion} from './questionnaire/question.js'
import {createSection, updateSection} from './questionnaire/section.js'
import { 
    addReponsesTranches, 
    getReponsesTranchesByQuestion, 
    updateReponsesTranches, 
    deleteReponsesTranches 
} from './questionnaire/reponsesTranches.js'

import { updateReponse,createReponse } from './questionnaire/reponse.js'

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
      theme,
      mandatory,
      public_cible,
      dependencies // Array de reponse_id : ['2_6', '3_4']
    } = req.body;



    const updatedQuestion =  await updateQuestion(questionId,section_id,label,questiontype,tooltip,coeff,theme,mandatory,public_cible,dependencies)
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
  const { label, description, insight, isactive } = req.body; // Get data from request body
  try {
    const questionnaireUpdate = await updateQuestionnaireInfo(questionnaireId, label, description, insight, isactive)
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
    res.status(200).json({success: true})
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
        theme, 
        mandatory, 
        public_cible 
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
            theme,
            mandatory,
            public_cible
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