import * as React from 'react';
import { PageContainer, SubTitle, FormContainer, Title, TitleForm, RedBox, GreenBox } from './styles';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from "react-qr-code";
import { getDatabase, ref, child, push, update, get, onValue, set } from "firebase/database";
import Button from '@mui/material/Button';
import "firebase/database";
import TextField from '@mui/material/TextField';
import Header from '../../components/Header';
import base64 from 'base-64';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { callBackOAuth, refreshToken } from '../../services';
import { getItem } from '../../storage/serviceState';



const GoogleAgenda = () => {
    const navigate = useNavigate()
    const [agenda, setAgenda] = React.useState('');
    const [idSalvo, setIdSalvo] = React.useState('');
    const [tokena, settokena] = React.useState("ya29.a0AW4XtxgG4ZHKTNbW1EJgTcN5HZpxl0K65JdIiIbrF57MQ_m8YdIQbUVRCcZNxWRUJqZ4D8WmS9xSEH118WqNq8FgTFn7snhfIp_Ol6Bcretc5DbORO4QrbCCL5aIcniHhDSz6a2RDpOxxwkwi9u2YIOoo59BWQNYNx_cq73maCgYKAXwSARQSFQHGX2MimU8ee4ve4pYzklu0VtaJmA0175");


    const [successId, setSuccesId] = React.useState(false);
    const [gatilho, setGatilho] = React.useState(false);

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('code');
    const user = getItem('user')
    const db = getDatabase();
    console.log('user', user)

    React.useEffect(() => {
        const database = ref(db, `${base64.encode(user.email)}`);

        onValue(database, (snapshot) => {
            setIdSalvo(snapshot.val())
        });
    }, [])




    function GetTokensRefresh() {
        if (accessToken && !gatilho) {

            const body = {
                code: accessToken,
                userId: base64.encode(user.email)
            }
            console.log(body)
            callBackOAuth(body).then(success => settokena(success)).catch(err => console.log(err))
            setGatilho(true)

        }


    }


    async function revokeAccess() {
        if (idSalvo.tokens?.access_token) {
            try {
                const body = {
                    userId: `${base64.encode(user.email)}`
                }
               const responseRefresh = await refreshToken(body)

               if (responseRefresh) {
                    const accessToken = responseRefresh.access_token
                    const revokeTokenEndpoint = 'https://oauth2.googleapis.com/revoke';

                    // Criando um formulário programaticamente
                    const formData = new FormData();
                    formData.append('token', accessToken );

                    // Fazendo a requisição POST usando fetch
                    fetch(revokeTokenEndpoint, {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Falha ao revogar o token');
                            }
                            const body = {
                                access_token: '',
                                refresh_token: '',
                                expires_at: null, // Adicione isso para limpar o timestamp de expiração
                                token_type: null
                            };

                            update(ref(db, `${base64.encode(user.email)}/tokens`), body)
                                .then(() => window.alert('Desconexão feita com sucesso'))
                                .catch(err => console.error('Erro ao revogar token:', err))

                        }).catch(err => console.log(err))

              }
            } catch (err) {
                console.log(err)
            }
        }
    }





    const cadastrarEmail = () => {
        const db = getDatabase();
        set(ref(db, `${base64.encode(user.email)}/googleAgenda`), {
            idAgenda: agenda
        }).then(() => setSuccesId(true))
    }

    const RenderConnected = () => {
        if (idSalvo.tokens?.refresh_token) {
            return (
                <GreenBox>Conectado</GreenBox>
            )
        } else {
            return (
                <RedBox>Desconectado</RedBox>
            )
        }
    }



    const oauthSignIn = async () => {
        const params = {
            client_id: '450312285360-7ph6jle92fp2kv1dsuo1h2pde6ld7sdt.apps.googleusercontent.com',
            redirect_uri: 'https://projectbackoffice.vercel.app/google', // Deve ser registrado no Google Cloud Console
            response_type: 'code',
            scope: 'https://www.googleapis.com/auth/calendar.events.owned',
            include_granted_scopes: 'true',
            access_type: 'offline', // Isso é crucial para obter refresh token
        };

        // Construir URL de autenticação
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        Object.keys(params).forEach(key => authUrl.searchParams.append(key, params[key]));

        try {
            // Redirecionar para a página de autenticação do Google
            window.location.href = authUrl.toString();

            // Após o redirecionamento, você precisará capturar o token na URL de retorno
            // Isso normalmente é feito em um componente de rota (como /oauth2callback)
        } catch (error) {
            console.error('Erro na autenticação OAuth:', error);
        }
    }

    return (
        <>
            <GetTokensRefresh />
            <Header />
            <PageContainer>

                <FormContainer>
                    <RenderConnected />
                    <Title>Conecte sua Agenda do Google</Title>
                    <SubTitle>Google Calendar API</SubTitle>


                    <Button id='Button-id' fullWidth variant='outlined' style={{ backgroundColor: '#0073b1', color: 'white' }} onClick={() => oauthSignIn()} >Conectar Conta Google</Button>
                    <Button id='Button-id' fullWidth variant='outlined' style={{ backgroundColor: 'red', color: 'white' }} onClick={() => revokeAccess()} >Remover Conexão</Button>


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

                    <Button id='Button-id' fullWidth variant='outlined' style={{ backgroundColor: '#0073b1', color: 'white' }} onClick={() => cadastrarEmail()} >Salvar ID Google Agenda</Button>
                    <SubTitle>Normalmente é seu email da conta do Google Agenda</SubTitle>
                    {
                        successId && (<><SubTitle style={{ color: 'green' }}>ID Salvo com sucesso</SubTitle> - </>)
                    }
                    ID Atual:{idSalvo?.googleAgenda?.idAgenda}
                </FormContainer>
            </PageContainer>
        </>
    );
}

export default GoogleAgenda;

