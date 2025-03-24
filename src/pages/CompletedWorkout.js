import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config"

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatDate(unix) {
  return new Date(unix * 1000).toLocaleString();
}

function CompletedWorkout() {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/completed-workouts/${id}`)
      .then((res) => {
        console.log("Workout data received:", res.data);
        setWorkout(res.data);
      })
      .catch((err) => {
        console.error("Error fetching workout:", err);
        setWorkout(null);
      });
  }, [id]);

  if (!workout) {
    return <p style={{ padding: "1rem", fontFamily: "Arial" }}>Loading workout data...</p>;
  }

  const groupedExercises = workout.exercises.reduce((acc, ex) => {
    if (!acc[ex.exercise_name]) {
      acc[ex.exercise_name] = [];
    }
    acc[ex.exercise_name].push(ex);
    return acc;
  }, {});

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Completed Workout</h1>
      <div style={styles.meta}>
        <p><strong>Session:</strong> {workout.session_name}</p>
        <p><strong>Date:</strong> {formatDate(workout.workout_date)}</p>
        <p><strong>Duration:</strong> {formatDuration(workout.workout_length)}</p>
      </div>

      <h2 style={styles.sectionHeader}>Exercises</h2>

      {Object.entries(groupedExercises).map(([exerciseName, sets], i) => (
        <div key={i} style={styles.exerciseCard}>
          <h3 style={styles.exerciseTitle}>{exerciseName}</h3>
          {sets.map((set, index) => (
            <div key={index} style={styles.setBox}>
              <p><strong>Set {index + 1}</strong></p>
              <div style={styles.setDetails}>
                <p>Weight: {set.weight} lbs</p>
                <p>Reps: {set.reps}</p>
                {set.superset_weight !== null && set.superset_reps !== null && (
                  <>
                    <p>Superset Weight: {set.superset_weight} lbs</p>
                    <p>Superset Reps: {set.superset_reps}</p>
                  </>
                )}
                <p><strong>Total Moved:</strong> {set.total_weight} lbs</p>
              </div>
            </div>
          ))}
        </div>
      ))}

      <Link to="/view-workouts">
        <button style={styles.backButton}>⬅ Back to All Workouts</button>
      </Link>
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
    marginBottom: "1rem",
  },
  meta: {
    fontSize: "0.95rem",
    marginBottom: "2rem",
  },
  sectionHeader: {
    fontSize: "1.25rem",
    marginBottom: "1rem",
  },
  exerciseCard: {
    background: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1.5rem",
  },
  exerciseTitle: {
    fontSize: "1.1rem",
    marginBottom: "0.75rem",
  },
  setBox: {
    padding: "0.75rem",
    borderBottom: "1px solid #eee",
  },
  setDetails: {
    fontSize: "0.9rem",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.5rem",
    marginTop: "0.5rem",
  },
  backButton: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    border: "none",
    background: "#4CAF50",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "1rem",
  },
};

export default CompletedWorkout;
