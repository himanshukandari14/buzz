

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-[15%] font-bold">
      <div className="text-[2rem]">Buzz</div>

      <div className="flex justify-center gap-10 items-center">
        <h1>About</h1>
        <h1>Collection</h1>
        <h1>FAQ</h1>
        <button className="text-[#c4ebff]  hover:text-black hover:bg-white 0.3s transition bg-[#0a2b3b] text-[1rem] rounded-[100px] px-4 py-3">Connect wallet</button>
      </div>
    </div>
  )
}

export default Navbar
