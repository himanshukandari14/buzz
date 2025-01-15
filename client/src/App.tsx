
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Mint from './pages/Mint'

function App() {


  return (
    <Routes>
    <Route path="/" element={<Home />}></Route>
    <Route path="/collection" element={<Collection />}></Route>
    <Route path="/mint" element={<Mint />}></Route>
      
      
    </Routes>
  )
}

export default App
