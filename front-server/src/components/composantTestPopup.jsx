import { useState } from "react"

import { editButton, deleteButton, copyButton, addButton, saveButton, publishButton } from "./button/button"
import PopUpDeleteQuestion from './popups/deleteQuestion'
import PopUpDeleteSection from './popups/deleteSection'
import PopUpEditQuestion from './popups/editQuestion'
import PopUpEditSection from './popups/editSection'
import PopupCreateSection from './popups/createSection'
import PopupCreateQuestionnaire from './popups/createQuestionnaire'


function TestPopups({ id, handleDelete, handleEdit}){
    const [DeleteQuestion, setDeletQuestion] = useState(false) //test popup delete question 
    const [EditQuestion, setEditQuestion] = useState(false) //test edit question
    const [deletSection , setDeleteSection] = useState(false) //test delete section
    const [editSection, setEditSection] = useState(false)//teste edit question
    const [createSection, setCreateSection] = useState(false) //test create section
    const [createQuestionnaire, setCreateQuestionnaire] = useState(false) //test create questionnaire
    return(
        <div className="test"> 
            <div className="questionstest">
                <h2 className="titre"> Test popup questions</h2>
                {editButton(setEditQuestion)}
                {deleteButton(setDeletQuestion)}
   
            </div>
            <div>
                -----------
            </div>
            <div className="sectionTest">
                <h2 className="titre">
                    test popups section
                </h2>
                {editButton(setEditSection)}
                {deleteButton(setDeleteSection)}
                {addButton(setCreateSection)}
            </div>
            
            <div>
                -----------
            </div>

            <div className="sectionTest">
                <h2 className="titre">
                    test popups Questionnaire
                </h2>
                {addButton(setCreateQuestionnaire)}
            </div>
            <div>
                {/* QUESTION */}
                <PopUpDeleteQuestion id={id} handleDelete={handleDelete} trigger={DeleteQuestion} setTrigger={setDeletQuestion}/> 
                <PopUpEditQuestion id={id} handleEdit={handleEdit} trigger={EditQuestion} setTrigger={setEditQuestion} />

                {/* SECTIONS */}
                <PopUpDeleteSection id={id} handleEdit={handleDelete} trigger={deletSection} setTrigger={setDeleteSection} />
                <PopUpEditSection id = {id} handleEdit={handleEdit} trigger={editSection} setTrigger={setEditSection} />
                <PopupCreateSection  id = {id} trigger={createSection} setTrigger={setCreateSection} />

                {/* Questionnaire create */}
                <PopupCreateQuestionnaire id = {id} trigger={createQuestionnaire} setTrigger={setCreateQuestionnaire} />
            </div>





        </div>

    );



}

export default TestPopups;