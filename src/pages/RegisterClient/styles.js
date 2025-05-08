import styled from 'styled-components';
import { colorButton,backgroundColor,backgroundMenu } from '../../Globals/globals';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

export const Body = styled(Box)`
  display:column;
  padding:18px;
  background-color:${backgroundColor};
  gap:7px;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100%;
`;

export const ContainerDisplay = styled(Box)`
flex-direction:row;
display:flex;
   @media (max-width: 768px) { /* Ajuste o valor conforme a largura desejada */
    grid-template-columns: 1fr; /* muda para 1 coluna */
    flex-direction:column
  }
`


export const TextModel = styled.a`
color:grey;
font-size:25px;
font-weight:bold;
`

export const Text = styled.a`
color:grey;
font-size:16px;
font-weight:;
`

export const AppTopBar = styled(AppBar)`

`

export const TextRed = styled.a`
color:red;
font-size:16px;
font-weight:400;
`
export const Container1 = styled(Box)`
margin-top:-120px;
width: 40%;
flex-direction:column;
display:flex;
height:100vh;
align-items:center;
justify-content:center;
gap:10px;


`
export const Container2 = styled(Box)`
width: 100%;
display:flex;
height:100%;
align-items:center;
flex-direction:column;
padding:15px;
`
export const ContainerEditAccordion = styled(Box)`
width: 100%;
display:flex;
align-items:flex-end;
justify-content:flex-end;
`

export const Input = styled.input`
color: black;
font-size: 14px;
font-weight: 400;
width:35%;
height:40px;
border-color:#d9ded8;
border-radius:10px;
padding:7px;
background-color:white;
font-weight:bold;
border: 2px solid black;
margin:5px;
&::placeholder {
    font-weight: 500;
    color:#4f614f; /* ajuste a cor conforme necessário */
  }
`

export const ContainerRules = styled(Box)`
display: flex;
  align-items: flex-start;
  flex-direction: column;
  width: 80%;
  gap: 10px;
  padding: 18px;
   @media (max-width: 768px) { /* Ajuste o valor conforme a largura desejada */
     flex-direction:row;
  }
`

export const ContainerRules1 = styled(Box)`
display: flex;
  align-items: flex-start;
  flex-direction: row;
  width: 45%;
  gap: 10px;
  padding: 18px;
  width:100%;
`
const BoxCard = styled.div`
  width: 130px;
  height: 25px;
  padding:10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: white;
  border-radius: 8px;
  margin: 10px;
`;


export const GreenBox = styled(BoxCard)`
  background-color: green;
`;

export const RedBox = styled(BoxCard)`
  background-color: red;
`;
