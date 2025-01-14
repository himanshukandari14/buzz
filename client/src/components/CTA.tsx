

const CTA = () => {
  return (
    <div className="w-full h-[500px]  flex justify-center items-center">
        <div className="flex justify-center items-start">
            <div className="w-[40%] text-[3rem] flex  font-bold">Meet the punks</div>
            <div className="flex flex-col items-center w-[40%] text-start  gap-10">
                <h2 className="font-semibold text-[1.2rem] ">The CryptoPunks are 24x24 pixel art images, generated algorithmically. Most are punky-looking guys and girls, but there are a few rarer types mixed in: Apes, Zombies and even the odd Alien. Every punk has their own profile page that shows their attributes as well as their ownership/for-sale status.</h2>

                <div className="flex gap-5 w-full ">
                  <button className="text-[#000000]  hover:text-[#ffffff] hover:bg-[#4a4a4a] 0.3s transition bg-[#ffff] text-[1rem] rounded-[100px] px-6 py-3 font-bold ">Buy a punk</button>
                <button className="border border-white hover:border text-[#ffffff]  0.3s transition  text-[1rem] rounded-[100px] px-6 py-3 font-bold ">View full collection</button>
                </div>
                
            </div>
        </div>
      
    </div>
  )
}

export default CTA
