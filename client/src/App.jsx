import React, { useEffect, useState } from "react";
import "./App.css";
import api from "./api";

function App() {
  const [message, setMessage] = useState("Loading...");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await api.get("/api/users");
        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to fetch users");
        }
        setMessage(
          response.data.data.map((user) => user.name).join(", ") ||
            "No users found"
        );
      } catch (err) {
        console.error("Backend error:", err.message);
        setError("Failed to load message from server");
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="App">
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Backend Message:</h1>
        <p>{message}</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default App;
