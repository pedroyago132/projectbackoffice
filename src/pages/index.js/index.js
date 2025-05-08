import * as React from 'react';
import { Container, Input, Title, Form,FormWrapper,SubTitle} from './styles';
import { useNavigate } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import TextField from '@mui/material/TextField';

const QRCode = () => {
    const [emailInput, setEmailInput] = React.useState(false);
    const [senhaInput, setSenha] = React.useState(false);
    const [state, setState] = React.useState({
        open: false,
        vertical: 'right',
        horizontal: 'center',
    });





    return (
    
            <Container>
                <FormWrapper>
                    <Title>Gerar QR Code ( 20 segundos )</Title>
                    <SubTitle>Habilite aqui seu WhatsApp Busniess</SubTitle>
                    <Form>
                        <Input type="text" placeholder="Nome" />
                        <Input type="email" placeholder="Email" />
                        <Input type="password" placeholder="Senha" />
                        <Button type="submit" variant='contained' >Gerar QR Code</Button>
                    </Form>
                </FormWrapper>
            </Container>
   
    );
}

export default QRCode

