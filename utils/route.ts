import axios from 'axios';

export const fetchKeyDetails = async (id:string) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/ship/${id}`);
      
      // Assuming the key details are stored in response.data
      const { apiKey,collectionAddress, chainId, imageUrl,walletAddress,price,gmailAddress } = response.data;
      
      // Now you can use the key details as needed in your application
      return { apiKey,collectionAddress, chainId, imageUrl,walletAddress,price,gmailAddress };
    } catch (error) {
      console.error('Error fetching key details:', error);
      return { };
    }
  };
