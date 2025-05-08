import * as React from 'react';
import { PageContainer, SubTitle, InputText, ContainerEdit, Title, TitleForm, ContainerEditIn } from './styles';
import { useNavigate } from 'react-router-dom';
import QRCode from "react-qr-code";
import { getDatabase, ref, child, push, update } from "firebase/database";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Header from '../../components/Header';
import base64 from 'base-64';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { onValue } from "firebase/database";
import { database } from '../../App';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import "firebase/database";
import { BorderBottom } from '@mui/icons-material';
import YourComponent from '../../components/Foto';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const Clientes = () => {
    const navigate = useNavigate()
    const [openRegister, setOpenRegister] = React.useState(false);
    const [user, setUser] = React.useState({ email: 'alo' });
    const [qrCode, setQRCode] = React.useState(false);
    const [dataClientes, setDataClientes] = React.useState([]);
    const [itemCliente, setItemCliente] = React.useState([{ nome: '', contato: 0 }]);
    const listaRef = React.useRef(null);
    const [remedioInput, setRemedioInput] = React.useState([{ remedio: '', horario: [], doses: 0, foto: '' }]);
    const [images, setImages] = React.useState(
        dataClientes.reduce((acc, item) => {
            acc[item.id] = item.fotoUrl; // Inicializa com a URL original de cada item
            return acc;
        }, {})
    );

    const [nomeInput, setNomeInput] = React.useState('');
    const [wppInput, setWppInput] = React.useState('');

    const [cpfInput, setCpfInput] = React.useState('');
    const [usoContinuo, setUsoContinuo] = React.useState(false);
    const [receita, setReceita] = React.useState('');
    const [updatedPhotosAtual, setUpdatedPhotosAtual] = React.useState(''); // Foto original ou vazia
    const [filteredData, setFilteredData] = React.useState([]);
    const [filterValue, setFilterValue] = React.useState('');






    const styleModalRegister = {
        height: '97%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '95%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 1,
        overflowY: 'auto'
    };

    const addMedicacao = () => {
        setRemedioInput([...remedioInput, { horario: [{ hora: '10:00' }], remedio: '' }]);
    };

    const addHorario = (index) => {
        setRemedioInput((prevState) =>
            prevState.map((item, i) =>
                i === index
                    ? { ...item, horario: [...item.horario, { hora: '' }] }
                    : item
            )
        );
    };



    const handleInputChangeRemedio = (remedioInput1, newValue) => {
        setRemedioInput(remedioInput.map(input => {
            if (input.remedio === remedioInput1) {
                return { ...input, remedio: newValue }
            } else return input
        }));
    };

    const handleInputChangeDoses = (remedioInput1, newValue) => {
        setRemedioInput(remedioInput.map(input => {
            if (input.remedio === remedioInput1) {
                return { ...input, doses: newValue }
            } else return input
        }));
    };

    const handleInputChangehorario = (remedioInput1, indexHorario, newValue) => {
        setRemedioInput((prevState) =>
            prevState.map((input) => {
                if (input.remedio === remedioInput1) {
                    const updatedHorario = input.horario.map((horario, i) =>
                        i === indexHorario
                            ? formatarHorario(newValue) // Formatar a hora antes de atualizar
                            : horario
                    );

                    return { ...input, horario: updatedHorario };
                }
                return input;
            })
        );
    };

    const handleFilterChange = (e) => {
        const value = e.target.value.toLowerCase(); // Converte o valor do filtro para minúsculas
        setFilterValue(value); // Atualiza o valor do filtro
    
        if (value === '') {
            // Retorna ao estado original se o filtro estiver vazio
            setFilteredData(dataClientes); // Use o conjunto original de dados
            return;
        }
    
        const filtered = dataClientes.filter((item) =>
            item.nome.toLowerCase().includes(value) ||
            item.contato.toLowerCase().includes(value)
        );
    
        setFilteredData(filtered); // Atualiza os dados filtrados
    };

    // Função para formatar o horário
    const formatarHorario = (newValue) => {
        // Remove qualquer caractere não numérico
        const valoresNumericos = newValue.replace(/\D/g, "");

        // Se tiver 4 ou mais números, formate como hora:minuto
        if (valoresNumericos.length >= 4) {
            // Formata no estilo "HH:MM"
            return `${valoresNumericos.slice(0, 2)}:${valoresNumericos.slice(2, 4)}`;
        }

        // Se o valor for menor que 4 caracteres, apenas retorna o que foi digitado
        return valoresNumericos;
    };

    const removeTask = (index) => {
        const newsInputs = remedioInput.filter((_, i) => i !== index);
        setRemedioInput(newsInputs);
    };


    const handleOpenRegister = (item) => {
        setOpenRegister(true)
        setItemCliente(item)
    }
    const handleCloseRegister = () => setOpenRegister(false);

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
        if (listaRef.current) {
            listaRef.current.scrollTop = listaRef.current.scrollHeight; // Scroll automático
        }
    }, [dataClientes]);


    React.useEffect(() => {
        if (user) {
            const dbRef = ref(database, `${base64.encode(user.email)}/clientes`);
            const unsubscribe = onValue(dbRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const dataList = Object.keys(data).map((key) => ({
                        id: key,
                        nome: data[key].nome,
                        acabaEm: data[key].acabaEm,
                        cpf: data[key].cpf,
                        contato: data[key].contato,
                        doses: data[key].doses,
                        remedio: data[key].remedio,
                        receita: data[key].receita,
                        usoContinuo: data[key].usoContinuo,
                        msgUsoContinuo: data[key].msgUsoContinuo,
                        msgReceita: data[key].msgReceita,
                        horario: data[key].horario,
                        dataCadastro: data[key].dataCadastro,
                        digit: data[key].digit,
                        fotoUrl: data[key].fotoUrl,
                        valorMedicamento:data[key].valorMedicamento
                    }));
                    setDataClientes(dataList);
                    setFilteredData(dataList)
                } else {
                    setDataClientes([]);
                    setFilteredData([])
                }
            });

            return unsubscribe; // Retorna a função de limpeza
        }
    }, [user]);



    function writeNewPost(item, inputNome, horarios, inputRemedio, inputContato, inputUsoContinuo, inputReceita, inputFoto) {
        const email64 = base64.encode(user.email);
        const db = getDatabase();
        console.log()

        if (item.nome != inputNome) {
            const postNome = {
                nome: inputNome,
                cpf: item.cpf,
                contato: item.contato,
                acabaEm: item.acabaEm,
                doses: item.doses,
                remedio: item.remedio,
                horario: item.horario,
                dataCadastro: item.dataCadastro,
                receita: true,
                msgUsoContinuo: item.msgUsoContinuo,
                msgReceita: item.msgReceita,
                digit: item.digit,
                fotoUrl: item.fotoUrl,
                valorMedicamento:item.valorMedicamento
            }

            const updates = {};
            updates[`${email64}/clientes/${base64.encode(item.cpf + item.digit + item.remedio)}`] = postNome;

            return update(ref(db), updates)
                .then(() => window.alert('Nome alterado com sucesso!!'))
                .catch((log) => console.log('ERROREDITUSER:::::', log));

        } else if (item.contato != inputContato) {
            const postNome = {
                nome: item.nome,
                cpf: item.cpf,
                contato: inputContato,
                acabaEm: item.acabaEm,
                doses: item.doses,
                remedio: item.remedio,
                horario: item.horario,
                dataCadastro: item.dataCadastro,
                receita: true,
                usoContinuo: item.usoContinuo,
                msgUsoContinuo: item.msgUsoContinuo,
                msgReceita: item.msgReceita,
                digit: item.digit,
                fotoUrl: item.fotoUrl,
                valorMedicamento:item.valorMedicamento
            }

            const updates = {};
            updates[`${email64}/clientes/${base64.encode(item.cpf + item.digit + item.remedio)}`] = postNome;

            return update(ref(db), updates)
                .then(() => window.alert('Contato alterado com sucesso!!'))
                .catch((log) => console.log('ERROREDITUSER:::::', log));

        } else if (item.remedio != inputRemedio) {
            console.log(item.msgUsoContinuo)
            const postNome = {
                nome: item.nome,
                cpf: item.cpf,
                contato: item.contato,
                acabaEm: item.acabaEm,
                doses: item.doses,
                remedio: inputRemedio,
                horario: item.horario,
                dataCadastro: item.dataCadastro,
                receita: true,
                usoContinuo: item.usoContinuo,
                msgUsoContinuo: item.msgUsoContinuo,
                msgReceita: item.msgReceita,
                digit: item.digit,
                fotoUrl: item.fotoUrl,
                valorMedicamento:item.valorMedicamento
            }

            const updates = {};
            updates[`${email64}/clientes/${base64.encode(item.cpf + item.digit + item.remedio)}`] = postNome;

            return update(ref(db), updates)
                .then(() => window.alert('Remedio alterado com sucesso!!'))
                .catch((log) => console.log('ERROREDITUSER:::::', log));

        } else if (item.msgUsoContinuo != inputUsoContinuo) {
            const postNome = {
                nome: item.nome,
                cpf: item.cpf,
                contato: item.contato,
                acabaEm: item.acabaEm,
                doses: item.doses,
                remedio: item.remedio,
                horario: item.horario,
                dataCadastro: item.dataCadastro,
                receita: true,
                usoContinuo: item.usoContinuo,
                msgUsoContinuo: inputUsoContinuo,
                msgReceita: item.msgReceita,
                digit: item.digit,
                fotoUrl: item.fotoUrl,
                valorMedicamento:item.valorMedicamento
            }

            const updates = {};
            updates[`${email64}/clientes/${base64.encode(item.cpf + item.digit + item.remedio)}`] = postNome;

            return update(ref(db), updates)
                .then(() => window.alert('Mensgaem para USO CONTINUO alterado com sucesso!!'))
                .catch((log) => console.log('ERROREDITUSER:::::', log));
        } else if (item.msgReceita != inputReceita) {
            const postNome = {
                nome: item.nome,
                cpf: item.cpf,
                contato: item.contato,
                acabaEm: item.acabaEm,
                doses: item.doses,
                remedio: item.remedio,
                horario: item.horario,
                dataCadastro: item.dataCadastro,
                receita: true,
                usoContinuo: item.usoContinuo,
                msgUsoContinuo: item.msgUsoContinuo,
                msgReceita: inputReceita,
                digit: item.digit,
                fotoUrl: item.fotoUrl,
                valorMedicamento:item.valorMedicamento
            }

            const updates = {};
            updates[`${email64}/clientes/${base64.encode(item.cpf + item.digit + item.remedio)}`] = postNome;

            return update(ref(db), updates)
                .then(() => window.alert('Mensagem para RECEITA alterada com sucesso!!'))
                .catch((log) => console.log('ERROREDITUSER:::::', log));

        } else if (updatedPhotosAtual != '' ) {
            const postNome = {
                nome: item.nome,
                cpf: item.cpf,
                contato: item.contato,
                acabaEm: item.acabaEm,
                doses: item.doses,
                remedio: item.remedio,
                horario: item.horario,
                dataCadastro: item.dataCadastro,
                receita: true,
                usoContinuo: item.usoContinuo,
                msgUsoContinuo: item.msgUsoContinuo,
                msgReceita: inputReceita,
                digit: item.digit,
                fotoUrl: updatedPhotosAtual,
                valorMedicamento:item.valorMedicamento
            }

            const updates = {};
            updates[`${email64}/clientes/${base64.encode(item.cpf + item.digit + item.remedio)}`] = postNome;

            return update(ref(db), updates)
                .then(() => window.alert('Foto Alterada com sucesso!!'))
                .catch((log) => console.log('ERROREDITUSER:::::', log));
        }
        else {

            Object.values(horarios).forEach(horario => {
                Object.values(item.horario).forEach(horarioT => {
                    if (horarioT.hora != horario.hora) {
                        const postHorario = {
                            hora: horario.hora

                        }

                        const updates = {};
                        updates[`${email64}/clientes/${base64.encode(item.cpf + item.digit + item.remedio)}/horario/${horarioT.hora}`] = postHorario;

                        return update(ref(db), updates)
                            .then(() => window.alert('Horario alterado com sucesso!!'))
                            .catch((log) => console.log('ERROREDITUSER:::::', log));


                    } else if (horarioT.hora == horario.hora) {
                        const postData = {
                            nome: inputNome || item.nome,
                            cpf: item.cpf,
                            contato: item.contato,
                            acabaEm: item.acabaEm,
                            doses: item.doses,
                            remedio: item.remedio,
                            horario: item.horario || horario,
                            dataCadastro: item.dataCadastro,
                            receita: true,
                            usoContinuo: item.usoContinuo,
                            digit: item.digit,
                            fotoUrl: item.fotoUrl,
                            valorMedicamento:item.valorMedicamento
                        };



                        // Obtem uma chave para o novo post.
                        const newPostKey = push(child(ref(db), '/')).key;

                        // Atualiza os dados no banco, usando a chave gerada como índice.
                        const updates = {};
                        updates[`${email64}/clientes/${base64.encode(item.cpf + item.digit + item.remedio)}`] = postData;

                        return update(ref(db), updates)
                            .then(() => window.alert('Alterado com sucesso!!'))
                            .catch((log) => console.log('ERROREDITUSER:::::', log));
                    }
                    else return null
                })
            })
        }

        // Cria uma entrada de post.

    }

    const handleinputedit = (e) => {
        if (e == 'on') {
            setUsoContinuo(true)
        } else if (!e || e !== 'on') {
            setUsoContinuo(false)
        }
    }




    return (
        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden', maxHeight: '100vh' }} >
            <Header />

            <Title>Edite caso precise</Title>
            <SubTitle>1. Insira as informações que queira editar</SubTitle>
            <SubTitle>2. Após isso clique em salvar para salvar as alterações</SubTitle>

              <InputText placeholder='Pesquisar por nome ou contato...' value={filterValue} onChange={e => handleFilterChange(e)} />
                                 


            {
                filteredData.length > 0 ? (filteredData.map((item, remedioIndex) => {
                    console.log(item)
                    let inputNome = item.nome;
                    let inputContato = item.contato;
                    let inputRemedio = item.remedio;
                    let inputUsoContinuo = item.msgUsoContinuo;
                    let inputReceita = item.msgReceita;
                    let inputFoto = item.fotoUrl;
                    let novaFoto = '';
                    let horarios = [];
                    console.log('MSG::::::::', item)

                    const handleEventTargert = (text) => {
                        inputNome = text;

                    }

                    const handleEventContato = (text) => {
                        inputContato = text;

                    }

                    const handleEventRemedio = (text) => {
                        inputRemedio = text;

                    }

                    const handleEventUsoContinuo = (text) => {
                        inputUsoContinuo = text;

                    }

                    const handleEventReceita = (text) => {
                        inputReceita = text;

                    }

                    const handleImageChange = (event) => {
                        const file = event.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                                  novaFoto = reader.result
                            };
                            reader.readAsDataURL(file); // Converte o arquivo em uma URL Base64
                        }
                    };
                    const handleHorarioChange = (index, newHora) => {
                        // Atualiza o valor diretamente no array
                        horarios[index] = { hora: newHora };
                        // Remove valores vazios ou inválidos
                        horarios = horarios.filter((hor) => hor.hora);
                        console.log(horarios); // Apenas para verificar as mudanças
                    };

                    if (item.nome) {
                        return <div style={{ borderBottom: 1, borderColor: 'blak', display: 'flex', flexDirection: 'column', padding: 8 }} >
                            <ContainerEdit >
                                <ContainerEditIn>
                                    Nome: {item.nome}
                                    <TextField
                                        id={`outlined-basic`}
                                        label={`editar Nome`}
                                        fullWidth
                                        variant="outlined"
                                        onChange={text => handleEventTargert(text.target.value)}

                                    />

                                </ContainerEditIn>
                                <ContainerEditIn>
                                    Remédio:{item.remedio}
                                    <TextField
                                        id={`outlined-basic`}
                                        label={`Editar Remedio`}
                                        fullWidth
                                        variant="outlined"
                                        onChange={text => handleEventRemedio(text.target.value)}

                                    />
                                </ContainerEditIn>
                                <ContainerEditIn>
                                    Contato:{item.contato}
                                    <TextField
                                        id={`outlined-basic`}
                                        label={`Editar Contato`}
                                        fullWidth
                                        variant="outlined"
                                        onChange={text => handleEventContato(text.target.value)}

                                    />
                                </ContainerEditIn>

                                {Object.values(item.horario || []).map((hor, index) => (
                                    <ContainerEditIn key={index}>
                                        Horário: {hor.hora}
                                        <TextField
                                            id={`outlined-basic-${index}`}
                                            label="Editar horário"
                                            fullWidth
                                            variant="outlined"
                                            defaultValue={horarios[index]?.hora || ""} // Mostra o valor atual ou vazio
                                            onChange={(e) => handleHorarioChange(index, e.target.value)}
                                        />
                                    </ContainerEditIn>
                                ))}
                        
                                {item.fotoUrl && (
                                    <>
                                    <div style={{width:50}} />
                                     <label >Foto atual:</label>
                                        <img
                                            src={item.fotoUrl} // Mostra a nova foto ou a original
                                            alt="foto remédio"
                                            style={{ width: 80, height: 80 }}
                                        />
                                      
                                    
                                            <YourComponent remedioIndex={remedioIndex} setUpdatedPhotosAtual={setUpdatedPhotosAtual}  />
                                   
                                    </>
                                )}
    <br/>
                                <div style={{ width: '50%', display: 'flex', flexDirection: 'column' }} >


                                    Envie uma mensagem 72 horas do medicamento ou receita acabar:
                                    <TextField
                                        id={`outlined-basic`}
                                        label={`Envie 36 horas antes - Uso Contínuo`}
                                        fullWidth
                                        variant="outlined"
                                        onChange={text => handleEventUsoContinuo(text.target.value)}

                                    />

                                    Mensagem:{item.msgUsoContinuo}


                                    <TextField
                                        id={`outlined-basic`}
                                        label={`Envie 36 horas antes para RECEITA`}
                                        fullWidth
                                        variant="outlined"
                                        onChange={text => handleEventReceita(text.target.value)}

                                    />
                                    Mensagem:{item.msgReceita}
                                </div>
                                <Button style={{ alignSelf: 'center' }} onClick={() => writeNewPost(item, inputNome, horarios, inputRemedio, inputContato, inputUsoContinuo, inputReceita, inputFoto)} variant="contained">Salvar Edição</Button>

                            </ContainerEdit>



                        </div>

                    } else {
                        return null
                    }
                })) : (
                    <Typography style={{ fontWeight: '600', color: '#999592', fontSize: '14px', alignSelf: 'flex-start' }} > Nenhum usuário cadastrado </Typography>

                )
            }






        </div>

    );
}

export default Clientes;

