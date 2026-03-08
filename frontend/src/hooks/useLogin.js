import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useUserContext } from "./useUserContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { dispatch } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const login = async (email, password) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, { email, password }, { withCredentials: true })
        .then((res) => {
          console.log('Login successful:', res.data.message);
          if (res.data.success) {
            setIsLoading(true);
            setError(null);
            dispatch({ type: "SET_USER", payload: res.data.user });
            localStorage.setItem('token', res.data.token);
            if (res.data.user.role === 'admin') {
              navigate('/admin/dashboard');
            }
          }
        })
        .catch((err) => {
          console.error('Login failed:', err.response ? err.response.data.message : err.message);
          setError(err.response ? err.response.data.message : err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
    }
  }
  return { login, isLoading, error };
}