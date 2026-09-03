import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Topics from "./pages/Topics";
import Quiz from "./pages/Quiz";
import Progress from "./pages/Progress";
import WeakTopics from "./pages/WeakTopics";

// function App() {
//   return <Login />;

// }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/weak-topics" element={<WeakTopics />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/quiz/:topicId" element={<Quiz />} />
        <Route path="/subjects/:subjectId/topics" element={<Topics />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
