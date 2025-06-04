import React, { useState } from 'react';
import styled, { createGlobalStyle }  from 'styled-components';
import axios from 'axios';
import Header from '../../components/Header'
import { callBackOAuth, refreshToken } from '../../services';
import { getItem } from '../../storage/serviceState';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDatabase, ref, child, push, update, get, onValue, set } from "firebase/database";
import base64 from 'base-64';


const GenerateVideo = () => {
    const [productImage, setProductImage] = useState(null);
    const [logo, setLogo] = useState(null);
    const [operationName, setOperationName] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [agenda, setAgenda] = React.useState('');
    const [idSalvo, setIdSalvo] = React.useState('');
    const [tokena, settokena] = React.useState("ya29.a0AW4XtxgG4ZHKTNbW1EJgTcN5HZpxl0K65JdIiIbrF57MQ_m8YdIQbUVRCcZNxWRUJqZ4D8WmS9xSEH118WqNq8FgTFn7snhfIp_Ol6Bcretc5DbORO4QrbCCL5aIcniHhDSz6a2RDpOxxwkwi9u2YIOoo59BWQNYNx_cq73maCgYKAXwSARQSFQHGX2MimU8ee4ve4pYzklu0VtaJmA0175");
 const [imageFile, setImageFile] = useState(null);
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [durationSeconds, setDurationSeconds] = useState(8);
    const [personGeneration, setPersonGeneration] = useState('allow_adult');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [videoUri, setVideoUri] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [successId, setSuccesId] = React.useState(false);
    const [gatilho, setGatilho] = React.useState(false);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (type === 'product') {
            setProductImage(file);
        } else {
            setLogo(file);
        }
    };

       const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage({ type: 'info', text: 'Iniciando a geração do vídeo... Isso pode levar alguns minutos.' });
        setVideoUri(''); // Limpa o vídeo anterior
        setIsLoading(true);

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('aspectRatio', aspectRatio);
        formData.append('durationSeconds', durationSeconds);
        formData.append('personGeneration', personGeneration);

        try {
            const response = await fetch('http://localhost:3030/generate-video/from-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            setMessage({ type: 'success', text: `Vídeo gerado com sucesso! ${data.message}` });
            setVideoUri(data.videoUri);
        } catch (error) {
            console.error('Erro ao gerar vídeo:', error);
            setMessage({ type: 'error', text: `Erro ao gerar vídeo: ${error.message}. Por favor, tente novamente.` });
        } finally {
            setIsLoading(false);
        }
    };


    const generateVideo = async () => {
        if (!productImage || !logo) {
            setError('Por favor, selecione a imagem do produto e a logo');
            return;
        }

        setLoading(true);
        setError(null);
        setProgress(0);

        const formData = new FormData();
        formData.append('productImage', productImage);
        formData.append('logo', logo);

        try {
            const response = await axios.post('http://localhost:3030/generate-video', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 98) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });
            console.log('RESPONSEVIDEO:::',response)

            setOperationName(response.data.operationName);
            setVideoUri(response.data.videoOutputUri);
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao gerar vídeo');
            setLoading(false);
        }
    };

    const checkOperationStatus = async () => {
            const accessToken = idSalvo.tokens.access_token;
            const operationId = 'c8adcf22-e144-4b2d-b2eb-3dd7ae259a30'
        const body = {
            token:accessToken,
            operationName:operationName
         }

   try {
    const response = await fetch(`http://localhost:3030/check-operation/${operationId}`, {
      method: 'GET',
    });

       const data = await response.json(); // Chamando a função json()
       console.log(data)


    console.log('DATAREFRESH:::::',data)

    return await data
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
    
    };

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
                        userId: base64.encode(user.email)
                    }
                    const responseRefresh = await refreshToken(body)
    
                    if (responseRefresh) {
                        const accessToken = responseRefresh.access_token
                        const revokeTokenEndpoint = 'https://oauth2.googleapis.com/revoke';
    
                        // Criando um formulário programaticamente
                        const formData = new FormData();
                        formData.append('token', accessToken);
    
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
                redirect_uri: 'http://localhost:3000/gerar', // Deve ser registrado no Google Cloud Console
                response_type: 'code',
                scope: 'https://www.googleapis.com/auth/cloud-platform',
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
        <Header />
       
     

            <Container>
                <Title>Gerar Vídeo Apresentação de Produto (8 segundos)</Title>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="imageFile">Selecione uma Imagem:</Label>
                        <InputFile
                            type="file"
                            id="imageFile"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="aspectRatio">Proporção do Vídeo:</Label>
                        <Select
                            id="aspectRatio"
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            required
                        >
                            <option value="16:9">16:9 (Paisagem)</option>
                            <option value="9:16">9:16 (Retrato)</option>
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="durationSeconds">Duração do Vídeo (segundos):</Label>
                        <NumberInput
                            type="number"
                            id="durationSeconds"
                            value={durationSeconds}
                            onChange={(e) => setDurationSeconds(e.target.value)}
                            min="5"
                            max="8"
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="personGeneration">Geração de Pessoas:</Label>
                        <Select
                            id="personGeneration"
                            value={personGeneration}
                            onChange={(e) => setPersonGeneration(e.target.value)}
                            required
                        >
                            <option value="allow_adult">Permitir adultos</option>
                            <option value="dont_allow">Não permitir pessoas</option>
                        </Select>
                    </FormGroup>

                    <Button type="submit" disabled={!imageFile || isLoading}>
                        {isLoading ? 'Gerando Vídeo...' : 'Gerar Vídeo'}
                    </Button>
                </Form>

                {message.text && (
                    <MessageBox className={message.type}>
                        {message.text}
                    </MessageBox>
                )}

                {isLoading && <LoadingIndicator>Aguardando a conclusão da geração do vídeo...</LoadingIndicator>}

                {videoUri && (
                    <VideoPlayer>
                        <h3>Vídeo Gerado:</h3>
                        <Video controls src={videoUri} type="video/mp4">
                            Seu navegador não suporta a tag de vídeo.
                        </Video>
                        <p>
                            <a href={videoUri} target="_blank" rel="noopener noreferrer">Abrir vídeo em nova aba</a>
                        </p>
                    </VideoPlayer>
                )}
            </Container>
        </>
        
    );
};


