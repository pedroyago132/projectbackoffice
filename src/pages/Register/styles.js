import React from 'react';

import styled from 'styled-components';
import { colorButton, colorTitleButton, backgroundColor } from '../../Globals/globals';

export const Body = styled.div`
  width: 100%;
  height: 100vh;
  flex-direction:column;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:15px;
  padding:20px;
  background-color:#f0f0f0;
   background-image: url('/backgroundp.png');
   background-size: cover;
  background-position: center;
`;

export const Container = styled.div`
  width: 50vw;
  height: 100vh;
  flex-direction: column;
  display:flex;
  align-items:center;
  justify-content:center;
  background-color:#f9f9f9;
  gap:20px;
  @media (max-width: 768px) { /* Ajuste o valor conforme a largura desejada */
    width:100%;
    height:100%;
  }
`;

export const Container1 = styled.div`
  width: 50vw;
  height: 100vh;
  @media (max-width: 768px) { /* Ajuste o valor conforme a largura desejada */
    width:0%;
    height:0%;
  }
`;

export const ImageBackground = styled.img`
width:100%;
height:100%;
@media (max-width: 768px) { /* Ajuste o valor conforme a largura desejada */
    width:0%;
    height:0%;
    display:none;
  }
`



export const ContainerButton = styled.div`
  width: 70vw;
  height: 40%;
  flex-direction: column;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:45px;
`;

export const Button = styled.button`
 width:280px;
 height:60px;
 display:flex;
 align-items:center;
 justify-content:center;
 border-radius:20px;
 background-color:${colorButton};
 cursor:pointer;
`

export const TitleButton = styled.h1`
color:${colorTitleButton};
font-size:18px;
font-weight:bold;
`
export const Title = styled.a`
color:black;
font-size:35px;
font-weight:bold;
`

export const SubTitle = styled.a`
color: #15d70c;
font-size: 17px;
font-weight: 400;
`

export const FormControl = styled.div`
  width: 50%;
  min-height: 70%;
  flex-direction: column;
  display:flex;
  padding:10px;
  align-items:center;
  justify-content:center;
  border-radius:25px;
  border:1px solid black;
 background-color:white;
  gap:20px;
  @media (max-width: 768px) { /* Ajuste o valor conforme a largura desejada */
    width:85%;
    height:90%;
  }
`;

export const Input = styled.input`
color: black;
font-size: 14px;
font-weight: 400;
width:280px;
height:47px;
border-color:#d9ded8;
border-radius:17px;
padding:7px;
background-color:white;
font-weight:bold;
border: 2px solid grey;
&::placeholder {
    font-weight: 500;
    color:#4f614f; /* ajuste a cor conforme necessário */
  }
`
export const Logo = styled.img`
width:100px;
height:100px;
border-radius:17px;
padding:7px;
border: 2px solid #d9ded8;
`

