import express from 'express'
import cors from 'cors'
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });


import { numdiagPool, toHeroPool, connectToDatabase, executeQuery, initNumdiagDatabase, populateNumdiagScores } from './database/client.js'
import { getQuestionnaireById, createQuestionnaire, getAllQuestionnaires, getAllInfosQuestionnaire, getAllQuestionnaireResume, updateQuestionnaireInfo, getAllQuestionsByQuestionnaire,getDependenciesForQuestion, publishQuestionnaire, exportJson, displaySponsor, clientLogo } from './questionnaire/questionnaire.js'
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
import { createSession,launchSession,getSessionQuestionnaire,updateSession, getScore, trySessionCode, getQuestionnaireCode, getQuestionnaireInfos } from './session/session.js'
import { getAllPublics,getAllPublicsActive, createPublic, getAllThemes,getAllThemesActive, createTheme, updateTheme, activationTheme, updatePublic, activationPublic, createThemePublicQuestionnaire, associatedThemesAndPublics, updateAssociatedThemesAndPublics, createThemePublicQuestion, associatedThemesAndPublicsQuestion, updateAssociatedThemesAndPublicsQuestion, searchQuestions } from './questionnaire/themePublic.js'
import { updateScore, getAllScores, createScore, deleteScore, createNewScore } from './questionnaire/scores.js'

const app = express()
const port = 3008

app.use(express.json())

var corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
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

app.post('/populateScores', async (req, res) => {
  try {
    await populateNumdiagScores()
    res.status(200).json({ message: 'Scores populated successfully' })
  } catch (error) {
    console.error('Error populating scores:', error)
    res.status(500).json({ error: 'Failed to populate scores' })
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
      tooltip,
      coeff,
      mandatory,
      dependencies, // Array de reponse_id : ['2_6', '3_4']
      themes,
      publics
    } = req.body;



    const updatedQuestion =  await updateQuestion(questionId,section_id,label,questiontype,tooltip,coeff,mandatory,dependencies, themes, publics)
    const updatedThemesAndPublics = await updateAssociatedThemesAndPublicsQuestion({questionId, themes, publics})
    res.status(200).json(updatedQuestion, updatedThemesAndPublics)
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
  const { label, description, insight, tooltip, code, isactive, default_question_type } = req.body; // Get data from request body
  try {
    const questionnaireUpdate = await updateQuestionnaireInfo(questionnaireId, label, description, insight, tooltip, code, isactive, default_question_type)
    res.status(200).json({ message: 'Questionnaire Updated successfully' })
  } catch (error) {
    console.error('Error updating questionnaire infos:', error)
    res.status(500).json({ error: 'Failed to update questionnaire' })
  }
})

