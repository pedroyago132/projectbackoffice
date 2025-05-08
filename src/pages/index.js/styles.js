import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #e5e4e4; /* Fundo cinza bem claro */
`;

export const FormWrapper = styled.div`
  background-color: #ffffff; /* Fundo mais claro para o formulário */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombras suaves */
  padding: 20px;
  width: 400px;
  align-items:center;
  display:flex;
  flex-direction:column;
`;
export const SubTitle = styled.a`
color: black;
font-size: 17px;
font-weight: 400;
`


export const Title = styled.h1`
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`;

export const Button = styled.button`
  padding: 10px;
  background-color: #4caf50;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;