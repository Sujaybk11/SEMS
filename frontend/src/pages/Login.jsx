import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      const role = res.data.user.role;
      if (role === "admin") navigate("/admin");
      else if (role === "faculty") navigate("/faculty");
      else navigate("/student");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh' }}>
      <div className="card animate-fadeInUp" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-6">
          <h1 className="gradient-text text-2xl font-bold mb-4">SEMS Login</h1>
          <p className="text-secondary">Smart Examination Management System</p>
        </div>

        <form onSubmit={handleLogin} className="grid grid-1" style={{ gap: '20px' }}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading && <span className="spinner"></span>}
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-4" style={{ 
            background: 'rgba(231, 76, 60, 0.1)', 
            border: '1px solid rgba(231, 76, 60, 0.3)',
            borderRadius: '8px',
            color: '#e74c3c',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <div className="text-muted mb-4">Demo Credentials:</div>
          <div className="grid grid-3" style={{ gap: '10px', fontSize: '12px' }}>
            <div className="status status-registered">Admin: admin@sems.com</div>
            <div className="status status-approved">Faculty: faculty@sems.com</div>
            <div className="status status-pending">Student: student@sems.com</div>
          </div>
          <div className="text-muted mt-2" style={{ fontSize: '12px' }}>Password: password123</div>
        </div>
      </div>
    </div>
  );
}

export default Login;
