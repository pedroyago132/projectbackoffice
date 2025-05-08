import * as React from 'react';
import { Input } from './styles';
import { getDatabase, ref, set, get, child, onValue, update } from "firebase/database";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { sendMessageAll, setNewClient } from '../../services';
import base64 from 'base-64';
import "firebase/database";
import { dataInstance } from '../../services';
import styled from 'styled-components';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";
import { CircularProgress } from "@mui/material"; // Certifique-se de ter os componentes do Material-UI instalados
import "firebase/database";
import { database } from '../../App';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const RegisterClient = () => {
    const navigate = useNavigate()
    const [datarow, setDataRow] = React.useState(false);
    const [messageAll, setMessageAll] = React.useState('');
    const [nomeInput, setNomeInput] = React.useState('');
    const [wppInput, setWppInput] = React.useState('');
    const [funcaoinput, setfuncaoinput] = React.useState([{ remedio: '', horario: [], doses: 0, foto: "", valor: '' }]);
    const [cpfInput, setCpfInput] = React.useState('');
    const [usoContinuo, setUsoContinuo] = React.useState('');
    const [receita, setReceita] = React.useState('');
    const [dataClientes, setDataClientes] = React.useState([]);
    const [time, setTime] = React.useState('');
    const [date, setDate] = React.useState('');
    const [filteredData, setFilteredData] = React.useState([]);
    const [filterValue, setFilterValue] = React.useState('');
    const [user, setUser] = React.useState({ email: 'alo' });
    const [clientForTime, setClientforTime] = React.useState([{ clientes: [] }]);
    const [connectednumber, setConnectedNumber] = React.useState(false);
    const [userData, setUserData] = React.useState('');
    const [inputUsocontinuo, setInputUsoContinuo] = React.useState('Sua medicação esta acabando lembre-se de comprar');
    const [inputReceita, setInputReceita] = React.useState('Sua medicaçãoe sta vencendo precisa de nova receia?');
    const [progress, setProgress] = React.useState(false);
    const [relatorio, setRelatorio] = React.useState(false);
    const [images, setImages] = React.useState([])
    const [valorMedicamento, setValorMedicamento] = React.useState(false);
    const listRef = React.useRef(null);

    const isMobile = useMediaQuery('(max-width:600px)');

    const buttonStyles = {
        marginBottom: 25,
        paddingTop: 7,
        width: isMobile ? '100%' : '60%',
    };

    const InputText = styled.input`
color: black;
font-size: 14px;
font-weight: 400;
width:100%;
height:40px;
border-color:#d9ded8;
border-radius:10px;
padding:7px;
background-color:white;
font-weight:bold;
border: 1px solid grey;
margin:5px;
margin-top:10px;

     @media (max-width: 768px) { /* Ajuste o valor conforme a largura desejada */
     flex-direction:row;
     width:95%
  }
`
    const UploadButton = styled.label`
              background-color: #007bff;
              color: white;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
              max-height:50px;
              margin-top:10px;
              &:hover {
                background-color: #0056b3;
              }
            `;

    const Input = styled.input`
              display: none;
            `;

    const ImageContainer = styled.div`
              display: flex;
              flex-direction: column;
              align-items: center;

            `;

    const ImagePreview = styled.img`
              max-width: 300px;
              max-height: 300px;
              border: 2px solid #ccc;
              border-radius: 10px;
            `;

    const PlaceholderText = styled.p`
              color: #555;
              font-size: 14px;
            
            `;

    const RemoveButton = styled.button`
              background-color: #dc3545;
              color: white;
              padding: 10px 20px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
              margin-top: 10px;
            
              &:hover {
                background-color: #a71d2a;
              }
            `;

    const BotaoAzul = styled.button`
  background-color: white;
  color:rgb(8, 53, 68); /* Azul claro */
  border: 2px solidrgb(12, 51, 65); /* Azul claro */
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #ADD8E6; /* Azul claro no hover */
    color: white;
  }
`;


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImages(url);
        }
    };
    /*
    
        const handleImageChange = (event, index) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Atualizar o objeto certo no array
                    setfuncaoinput((prevState) => {
                        const updatedfuncaoinput = [...prevState];
                        updatedfuncaoinput[index].foto = e.target.result;
                        return updatedfuncaoinput;
                    });
                };
                reader.readAsDataURL(file);
            }
        };
        */

    // Remover foto
    const handleRemoveImage = (funcaoIndex) => {
        const updated = [...funcaoinput];
        updated[funcaoIndex].foto = null;
        setfuncaoinput(updated);
    };

    console.log(images)

    async function dataInstanceValue() {
        const idi = '3D826867ABEC00CA23EBB2D4EBC7E202';
        const tokeni = '9A63F56F86E49E2446ED34DD';

        try {
            const response = await dataInstance(idi, tokeni); // Aguarda a função retornar o resultado
            console.log('DATAAQUI:::::::', response)
            if (response.connected) {
                setConnectedNumber(true)
            } else {
                setConnectedNumber(false)
            }
        } catch (error) {
            console.error('TRYCAYCHERROR:::::QRCODE:::', error); // Lida com erros
        }
    }


    React.useEffect(() => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        const hours = today.getHours();
        const minutes = today.getMinutes().toString().padStart(2, '0'); // Pads single digit minutes with a zero
        setDate(`${date}/${month}/${year} ${hours}:${minutes}`);
    }, []);

    React.useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                setUser(user)

                const dbRef = ref(getDatabase());
                get(child(dbRef, `${base64.encode(user.email)}/mensagens`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        setUserData(snapshot.val())
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });

                get(child(dbRef, `${base64.encode(user.email)}/relatorios/clientes`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        setRelatorio(snapshot.val())
                    } else {
                        console.log("No data available");
                    }
                }).catch((error) => {
                    console.error(error);
                });
                // ...
            } else {
                // User is signed out
                // ...
            }
        });
    }, [user, console.log('MSG:::', userData.msgCadastro)])


    React.useEffect(() => {
        const dbRef = ref(database, `/`); // Referência para a coleção 'clientes'



        const intervalo = setInterval(() => {
            const unsubscribe = onValue(dbRef, (snapshot) => {
                const data = snapshot.val();
                console.log('ITEM1::::::::', data)
                if (data) {
                    const dataList = Object.keys(data).map((key) => ({
                        id: key,
                        clientes: data[key].clientes,
                        mensagens: data[key].mensagens,
                        relatorios: data[key].relatorios
                    }));
                    setClientforTime(dataList);


                } else {
                    return null // Define uma lista vazia caso não haja dados
                }
                console.log(clientForTime)

            });
            return unsubscribe;
        }, 4000);
        return () => clearInterval(intervalo);




    }, [])


    async function dataInstanceValue() {
        const idi = '3D826867ABEC00CA23EBB2D4EBC7E202';
        const tokeni = '9A63F56F86E49E2446ED34DD';

        try {
            const response = await dataInstance(idi, tokeni); // Aguarda a função retornar o resultado
            console.log('DATAAQUI:::::::', response)
            if (response.connected) {
                setConnectedNumber(true)
            } else {
                setConnectedNumber(false)
            }
        } catch (error) {
            console.error('TRYCAYCHERROR:::::QRCODE:::', error); // Lida com erros
        }
    }

    React.useEffect(() => {
        dataInstanceValue();

    }, [])



    async function setNewClient() {
        const database = getDatabase();
        const storage = getStorage();
        setProgress(true)
        if (wppInput === '' || nomeInput === '') {
            window.alert('Complete os campos');
            setProgress(false)
            return;
        } 



        const body = {
            message: `${userData.msgCadastro}`,
            phone: `55${wppInput}`,
            delayMessage: 10
        };

    funcaoinput.map(async (response, funcaoIndex) => {
        const horariosCount = response.horario.length;
        const dosesCount = response.doses;
        const acabaEmDias = dosesCount / horariosCount;
        const hoje = new Date(); // Data atual
        const novaData = new Date(hoje); // Clona a data atual
        novaData.setDate(novaData.getDate() + acabaEmDias); // Adiciona os dias

        // Adiciona a data ao objeto response
        response.acabaEm = novaData.toLocaleDateString(); // Formata a data no formato local

   /*     let imageUrl = '';

        if (response.foto) {
            // Upload da imagem ao Firebase Storage
            const storagePath = `${base64.encode(user.email)}/eventos/${funcaoIndex}/foto.jpg`;
            const storageReference = storageRef(storage, storagePath);

            try {
                await uploadString(storageReference, response.foto, 'data_url');
                imageUrl = await getDownloadURL(storageReference);
            } catch (error) {
                console.error("Erro ao fazer upload da imagem:", error);
            }
        }
             */
        // Caminho no Realtime Database com cpfInput, funcaoIndex e response.remedio
        const databasePath = `${base64.encode(user.email)}/eventos/${funcaoIndex}`;
        set(ref(database, databasePath), {
            nome: nomeInput,
            descriçãoDoEvento: wppInput,
            cpf: cpfInput,
            receita: receita,
            dataCadastro: date,

            digit: funcaoIndex,
            emailDono: user.email,
        }).then(() => {
            const databasePath2 = `${base64.encode(user.email)}/eventos/${funcaoIndex}/cargos`;
            funcaoinput.forEach(cargo => {
                const novoCargoRef = push(ref(database, databasePath2));
                set(novoCargoRef, cargo);
            });
        })



    });


    // Aguarda todos os uploads e gravações de dados


       

        // Envia a mensagem
       // sendMessageAll(body);

        navigate('/measure')
        setProgress(false)


        // Navega para a próxima página

    }

    const addMedicacao = () => {
        setfuncaoinput([...funcaoinput, { horario: [], remedio: '' }]);
        setTimeout(scrollToLastItem, 100);
    };

    const addHorario = (index) => {
        setfuncaoinput((prevState) =>
            prevState.map((item, i) =>
                i === index
                    ? { ...item, horario: [...item.horario, { hora: '' }] }
                    : item
            )
        );
        setTimeout(() => {
            if (listRef.current) {
                listRef.current.scrollTop = listRef.current.scrollHeight;
            }
        }, 50);
    };

    const handleInputChangeRemedio = (funcaoinput1, newValue) => {
        setfuncaoinput(funcaoinput.map(input => {
            if (input.remedio === funcaoinput1) {
                return { ...input, remedio: newValue }
            } else return input
        }));
    };

    const handleInputChangeDoses = (funcaoinput1, newValue) => {
        setfuncaoinput(funcaoinput.map(input => {
            if (input.remedio === funcaoinput1) {
                return { ...input, doses: newValue }
            } else return input
        }));
    };

    const handleInputChangeValor = (funcaoinput1, newValue) => {
        // Função para formatar o valor como número ou moeda
        const formatValue = (value) => {
            // Remove caracteres não numéricos
            const numericValue = value.replace(/[^\d]/g, '');

            // Converte para um formato decimal (ex: 0.00)
            const formattedValue = (parseFloat(numericValue) / 100).toFixed(2);

            // Retorna como string formatada, ex: "123.45" ou "R$ 123,45"
            return formattedValue;
        };
        console.log(typeof formatValue(newValue))

        setfuncaoinput(funcaoinput.map(input => {
            if (input.remedio === funcaoinput1) {
                return { ...input, valor: formatValue(newValue) }; // Formata o valor aqui
            } else return input;
        }));
    };
    const handleInputChangehorario = (funcaoIndex, horarioIndex, newValue) => {
        const horarioFormatado = formatarHorario(newValue);

        setfuncaoinput((prevState) =>
            prevState.map((input, index) => {
                if (index === funcaoIndex) {
                    const updatedHorario = input.horario.map((horario, i) =>
                        i === horarioIndex
                            ? { ...horario, hora: horarioFormatado }
                            : horario
                    );

                    return { ...input, horario: updatedHorario };
                }
                return input;
            })
        );
    };

    const scrollToLastItem = () => {
        if (listRef.current) {
            listRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Função para formatar o horário
    const formatarHorario = (valor) => {
        // Remove tudo que não for número
        const apenasNumeros = valor.replace(/\D/g, "");

        // Adiciona os dois pontos automaticamente
        if (apenasNumeros.length <= 2) {
            return apenasNumeros; // Apenas horas
        } else if (apenasNumeros.length <= 4) {
            return `${apenasNumeros.slice(0, 2)}:${apenasNumeros.slice(2)}`; // Horas e minutos
        }

        // Limita o formato ao padrão HH:mm
        return `${apenasNumeros.slice(0, 2)}:${apenasNumeros.slice(2, 4)}`;
    };
    const removeTask = (index) => {
        const newsInputs = funcaoinput.filter((_, i) => i !== index);
        setfuncaoinput(newsInputs);
    };

    async function sendAll() {
        try {

            filteredData.map(item => {
                const body = {
                    message: messageAll,
                    phone: `55${item.contato}`,
                    delayMessage: 10
                }

                const response = sendMessageAll(body)
                return response
            })
        } catch (error) {
            console.log('ERROR TRYCATCH::::::::')
        }


    }

    const handleFilterChange = (e) => {
        const value = e.target.value.toLowerCase(); // Converte o valor do filtro para minúsculas
        setFilterValue(value); // Atualiza o valor do filtro

        const filtered = dataClientes.filter((item) =>
            item.nome.toLowerCase().includes(value) ||
            item.dataCadastro.toLowerCase().includes(value) ||
            item.acabaEm.toLowerCase().includes(value) ||
            item.doses.toLowerCase().includes(value) ||
            item.remedio.toLowerCase().includes(value)
        );

        setFilteredData(filtered); // Atualiza os dados filtrados
    };

    console.log(relatorio.valorTotalM)

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4, justifyContent: 'center', gap: 6 }} ref={listRef} >
            <a
                onClick={() => navigate('/measure')}
                style={{
                    fontSize: 19,
                    color: 'red',
                    cursor: 'pointer',
                    alignSelf: 'flex-end',
                    padding: 5,
                    border: '1px dotted red',
                    marginTop: 10
                }}
            >
                X
            </a>
            <Typography id="modal-modal-title" variant="h6" style={{ fontWeight: 'bold', fontSize: 18 }} >
                Dados para cadastro do Evento/Serviço
            </Typography>
            <TextField id="outlined-basic-nome" value={nomeInput} label="Nome do Evento" onChange={text => setNomeInput(text.target.value)} fullWidth variant="outlined" />


            <div style={{ flexDirection: 'row', display: 'flex', gap: 15, alignItems: 'center', justifyContent: 'center', padding: 10 }} >

                <label
                    htmlFor="imageUpload" // Conectando o label ao input
                    style={{
                        display: "inline-block",
                        padding: "10px 10px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: 10,
                        alignSelf: 'flex-start'
                    }}
                >
                    Selecionar Foto
                </label>

                <input
                    id="imageUpload" // Adicionando o mesmo ID para conectar ao label
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageChange(event)}
                    className='mb-4'
                    style={{ display: "none" }}
                />
                {
                    images && (
                        <img src={images} style={{ width: 200, height: 200 }} alt={`Uploaded`} className="w-full h-auto rounded-lg" />
                    )
                }







            </div>


            <TextField id="outlined-basic-wpp" value={wppInput} label="Descrição do evento para os Candidatos" onChange={text => setWppInput(text.target.value)} fullWidth variant="outlined" />

            {
                funcaoinput.map((response, funcaoIndex) => (
                    <div key={funcaoIndex} ref={funcaoIndex === funcaoinput.length - 1 ? listRef : null} >
                        <div style={{ width: "100%", display: 'flex' }}>
                            <div style={{ width: "50%" }}>
                                <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    style={{
                                        fontWeight: '400',
                                        margin: 5,
                                        alignSelf: 'flex-start',
                                        fontSize: 12,
                                    }}
                                >
                                    Função {funcaoIndex + 1} ( Cargo do Candidato ) :
                                </Typography>
                            </div>
                            <div
                                style={{
                                    width: "50%",
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: "flex-end",
                                    margin: 5,
                                }}
                            >
                                <a
                                    onClick={() => removeTask(funcaoIndex)}
                                    style={{
                                        fontSize: 13,
                                        color: 'blue',
                                        cursor: 'pointer',
                                        alignSelf: 'flex-end',
                                        padding: 5,
                                        border: '1px solid blue',
                                    }}
                                >
                                    Excluir Função
                                </a>
                            </div>
                        </div>
                        <TextField
                            id="outlined-basic-remedio"
                            label="Nome da Função ( Cargo )"
                            style={{ width: '100%' }}
                            onChange={(text) =>
                                handleInputChangeRemedio(response.remedio, text.target.value)
                            }
                            value={response.remedio}
                            variant="outlined"
                        />

                        <TextField
                            id="outlined-basic-remedio"
                            label="Vagas"
                            style={{ width: '100%' }}
                            onChange={(text) =>
                                handleInputChangeValor(response.remedio, text.target.value)
                            }
                            value={response.valor}
                            variant="outlined"
                        />

                        {response.horario.map((horario, horarioIndex) => (
                            <input
                                style={{ width: '98%', borderColor: 'grey', height: 40 }}
                                key={horarioIndex}
                                id={`outlined-basic-horario-${funcaoIndex}-${horarioIndex}`}
                                label={`Horário ${horarioIndex + 1}`}
                                fullWidth
                                onChange={(event) =>
                                    handleInputChangehorario(
                                        funcaoIndex,
                                        horarioIndex,
                                        event.target.value
                                    )
                                }
                                value={horario.hora || ''} // Garante que o valor inicial não seja undefined
                            />
                        ))}



                        <div style={{ width: '97%', border: '1px dotted grey' }} />

                    </div>
                ))
            }
            <UploadButton style={{ marginTop: 10 }} variant='outlined' fullWidth onClick={() => addMedicacao()}>Adicionar Cargo</UploadButton>



            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "center" }} >
                <Typography id="modal-modal-title" variant="h6" style={{ fontWeight: '500', fontSize: 14 }} >
                    Uso contínuo
                </Typography>
                <Checkbox {...label} id='checkcontinuo' onChange={value => setUsoContinuo(value.target.value)} />
                {
                    usoContinuo == 'on' ? (
                        <TextField
                            id="outlined-basic-remedio"
                            label="Doses"
                            style={{ width: '100%' }}
                            onChange={(text) =>
                                setInputUsoContinuo(text.target.value)
                            }
                            variant="outlined"
                            value={inputUsocontinuo}
                        />
                    ) : null
                }
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "center" }} >
                <Typography id="modal-modal-title" variant="h6" style={{ fontWeight: '500', fontSize: 14 }} >
                    Precisa de receita
                </Typography>
                <Checkbox {...label} id='checkreceita' onChange={value => setReceita(value.target.value)} />

                {
                    receita == 'on' ? (
                        <TextField
                            id="outlined-basic-remedio"
                            label="Doses"
                            style={{ width: '100%' }}
                            onChange={(text) =>
                                setInputReceita(text.target.value)
                            }
                            variant="outlined"
                            value={inputReceita}
                        />
                    ) : null
                }
            </div>


            {
                !progress && (
                    <Button
                        style={buttonStyles}
                        variant="contained"
                        onClick={() => setNewClient()}
                    >
                        Cadastrar
                    </Button>
                )
            }

            {
                progress && (
                    <div style={{ display: 'flex', gap: 7 }} >
                        <label>Cadastrando....</label>
                        <CircularProgress />
                        <label>Ao carregar foto, demora um pouco mais</label>
                    </div>
                )
            }
        </Box>
    );
}

export default RegisterClient;

