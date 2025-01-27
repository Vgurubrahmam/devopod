import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Cookies from 'js-cookie';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();
  const jwtToken = Cookies.get('jwt_token');

  
  useEffect(() => {
    if (jwtToken) {
      setIsAuthenticated(true);
      navigate('/home');
    }
  }, [jwtToken, navigate]);
  const onSubmitSuccess = (jwtToken, message) => {
    Cookies.set('jwt_token', jwtToken, { expires: 30 });
    setIsAuthenticated(true);
    toast.success(message);
    setEmail('');
    setPassword('');
    navigate("/home")
  };

  const onSubmitFailure = (errorMsg) => {
    setShowSubmitError(true);
    setErrorMsg(errorMsg);
    toast.error(errorMsg);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const userDetails = { email, password };
    const url = process.env.API + `/userLogin`;
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
        return;
      }
      const data = await response.json();
      onSubmitSuccess(data.token, data.message);
    } catch (error) {
      console.log('Server error:', error);
    }
  };

  const renderPasswordField = () => (
    <>
      <label className="text-sm font-semibold text-gray-600" htmlFor="password">
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

  const renderEmailField = () => (
    <>
      <label className="text-sm font-semibold text-gray-600" htmlFor="email">
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
    <div className="flex flex-col lg:flex-row items-center justify-between max-sm:justify-center p-4 h-screen bg-gray-100">
      
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
        className=" max-sm:hidden ml-30 w-96"
        alt="website login"
      />
      <form
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm"
        onSubmit={submitForm}
      >
        <img
          src="https://i.ibb.co/h96GL1X/Screenshot-2025-01-25-212619.png"
          className=" w-44 mx-auto mb-4"
          alt="website logo"
        />
        <div className="mb-4">{renderEmailField()}</div>
        <div className="mb-4">{renderPasswordField()}</div>
        <button
          type="submit"
          className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
        <div className="my-4 text-center">
          <p className="font-bold">OR</p>
        </div>
        <Link to="/">
          <button
            type="button"
            className="w-full bg-gray-600 cursor-pointer text-white py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Signup
          </button>
        </Link>
        {showSubmitError && (
          <p className="mt-2 text-red-600 text-sm font-semibold">
            *{errorMsg}
          </p>
        )}
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;
