import React from "react";
import styled, { keyframes } from "styled-components";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get, child, onValue, update } from "firebase/database";
import TextField from '@mui/material/TextField';
import base64 from 'base-64'
import { database } from '../../App';
import { useNavigate } from 'react-router-dom';

// Animação para o spinner
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Container da tela de carregamento
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f3f3f3;
`;

// Estilo do spinner
const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingScreen = () => {
    const navigate = useNavigate()

    const [connected, setConnected] = React.useState(false);


    React.useEffect(() => {
        const db = getDatabase()
        const auth = getAuth();
        setTimeout(() => {
            navigate('/')
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                   
                    navigate('/measure')


                    // ...
                } else {
                   navigate('/')
                }
            });
        }, 1000);
    }, [])
    return (
        <LoadingContainer>
            <Spinner />
        </LoadingContainer>
    );
};

export default LoadingScreen;
