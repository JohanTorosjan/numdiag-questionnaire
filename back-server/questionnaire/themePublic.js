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

    const associatedThemesAndPublics = async (questionnaireId) => {
      try {
        const queryTheme = `
        SELECT theme_id
        FROM JoinThemesQuestionnaires
        WHERE questionnaire_id = $1
        `;
        const resultTheme = await executeQuery(numdiagPool, queryTheme, [questionnaireId]);

        const queryLabelTheme=`SELECT label FROM Themes WHERE id= $1`
        const themeLabels = [];

        for (const result of resultTheme) {
          const label = await executeQuery(
            numdiagPool,
            queryLabelTheme,
            [result.theme_id]
          );
          themeLabels.push(label[0].label);
        }

        const queryPublic = `
        SELECT public_id
        FROM JoinPublicsQuestionnaires
        WHERE questionnaire_id = $1
        `;
        const resultPublic = await executeQuery(numdiagPool, queryPublic, [questionnaireId]);

        const queryLabelPublic=`SELECT label FROM Publics WHERE id= $1`
        const publicLabels = [];

        for (const result of resultPublic) {
          const label = await executeQuery(
            numdiagPool,
            queryLabelPublic,
            [result.public_id]
          );
          publicLabels.push(label[0].label);
        }

        return {resultTheme, themeLabels, resultPublic, publicLabels, questionnaireId, success: true};

      } catch (error) {
        console.error('Error updating theme activation:', error);
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

export { getAllPublics,getAllPublicsActive, createPublic, getAllThemes,getAllThemesActive, createTheme, updateTheme, activationTheme, updatePublic, activationPublic, createThemePublicQuestionnaire, associatedThemesAndPublics, updateAssociatedThemesAndPublics }
