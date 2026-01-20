import { numdiagPool, executeQuery } from '../database/client.js'

function getAllPublics() {
    return executeQuery(numdiagPool, 'SELECT * FROM publics ORDER BY id')
}
function getAllPublicsActive() {
    return executeQuery(numdiagPool, 'SELECT * FROM publics WHERE isactive ORDER BY id')
}

function createPublic(label = null) {
    const fields = [];
    const placeholders=[];
    const values = [];
    let index = 1;

    if (label !== null && label!=='') {
      fields.push(`label`);
      placeholders.push(`$${index++}`);
      values.push(label);
    }

     return executeQuery(
        numdiagPool,
        `INSERT INTO Publics (${fields.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
        values
    )
}

function getAllThemes() {
    return executeQuery(numdiagPool, 'SELECT * FROM themes ORDER BY id')
}
function getAllThemesActive() {
    return executeQuery(numdiagPool, 'SELECT * FROM themes WHERE isactive ORDER BY id')
}

function createTheme(label = null) {
    const fields = [];
    const placeholders=[];
    const values = [];
    let index = 1;

    if (label !== null && label!=='') {
      fields.push(`label`);
      placeholders.push(`$${index++}`);
      values.push(label);
    }

     return executeQuery(
        numdiagPool,
        `INSERT INTO Themes (${fields.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
        values
    )
}

const updateTheme = async (theme_id, label) => {
  try {
    const query = `
      UPDATE
        themes
      SET label = $2
      WHERE id = $1
    `;

    const result = await executeQuery(numdiagPool, query, [theme_id, label]);

    return {result, success: true};

  } catch (error) {
    console.error('Error updating theme label:', error);
    throw error;
  }
};

const activationTheme = async (themeId, themeState) => {
  try {
    const query = `
    UPDATE
    themes
    SET isactive = $2
    WHERE id = $1
    `;

    const result = await executeQuery(numdiagPool, query, [themeId, !themeState]);

    return {result, success: true};

  } catch (error) {
    console.error('Error updating theme activation:', error);
    throw error;
  }
};

const updatePublic = async (public_id, label) => {
  try {
    const query = `
    UPDATE
    publics
    SET label = $2
    WHERE id = $1
    `;

    const result = await executeQuery(numdiagPool, query, [public_id, label]);

    return {result, success: true};

  } catch (error) {
    console.error('Error updating public label:', error);
    throw error;
  }
};

const activationPublic = async (publicId, publicState) => {
  try {
    const query = `
    UPDATE
    publics
    SET isactive = $2
    WHERE id = $1
    `;

    const result = await executeQuery(numdiagPool, query, [publicId, !publicState]);

    return {result, success: true};

  } catch (error) {
    console.error('Error updating public activation:', error);
    throw error;
  }
};

const createThemePublicQuestionnaire = async ({theme, publicSelect, questionnaire_id}) => {
  let resultTheme=[];
  let resultPublic=[];

  if (theme !== null && theme.theme_id[0] !== '') {
    for (const themeElement of theme.theme_id) {
      const result = await executeQuery(
        numdiagPool,
        `INSERT INTO JoinThemesQuestionnaires  (
          theme_id, questionnaire_id
          )
          VALUES ($1, $2)
          RETURNING *
          `,
          [ themeElement, questionnaire_id ]
        );
        resultTheme.push(result)
      }
    }
    if (publicSelect !== null && publicSelect.public_id[0]!=='') {
      for (const publicElement of publicSelect.public_id) {
        const result = await executeQuery(
          numdiagPool,
          `INSERT INTO JoinPublicsQuestionnaires  (
            public_id, questionnaire_id
            )
            VALUES ($1, $2)
            RETURNING *
            `,
            [ publicElement, questionnaire_id ]
          );
          resultPublic.push(result)
        }
      }
      return {resultTheme, resultPublic}
  }

const createThemePublicQuestion = async ({theme, publicSelect, question_id}) => {
  let resultTheme=[];
  let resultPublic=[];

  if (theme !== null && theme[0] !== '') {
    for (const themeElement of theme) {
      const result = await executeQuery(
        numdiagPool,
        `INSERT INTO JoinThemesQuestions  (
          theme_id, question_id)
          VALUES ($1, $2)
          RETURNING *
          `,
          [ themeElement, question_id ]
        );
        resultTheme.push(result)
      }
    }
    if (publicSelect !== null && publicSelect[0]!=='') {
      for (const publicElement of publicSelect) {
        const result = await executeQuery(
          numdiagPool,
          `INSERT INTO JoinPublicsQuestions  (
            public_id, question_id )
            VALUES ($1, $2)
            RETURNING *
            `,
            [ publicElement, question_id ]
          );
          resultPublic.push(result)
        }
      }
      return {resultTheme, resultPublic}
  }

  const associatedThemesAndPublics = async (questionnaireId) => {
      try {
        const queryTheme = `
        SELECT theme_id
        FROM JoinThemesQuestionnaires
        WHERE questionnaire_id = $1
        `;
        const resultTheme = await executeQuery(numdiagPool, queryTheme, [questionnaireId]);

        const queryLabelTheme=`SELECT label FROM Themes WHERE id= $1 AND isactive`
        const themeLabels = [];

        for (const result of resultTheme) {
          const label = await executeQuery(
            numdiagPool,
            queryLabelTheme,
            [result.theme_id]
          );
          if (label.length != 0) {
            themeLabels.push(label[0].label);
          }
        }

        const queryPublic = `
        SELECT public_id
        FROM JoinPublicsQuestionnaires
        WHERE questionnaire_id = $1
        `;
        const resultPublic = await executeQuery(numdiagPool, queryPublic, [questionnaireId]);

        const queryLabelPublic=`SELECT label FROM Publics WHERE id= $1 AND isactive`
        const publicLabels = [];

        for (const result of resultPublic) {
          const label = await executeQuery(
            numdiagPool,
            queryLabelPublic,
            [result.public_id]
          );
          if (label.length != 0) {
            publicLabels.push(label[0].label);
          }
        }

        return {resultTheme, themeLabels, resultPublic, publicLabels, questionnaireId, success: true};

      } catch (error) {
        console.error('Error updating theme activation:', error);
        throw error;
      }
    };


  const associatedThemesAndPublicsQuestion = async (questionId) => {
      try {
        const queryTheme = `
        SELECT theme_id
        FROM JoinThemesQuestions
        WHERE question_id = $1
        `;
        const resultTheme = await executeQuery(numdiagPool, queryTheme, [questionId]);

        const queryLabelTheme=`SELECT label FROM Themes WHERE id= $1 AND isactive`
        const themeLabels = [];

        for (const result of resultTheme) {
          const label = await executeQuery(
            numdiagPool,
            queryLabelTheme,
            [result.theme_id]
          );
          if (label.length != 0) {
            themeLabels.push({id: result.theme_id, label:label[0].label});
          }
        }

        const queryPublic = `
        SELECT public_id
        FROM JoinPublicsQuestions
        WHERE question_id = $1
        `;
        const resultPublic = await executeQuery(numdiagPool, queryPublic, [questionId]);

        const queryLabelPublic=`SELECT label FROM Publics WHERE id= $1 AND isactive`
        const publicLabels = [];

        for (const result of resultPublic) {
          const label = await executeQuery(
            numdiagPool,
            queryLabelPublic,
            [result.public_id]
          );
          if (label.length != 0) {
            publicLabels.push({id: result.public_id, label: label[0].label});
          }
        }

        return {themeLabels, publicLabels, questionId, success: true};

      } catch (error) {
        console.error('Error getting themes and publics for question:',questionId,' :', error);
        throw error;
      }
    };


    const updateAssociatedThemesAndPublics = async ({questionnaireId, theme, publicSelect}) => {
      try {
        const deleteJoinedTheme =
        `DELETE FROM JoinThemesQuestionnaires WHERE questionnaire_id = $1`;
        const resultDeleteTheme = await executeQuery(numdiagPool, deleteJoinedTheme, [questionnaireId]);
        const deleteJoinedPublic =
        `DELETE FROM JoinPublicsQuestionnaires WHERE questionnaire_id = $1`;
        const resultDeletePublic = await executeQuery(numdiagPool, deleteJoinedPublic, [questionnaireId]);


        const queryPublic = `
        INSERT INTO JoinPublicsQuestionnaires  (
          public_id, questionnaire_id
          )
          VALUES ($1, $2)
          RETURNING *
        `;

        for (const aPublic of publicSelect) {
          const result = await executeQuery(
            numdiagPool,
            queryPublic,
            [aPublic, questionnaireId]
          );
        }
        const queryTheme = `
        INSERT INTO JoinThemesQuestionnaires  (
          theme_id, questionnaire_id
          )
          VALUES ($1, $2)
          RETURNING *
        `;

        for (const aTheme of theme) {
          const result = await executeQuery(
            numdiagPool,
            queryTheme,
            [aTheme, questionnaireId]
          );
        }

        return {success: true};

      } catch (error) {
        console.error('Error updating theme and public for questionnaire ',questionnaireId,':', error);
        throw error;
      }
    };

    const updateAssociatedThemesAndPublicsQuestion = async ({questionId, themes, publics}) => {
      try {
        const deleteJoinedTheme =
        `DELETE FROM JoinThemesQuestions WHERE question_id = $1`;
        const resultDeleteTheme = await executeQuery(numdiagPool, deleteJoinedTheme, [questionId]);
        const deleteJoinedPublic =
        `DELETE FROM JoinPublicsQuestions WHERE question_id = $1`;
        const resultDeletePublic = await executeQuery(numdiagPool, deleteJoinedPublic, [questionId]);


        const queryPublic = `
        INSERT INTO JoinPublicsQuestions  (
          public_id, question_id
          )
          VALUES ($1, $2)
          RETURNING *
        `;

        for (const aPublic of publics) {
          const result = await executeQuery(
            numdiagPool,
            queryPublic,
            [aPublic, questionId]
          );
        }
        const queryTheme = `
        INSERT INTO JoinThemesQuestions  (
          theme_id, question_id
          )
          VALUES ($1, $2)
          RETURNING *
        `;

        for (const aTheme of themes) {
          const result = await executeQuery(
            numdiagPool,
            queryTheme,
            [aTheme, questionId]
          );
        }

        return {success: true};

      } catch (error) {
        console.error('Error updating theme and public for question ',questionId,':', error);
        throw error;
      }
    };


    const searchQuestions = async ({ selectedThemes, selectedPublics}) => {
      console.log('Selected themes:', selectedThemes)

      try {
        const queryTheme = `
        SELECT question_id
        FROM JoinThemesQuestions
        WHERE theme_id = $1
        `;

        const questionSearchTheme = [];

        for (const search of selectedThemes) {
          console.log(search.theme_id)
          const question_ids = await executeQuery(
            numdiagPool,
            queryTheme,
            [search.theme_id]
          );

          for (const question_id of question_ids) {
              questionSearchTheme.push({
              question_id: question_id.question_id,
              theme_id: search.theme_id,
              theme_label: search.theme_label
            });
          }
        }

        const queryPublic = `
        SELECT question_id
        FROM JoinPublicsQuestions
        WHERE public_id = $1
        `;

        const questionSearchPublic = [];

        for (const search of selectedPublics) {
          const question_ids = await executeQuery(
            numdiagPool,
            queryPublic,
            [search.public_id]
          );
          for (const question_id of question_ids) {
            questionSearchPublic.push({
            question_id: question_id.question_id,
            public_id: search.public_id,
            public_label: search.public_label
          });
  }
        }

        // on a id question, id et label du thème et du public associé
        // il faudrait associer les deux arrays questionSearchTheme et questionSearchPublic ensemble pour supprimer les doublons
        const mergedByQuestion = new Map();
        for (const item of questionSearchTheme) {
          if (!mergedByQuestion.has(item.question_id)) {
            mergedByQuestion.set(item.question_id, {
              question_id: item.question_id,
              themes: [],
              publics: []
            });
          }

          mergedByQuestion.get(item.question_id).themes.push({
            theme_id: item.theme_id,
            theme_label: item.theme_label
          });
        }

        for (const item of questionSearchPublic) {
          if (!mergedByQuestion.has(item.question_id)) {
            mergedByQuestion.set(item.question_id, {
              question_id: item.question_id,
              themes: [],
              publics: []
            });
          }

          mergedByQuestion.get(item.question_id).publics.push({
            public_id: item.public_id,
            public_label: item.public_label
          });
        }

        // on va chercher pour chaque question tous les thèmes et publics associés
        const questionIds = [...mergedByQuestion.keys()];


        console.log('questions ids:', questionIds)

        for (const id of questionIds) {
            const queryAllThemes = `
            SELECT theme_id
            FROM JoinThemesQuestions
            WHERE question_id = $1
            `;
            const resultTheme = await executeQuery(numdiagPool, queryAllThemes, [id]);

            const queryLabelTheme=`SELECT label FROM Themes WHERE id= $1 AND isactive`
            const themeLabels = [];

            for (const result of resultTheme) {
              const label = await executeQuery(
                numdiagPool,
                queryLabelTheme,
                [result.theme_id]
              );
              if (label.length != 0) {
                themeLabels.push({theme_id: result.theme_id, theme_label:label[0].label});
              }
            }

            const queryAllPublics = `
            SELECT public_id
            FROM JoinPublicsQuestions
            WHERE question_id = $1
            `;
            const resultPublic = await executeQuery(numdiagPool, queryAllPublics, [id]);

            const queryLabelPublic=`SELECT label FROM Publics WHERE id= $1 AND isactive`
            const publicLabels = [];

            for (const result of resultPublic) {
              const label = await executeQuery(
                numdiagPool,
                queryLabelPublic,
                [result.public_id]
              );
              if (label.length != 0) {
                publicLabels.push({public_id: result.public_id, public_label: label[0].label});
              }
            }

            const existing = mergedByQuestion.get(id);
            mergedByQuestion.set(id, {
              ...existing,
              themes: themeLabels,
              publics: publicLabels
            });

        }

        // puis aller chercher le label de la question et son type

        const questionQuery = `SELECT id, label, questiontype, section_id
                          FROM questions
                          WHERE id = ANY($1)`

        const questionsInfo = await executeQuery(
              numdiagPool,
              questionQuery,
              [questionIds]
            );

        for (const question of questionsInfo) {
          const existing = mergedByQuestion.get(question.id);
          mergedByQuestion.set(question.id, {
            ...existing,
            label: question.label,
            question_type: question.questiontype,
            section_id: question.section_id
          });
        }

        // ensuite récupérer le label de la section associée,
        const sectionIds = [];

        for (const s of mergedByQuestion.values()) {
          sectionIds.push(s.section_id);
        }
        const sectionQuery = `SELECT id, label, questionnaire_id
        FROM sections
        WHERE id = ANY($1)`

        const sectionsInfo = await executeQuery(
          numdiagPool,
          sectionQuery,
          [sectionIds]
        );

        for (const section of sectionsInfo) {
          for (const question of mergedByQuestion.values()) {
            if (question.section_id === section.id) {
              question.section_label = section.label;
              question.questionnaire_id = section.questionnaire_id;
            }
          }
        }

        // puis le label du questionnaire associé
        const questionnaireIds = [];
        for (const s of mergedByQuestion.values()) {
          questionnaireIds.push(s.questionnaire_id);
        }

        const questionnairesQuery = `SELECT id, label, isactive, ispublished
        FROM questionnaires WHERE id = ANY($1)`

        const questionnairesInfo = await executeQuery(numdiagPool, questionnairesQuery, [questionnaireIds]);

        for (const questionnaire of questionnairesInfo) {
          for (const question of mergedByQuestion.values()) {
            if (question.questionnaire_id === questionnaire.id) {
              question.questionnaire_label = questionnaire.label;
              question.questionnaire_isActive = questionnaire.isactive;
              question.questionnaire_isPublished = questionnaire.ispublished;
            }
          }
        }

        const questionsMerged = [...mergedByQuestion.values()];

        return {questionsMerged, success: true};

      } catch (error) {
        console.error('Error searching question by theme or public:', error);
        throw error;
      }
    };

export { getAllPublics,getAllPublicsActive, createPublic, getAllThemes,getAllThemesActive, createTheme, updateTheme, activationTheme, updatePublic, activationPublic, createThemePublicQuestionnaire, associatedThemesAndPublics, updateAssociatedThemesAndPublics, createThemePublicQuestion, associatedThemesAndPublicsQuestion, updateAssociatedThemesAndPublicsQuestion, searchQuestions }
