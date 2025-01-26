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
            element={<ChangePassword endpoint={ authServerEndpoint } appUser={ appUser }/>}
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
      <br/>
      <StatusIndicator subject="Authentication Server" endpoint={ authServerEndpoint  + '/ping' }/>
    </>
  )
}

export default App;
