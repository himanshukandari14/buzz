// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

// Browser-compatible Pinata upload function
const uploadToIPFS = async (file: File) => {
  // Retrieve API keys from environment variables
  const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
  const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY;
  console.log(PINATA_API_KEY, PINATA_SECRET_API_KEY,"-------------")
  // Check if the API keys are present
  if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
    console.error("Pinata API keys are missing");
    throw new Error("Pinata API keys are missing");
  }

  // Validate file type (e.g., ensure it's an audio file)
  const allowedFileTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg'];
  if (!allowedFileTypes.includes(file.type)) {
    console.error("Invalid file type. Please upload an audio file.");
    throw new Error("Invalid file type. Please upload an audio file.");
  }

  // Create FormData
  const formData = new FormData();
  formData.append('file', file);

  // Add metadata
  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      // Add additional metadata if needed
    }
  });
  formData.append('pinataMetadata', metadata);

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("File uploaded successfully:", result.IpfsHash);
    return result.IpfsHash; // This is the CID (IPFS hash) you'll use when minting the NFT

  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed");
  }
};

export default uploadToIPFS;
