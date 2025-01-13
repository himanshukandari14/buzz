import Hero from "../components/Hero"
import Navbar from "../components/Navbar"


const Home = () => {
  return (
    <div className="bg-black h-screen w-screen text-white py-4">
     <Navbar />
     <Hero />
    </div>
  )
}

export default Home
