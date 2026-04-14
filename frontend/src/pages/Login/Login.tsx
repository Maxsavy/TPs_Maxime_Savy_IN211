import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      console.log("Login successful:", response.data);
      localStorage.setItem('userEmail', email);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setEmail("");
  };

  if (isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Tu es connecté en tant que : {email}</h1>
        <button onClick={handleLogout}>Se déconnecter</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;