import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const AddSecurityForm = () => {
  const [securityData, setSecurityData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'security',
    department: 'Security',
    phone: ''
  });
  const handleChange = (e) => {
    setSecurityData({ ...securityData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_API_URL}/api/users/signup`, securityData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => {
        toast.success(res.data.message);
        setSecurityData({
          name: '',
          email: '',
          password: '',
          role: 'security',
          department: 'Security',
          phone: ''
        });
      })
      .catch((err) => {
        toast.error(`Failed to add security: ${err?.response?.data?.message ?? err.message}`);
        console.error('Error adding security:', err?.response?.data?.message ?? err.message);
      });
  }
  return (
    <div>
      <h1 className='font-bold text-3xl'>Add Security</h1>
      <form className='flex flex-col gap-4 my-5' onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block mb-2'>Name</label>
            <input type='text' name='name' className='border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={securityData.name} onChange={handleChange} />
          </div>
          <div>
            <label className='block mb-2'>Email</label>
            <input type='email' name='email' className='border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={securityData.email} onChange={handleChange} />
          </div>
          <div>
            <label className='block mb-2'>Password</label>
            <input type='password' name='password' className='border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={securityData.password} onChange={handleChange} />
          </div>
          <div>
            <label className='block mb-2'>Phone</label>
            <input type='text' maxLength={10} minLength={10} pattern='[0-9]{10}' name='phone' className='border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={securityData.phone} onChange={handleChange} />
          </div>
        </div>
        <div className='flex flex-row gap-4 mt-4 justify-end'>
          <button type='submit' className='bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer block w-max'>
            Add Security
          </button>
          <Link to='/admin/security' className='bg-gray-500 text-white py-2 px-4 rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer block w-max'>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}