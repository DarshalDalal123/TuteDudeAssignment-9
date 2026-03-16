import React from 'react';
import { SecurityScanQR } from './SecurityScanQR';
import axios from 'axios';
import toast from "react-hot-toast";

export const SecurityScanVisitor = () => {
  const [openScanner, setOpenScanner] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleScan = async (decodedText) => {
    setOpenScanner(false);
    setLoading(true);
    await axios.post(`${import.meta.env.VITE_API_URL}/api/security/updateCheckInOutTime/${decodedText}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      toast.success(res.data.message);
    }).catch(err => {
      toast.error(err.response.data.message || "Error checking in/out visitor");
    }).finally(() => {
      setLoading(false);
    });
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Scan Visitor</h1>
      <p>This is where the security personnel can scan the visitor's QR code or ID to check them in.</p>

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setOpenScanner(prev => !prev)}
      >
        {
          openScanner ? 'Close Scanner' : 'Open Scanner'
        }
      </button>

      {openScanner && <SecurityScanQR onScan={handleScan} />}
    </div>
  )
}