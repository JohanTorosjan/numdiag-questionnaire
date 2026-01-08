import { numdiagPool, executeQuery } from '../database/client.js'

function getAllPublics() {
    return executeQuery(numdiagPool, 'SELECT * FROM publics ORDER BY id')
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

export { getAllPublics, createPublic, getAllThemes, createTheme, updateTheme, activationTheme, updatePublic, activationPublic, createThemePublicQuestionnaire }
