import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const jwtToken = Cookies.get('jwt_token');
console.log(jwtToken);
useEffect(()=>{

  if(jwtToken){
    navigate('/home');
  }
})
  const onSubmitSuccess = (message) => {
    setUsername("")
    setEmail("")
    setPassword("")
    toast.success(message);
    // navigate('/login');
  };

  const onSubmitFailure = (errorMsg) => {
    setShowSubmitError(true);
    setErrorMsg(errorMsg);
    toast.error(errorMsg);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const userDetails = { username, password, email };
    const url = `${import.meta.env.VITE_API}/userRegister`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const data = await response.json();
        onSubmitFailure(data.error);
        toast.error(data.error)
        return;
      }
      const data = await response.json();
      onSubmitSuccess(data.message);
      toast.success(data.message)

    } catch (error) {
      onSubmitFailure('Something went wrong, please try again.');
    }
  };

  const renderPasswordField = () => (
    <>
      <label className="text-sm font-bold text-gray-600" htmlFor="password">
        PASSWORD
      </label>
      <input
        type="password"
        id="password"
        className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
    </>
  );

  const renderUsernameField = () => (
    <>
      <label className="text-sm font-bold text-gray-600" htmlFor="username">
        USERNAME
      </label>
      <input
        type="text"
        id="username"
        className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
    </>
  );

  const renderEmailField = () => (
    <>
      <label className="text-sm font-bold text-gray-600" htmlFor="email">
        EMAIL
      </label>
      <input
        type="email"
        id="email"
        className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
    </>
  );

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between max-sm:justify-center max-sm:p-5 h-screen w-screen bg-gray-100">
      
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
        className="hidden lg:block w-90 ml-30"
        alt="website login"
      />
      <form
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm"
        onSubmit={submitForm}
      >
        <img
          src="https://i.ibb.co/h96GL1X/Screenshot-2025-01-25-212619.png"
          className=" w-44 mx-auto mb-4 m-"
          alt="website logo"
        />
        <div className="mb-4">{renderUsernameField()}</div>
        <div className="mb-4">{renderEmailField()}</div>
        <div className="mb-4">{renderPasswordField()}</div>
        <button
          type="submit"
          className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Signup
        </button>
        <div className="my-4 text-center">
          <p className="font-bold">OR</p>
        </div>
        <Link to="/login">
          <button
            type="button"
            className="w-full bg-gray-600 cursor-pointer   text-white py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Login
          </button>
        </Link>
       
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUpForm;
