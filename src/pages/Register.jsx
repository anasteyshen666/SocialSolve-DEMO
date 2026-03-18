import { useState } from "react";
import "./Register.css";
import { supabase } from "../supabase";

export default function Register({ onRegister, goLogin }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [problem, setProblem] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const userData = {
      name,
      age: parseInt(age),
      country,
      problem,
      email,
      password,
    };

    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select();

    if (error) {
      alert("Register error: " + error.message);
      return;
    }

    onRegister(data[0]);
  }

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <input
          placeholder="What's bothering you?"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Register</button>

        <p className="switch-link">
          Already have an account? <span onClick={goLogin}>Login</span>
        </p>
      </form>
    </div>
  );
}
