// App.tsx
import { Routes, Route } from "react-router-dom";
import Home from './components/layout/Home';
import Dashboard from "./components/Notes"; 
import ProtectedRoute from './components/layout/ProtectedRoute'; 

function App() {
  return (
    <div className='bg-white min-h-screen w-full p-2'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;