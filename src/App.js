import React from 'react';
import { BrowserRouter, Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Measurement from './pages/Measurement';
import Register from './pages/Register';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createTheme,ThemeProvider } from '@mui/material/styles';
import { getDatabase } from 'firebase/database';
import QRCode from './pages/QRCode';
import Configuracao from './pages/Config';
import Clientes from './pages/Clientes';
import RegisterClient from './pages/RegisterClient';
import Payment from './pages/Payment';
import { initMercadoPago } from '@mercadopago/sdk-react';
import ChangePassword from './pages/ChangePassword';
import CustomForm from './pages/ClientForm';
import LoadingScreen from './pages/Loading';
import GoogleAgenda from './pages/GoogleAgenda';


const firebaseConfig = {
  apiKey: "AIzaSyBfjrD4DDMz2ucwLvdxf3-6K98514ZaSdw",
  authDomain: "app-project-farmatical.firebaseapp.com",
  databaseURL: "https://app-project-farmatical-default-rtdb.firebaseio.com",
  projectId: "app-project-farmatical",
  storageBucket: "app-project-farmatical.firebasestorage.app",
  messagingSenderId: "264403208467",
  appId: "1:264403208467:web:a7fb74ed3c6c7998eff2e6",
  measurementId: "G-XR9NWN60G6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);


export { database }



const theme = createTheme({
  colorSchemes: {
    
    light: {
      palette: {
        primary: {
          main: '#0073b1',
          light:'#7F00FF',
          dark:"#7F00FF"
        },

        secondary:{
          main: '#0073b1',
          light:'#7F00FF',
          dark:"#7F00FF"
        },
        
      
        // ...other tokens
      },
      
    },
    dark: {
      palette: {
        primary: {
          main:'#0073b1',
          light:'#7F00FF',
          dark:"#7F00FF"
        },

        secondary:{
          main:'#0073b1',
          light:'#7F00FF',
          dark:"#7F00FF"
        },
       
      },
    },

  },
});

function App() {


  return (

    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/measure" element={<Measurement />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/qrcode" element={<QRCode />} />
          <Route path="/config" element={<Configuracao />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/registerClient" element={<RegisterClient />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/password" element={<ChangePassword />} />
          <Route path="/payment/customForm" element={<CustomForm />} />
          <Route path="/loading" element={<LoadingScreen />} />
            <Route path="/google" element={<GoogleAgenda />} />
        </Routes>
      </BrowserRouter>
      </ThemeProvider>
   
  );
}

export default App;