// Container principal
const Container = styled.div`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 550px;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.2em;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FormGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #4a4a4a;
  font-size: 1.05em;
`;

const InputFile = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #c0c0c0;
  border-radius: 8px;
  font-size: 1em;
  box-sizing: border-box;
  background-color: #f9f9f9;
  cursor: pointer;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #c0c0c0;
  border-radius: 8px;
  font-size: 1em;
  box-sizing: border-box;
  background-color: #f9f9f9;
  appearance: none; /* Remove default arrow */
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%00-13.6-6.4H18.9c-5%200-9.6%202.4-13.6%206.4-8%208-8%2020.8%200%2028.8l128%20128c4.8%204.8%2011.2%207.2%2017.6%207.2s12.8-2.4%2017.6-7.2l128-128c8-8%208-20.8%200-28.8z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 12px top 50%;
  background-size: 12px;
  cursor: pointer;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
`;

const NumberInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #c0c0c0;
  border-radius: 8px;
  font-size: 1em;
  box-sizing: border-box;
  background-color: #f9f9f9;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button`
  background-color: #28a745;
  color: white;
  padding: 15px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2em;
  font-weight: 600;
  margin-top: 25px;
  width: 100%;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #218838;
    transform: translateY(-2px);
  }
  &:disabled {
    background-color: #a0d4a0;
    cursor: not-allowed;
  }
`;

const MessageBox = styled.div`
  margin-top: 25px;
  padding: 15px;
  border-radius: 8px;
  text-align: left;
  word-break: break-all;
  font-size: 0.95em;
  line-height: 1.5;
  font-weight: 500;

  &.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  &.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  &.info {
    background-color: #e2e3e5;
    color: #383d41;
    border: 1px solid #d6d8db;
  }
`;

const VideoPlayer = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const Video = styled.video`
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  background-color: #000; /* Fallback for loading */
`;

const LoadingIndicator = styled.div`
  margin-top: 20px;
  font-size: 1.1em;
  color: #007bff;
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
  background-color: grey;
`;


export default GenerateVideo;