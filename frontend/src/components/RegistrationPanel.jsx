import { useState } from "react";
import API from "../services/api";

function RegistrationPanel({ examId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const res = await API.post(`/registrations/register/${examId}`);
      setMessage(res.data.message);
      if (onSuccess) onSuccess();
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const res = await API.delete(`/registrations/withdraw/${examId}`);
      setMessage(res.data.message);
      if (onSuccess) onSuccess();
    } catch (error) {
      setMessage(error.response?.data?.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.panel}>
      <div style={styles.buttons}>
        <button 
          style={styles.registerBtn} 
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Processing..." : "Register"}
        </button>
        
        <button 
          style={styles.withdrawBtn} 
          onClick={handleWithdraw}
          disabled={loading}
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>
      </div>
      
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  panel: {
    marginTop: "15px",
  },
  buttons: {
    display: "flex",
    gap: "10px",
  },
  registerBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#1f3c88",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  withdrawBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#c0392b",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  message: {
    marginTop: "10px",
    textAlign: "center",
    fontSize: "14px",
  },
};

export default RegistrationPanel;