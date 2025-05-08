import * as React from 'react';
import { PageContainer, SubTitle, FormContainer, Title } from './styles';
import { useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code";
import Button from '@mui/material/Button';
import "firebase/database";
import { dataInstance, lerQRCode, listingInstances,dataDisconnectedInstance } from '../../services';
import Header from '../../components/Header';
import styled from 'styled-components';
import Box from '@mui/material/Box';

const QRCodePage = () => {
    const navigate = useNavigate()
    const [connected, setConnected] = React.useState(false);
    const [qrCode, setQRCode] = React.useState(false);
    const [revalidate, setRevalidate] = React.useState(false);

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
        if (connected) {
            window.alert('Celular Conectado')
        } else {
            const idi = '3E019F6A2AD3400FBE778E66062CE0C1';
            const tokeni = '0F4CC44688C0009373197BB4';

            try {
                const response = await lerQRCode(idi, tokeni); // Aguarda a função retornar o resultado
                setQRCode(response); // Atualiza o estado ou faz o que for necessário com o QR Code
                console.log('RSPONEVALUE::::::', response); // Imprime o resultado
            } catch (error) {
                console.error('TRYCAYCHERROR:::::QRCODE:::', error); // Lida com erros
            }
        }

    }

    async function listingInstacesValue() {
        const idi = '3E019F6A2AD3400FBE778E66062CE0C1';
        const tokeni = '0F4CC44688C0009373197BB4';

        try {
            const response = await listingInstances(); // Aguarda a função retornar o resultado
            console.log('RSPONSEINSATNCEESS::::::', response); // Imprime o resultado
        } catch (error) {
            console.error('TRYCAYCHERROR:::::QRCODE:::', error); // Lida com erros
        }
    }

    async function dataInstanceValue() {
        const idi = '3E019F6A2AD3400FBE778E66062CE0C1';
        const tokeni = '0F4CC44688C0009373197BB4';

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
        const idi = '3E019F6A2AD3400FBE778E66062CE0C1';
        const tokeni = '0F4CC44688C0009373197BB4';

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


    React.useEffect(() => {
        dataInstanceValue();
    }, [connected,revalidate])

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

