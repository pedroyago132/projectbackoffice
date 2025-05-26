import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, child, get, update, set } from 'firebase/database';
import base64 from 'base-64';
import styled from "styled-components";
import { colorButton, backgroundColor, backgroundMenu } from '../../Globals/globals';
import Header from '../../components/Header';
import { Typography } from '@mui/material';

// Componentes estilizados
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${backgroundColor};
`;

const FormContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 55%;
  display: flex;
  flex-direction: column;
  height: 65%;
  gap: 15px;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) { 
    width: 95%;
    height: 90%;
  }
`;

const Title = styled.a`
  color: black;
  font-size: 24px;
  font-weight: bold;
`;

const TitleForm = styled.a`
  color: black;
  font-size: 16px;
  font-weight: 600;
`;

const SubTitle = styled.a`
  color: grey;
  font-size: 18px;
  font-weight: 500;
`;

const TextField = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${colorButton};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const RemoveButton = styled(Button)`
  background-color: #f44336;
  width: auto;
  padding: 0 15px;
  height: 48px;
  margin-left: 8px;

  &:hover {
    background-color: #d32f2f;
  }
`;

const AddButton = styled(Button)`
  background-color: #4CAF50;
  width: auto;
  padding: 0 15px;
  height: 48px;
  margin-left: 8px;

  &:hover {
    background-color: #388E3C;
  }
`;

const PerguntaContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 16px;
`;

const Configuracao = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState({ email: 'alo' });
    const [qrCode, setQRCode] = React.useState(false);
    const [perguntas, setPerguntas] = React.useState([]);
    const [novaPergunta, setNovaPergunta] = React.useState('');
    const [sobre, setSobre] = React.useState('');
    const db = getDatabase();


    React.useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                if (user?.email) {
                    const dbRef = ref(getDatabase());
                    get(child(dbRef, `${base64.encode(user.email)}/perguntas`)).then((snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            setPerguntas(data);

                        }
                    }).catch(console.error);
                }
            }
        })
    }, []);


    function writeNewPost() {
        const email64 = base64.encode(user.email);
        const updates = {};
  

        updates[email64 + '/perguntas'] = perguntas;
        if (perguntas) {
            console.log('PASOUUUUUUUUUUUUUU')
            return set(ref(db, `${email64}/perguntas`), perguntas)
                .then(() => {
                    window.alert('Configurações salvas com sucesso!');
                    navigate('/measure');
                })
                .catch(error => console.log('Erro ao salvar:', error));
        }


    }

    const handlePerguntaChange = (id, texto) => {
        setPerguntas(prev =>
            prev.map(pergunta =>
                pergunta.id === id ? { ...pergunta, texto } : pergunta
            )
        );
    };

    const adicionarPergunta = () => {
        if (novaPergunta.trim() !== '') {
            const novoId = perguntas.length > 0 ? Math.max(...perguntas.map(p => p.id)) + 1 : 1;
            setPerguntas(prev => [...Object.entries(prev), { id: novoId, texto: novaPergunta }]);
            setNovaPergunta('');
        }
    };

    const removerPergunta = (id) => {
        if (perguntas.length >= 0) {
            const updates = {}
            setPerguntas(prev => prev.filter(pergunta => pergunta.id !== id));
        }

    };

    console.log('PERGUNTASSS::::', perguntas)
    return (
        <>
            <Header />
            <PageContainer>
                <FormContainer>
                    <Title>Configuração de Mensagens e Perguntas</Title>
                    <SubTitle>Personalize as mensagens enviadas aos seus clientes</SubTitle>

                    <TitleForm>Perguntas Personalizadas:</TitleForm>
                    {perguntas.map((pergunta, index) => (
                        <PerguntaContainer key={index}>
                            <TextField
                                disabled
                                type="text"
                                placeholder={`${pergunta.texto}`}
                                value={pergunta.texto}
                                onChange={(e) => handlePerguntaChange(pergunta.id, e.target.value)}
                            />
                            <RemoveButton onClick={() => removerPergunta(pergunta.id)}>
                                Remover
                            </RemoveButton>
                        </PerguntaContainer>
                    ))}

                    <PerguntaContainer>
                        <Typography style={{ color: "black", fontWeight: 'bold' }} >Pergunta ao usuário:</Typography>
                        <TextField
                            type="text"
                            placeholder="Digite uma nova pergunta"
                            value={novaPergunta}
                            onChange={(e) => setNovaPergunta(e.target.value)}
                        />
                        <AddButton onClick={adicionarPergunta}>
                            Adicionar
                        </AddButton>
                    </PerguntaContainer>

                    <Button style={{ backgroundColor: '#0073b1' }} onClick={writeNewPost}>
                        Salvar Todas as perguntas
                    </Button>

                    <PerguntaContainer>
                        <Typography style={{ color: "black", fontWeight: 'bold' }} >Descrição da empresa:</Typography>
                        <TextField
                            type="text"
                            placeholder="Sobre a empresa"
                            value={sobre}
                            onChange={(e) => setSobre(e.target.value)}
                        />
                    </PerguntaContainer>

                    <Button style={{ backgroundColor: '#0073b1' }} onClick={writeNewPost}>
                        Salvar Descrição "Sobre a empresa"
                    </Button>
                </FormContainer>
            </PageContainer>
        </>
    );
};

export default Configuracao;