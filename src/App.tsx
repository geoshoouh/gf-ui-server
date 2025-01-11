import './App.css'
import StatusIndicator from './components/StatusIndicator'

function App() {

  // Dev Value; must be on local network
  const authServerEndpoint: string = "http://rpi2:31772"
  
  return (
    <>
      <div className="card">
        <StatusIndicator endpoint={authServerEndpoint} subject="Login Server"/>
      </div>
    </>
  )
}

export default App
