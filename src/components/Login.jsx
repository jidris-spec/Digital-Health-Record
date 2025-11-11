import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import { auth } from "../auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    alert(`Email: ${email}\nPassword: ${password}`);
    auth.login("demo-token");
    navigate("/dashboard"); // move to dashboard after login
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h1>Digital Health Login</h1>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" style={{ marginTop: "1.5rem" }}>
          Login
        </button>

        <p>By logging in, you agree to our Terms & Privacy.</p>
      </form>
    </div>
  );
}
