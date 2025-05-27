import * as React from 'react';
import { PageContainer, SubTitle, FormContainer, Title } from './styles';
import { useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code";
import Button from '@mui/material/Button';
import "firebase/database";
import { dataInstance, lerQRCode, listingInstances, dataDisconnectedInstance } from '../../services';
import Header from '../../components/Header';
import styled from 'styled-components';
import base64 from 'base-64';
import { get, getDatabase, ref, set, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const QRCodePage = () => {
    const navigate = useNavigate()
    const [connected, setConnected] = React.useState(false);
    const [qrCode, setQRCode] = React.useState(false);
    const [revalidate, setRevalidate] = React.useState(false);
    const [user, setUser] = React.useState('');
    const [checkUserToken, setCheckUserToken] = React.useState('');
    const db = getDatabase();

    const BoxCard = styled.div`
  width: 180px;
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

    const GreenBox = styled(BoxCard)`
  background-color: green;
`;

    const RedBox = styled(BoxCard)`
  background-color: grey;
`;

    const localTokens = [
        {
            instance: "3E1C913EE76B50205B962ED5B439CBB7",
            token: "0F76F73AD4B03EBDBCCDC20F"
        },
        {
            instance: "3E1Cjhgjhgfj5B9gdfgfd62ED5B439CBB7",
            token: "hjfghfghgf3EBDBCgfdCDC20F"
        },

    ];

    React.useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
                get(ref(db, `${base64.encode(user.email)}/tokenZAPI`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        setCheckUserToken(data);
                    }
                }).catch(console.error);
            }
        }
        )
        // Exemplo de uso
        ap()
    }, [])


    const RenderConnected = () => {
        if (connected) {
            return (
                <GreenBox>Conectado</GreenBox>
            )
        } else {
            return (
                <RedBox>Desconectado</RedBox>
            )
        }
    }

    async function verifyLocalTokens() {
        try {
            // 1. Buscar todos os usuários no banco
            const usersRef = ref(db, '/');
            const snapshot = await get(usersRef);
            const users = snapshot.val()

            // 2. Verificar correspondências
            const verificationResults = localTokens.map(localToken => {
                let matchedUser = null;

                // Procurar em cada usuário
                Object.entries(users).forEach(([userId, userData]) => {
                    if (userData.tokenZAPI &&
                        userData.tokenZAPI.instance === localToken.instance &&
                        userData.tokenZAPI.token === localToken.token) {
                        matchedUser = userId;
                    }
                });

                return {
                    ...localToken,
                    existsInDB: !!matchedUser,
                    userId: matchedUser || null
                };
            });

            return verificationResults;

        } catch (error) {
            console.error("Erro na verificação:", error);
            return [];
        }
    }


    async function ap() {
        const results = await verifyLocalTokens()
        console.log('RESULTSTOKENS::::::::::::', results)
    }






    const RenderQR = () => {
        if (!qrCode) {
            return (
                <SubTitle>Necessário para envio automático de mensagens, Você terá 20 segundos para ler seu QRCode</SubTitle>
            )
        } else {
            return (
                <QRCode
                    size={256}
                    style={{ height: '85%', maxWidth: "100%", width: "80%", padding: 17 }}
                    value={qrCode.value}
                    viewBox={`0 0 256 256`}
                />
            )
        }
    }

    async function GerarQRCode() {
        if (!checkUserToken.token) {
            const checkTokenNotExists = await verifyLocalTokens();
            if (checkTokenNotExists) {
                const tokenListNotUsed = checkTokenNotExists.find(tokenObject => tokenObject.existsInDB == false)
                console.log('TOKENLISTNOTUSED:::::', tokenListNotUsed)
                try {
                    await set(ref(db, `${base64.encode(user.email)}/tokenZAPI`), {
                        token: tokenListNotUsed.token,
                        instance: tokenListNotUsed.instance,
                        userEmail: user.email
                    })
                    await QRcode({ token: tokenListNotUsed.token, instance: tokenListNotUsed.instance })
                    console.log('DSHUIDHUISA::::::::', { token: tokenListNotUsed[0].token, instance: tokenListNotUsed[0].instance })
                } catch (error) {
                    console.error('TRYCAYCHERROR:::::QRCODE:::', error); // Lida com erros
                }
            }

        }
    }

    async function QRcode({ token, instance }) {
        try {
            if (connected) {
                window.alert('Celular Conectado')
            } else {
                const idi = instance;
                const tokeni = token;
                const response = await lerQRCode(idi, tokeni)
                setQRCode(response); // Atualiza o estado ou faz o que for necessário com o QR Code
                console.log('RSPONEVALUE::::::', response); // Imprime o resultado

            }


        } catch (erro) {
            console.log(erro)
        }


    }


    async function dataInstanceValue() {
        const idi = checkUserToken.instance;
        const tokeni = checkUserToken.token;

        try {
            const response = await dataInstance(idi, tokeni); // Aguarda a função retornar o resultado
            if (response.connected) {

                setConnected(true)
                window.alert('Celular Conectado')

            } else {
                return null
            }
        } catch (error) {
            console.error('TRYCAYCHERROR:::::QRCODE:::', error); // Lida com erros
        }
    }

    async function disconnectedInstance() {
        if (!checkUserToken.token) {
            const idi = checkUserToken?.instance;
            const tokeni = checkUserToken?.token;

            try {
                const response = await dataDisconnectedInstance(idi, tokeni); // Aguarda a função retornar o resultado
                if (response) {

                    window.alert('Celular Desconectado')
                    setRevalidate(true)

                } else {
                    return null
                }
            } catch (error) {
                console.error('TRYCAYCHERROR:::::QRCODE:::', error); // Lida com erros
            }
        }

    }


    React.useEffect(() => {
        dataInstanceValue();
    }, [checkUserToken])

    console.log(checkUserToken.token)

    return (
        <>
            <Header />
            <PageContainer>
                <FormContainer>
                    <RenderConnected />

                    <Title>Gere seu QRCode WhatsApp</Title>
                    <Title>Para se conectar a automação</Title>
                    <Title>Você terá 20 segundos para ler seu QRCode</Title>

                    <RenderQR />
                    <Button id='Button-id' fullWidth variant='contained' onClick={() => GerarQRCode()}>Gerar QRCode ( gerar de novo )</Button>

                    <Button id='Button-id' style={{ backgroundColor: 'red' }} fullWidth variant='contained' onClick={() => disconnectedInstance()}>Desconectar Número</Button>

                </FormContainer>
            </PageContainer>
        </>
    );
}

export default QRCodePage;

