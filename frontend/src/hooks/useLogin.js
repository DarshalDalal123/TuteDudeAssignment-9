import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useUserContext } from "./useUserContext";
import toast from "react-hot-toast";

export const useLogin = () => {
  const navigate = useNavigate();
  const { dispatch } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const login = async (email, password) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, { email, password }, { withCredentials: true })
        .then((res) => {
          if (res.data.success) {
            setIsLoading(true);
            setError(null);
            dispatch({ type: "SET_USER", payload: res.data.user });
            toast.success(res.data.message);
            localStorage.setItem('token', res.data.token);
            if (res.data.user.role === 'admin') {
              navigate('/admin/dashboard');
            } else if (res.data.user.role === 'employee') {
              navigate('/employee/dashboard');
            } else if (res.data.user.role === 'security') {
              navigate('/security/dashboard');
            }
          }
        })
        .catch((err) => {
          setError(err.response ? err.response.data.message : err.message);
          toast.error(err.response ? err.response.data.message : err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      toast.error(error.response ? error.response.data.message : error.message);
    }
  }
  return { login, isLoading, error };
}