import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'


import 'react-toastify/ReactToastify.css'
import { Bounce, ToastContainer } from 'react-toastify'
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>

    <App />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition:Bounce />
  </BrowserRouter>
  </StrictMode>,
)
