import { useState } from "react";
import "./Auth.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, register, loading } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignIn) {
        const result = await login(email, password);
        if (result.success) {
          navigate("/");
        } else {
          setError(result.error);
        }
      } else {
        const result = await register(email, password);
        if (result.success) {
          navigate("/");
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="login">
      {/* logo */}
      <Link to="/">
        <img
          className="login__logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
          alt="Amazon Logo"
        />
      </Link>

      {/* container */}
      <div className="login__container">
        <h1>{isSignIn ? "Sign In" : "Create Account"}</h1>

        {error && <div className="error">{error}</div>}

        {/* form */}
        <form onSubmit={handleAuth}>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              required
            />
          </div>

          <button
            type="submit"
            className="login__signInButton"
            disabled={loading}
          >
            {loading ? "Loading..." : (isSignIn ? "Sign In" : "Create Account")}
          </button>
        </form>

        {/* agreement */}
        <p>
          By {isSignIn ? "signing-in" : "creating an account"} you agree to the AMAZON FAKE CLONE Conditions of Use & Sale.
          Please see our Privacy Notice, our Cookies Notice and our
          Interest-Based Ads Notice.
        </p>

        {/* toggle button */}
        <button
          className="login__registerButton"
          onClick={() => setIsSignIn(!isSignIn)}
        >
          {isSignIn ? "Create your Amazon Account" : "Already have an account? Sign In"}
        </button>
      </div>
    </section>
  );
}

export default Auth;
