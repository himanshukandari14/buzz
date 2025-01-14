interface HeadingProps {
    title: string; // Define the title property as a string
}

const Heading: React.FC<HeadingProps> = ({title}) => {

  return (
    <div>
       <div className=" flex text-[8rem] text-white  font-bold">{title}</div>
    </div>
  )
}

export default Heading
