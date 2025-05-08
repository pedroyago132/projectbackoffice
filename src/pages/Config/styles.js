import styled from "styled-components";
import { colorButton,backgroundColor,backgroundMenu } from '../../Globals/globals';

// Container principal cobrindo toda a página
export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color:${backgroundColor};
`;

// Estilizando o formulário
export const FormContainer = styled.div`
  background-color: #ffffff; /* Fundo branco */
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 55%;
  display:flex;
  flex-direction:column;
  height:65%;
  gap:15px;
  align-items:center;
  justify-content:center;
   @media (max-width: 768px) { 
    width:95%;
    height:90%;
  }
`;

export const Title = styled.a`
color:black;
font-size:24px;
font-weight:bold;
`

export const TitleForm = styled.a`
color:black;
font-size:16px;
font-weight:600;
`

export const SubTitle = styled.a`
color:grey;
font-size:18px;
font-weight:500;
`
// Estilizando os campos de entrada
export const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

// Estilizando o botão
export const StyledButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;