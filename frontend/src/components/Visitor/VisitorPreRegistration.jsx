import React from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactSelect from "react-select";
import axios from 'axios';
import { useState, useEffect } from 'react';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

export const VisitorPreRegistration = () => {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [visitDate, setVisitDate] = useState(new Date());
  const [visitTime, setVisitTime] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    purpose: '',
    phone: ''
  });
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      toast.error("Please select an employee to meet.");
      return;
    }
    if (!visitTime) {
      toast.error("Please select a visit time.");
      return;
    }
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("purpose", formData.purpose);
    data.append("employeeId", selectedEmployee.value);
    data.append("visitDate", visitDate.toISOString().split('T')[0]);
    data.append("visitTime", visitTime);
    data.append("phone", formData.phone);
    data.append("photo", photo);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/visitor/pre-register`, data);
      toast.success("Visitor pre-registered successfully");
      setFormData({
        name: '',
        email: '',
        purpose: '',
        phone: ''
      });
      setSelectedEmployee(null);
      setVisitDate(new Date());
      setVisitTime('');
      setPhoto(null);
      setPreview(null);
      toast.success(res.data.message);
      navigate('/');
    } catch (error) {
      toast.error(`Failed to pre-register visitor: ${error.response?.data?.message || error.message || "Please try again."}`);
    }
  }
  useEffect(() => {
    const fetchEmployees = async () => {
      await axios.get(`${import.meta.env.VITE_API_URL}/api/visitor/allemployees`)
        .then(res => {
          const options = res.data.employees.map(emp => ({
            value: emp._id,
            label: emp.name
          }))
          setEmployeeOptions(options);
        })
        .catch(err => {
          toast.error(`Failed to fetch employees. ${err.response?.data?.message || err.message || "Please try again."}`);
        })
    }

    fetchEmployees();
  }, [])
  return (
    <div className='w-full max-w-[80%] mx-auto mt-3'>
      <h1 className='text-2xl font-bold'>Visitor Pre-Registration</h1>
      <p className='text-gray-600 mt-2'>Pre-register a visitor by filling out the form below.</p>
      <div className='mt-4'>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='mb-4'>
              <label className='block font-bold mb-2'>Name</label>
              <input type="text" className='w-full px-3 py-2 border rounded-md' placeholder='Visitor Name' name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className='mb-4'>
              <label className='block font-bold mb-2'>Email</label>
              <input type="email" className='w-full px-3 py-2 border rounded-md' placeholder='Visitor Email' name="email" value={formData.email} onChange={handleInputChange} />
            </div>
          </div>
          <div>
            <label className='block font-bold mb-2'>Purpose of Visit</label>
            <textarea className='w-full px-3 py-2 border rounded-md' placeholder='Purpose of Visit' name="purpose" value={formData.purpose} onChange={handleInputChange} />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            <div className='mb-4'>
              <label className='block font-bold mb-2'>Employee to Meet</label>
              <ReactSelect
                options={employeeOptions}
                value={selectedEmployee}
                onChange={setSelectedEmployee}
                placeholder="Select Employee"
              />
            </div>
            <div className='mb-4'>
              <label className='block font-bold mb-2'>Date of Visit</label>
              <DatePicker
                className='w-full px-3 py-2 border rounded-md'
                placeholderText='Select Date'
                selected={visitDate}
                onChange={setVisitDate}
                dateFormat='yyyy-MM-dd'
              />
            </div>
            <div>
              <label className='block font-bold mb-2'>Time of Visit</label>
              <input
                type="time"
                className='w-full px-3 py-2 border rounded-md'
                placeholder='Time of Visit'
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
              />
            </div>
            <div>
              <label className='block font-bold mb-2'>Phone</label>
              <input type="text" className='w-full px-3 py-2 border rounded-md' placeholder='Visitor Phone' name="phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className='mb-4'>
              <label className='block font-bold mb-2'>Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                className='w-full px-3 py-2 border rounded-md'
                onChange={handleImageChange}
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded"
                />
              )}
            </div>
          </div>
          <div>
            <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer'>Pre-Register Visitor</button>
          </div>
        </form>
      </div>
    </div>
  )
}