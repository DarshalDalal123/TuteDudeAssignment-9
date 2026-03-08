import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { VisitorScanQR } from '../Visitor/VisitorScanQR'

export const Home = () => {
  const navigate = useNavigate()
  const [scannerVisible, setScannerVisible] = React.useState(false)

  const handleScan = async (data) => {
    const isUrl = /^https?:\/\//i.test(data)
    if (isUrl) {
      window.location.href = data
      return
    }

    navigate(data)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-dvh min-w-dvw'>
      <h1 className='text-4xl font-bold text-center'>Welcome to the VizManage</h1>
      <div>
        <Link to="/login" className='mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'>Login</Link>
        <Link to="/visitor/pre-registration" className='mt-4 inline-block px-6 py-3 bg-green-600 text-white rounded-lg ml-4 hover:bg-green-700 transition-colors duration-200'>Pre-register</Link>
      </div>

      <div className='mt-8 flex flex-col items-center'>
        <p className='mb-2'>Already pre registered?</p>
        <button
          className='inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200'
          onClick={() => setScannerVisible((v) => !v)}
        >
          {scannerVisible ? 'Hide QR Scanner' : 'Scan QR Code'}
        </button>

        {scannerVisible && (
          <div className='mt-6 w-full max-w-lg'>
            <VisitorScanQR fps={15} qrbox={200} onScan={handleScan} />
          </div>
        )}
      </div>
    </div>
  )
}