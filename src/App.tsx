import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import StatusIndicator from './components/StatusIndicator'
import GPF_User from './types/Interfaces';
import ChangePassword from './components/ChangePassword';

const App: React.FC = () => {

  const [appUser, setAppUser] = useState<GPF_User>({email: '', role: '', token: '', isAuthenticated: false})

  // TODO: make domain more generic
  const authServerEndpoint: string = "https://app.gfproto.xyz"
  
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login updateUserStateFunc={ setAppUser } endpoint={ authServerEndpoint + '/auth/login' } />}
          />
          <Route 
            path="change-password"
            element={
              appUser.isAuthenticated ? (
                <ChangePassword endpoint={ authServerEndpoint } appUser={ appUser }/>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              appUser.isAuthenticated ? (
                <Dashboard endpoint={ authServerEndpoint } user={ appUser } role={ appUser.role } token={ appUser.token } isAuthenticated={ appUser.isAuthenticated }/>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      <div
        className="position-fixed bottom-0 start-0 d-flex flex-column"
        style={{ 
          margin: "10px", 
          zIndex: 1050,
          maxWidth: "250px",
          pointerEvents: "none"
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <StatusIndicator subject="Auth" endpoint={ authServerEndpoint  + '/ping' }/>
        </div>
        <div style={{ pointerEvents: "auto" }}>
          <StatusIndicator subject="Data" endpoint={ authServerEndpoint  + '/ping-data-server' }/>
        </div>
      </div>
    </>
  )
}

export default App;
