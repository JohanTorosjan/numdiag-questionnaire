import { useNavigate } from 'react-router-dom';

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        if (!username || !password) {
            alert('Veuillez remplir tous les champs.');
            return;
        }
    
        // Simulate a login request
        fetch('http://localhost:3008/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('Échec de la connexion');
            }
            return response.json();
        })
        .then(data => {
            navigate(`/`);
        });
    }
    catch (error) {
      console.error('Erreur lors de la connexion:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
    }

function Login() {
  return (
    <div>
      <h1>Page de connexion</h1>
      <p>Veuillez vous connecter pour accéder à l'application !</p>

      <input type="text" placeholder="Identifiant" id="username" />
      <input type="password" placeholder="Mot de passe" id="password" />
      <button onClick={handleLogin}>Se connecter</button>

    </div>
  );
}

export default Login;