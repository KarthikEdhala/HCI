import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Blog from './components/Blog';
import SignUpPage from './components/Signup';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<Blog />} />
        {/* If none of the above routes match, redirect to the default route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
