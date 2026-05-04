import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedFirstname = localStorage.getItem('userFirstname');
    const storedLastname = localStorage.getItem('userLastname');
    if (storedEmail) {
      setEmail(storedEmail);
      setFirstname(storedFirstname || '');
      setLastname(storedLastname || '');
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      const { user } = response.data;
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userFirstname', user.firstname);
      localStorage.setItem('userLastname', user.lastname);
      setFirstname(user.firstname);
      setLastname(user.lastname);
      setIsLoggedIn(true);
    } catch (error) {
      setError("Email ou mot de passe incorrect");
    }
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(
        `${BACKEND_URL}/users/new`,
        { email, password_hash: password, firstname, lastname }
      );
      const response = await axios.post(
        `${BACKEND_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      const { user } = response.data;
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userFirstname', user.firstname);
      localStorage.setItem('userLastname', user.lastname);
      setIsLoggedIn(true);
    } catch (error: any) {
      setError(error.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstname');
    localStorage.removeItem('userLastname');
    setIsLoggedIn(false);
    setEmail("");
    setFirstname("");
    setLastname("");
  };

  if (isLoggedIn) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <h1>Bon retour {firstname} 🎬</h1>
          <p>Connecté en tant que <strong>{email}</strong></p>
          <button onClick={handleLogout} className="login-btn logout-btn">
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>{isSignup ? "Créer un compte 🎬" : "Bienvenue 🎬"}</h1>
        <p>{isSignup ? "Rejoignez la communauté" : "Connectez-vous pour noter vos films"}</p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          {isSignup && (
            <>
              <div className="form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  placeholder="Jean"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  placeholder="Dupont"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            {isSignup ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        <div className="login-footer">
          {isSignup ? (
            <>Déjà un compte ? <span className="toggle-link" onClick={() => { setIsSignup(false); setError(""); }}>Se connecter</span></>
          ) : (
            <>Pas encore de compte ? <span className="toggle-link" onClick={() => { setIsSignup(true); setError(""); }}>S'inscrire</span></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;