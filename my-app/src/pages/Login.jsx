// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { auth } from "../auth";

function fakeLogin(email, password) {
  const DEMO_EMAIL = "doctor@clinic.com";
  const DEMO_PASSWORD = "demo123";

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        resolve();
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 800);
  });
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    // mark fields as touched so warnings show
    setTouchedEmail(true);
    setTouchedPassword(true);

    if (!email || !password) {
      setError("Please fill in all fields before logging in.");
      triggerShake();
      return;
    }

    try {
      setIsLoading(true);
      await fakeLogin(email, password);

      auth.login("demo-token");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 350);
  }

  const isDisabled = isLoading || !email || !password;

  const showEmailWarning = touchedEmail && !email;
  const showPasswordWarning = touchedPassword && !password;

  return (
    <div className="login-container">
      <form
        className={`login-card ${shake ? "shake" : ""}`}
        onSubmit={handleLogin}
      >
        <h1>Digital Health Login</h1>

        {/* Info message explaining what to do */}
        <p className="info-text">
          Use <strong>doctor@clinic.com</strong> and <strong>demo123</strong> to
          sign in. Make sure all fields are filled before logging in.
        </p>

        <div className="field-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="doctor@clinic.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouchedEmail(true)}
          />
          {showEmailWarning && (
            <span className="field-message">
              Please enter your email address.
            </span>
          )}
        </div>

        <div className="field-group" style={{ marginTop: "1rem" }}>
          <label>Password</label>
          <input
            type="password"
            placeholder="demo123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouchedPassword(true)}
          />
          {showPasswordWarning && (
            <span className="field-message">
              Please enter your password.
            </span>
          )}
        </div>

        {/* App-level error (wrong password, missing fields, etc.) */}
        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={isDisabled}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="terms-text">
          By logging in, you agree to our Terms & Privacy.
        </p>
      </form>
    </div>
  );
}
