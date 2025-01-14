import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Heading from "../components/headerComponents/Heading";

const Collection = ({factoryData}) => {


  


  useEffect(() => {
    if (factoryData) {
     console.log(factoryData,"faccc")
    }
  }, []); // Ensure it runs when the factory is set

  return (
    <div className="h-screen w-full bg-black px-6">
      <Heading title="Collection" />
      {/* Display NFTs or other UI elements here */}
    </div>
  );
};

export default Collection;
