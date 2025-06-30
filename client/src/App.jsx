import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import "./App.css";

// This is the main App component that sets up the router and routes for the application
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

// function App() {
//   const [message, setMessage] = useState("Loading...");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchMessage = async () => {
//       try {
//         const response = await api.get("/");
//         if (!response.data.success) {
//           throw new Error(response.data.message || "Failed to fetch users");
//         }
//         setMessage("Got response");
//       } catch (err) {
//         console.error("Backend error:", err.message);
//         setError("Failed to load message from server");
//       }
//     };

//     fetchMessage();
//   }, []);

//   return (
//     <div className="App">
//       <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
//         <h1>Backend Message:</h1>
//         <p>{message}</p>
//         {error && <p style={{ color: "red" }}>{error}</p>}
//       </div>
//     </div>
//   );
// }

// export default App;
