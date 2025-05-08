import React, { useState } from "react";
import styled from "styled-components";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;
  gap:17px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const EmailInput = styled.input`
  padding: 10px;
  width: 300px;
  font-size: 16px;
  border: 2px solid #007bff;
  border-radius: 5px;
  outline: none;

  &:focus {
    border-color: #0056b3;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.p`
  margin-top: 10px;
  color: ${(props) => (props.error ? "red" : "green")};
`;

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage("Email de redefinição enviado com sucesso!");
      })
      .catch((error) => {
        setMessage(`Erro: ${error.message}`);
      });
  };

  return (
    <Container>
      <img src="security.png" style={{width:120,height:120}} alt="111" />
      <div style={{border:'1px solid black',width:500,borderRadius:15,padding:10,display:'flex',alignItems:'center',flexDirection:'column',justifyContent:'center'}} >

   
      <Title>Insira seu email</Title>
      <EmailInput
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <SubmitButton onClick={handleSubmit}>Enviar email de recuperação</SubmitButton>
      {message && <Message error={message.startsWith("Erro")}>{message}</Message>}
      </div>
    </Container>
  );
};

export default ChangePassword;
