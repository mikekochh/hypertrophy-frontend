import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

function WorkoutSessionPage() {
  const { id: sessionId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({});
  const [collapsed, setCollapsed] = useState({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const navigate = useNavigate();

  const STORAGE_KEY = `workout-log-${sessionId}`;
  const TIMER_KEY = `workout-timer-${sessionId}`;

  // 🕒 Load data + timer on mount
  useEffect(() => {
    const storedTimer = localStorage.getItem(TIMER_KEY);
    if (storedTimer) setElapsedSeconds(parseInt(storedTimer));

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const updated = prev + 1;
        localStorage.setItem(TIMER_KEY, updated.toString());
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/workout-sessions/${sessionId}/exercises`)
      .then((res) => {
        setExercises(res.data);

        const initialCollapsedState = {};
        const stored = localStorage.getItem(STORAGE_KEY);
        let parsedStored = {};

        if (stored) {
          try {
            parsedStored = JSON.parse(stored);
          } catch {
            console.warn("Failed to parse saved workout data");
          }
        }

        const initialData = {};
        res.data.forEach((exercise) => {
          initialCollapsedState[exercise.id] = true;

          if (parsedStored[exercise.id]) {
            initialData[exercise.id] = parsedStored[exercise.id];
          } else {
            initialData[exercise.id] = Array.from({ length: exercise.sets }, () => ({
              weight: "",
              reps: "",
              supersetWeight: "",
              supersetReps: "",
              notes: "",
            }));
          }
        });

        setFormData(initialData);
        setCollapsed(initialCollapsedState);
      })
      .catch((err) => {
        console.error("Error loading exercises:", err);
        setExercises([]);
      });
  }, [sessionId]);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  const handleInputChange = (exerciseId, setIndex, field, value) => {
    const updated = { ...formData };
    updated[exerciseId][setIndex][field] = value;
    setFormData(updated);
  };

  const toggleCollapse = (exerciseId) => {
    setCollapsed((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        workout_session_id: sessionId,
        workout_length: elapsedSeconds,
        workout_date: Math.floor(Date.now() / 1000),
        exercises: Object.entries(formData).map(([exerciseId, sets]) => ({
          exercise_id: exerciseId,
          sets: sets.map((set) => ({
            weight: parseInt(set.weight) || 0,
            reps: parseInt(set.reps) || 0,
            superset_weight: parseInt(set.supersetWeight) || 0,
            superset_reps: parseInt(set.supersetReps) || 0,
            notes: set.notes || "",
          })),
        })),
      };
  
      console.log("Submitting workout log:", payload);

      await axios.post(`${BASE_URL}/log-workout`, payload);
  
      // Clear local storage after successful submission
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TIMER_KEY);
  
      alert("Workout submitted successfully!");
      navigate("/"); // 👈 Redirect to home
    } catch (err) {
      console.error("Error submitting workout:", err);
      alert("Failed to submit workout.");
    }
  };
  

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial", maxWidth: "900px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem" }}>Workout Session</h1>
        <div
          style={{
            background: "#222",
            color: "#fff",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            fontSize: "1rem",
            minWidth: "100px",
            textAlign: "center",
          }}
        >
          ⏱ {formatTime(elapsedSeconds)}
        </div>
      </div>

      {exercises.map((exercise) => {
        const isCollapsed = collapsed[exercise.id];

        return (
          <div
            key={exercise.id}
            style={{
              marginBottom: "2rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ fontSize: "1.2rem" }}>{exercise.exercise_name}</h2>
              <button
                onClick={() => toggleCollapse(exercise.id)}
                style={{
                  fontSize: "0.85rem",
                  padding: "0.3rem 0.8rem",
                  borderRadius: "5px",
                  cursor: "pointer",
                  background: "#eee",
                  border: "1px solid #ccc",
                }}
              >
                {isCollapsed ? "Expand" : "Collapse"}
              </button>
            </div>

            {!isCollapsed &&
              formData[exercise.id]?.map((set, setIndex) => (
                <div
                  key={setIndex}
                  style={{
                    marginTop: "1rem",
                    marginBottom: "1rem",
                    padding: "1rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    background: "#fff",
                  }}
                >
                  <h4 style={{ marginBottom: "0.5rem" }}>Set {setIndex + 1}</h4>
                  <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
                    <label>
                      Weight:
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) =>
                          handleInputChange(exercise.id, setIndex, "weight", e.target.value)
                        }
                        style={{ width: "100%" }}
                      />
                    </label>
                    <label>
                      Reps:
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) =>
                          handleInputChange(exercise.id, setIndex, "reps", e.target.value)
                        }
                        style={{ width: "100%" }}
                      />
                    </label>
                    <label>
                      Superset Weight:
                      <input
                        type="number"
                        value={set.supersetWeight}
                        onChange={(e) =>
                          handleInputChange(exercise.id, setIndex, "supersetWeight", e.target.value)
                        }
                        style={{ width: "100%" }}
                      />
                    </label>
                    <label>
                      Superset Reps:
                      <input
                        type="number"
                        value={set.supersetReps}
                        onChange={(e) =>
                          handleInputChange(exercise.id, setIndex, "supersetReps", e.target.value)
                        }
                        style={{ width: "100%" }}
                      />
                    </label>
                  </div>
                  <div style={{ marginTop: "0.5rem" }}>
                    <label>
                      Notes:
                      <textarea
                        value={set.notes}
                        onChange={(e) =>
                          handleInputChange(exercise.id, setIndex, "notes", e.target.value)
                        }
                        style={{ width: "100%", minHeight: "60px", marginTop: "0.25rem" }}
                      />
                    </label>
                  </div>
                </div>
              ))}
              {/* Total weight moved */}
            <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
                Total Weight Moved:{" "}
                {formData[exercise.id]
                    ?.reduce((total, set) => {
                    const weight = parseFloat(set.weight) || 0;
                    const reps = parseFloat(set.reps) || 0;
                    const ssWeight = parseFloat(set.supersetWeight) || 0;
                    const ssReps = parseFloat(set.supersetReps) || 0;
                    return total + (weight * reps) + (ssWeight * ssReps);
                    }, 0)
                    .toLocaleString()}{" "}
                lbs
            </div>
          </div>
            
        );
      })}

      {exercises.length > 0 && (
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "1.1rem",
            borderRadius: "8px",
            border: "none",
            background: "#4CAF50",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          ✅ Submit Workout
        </button>
      )}
    </div>
  );
}

export default WorkoutSessionPage;
