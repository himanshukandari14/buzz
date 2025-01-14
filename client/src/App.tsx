
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'

function App() {


  return (
    <Routes>
    <Route path="/" element={<Home />}></Route>
    <Route path="/collection" element={<Collection />}></Route>
      
      
    </Routes>
  )
}

export default App
