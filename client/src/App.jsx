import React, { useEffect, useState } from "react";
import "./App.css";
// import api from "./api/api";
import LoginForm from "./components/LoginForm";
import api from "./api/api";

function App() {
  // const [message, setMessage] = useState("Loading...");
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Fetch a message from the backend
    const fetchMessage = async () => {
      console.log("token", token);
      try {
        const response = await api.get("/user/me", { headers: { Authorization: `Bearer ${token}` } });
        console.log("Response:", response.data);
        // setMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching message:", error);
        // setMessage("Failed to load message");
      }
    };

    if (token) fetchMessage();
  }, [token]);

  return (
    <div className="App">
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        {token ? (
          <p>Logged in with token: {token}</p>
        ) : (
          <LoginForm onLogin={setToken} />
        )}
      </div>
    </div>
  );
}

export default App;
