import { useNavigate } from "react-router-dom"

const Hero = () => {
  const navigate = useNavigate();

  const redirectMint = ()=>{
    navigate('/mint');
  }
  return (
    <div className='h-[500px] w-screen text-center flex justify-center items-center  px-[20%] mt-6'>
      <div className="flex flex-col justify-center items-center gap-8">
        <h1 className='text-[4rem] text-white font-semibold'>The project that inspired the modern CryptoArt movement</h1>
        <h1 className='text-[1.5rem] text-white font-light px-[20%]'>10,000 unique collectible characters with proof of ownership stored on the Ethereum blockchain.</h1>
        <button onClick={redirectMint} className="text-[#000000]  hover:text-[#ffffff] hover:bg-[#4a4a4a] 0.3s transition bg-[#ffff] text-[1rem] rounded-[100px] px-6 py-3 font-bold ">Mint now</button>
      </div>
    </div>
  )
}

export default Hero
