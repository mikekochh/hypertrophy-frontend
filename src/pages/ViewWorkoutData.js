import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

function formatDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

function formatDuration(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
}

function ViewWorkoutData() {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/completed-workouts`)
      .then((res) => setWorkouts(res.data))
      .catch((err) => {
        console.error("Error fetching completed workouts:", err);
        setWorkouts([]);
      });
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📅 Past Workouts</h1>

      {workouts.length === 0 ? (
        <p style={styles.noWorkouts}>No logged workouts yet.</p>
      ) : (
        <ul style={styles.list}>
          {workouts.map((w) => (
            <li
              key={w.id}
              onClick={() => navigate(`/completed-workout/${w.id}`)}
              style={styles.card}
            >
              <strong style={styles.sessionName}>{w.session_name}</strong>
              <p>{formatDate(w.workout_date)}</p>
              <p style={styles.duration}>Duration: {formatDuration(w.workout_length)}</p>
            </li>
          ))}
        </ul>
      )}

      <button style={styles.backButton} onClick={() => navigate("/")}>
        ⬅ Back Home
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "1rem",
    fontFamily: "Arial",
    maxWidth: "600px",
    margin: "0 auto",
  },
  header: {
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  noWorkouts: {
    textAlign: "center",
    fontSize: "1rem",
  },
  list: {
    listStyle: "none",
    paddingLeft: 0,
  },
  card: {
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "1rem",
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
  },
  sessionName: {
    fontSize: "1.1rem",
  },
  duration: {
    fontSize: "0.95rem",
    color: "#444",
  },
  backButton: {
    width: "100%",
    marginTop: "2rem",
    padding: "0.75rem",
    fontSize: "1rem",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ViewWorkoutData;
