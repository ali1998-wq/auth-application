import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const usePut = (url) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const token = useSelector((state) => state.user.token); 

  const putData = async (data,includeToken) => {
    setIsLoading(true);
    setSuccess(null);

    try {
      const headers = includeToken
        ? { Authorization: `Bearer ${token}` }
        : {};
      const completeUrl = `${import.meta.env.VITE_BASE}${url}`;
      const response = await axios.put(completeUrl, data, {
        headers: headers,
      });
      setSuccess(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { putData, isLoading, success };
};

export default usePut;