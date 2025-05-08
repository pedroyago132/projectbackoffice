import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, set,getDatabase } from "firebase/database"; // Certifique-se de importar o Database corretamente
import { database } from '../../App';
import base64 from 'base-64';
import "firebase/database";


const CustomForm = () => {
  const [formData, setFormData] = useState({
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

   const [user, setUser] = React.useState({ email: 'alo' });
   const [paymentLinks, setPaymentLinks] = React.useState([]);

  const [formDataCard, setFormDataCard] = useState({
    card_number: '4111111111111111',
    card_holder_name: 'abc',
    card_expiration_date: '1225',
    card_cvv: '123',
  });

  const handleChange = (field, value) => {
    if (field.includes('address.')) {
      const addressField = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

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
        const res = await fetch('http://localhost:4000/create-payment', options);
        const data = await res.json();
        console.log(data)
                 
                  // Configura dados no Realtime Database
                  const databasePath = `${base64.encode(user.email)}/assinar`;
               await set(ref(db, databasePath), {
                   id:data.id
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
      }, [console.log(user.email)])

      React.useEffect(() => {
        const fetchPaymentLinks = async () => {
            try {
              const response = await fetch('http://localhost:4000/list-links'); // URL do backend
      
              if (!response.ok) {
                throw new Error('Erro ao buscar os links de pagamento');
              }
      
              const data = await response.json();
              setPaymentLinks(data); // Armazena os links no estado
            } catch (err) {
        
              setPaymentLinks([]); // Limpa os dados anteriores em caso de erro
            } finally {
          
            }
          };

          fetchPaymentLinks()
    }, [console.log(paymentLinks)])
  

  return (
    <Box
      sx={{
        backgroundColor: '#1c1c1c',
        minHeight: '100vh',
        padding: '40px',
        color: '#fff',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Registro para Assinatura</h1>
      <Grid container spacing={3}>
        {/* Address Inputs */}
        <Grid item xs={12} md={3}>
          <TextField
            label="Country"
            value={formData.address.country}
            onChange={(e) => handleChange('address.country', e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: '#fff' } }}
            InputProps={{ style: { color: '#fff' } }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="City"
            value={formData.address.city}
            onChange={(e) => handleChange('address.city', e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: '#fff' } }}
            InputProps={{ style: { color: '#fff' } }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="State"
            value={formData.address.state}
            onChange={(e) => handleChange('address.state', e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: '#fff' } }}
            InputProps={{ style: { color: '#fff' } }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Zip Code"
            value={formData.address.zip_code}
            onChange={(e) => handleChange('address.zip_code', e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: '#fff' } }}
            InputProps={{ style: { color: '#fff' } }}
            variant="outlined"
          />
        </Grid>

        {/* Other Inputs */}
        {[
          { label: 'Birthdate', field: 'birthdate' },
          { label: 'Name', field: 'name' },
          { label: 'Email', field: 'email' },
          { label: 'Code', field: 'code' },
          { label: 'Document', field: 'document' },
          { label: 'Document Type', field: 'document_type' },
          { label: 'Type', field: 'type' },
          { label: 'Gender', field: 'gender' },
        ].map((input, index) => (
          <Grid item xs={12} md={3} key={index}>
            <TextField
              label={input.label}
              value={formData[input.field]}
              onChange={(e) => handleChange(input.field, e.target.value)}
              fullWidth
              InputLabelProps={{ style: { color: '#fff' } }}
              InputProps={{ style: { color: '#fff' } }}
              variant="outlined"
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: 'center', marginTop: '40px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ padding: '10px 20px', fontSize: '16px' }}
        >
          Enviar
        </Button>
      </Box>
    </Box>
  );
};

export default CustomForm;
