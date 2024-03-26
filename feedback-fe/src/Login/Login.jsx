import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import styles from "./Login.module.css";

const loginUser = (email, password) =>
  axios.post("https://feedback-yd5z.onrender.com/api/login", {
    email,
    password,
  });

const signUpUser = (email, password, role) =>
  axios.post("https://feedback-yd5z.onrender.com/api/signup", {
    email,
    password,
    role,
  });

function Login({ setIsLoggedIn, setIsManager: setManagerMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isManager, setIsManager] = useState(false);

  const getGoogleUser = (user) => {
    console.log("user", user);
    axios
      .post("https://feedback-yd5z.onrender.com/api/googlelogin", {
        credential: user.credential,
      })
      .then((res) => {
        setIsLoggedIn(true);
        sessionStorage.setItem("jwt", res.data.token);
        sessionStorage.setItem("role", res.data.role);
        setManagerMode(res.data.role === "manager");
      });
  };

  return (
    <div className={styles.container}>
      <h1>Feedback Portal</h1>
      <form className={styles.formContainer}>
        <div className={styles.textInput}>
          <label htmlFor="email">Enter email:</label>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className={styles.textInput}>
          <label htmlFor="password">Enter password:</label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>
          <input
            onChange={(event) => setIsManager(event.target.checked)}
            type="checkbox"
            name="manager"
            checked={isManager}
          />
          <label htmlFor="manager">Manager</label>
        </div>
        <p style={{ color: "#b52424" }}>{error}</p>

        <GoogleLogin
          onSuccess={(credentialResponse) => {
            getGoogleUser(credentialResponse);
          }}
          onError={() => {
            setError("Login Failed");
          }}
        />
        <div className={styles.buttonRow}>
          <button
            type="button"
            onClick={() => {
              signUpUser(email, password, isManager ? "manager" : "employee")
                .then((res) => {
                  setIsLoggedIn(true);
                  sessionStorage.setItem("jwt", res.data.token);
                  sessionStorage.setItem("role", res.data.role);
                  setManagerMode(res.data.role === "manager");
                })
                .catch((error) => {
                  setError(error.response.data.message);
                });
            }}
          >
            Create account
          </button>
          <button
            type="button"
            onClick={() => {
              loginUser(email, password)
                .then((res) => {
                  setIsLoggedIn(true);
                  sessionStorage.setItem("jwt", res.data.token);
                  sessionStorage.setItem("role", res.data.role);
                  setManagerMode(res.data.role === "manager");
                })
                .catch((error) => {
                  console.log("error", error);
                  setError(error.response.data.message);
                });
            }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
