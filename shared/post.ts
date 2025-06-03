import axiosInstance from "./axiosinstance";

const poster = async (url: string, data: object) => {
    try {
      const response = await axiosInstance.post(url, data);
      return response.data;
    } catch (error) {
      // Log error for debugging
      console.log("Error in poster function:", error);
    //   throw error.response ? error.response.data : new Error("An unexpected error occurred");
    }
  };
  export default poster;