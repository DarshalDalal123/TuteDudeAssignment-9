import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../hooks/useUserContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useUserContext();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'CLEAR_USER' });
    navigate('/login');
  }

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">VizManage</a>
      </div>
      <div className="flex-none">
        <details className="dropdown">
          <summary className="btn m-1">{user.name}</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-1 p-2 shadow-sm">
            <li><a onClick={handleLogout}>Logout</a></li>
          </ul>
        </details>
      </div>
    </div>
  )
}