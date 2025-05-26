import React from "react";
import { Body,Title,SubTitle } from "./styles";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { ref, set } from "firebase/database"; // Certifique-se de importar o Database corretamente
import base64 from "base-64"; // Certifique-se de ter a biblioteca base-64 instalada
import { useNavigate } from "react-router-dom";
import { CircularProgress, Button, Input, FormControl } from "@mui/material"; // Certifique-se de ter os componentes do Material-UI instalados
import "firebase/database";
import { database } from '../../App';

const Register = () => {
  const [cnpjInput, setCnpjInput] = React.useState("");
  const [razaoSocial, setRazaoSocial] = React.useState("");
  const [emailInput, setEmailInput] = React.useState("");
  const [senhaInput, setSenhaInput] = React.useState("");
  const [confirmarSenhaInput, setConfirmarSenhaInput] = React.useState("");
  const [contatoInput, setContatoInput] = React.useState("");
  const [progressive, setProgressive] = React.useState(false);

  const navigate = useNavigate();

  const RenderProgressive = () => {
    if (progressive) {
      return <CircularProgress size={37} />;
    } else {
      return (
        <Button
          style={{ marginTop: 10 }}
          variant="contained"
          onClick={register}
        >
          Cadastrar
        </Button>
      );
    }
  };

  async function register() {
    const auth = getAuth();
    setProgressive(true);

    try {
      // Verifica se os campos estão preenchidos e as senhas coincidem
      if (
        !emailInput ||
        senhaInput !== confirmarSenhaInput
      ) {
        setProgressive(false);
        window.alert("Complete os campos corretamente");
        return;
      }

      // Registra o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailInput,
        senhaInput
      );

      // Configura dados no Realtime Database
      const databasePath = `${base64.encode(emailInput)}/mensagens`;
      await set(ref(database, databasePath), {
        msgHorario: "",
        msgCadastro: "Olá tudo bom aqui é do(a) ESTABELECIMENTO, caso queira *Agendar Agora*, digite *1*, caso queira *Falar com Atendente* digite *2*",
      });

      const databaseInsertData = `${base64.encode(emailInput)}/isconnected`;
      await set(ref(database, databaseInsertData), {
        isConnected: 0,
        });

        const dataBaseInsertRelatorios = `${base64.encode(emailInput)}/relatorios`;
        await set(ref(database, dataBaseInsertRelatorios), {
          clientes: 0,
          clientesAtendidos:0,
          valorEmClientes:0,
          valorEmClientesAtendidos:0
          });

          const createEmailBase64 = `${base64.encode(emailInput)}`;
          await set(ref(database, createEmailBase64), {
           nameBase64:base64.encode(emailInput),
           name:razaoSocial
            });
  

      // Envia email de verificação
      const user = userCredential.user;
      await sendEmailVerification(user);

      window.alert(
        "Conta criada com sucesso! Verifique seu email para ativar a conta."
      );

      // Redireciona para a página de pagamento
      navigate("/");
    } catch (error) {
      console.error("Erro ao registrar:", error);
      window.alert("Erro ao registrar: " + error.message);
    } finally {
      setProgressive(false);
    }
  }

  return (
    <Body>
      <FormControl style={{gap:30}} >
        <Title>Crie agora sua conta em nossa plataforma</Title>
        <SubTitle>
          Você está há 1 passo para a fidelização dos seus clientes
        </SubTitle>

          
        <Input
          placeholder="Insira seu Email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />

      
               <Input
          placeholder="Telefone para contato (WhatsApp)"
          value={contatoInput}
          onChange={(e) => setContatoInput(e.target.value)}
        />
   
   <Input
          placeholder="Nome Estabelecimento"
          value={razaoSocial}
          onChange={(e) => setRazaoSocial(e.target.value)}
        />

        <Input
          placeholder="Senha"
          type="password"
          value={senhaInput}
          onChange={(e) => setSenhaInput(e.target.value)}
        />
        <Input
          placeholder="Confirme sua senha"
          type="password"
          value={confirmarSenhaInput}
          onChange={(e) => setConfirmarSenhaInput(e.target.value)}
        />

        <RenderProgressive />
      </FormControl>
    </Body>
  );
};

export default Register;
