import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from "react-data-table-component"
import axios from 'axios'

export const EmployeeList = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const columns = [
    {
      name: "Name",
      selector: row => row.name,
      sortable: true
    },
    {
      name: "Email",
      selector: row => row.email,
    },
    {
      name: "Department",
      selector: row => row.department,
    },
    {
      name: "Phone",
      selector: row => row.phone,
    }
  ];
  const getAllEmployees = async () => {
    try {
      setLoading(true);
      await axios.get(`${import.meta.env.VITE_API_URL}/api/users/allemployees`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((res) => {
          setLoading(false);
          console.log('Employee Fetched:', res.data);
          setData(res.data.employees);
        })
        .catch((err) => {
          console.error('Error fetching employees:', err?.response?.data?.message ?? err.message);
        })
        .finally(() => {
          console.log('Employee fetch attempt completed');
          setLoading(false);
        });
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    }
  }

  useEffect(() => {
    getAllEmployees();
  }, []);

  return (
    <div>
      <h1 className='font-bold text-3xl'>EmployeeList</h1>
      <div className='flex flex-row justify-between my-5'>
        <form className='flex flex-row gap-4 items-center'>
          <input type='text' placeholder='Search by name or email' className='border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
          <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'>
            Search
          </button>
        </form>
        <Link to='/admin/employees/add' className='bg-green-500 text-white py-2 px-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer rounded-xl'>
          Add Employee
        </Link>
      </div>
      <div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}