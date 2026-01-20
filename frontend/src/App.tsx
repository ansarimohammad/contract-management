import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const handleBackend = () => {
    axios.get('/')
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.error(error)
      })
  }

  return (
    <>
      <div>
        Home page
        <br />
        <button onClick={handleBackend}>
          Click to Check Backend
        </button>
      </div>
    </>
  )
}

export default App
