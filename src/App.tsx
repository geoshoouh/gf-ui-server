import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import StatusIndicator from './components/StatusIndicator'

const App: React.FC = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authServerEndpoint: string = "https://auth.gfauth.xyz"
  
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login authStateFunc={ setIsAuthenticated } endpoint={authServerEndpoint} />}
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <br/>
      <StatusIndicator subject="Authentication Server" endpoint={authServerEndpoint}/>
    </>
  )
}

export default App
