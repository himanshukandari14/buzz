import punk1 from '../assets/Punk1.jpg'
import punk2 from '../assets/punk2.jpg'
import punk3 from '../assets/punk3.jpg'

import punk5 from '../assets/punk 5.jpg'
import punk6 from '../assets/punk 6.jpg'
import punk7 from '../assets/punk 7.jpg'
import punk8 from '../assets/punk 8.jpg'
import punk9 from '../assets/punk 9.jpg'

interface Image {
    punks:string
}
const images: Image[] =[
    {
        punks: punk1,

    },
    {
         punks: punk2,
    },
    {
         punks: punk3,
    },
    {
         punks: punk5,
    },
    {
         punks: punk6,
    },
     {
         punks: punk7,
    },
     {
         punks: punk8,
    },
    {
         punks: punk9,
    },
    
    
]
const Punks:React.FC = () => {
  return (
    <div className="w-full h-[300px]  flex justify-center items-center">
        <div className=' h-[200px] w-[200px] flex gap-4 justify-center items-center'>

        {images.map((image, index)=>
            (<img key={index} src={image.punks} alt="punk images" className='h-[200px] w-[200px]  rounded-3xl' />)
        )}
        </div>
    </div>
  )
}

export default Punks
