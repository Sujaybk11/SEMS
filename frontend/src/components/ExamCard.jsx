function ExamCard({ exam, onRegister, showRegisterBtn = true }) {
  return (
    <div style={styles.card}>
      <h3>{exam.courseName}</h3>
      <p><strong>Course Code:</strong> {exam.courseCode}</p>
      <p><strong>Date:</strong> {new Date(exam.examDate).toLocaleDateString()}</p>
      <p><strong>Duration:</strong> {exam.duration} minutes</p>
      <p><strong>Semester:</strong> {exam.semester}</p>
      <p><strong>Capacity:</strong> {exam.capacity}</p>
      
      {showRegisterBtn && (
        <button
          style={styles.registerBtn}
          onClick={() => onRegister(exam._id)}
        >
          Register
        </button>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    border: "1px solid #e0e0e0",
  },
  registerBtn: {
    marginTop: "15px",
    padding: "10px",
    width: "100%",
    backgroundColor: "#1f3c88",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default ExamCard;