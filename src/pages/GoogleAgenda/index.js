import * as React from 'react';
import { PageContainer, SubTitle, FormContainer, Title, TitleForm } from './styles';
import { useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code";
import { getDatabase, ref, child, push, update, get } from "firebase/database";
import Button from '@mui/material/Button';
import "firebase/database";
import TextField from '@mui/material/TextField';
import Header from '../../components/Header';
import base64 from 'base-64';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const GoogleAgenda = () => {
    const navigate = useNavigate()
    const [user, setUser] = React.useState({ email: 'alo' });
    const [agenda, setAgenda] = React.useState('');
    const [msgCadastro, setMsgCadastro] = React.useState('');
    const [qrCode, setQRCode] = React.useState(false);

    const [userData, setUserData] = React.useState({ msgCadastro: '', msgHorario: '' });

    React.useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                setUser(user)
                // ...
            } else {
                // User is signed out
                // ...
            }
        });
    }, [])




    React.useEffect(() => {
        if (user) {
            const dbRef = ref(getDatabase());
            get(child(dbRef, `${base64.encode(user.email)}/mensagens`)).then((snapshot) => {
                if (snapshot.exists()) {
                    setUserData(snapshot.val())
                    console.log(userData)
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
        }

    }, [user]); // Atualiza sempre que 'items' mudar

    function writeNewPost() {
        const email64 = base64.encode(user.email)
        const db = getDatabase();

        if (userData.msgCadastro != msgCadastro && msgCadastro != '') {
            const postData = {
                msgCadastro: msgCadastro,
                msgHorario: userData.msgHorario,
            };

            const updates = {};
            updates[email64 + '/mensagens'] = postData;

            return update(ref(db), updates).then(log => {
                window.alert('Alterado com sucesso!!')
                navigate('/measure')

            }).catch(log => console.log('ERROREDITUSER:::::', log))

        }
       
        if (userData.msgHorario != msgHorario && msgHorario != '') {
            const postData = {
                msgCadastro: userData.msgCadastro,
                msgHorario: msgHorario,
            };

            const updates = {};
            updates[email64 + '/mensagens'] = postData;

            return update(ref(db), updates).then(log => window.alert('Alterado com sucesso!!')).catch(log => console.log('ERROREDITUSER:::::', log))

        }
    }

    async function connectAccount() {
        const body = {

        }
     try {
       const response = await fetch(`https://backproject.vercel.app/auth/google`, {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json', // Define que o conteúdo do corpo é JSON
         },
    
       });
   
       // Verifica se a resposta está OK
       if (!response.ok) {
         throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
       }
   
       const result = await response.json(); // Aguarda a conversão para JSON
       console.log('Success:', result);
   
       return result; // Retorna o resultado, se necessário
     } catch (error) {
       console.error('Error:', error);
       throw error; // Relança o erro, se você quiser tratá-lo fora dessa função
     }
   }

    return (
        <>
            <Header />
            <PageContainer>
                <FormContainer>

                    <Title>Conecte sua Agenda do Google</Title>
                    <SubTitle>Google Calendar API</SubTitle>
            
                    <TextField
                        id={`outlined-basic`}
                        label={`ID da sua Agenda`}
                        fullWidth
                        variant="outlined"
                        onChange={(text) =>
                            setAgenda(
                                text.target.value
                            )
                        }
                        value={agenda}
                    />

                    <Button id='Button-id' fullWidth variant='outlined' style={{backgroundColor:'#0073b1',color:'white'}} onClick={() => connectAccount()} >Conectar Conta Google</Button>

                </FormContainer>
            </PageContainer>
        </>
    );
}

export default GoogleAgenda;

