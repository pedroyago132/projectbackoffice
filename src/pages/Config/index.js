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


const Configuracao = () => {
    const navigate = useNavigate()
    const [user, setUser] = React.useState({ email: 'alo' });
    const [msgHorario, setMsgHorario] = React.useState('');
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


    return (
        <>
            <Header />
            <PageContainer>
                <FormContainer>

                    <Title>Aqui você pode alterar dados do seu sistema</Title>
                    <SubTitle>Edite suas mensagens que serão enviadas aos clientes</SubTitle>
                    <TitleForm>Enviado para cadastro de clientes:</TitleForm>
                    <TextField
                        id={`outlined-basic`}
                        label={`Mensagem de cadastro`}
                        fullWidth
                        variant="outlined"
                        onChange={(text) =>
                            setMsgCadastro(
                                text.target.value
                            )
                        }
                        value={msgCadastro}
                    />

                    <SubTitle>Mensagem Escolhida: {userData.msgCadastro}</SubTitle>


                    <TitleForm>Enviado ,:</TitleForm>
                    <TextField
                        id={`outlined-basic`}
                        label={`Mensagem de lembrete - Horários`}
                        fullWidth
                        variant="outlined"
                        onChange={(text) =>
                            setMsgHorario(
                                text.target.value
                            )
                        }
                        value={msgHorario}
                    />

                    <SubTitle>Mensagem Escolhida: {userData.msgHorario}</SubTitle>


                    <Button id='Button-id' fullWidth variant='outlined' onClick={() => writeNewPost()} >Salvar</Button>



                </FormContainer>
            </PageContainer>
        </>
    );
}

export default Configuracao;

