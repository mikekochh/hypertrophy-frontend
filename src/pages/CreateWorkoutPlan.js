import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

function CreateWorkoutPlan() {
  const [exercises, setExercises] = useState([]);
  const [numDays, setNumDays] = useState(0);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/exercises`)
      .then((res) => setExercises(res.data))
      .catch((err) => {
        console.error("Error loading exercises:", err);
        setExercises([]);
      });
  }, []);

  const handleNumDaysChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumDays(value);

    // Initialize session placeholders
    const initialSessions = Array.from({ length: value }, () => ({
      name: "",
      exercises: []
    }));
    setSessions(initialSessions);
  };

  const handleSessionNameChange = (index, value) => {
    const updated = [...sessions];
    updated[index].name = value;
    setSessions(updated);
  };

  const toggleExercise = (sessionIndex, exerciseId) => {
    const updated = [...sessions];
    const current = updated[sessionIndex].exercises;

    const exists = current.find((e) => e.exercise_id === exerciseId);
    if (exists) {
      updated[sessionIndex].exercises = current.filter(
        (e) => e.exercise_id !== exerciseId
      );
    } else {
      updated[sessionIndex].exercises.push({ exercise_id: exerciseId, sets: 3 }); // default 3 sets
    }

    setSessions(updated);
  };

  const updateSets = (sessionIndex, exerciseId, sets) => {
    const updated = [...sessions];
    const exercise = updated[sessionIndex].exercises.find(
      (e) => e.exercise_id === exerciseId
    );
    if (exercise) {
      exercise.sets = parseInt(sets, 10) || 0;
    }
    setSessions(updated);
  };

  const handleSubmit = () => {
    const workoutPlan = {
      name: "Custom Plan",
      sessions
    };

    console.log("sessions: ", sessions);

    axios
      .post(`${BASE_URL}/create-workout-plan`, workoutPlan)
      .then(() => alert("Workout plan created!"))
      .catch((err) => {
        console.error("Error creating plan:", err);
        alert("Failed to create plan.");
      });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Create Workout Plan</h1>

      <label>
        How many days a week will you work out?
        <input
          type="number"
          min="1"
          max="7"
          value={numDays}
          onChange={handleNumDaysChange}
          style={{ marginLeft: "0.5rem", width: "50px" }}
        />
      </label>

      <hr />

      {sessions.map((session, index) => (
        <div key={index} style={{ marginBottom: "2rem" }}>
          <h3>Day {index + 1}</h3>
          <input
            type="text"
            placeholder="Session name (e.g. Push, Legs)"
            value={session.name}
            onChange={(e) => handleSessionNameChange(index, e.target.value)}
            style={{ marginBottom: "1rem", width: "300px" }}
          />

          <h4>Select Exercises</h4>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {exercises.map((exercise) => {
              const selected = session.exercises.find(
                (e) => e.exercise_id === exercise.id
              );
              return (
                <li key={exercise.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={!!selected}
                      onChange={() => toggleExercise(index, exercise.id)}
                    />
                    {exercise.exercise_name}
                  </label>
                  {selected && (
                    <input
                      type="number"
                      value={selected.sets}
                      min="1"
                      onChange={(e) =>
                        updateSets(index, exercise.id, e.target.value)
                      }
                      style={{ marginLeft: "1rem", width: "50px" }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {numDays > 0 && (
        <button onClick={handleSubmit}>✅ Create Plan</button>
      )}
    </div>
  );
}

export default CreateWorkoutPlan;
