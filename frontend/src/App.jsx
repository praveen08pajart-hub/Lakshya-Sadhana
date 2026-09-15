import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Topics from "./pages/Topics";
import Quiz from "./pages/Quiz";
import Progress from "./pages/Progress";
import WeakTopics from "./pages/WeakTopics";
import QuizHistory from "./pages/QuizHistory";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects/:subjectId/topics"
          element={
            <ProtectedRoute>
              <Topics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:topicId"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/weak-topics"
          element={
            <ProtectedRoute>
              <WeakTopics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz-history"
          element={
            <ProtectedRoute>
              <QuizHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