app.post('/createQuestionnaire', async (req,res) => {
  const { label, description, insight, tooltip, code, default_question_type } = req.body; // Get data from request body
  try {
    const questionnaireCreate = await createQuestionnaire(label, description, insight, tooltip, code, default_question_type)
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
        themes,
        publics
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
        const themeAndPublic = await createThemePublicQuestion({question_id:result.question.id, theme:themes, publicSelect:publics})
        console.log("Create question:", result)
        console.log("Create themes and publics:", themeAndPublic)
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

app.post('/sessionStorage',async (req,res) => {
    const { idQuestionnaire, idSession } = req.body;
    try {
        const result = await getQuestionnaireInfos(idQuestionnaire, idSession)
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

app.get('/sessionBack/questionnaire/:id_session',async (req,res) => {
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

app.put('/sessionUpdate/:id_session', async (req, res) => {
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
    const result = await exportJson(id)
    res.status(200).json({
            success: true,
            message: 'Json export ok',
            data: result
        })
  } catch (error) {
        console.error('Error exporting json:', error)
        res.status(500).json({ error: 'Failed to export json' })
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

app.get('/associatedThemesAndPublicsQuestion/:questionId', async (req,res) => {
  const { questionId } = req.params;
  try {
    const themesAndPublics = await associatedThemesAndPublicsQuestion(questionId);
    res.status(200).json({themesAndPublics})
  } catch (error) {
    console.error('Error finding themes and publics for question:',questionId, ' :', error)
    res.status(500).json({ error: 'Failed to find themes and publics for question' })
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

app.post('/searchQuestions', async (req,res) => {
        const {selectedThemes, selectedPublics} = req.body; // Get data from request body
        try {
          const foundQuestions = await searchQuestions({selectedThemes, selectedPublics})
          res.status(200).json(foundQuestions)
        } catch (error) {
          console.error('Error searching questions:', error)
          res.status(500).json({ error: 'Failed to search questions' })
        }
      })

app.post('/updatescore/:scoreId', async (req,res) => {
      const { scoreId } = req.params;
      const { questionnaireId, lettre, scoremin, scoremax, } = req.body; // Get data from request body
      try {
        const scoreUpdated = await updateScore({questionnaireId, scoreId, lettre, scoremin, scoremax} )
        console.log('Score has been updated: ',scoreUpdated);
        res.status(200).json({success: true, update: scoreUpdated})
      } catch (error) {
        console.error('Error updating score:', error)
        res.status(500).json({ error: 'Failed to update score' })
      }
    })

app.get('/scores/:questionnaireId', async (req, res) => {
  const { questionnaireId } = req.params
  try {
    const scores = await getAllScores(questionnaireId)
    res.json({ scores })
  } catch (error) {
    console.error('Error fetching scores:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/createscore/:questionnaireId', async (req,res) => {
  const {questionnaireId} = req.params
  try {
    // const defaultScores = await defaultScores();
    const create = await createScore(questionnaireId);
    console.log("created scores for questionnaire ", questionnaireId, ":", create)
    res.status(200).json({success: true, create})
  } catch (error) {
    console.error('Error creating score:', error)
    res.status(500).json({ error: 'Failed to create score' })
  }
})

app.post('/createnewscore', async (req,res) => {
  const {newScore, questionnaire_id} = req.body
  try {
    // const defaultScores = await defaultScores();
    const create = await createNewScore(newScore, questionnaire_id);
    console.log("created scores for questionnaire ", questionnaire_id, ":", create)
    res.status(200).json({success: true, create})
  } catch (error) {
    console.error('Error creating score:', error)
    res.status(500).json({ error: 'Failed to create score' })
  }
})

app.post('/deletescore/:scoreId', async (req, res) => {
  const {scoreId} = req.params;
  const { questionnaireId } = req.body;
  console.log(questionnaireId)
  try {
    const scoreDeleted = await deleteScore(scoreId, questionnaireId)
    console.log(scoreDeleted)
    console.log('score', scoreDeleted[0], ' has been deleted: ',scoreDeleted[1]);
    res.status(200).json({success: true})
  }
  catch (error) {
    console.error('Error deleting score:', error)
    scoreDeleted.status(500).json({ error: 'Failed to delete score' })
  }
})

app.post('/displaysponsors/:questionnaireId', async (req,res) => {
  const {questionnaireId} = req.params;
  const { sponsorsDisplay } = req.body;
  console.log("coucou")
  try {
    const toggleDisplay = await displaySponsor({questionnaireId, sponsorsDisplay})
    res.status(200).json({success: true})
  }
  catch (error) {
    console.error('Error toggling sponsor display:', error)
    res.status(500).json({ error: 'Failed to toggle sponsor display' })
  }
})

// client logo

const upload = multer({ storage: multer.memoryStorage() });
app.post('/clientlogo', upload.single('image'), async (req,res) => {
  const {questionnaireId} = req.params;
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'your-folder' },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(req.file.buffer);
    });
    const url = result.secure_url;
  }
  catch (error) {
    console.error('Error uploading file to cloudinary:', error)
    res.status(500).json({ error: 'Failed to upload file to cloudinary' })
  }
  try {
    const insertUrl = await clientLogo({url, questionnaireId})
  }
  catch (error) {
    console.error('Failed to insert url of client logo in DB')
    res.status(500).json({ error: 'Failed to to insert url of client logo in DB' })
  }
  res.status(200).json({success: "File sent to cloudinary and url in db"})
})
