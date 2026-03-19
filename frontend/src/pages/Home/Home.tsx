import './Home.css'
import { useState } from 'react'
import reactLogo from '../../assets/react.svg'

function Home() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>My movies</h1>
      <div className="card">
        <input type="text" placeholder="Search movies..." />
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default Home
