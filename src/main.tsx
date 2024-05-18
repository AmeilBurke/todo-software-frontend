import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast'

// plan out all requiremnts for front end, create the logic, starting with react router, then account logic & then do layout styling

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
      <Toaster />
      <BrowserRouter></BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
)
