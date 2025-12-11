import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";





export default function Code() {
  const { session_id } = useParams();
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  async function codeForSession({session_id, code}) {

    try {
      const response = await fetch(`http://localhost:3008/sessioncode/${session_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code
          }),
        });
      if (!response.ok) {
        throw new Error("Erreur lors du traitement du code");
      }
      const data = await response.json();
      console.log("Code validation : ", data);
      if (data.data.code === true) {
        navigate(`/session/${data.data.questionnaire}`)
      }
      return data.data;
    } catch (error) {
      console.error("Error sending code:", error);
      return null;
    }
  }

  return (
    <div className="bg-red-500">
        coucou
      <label htmlFor="code" >Entre ton code</label>
      <input type="text" name='code' placeholder="xxxx"
      value={code}
      onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={()=>codeForSession({session_id, code})}>Envoyer</button>
    </div>
  )
}
