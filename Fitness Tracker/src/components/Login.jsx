import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

function Login({ setUser }) {
  const [name,setName] = useState("")
  const [DOB,setDOB] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = isRegister
        ? await createUserWithEmailAndPassword(auth,name,DOB, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="DOB"
          placeholder="Date of Birth"
          value={Number}
          onChange={(e) => setDOB(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">{isRegister ? "Create Account" : "Login"}</button>
      </form>
      <p style={{ marginTop: "10px" }}>
        {isRegister ? "Already have an account?" : "New user?"}
        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}

export default Login;
