import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-dvh min-w-dvw'>
      <h1 className='text-4xl font-bold text-center'>Welcome to the VizManage</h1>
      <div>
        <Link to="/login" className='mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'>Login</Link>
        <Link to="/visitor/pre-registration" className='mt-4 inline-block px-6 py-3 bg-green-600 text-white rounded-lg ml-4 hover:bg-green-700 transition-colors duration-200'>Pre-register</Link>
      </div>
    </div>
  )
}