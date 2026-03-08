import { createContext, useEffect, useReducer, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const userReducer = (state, action) => {
  switch(action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "CLEAR_USER":
      return { ...state, user: null };
    default:
      return state;
  }
}

export const UserContextProvider = ({ children }) => {
  const [ state, dispatch ] = useReducer(userReducer, {
    user: null
  });
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios.get(`${import.meta.env.VITE_API_URL}/api/users/getuser`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        dispatch({ type: "SET_USER", payload: res.data.user });
      })
      .catch((err) => {
        console.warn('Failed to fetch user profile:', err?.response?.data?.message ?? err.message);
        localStorage.removeItem('token');
        dispatch({ type: "CLEAR_USER" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <UserContext.Provider value={{ ...state, dispatch, loading }}>
      {children}
    </UserContext.Provider>
  )
}