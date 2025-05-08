import React from "react";
import styled from "styled-components";
import { backgroundColor } from "../../Globals/globals";
import Header from "../../components/Header";
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, set, onValue, getDatabase } from "firebase/database"; // Certifique-se de importar o Database corretamente
import { database } from '../../App';
import base64 from 'base-64';
import "firebase/database";




const SubscriptionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: ${backgroundColor};
  flex-direction:column;
`;

const SubscriptionBox = styled.div`
  background-color: white;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  border-radius: 15px; /* Bordas arredondadas */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Price = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const BigNumber = styled.span`
  font-size: 48px;
  font-weight: bold;
  color: #333;
`;

const SmallNumber = styled.span`
  font-size: 24px;
  vertical-align: super;
  color: #555;
`;

const BenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
  text-align: left;

  li {
    margin: 10px 0;
    font-size: 16px;
    color: #666;
  }
`;

const SubscribeButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

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
  background-color: red;
`;
const Payment = () => {
  const [user, setUser] = React.useState({ email: '123' })
  const [paymentLinks, setPaymentLinks] = React.useState([]);
  const [paymentState, setPaymentState] = React.useState({ assinatura: false });
  const [formData, setFormData] = React.useState({
    address: { country: 'br', city: 'brasilia', state: 'df', zip_code: '71901050' },
    birthdate: '02/10/1998',
    name: 'Pedro',
    email: 'pedroyago132@gmail.com',
    code: '12345',
    document: '123456789',
    document_type: 'cpf',
    type: 'individual',
    gender: 'male',
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        setUser(user)
        // ... const db = getDatabase()
   const db = getDatabase()
      const dbRef = ref(db, `${base64.encode(user.email)}/assinar`);
      onValue(dbRef, (snapshot) => {
       const data = snapshot.val();
    
      if(data){
       setPaymentState(data)
      }
      
  
     })
      } else {
        // User is signed out
        // ...
      }
    });
  }, [])


  const handleSubmit = async () => {
    const db = getDatabase();
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Basic sk_test_7fdc9c80292541db910c7a1b9abcec2c','utf-8')}`
      },
      body: JSON.stringify({
        card_number: '4111111111111111',
        card_holder_name: 'abc',
        card_expiration_date: '1225',
        card_cvv: '123',
      })
    };

    try {
      const res = await fetch('https://backend-nine-gamma-70.vercel.app/create-payment', options);
      const data = await res.json();
      console.log(data)

      // Configura dados no Realtime Database
      const databasePath = `${base64.encode(user.email)}/assinar`;
      await set(ref(db, databasePath), {
        id: data.id,
        assinatura: false
      }).then(log => {
        window.location.href = data.url;
      }).catch(error => console.log(error))



      // Redireciona para a página de pagamento




      if (!res.ok) {
        throw new Error(data.message || 'An error occurred');
      }


    } catch (err) {
      console.log(err)
    }
  };



  React.useEffect(() => {
   


  }, [paymentState])

  React.useEffect(() => {
    const db = getDatabase();
    if (!paymentState.assinatura) {
      if (paymentState.id) {
        const fetchPaymentLinks = async () => {
          try {
            const response = await fetch(`https://backend-nine-gamma-70.vercel.app/payment-link-status/${paymentState.id}`); // URL do backend

            if (!response.ok) {
              throw new Error('Erro ao buscar os links de pagamento');
            }

            const data = await response.json();
            console.log(data)
            setPaymentLinks(data)
            if (data.orders_paid > 0) {
              const databasePath = `${base64.encode(user.email)}/assinar`;
              await set(ref(db, databasePath), {
                id: data.id,
                assinatura: true
              }).then(log => {
                 console.log('Assinatura paga')
              }).catch(error => console.log(error))
            }

          } catch (err) {
            console.log(err)
            setPaymentLinks([]); // Limpa os dados anteriores em caso de erro
          }
        };
        fetchPaymentLinks()
      }
    }




  }, [paymentState])

   const RenderConnected = () => {
          if (paymentState.assinatura) {
              return (
                  <GreenBox>Assinatura Ativa</GreenBox>
              )
          } else {
              return (
                  <RedBox>Sem assianatura</RedBox>
              )
          }
      }

  return (
    <>
      <Header />
 
      <SubscriptionContainer>
      <RenderConnected />
        <div style={{ alignSelf: 'center', display: 'flex', width: '80%', gap: 20, alignItems: 'center', justifyContent: 'center' }} >
          <img src="laptop.png" style={{ width: 120, height: 120 }} alt="computer" />
          <img src="right-arrow.png" style={{ width: 80, height: 80 }} alt="arrow" />
          <img src="wpp.png" style={{ width: 120, height: 120 }} alt="wpp" />
        </div>
        <SubscriptionBox>
          <Price>
            R$<BigNumber>49</BigNumber><SmallNumber>,90</SmallNumber>/mês
          </Price>
          <h2>Benefícios da Assinatura</h2>
          <BenefitsList>
            <li>Gerenciamento de medicações fácil e prático</li>
            <li>Lembretes automáticos via WhatsApp</li>
            <li>Interface intuitiva para controle de horários</li>
            <li>Suporte especializado em gerenciamento de saúde</li>


          </BenefitsList>

          <SubscribeButton onClick={() => handleSubmit()} >Assinar Agora</SubscribeButton>
        </SubscriptionBox>



      </SubscriptionContainer>
    </>
  );
};

export default Payment;
