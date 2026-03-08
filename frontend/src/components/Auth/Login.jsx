import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin';

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('email:', email);
    console.log('password:', password);
    await login(email, password);
  }
  return (
    <>
      {isLoading && <div>Loading...</div>}
      <div className='flex items-center justify-center h-screen max-h-dvh w-screen max-w-dvw'>
        <div className='border border-gray-300 rounded-lg flex flex-col p-6 w-full max-w-md'>
          <h1 className='text-3xl font-bold mb-4 text-center'>VizManage</h1>
          <h2 className='text-2xl font-bold mb-4 text-center'>Login</h2>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <label className='block mb-2'>Email</label>
              <input type='email' className='border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className='block mb-2'>Password</label>
              <input type='password' className='border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'>
              Login
            </button>
            {error && <div className='text-red-500 mb-4'>{error}</div>}
          </form>
        </div>
      </div>
    </>
  )
}