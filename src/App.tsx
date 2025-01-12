import './App.css'
import LoginPage from './components/Login'
import StatusIndicator from './components/StatusIndicator'

function App() {

  // Dev Value; must be on local network
  const authServerEndpoint: string = "http://rpi2:31772"
  
  return (
    <>
      <div className="card">
        <LoginPage endpoint={authServerEndpoint + '/auth/login'}/>
        <StatusIndicator endpoint={authServerEndpoint + '/ping'} subject="Login Server"/>
      </div>
    </>
  )
}

export default App
