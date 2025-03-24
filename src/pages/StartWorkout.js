import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

function StartWorkout() {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/workout-sessions`)
      .then((res) => setSessions(res.data))
      .catch((err) => {
        console.error("Failed to fetch sessions:", err);
        setSessions([]);
      });
  }, []);

  const handleSessionClick = (sessionId) => {
    navigate(`/workout-session/${sessionId}`);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🏋️ Start Workout</h1>

      {sessions.length === 0 ? (
        <p>No workout sessions found.</p>
      ) : (
        <div>
          <h3>Select a session to start:</h3>
          {sessions.map((session) => (
            <div key={session.id} style={{ marginBottom: "1rem" }}>
              <button onClick={() => handleSessionClick(session.id)}>
                {session.name}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StartWorkout;
