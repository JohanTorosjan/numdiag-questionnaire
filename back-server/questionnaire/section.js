import { numdiagPool, toHeroPool, connectToDatabase, executeQuery } from '../database/client.js'

function getSectionById(idSection) {
    return executeQuery(numdiagPool, 'SELECT * FROM sections WHERE id = $1', [idSection])
}

function getAllQuestionBySection(idSection) {
    return executeQuery(numdiagPool, 'SELECT * FROM questions WHERE section_id = $1', [idSection])
}

function updateSection(idSection, {label = null, description = null, tooltip = null, nbPages=null, isActive = null}) {
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
    if (tooltip !== null) {
        fields.push(`tooltip = $${index++}`)
        values.push(tooltip)
    }
    if (nbPages !== null) {
        fields.push(`nbPages = $${index++}`)
        values.push(nbPages)
      }
    if (isActive !== null) {
        fields.push(`isactive = $${index++}`)
        values.push(isActive)
    }

    // fields.push(`id = $${index}`)
    values.push(idSection)


    return executeQuery(numdiagPool, `UPDATE sections SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`, values)
}

function deleteSection(idSection) {
    return executeQuery(numdiagPool, 'DELETE FROM sections WHERE id_section = $1 RETURNING *', [idSection])
}

function createSection(questionnaire_id, label = null, description = null, tooltip = null, nbPages = null) {
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

    if (tooltip !== null && tooltip!=='') {
      fields.push(`tooltip`);
      placeholders.push(`$${index++}`);
      values.push(tooltip);
    }
    if (nbPages !== null && nbPages!=='') {
      fields.push(`nbPages`);
      placeholders.push(`$${index++}`);
      values.push(nbPages);
    }

    fields.push(`questionnaire_id`);
    placeholders.push(`$${index++}`);
    values.push(questionnaire_id);

     return executeQuery(
        numdiagPool,
        `INSERT INTO Sections (${fields.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
        values
    );
}

export { createSection, getSectionById, getAllQuestionBySection, updateSection, deleteSection }
