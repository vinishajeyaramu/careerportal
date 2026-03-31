import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const jobpostContext = createContext();

const JobPost = ({ children }) => {
  const jobUrl = import.meta.env.VITE_JOB_URL;

  const [jobpost, setJobPost] = useState([]);

  const fetchAllJobPost = async () => {
    const res = await axios(jobUrl);
    setJobPost(res.data);
  };

  console.log(jobpost);

  useEffect(() => {
    fetchAllJobPost();
  }, []);

  return (
    <jobpostContext.Provider value={{ jobpost }}>
      {children}
    </jobpostContext.Provider>
  );
};

export default JobPost;



