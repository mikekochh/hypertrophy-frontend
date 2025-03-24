import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import CreateWorkoutPlan from "./pages/CreateWorkoutPlan";
import StartWorkout from "./pages/StartWorkout";
import WorkoutSessionPage from "./pages/WorkoutSessionPage";
import ViewWorkoutData from "./pages/ViewWorkoutData";
import CompletedWorkout from "./pages/CompletedWorkout";
import { BASE_URL } from "./config";


function Home() {
  const [workoutPlan, setWorkoutPlan] = useState(null);

  console.log("BASE_URL: ", BASE_URL);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/workout-plans`)
      .then((res) => setWorkoutPlan(res.data[0]))
      .catch((err) => {
        console.error("Error fetching workout plan:", err);
        setWorkoutPlan(null);
      });
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🏋️ Hypertrophy Tracker</h1>

      {workoutPlan ? (
        <div style={styles.section}>
          <h2 style={styles.planTitle}>{workoutPlan.name}</h2>
          <Link to="/start-workout">
            <button style={styles.primaryButton}>Start Workout</button>
          </Link>
        </div>
      ) : (
        <p style={styles.message}>No workout plan found. Create one to get started.</p>
      )}

      {/* <div style={styles.section}>
        <Link to="/create-workout-plan">
          <button style={styles.secondaryButton}>Create Workout Plan</button>
        </Link>
      </div> */}

      <div style={styles.section}>
        <Link to="/view-workouts">
          <button style={styles.secondaryButton}>View Workout Data</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "1.5rem",
    fontFamily: "Arial",
    maxWidth: "500px",
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
  },
  planTitle: {
    fontSize: "1.3rem",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1rem",
    marginBottom: "2rem",
  },
  section: {
    marginBottom: "1.5rem",
  },
  primaryButton: {
    width: "100%",
    padding: "1rem",
    fontSize: "1rem",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  secondaryButton: {
    width: "100%",
    padding: "1rem",
    fontSize: "1rem",
    backgroundColor: "#f0f0f0",
    color: "#333",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-workout-plan" element={<CreateWorkoutPlan />} />
        <Route path="/start-workout" element={<StartWorkout />} />
        <Route path="/workout-session/:id" element={<WorkoutSessionPage />} />
        <Route path="/view-workouts" element={<ViewWorkoutData />} />
        <Route path="/completed-workout/:id" element={<CompletedWorkout />} />
      </Routes>
    </Router>
  );
}

export default App;
