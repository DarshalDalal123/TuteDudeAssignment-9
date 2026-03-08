import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AddEmployeeForm = () => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: '',
    phone: ''
  });

  const handleChange = (e) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(employeeData);
    await axios.post(`${import.meta.env.VITE_API_URL}/api/users/signup`, employeeData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => {
        console.log('Employee added:', res.data);
        setEmployeeData({
          name: '',
          email: '',
          password: '',
          role: 'employee',
          department: '',
          phone: ''
        });
      })
      .catch((err) => {
        console.error('Error adding employee:', err?.response?.data?.message ?? err.message);
      });
  }

  return (
    <div>
      <h1 className='font-bold text-3xl'>Add Employee</h1>
      <form className='flex flex-col gap-4 my-5' onSubmit={handleSubmit}>
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <label className='block mb-2'>Name</label>
            <input type='text' name='name' className='border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={employeeData.name} onChange={handleChange} />
          </div>
          <div>
            <label className='block mb-2'>Email</label>
            <input type='email' name='email' className='border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={employeeData.email} onChange={handleChange} />
          </div>
          <div>
            <label className='block mb-2'>Password</label>
            <input type='password' name='password' className='border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={employeeData.password} onChange={handleChange} />
          </div>
          <div>
            <label className='block mb-2'>Department</label>
            <input type='text' name='department' className='border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={employeeData.department} onChange={handleChange} />
          </div>
          <div>
            <label className='block mb-2'>Phone</label>
            <input type='text' maxLength={10} minLength={10} pattern='[0-9]{10}' name='phone' className='border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={employeeData.phone} onChange={handleChange} />
          </div>
        </div>
        <button type='submit' className='bg-green-500 text-white py-2 px-4 rounded-xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer'>
          Add Employee
        </button>
      </form>
    </div>
  )
}