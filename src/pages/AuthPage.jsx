import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./AuthPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); 

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { email, password } = loginForm;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Successfully logged in!");
      navigate("/home"); 
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { name, email, password } = signupForm;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Account created! Please check your email to confirm.");
      // You can optionally redirect after confirmation
      // navigate("/");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className={`auth-toggle ${!isLogin ? "signup-active" : ""}`}>
          <button
            className={`toggle-btn ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`toggle-btn ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form
          onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit}
          className={`auth-form fade-in`}
        >
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={signupForm.name}
              onChange={handleSignupChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={isLogin ? loginForm.email : signupForm.email}
            onChange={isLogin ? handleLoginChange : handleSignupChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={isLogin ? loginForm.password : signupForm.password}
            onChange={isLogin ? handleLoginChange : handleSignupChange}
            required
          />
          <button type="submit" className="submit-btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
