function AnswersResume({answer,answerType}) {
    console.log(answerType)
return(
    <div className="answers-resume">   
<p>
 {answer.label}
</p>
   
   <p>
 {answer.plafond}
</p>
   
   <p>
 {answer.position}
</p>
   
   <p>
 {answer.valeurscore}
</p>
   


    </div>
)
}

export default AnswersResume;