import * as React from 'react';
import { Body, ContainerRules, InputText, Container2, ContainerEditAccordion, GreenBox, RedBox } from './styles';
import { backgroundMenu } from '../../Globals/globals'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Header from '../../components/Header';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { atualizarWebhook, sendImage, sendMessageAll, sendMessageWitchButton, setNewClient } from '../../services';
import base64 from 'base-64';
import { getDatabase, ref, set, push, get, child, onValue, update, remove } from "firebase/database";
import { database } from '../../App';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SaveIcon from '@mui/icons-material/Save';
import ListAltOutlined from '@mui/icons-material/ListAltOutlined';
import AccountBoxOutlined from '@mui/icons-material/AccountBoxOutlined';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "firebase/database";
import { dataInstance } from '../../services';
import styled from 'styled-components';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';





const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const style = {
    minHeight: 300,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    gap: 15,

    // Responsivo com breakpoints do MUI
    '@media (max-width:720px)': {
        minWidth: '70%',
        height: 'auto',
        p: 2,
    },
};

const styleFuncServ = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 15,

    // Responsivo com breakpoints do MUI
    '@media (max-width:720px)': {
        flexDirection: 'column'
    },
};


const styleModalRegister = {
    maxHeight: '100vh',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 1,
    overflowY: 'auto'
};

const styleModalList = {
    height: '86%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 1
};


const actions = [
    { icon: <AccountBoxOutlined style={{ color: '#42adda', backgroundColor: '#0073b1' }} />, name: 'Cadastrar Funcionário' },
    { icon: <AccountBoxOutlined style={{ color: '#42adda', backgroundColor: '#0073b1' }} />, name: 'Cadastrar Serviços' },

];


const employees = ["Carlos", "Maria", "João", "Ana", "Pedro"];
const workHours = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"];
const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];




const Measurement = () => {
    const navigate = useNavigate()
    const [open, setOpen] = React.useState(false);
    const [openRegister, setOpenRegister] = React.useState(false);
    const [openList, setOpenList] = React.useState(false);
    const [datarow, setDataRow] = React.useState(false);
    const [dataClientes, setDataClientes] = React.useState([]);
    const [clientesRecompra, setClientesRecompra] = React.useState([]);
    const [time, setTime] = React.useState('');
    const [formattedTime, setFormattedTime] = React.useState('');
    const [date, setDate] = React.useState('');
    const [filteredData, setFilteredData] = React.useState([]);
    const [filterValue, setFilterValue] = React.useState('');
    const [user, setUser] = React.useState(false);
    const [novaData, setNovaData] = React.useState(null);
    const [clientForTime, setClientforTime] = React.useState([{ clientes: [] }]);
    const [connectednumber, setConnectedNumber] = React.useState(false);
    const [userData, setUserData] = React.useState({ funcionarios: [] });
    const listRef = React.useRef(null);
    const [paymentState, setPaymentState] = React.useState({ assinatura: false });
    const [dataRowRecompra, setDataRowRecompra] = React.useState('');
    const [relatorio, setRelatorio] = React.useState('');
    const [messageDataUser, setMessageDataUser] = React.useState(false);
    const [paymentLinks, setPaymentLinks] = React.useState([]);
    const [isCopied, setIsCopied] = React.useState(false);
    const [isLink, setLink] = React.useState('');



    const [bookedAppointments, setBookedAppointments] = React.useState([]);
    const [availableTimes, setAvailableTimes] = React.useState([]);
    const [selectedTime, setSelectedTime] = React.useState(null);
    const [selectedEmployee, setSelectedEmployee] = React.useState(null);
    const [userMessage, setUserMessage] = React.useState("");
    const [nextBooked, setNextBooked] = React.useState(null);
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [userState, setUserState] = React.useState();
    const [proxAgendar, setProxAgendar] = React.useState(false);
    const [servicoSelecionado, setServicoSelecionado] = React.useState(false);
    const [availableEmployeesa, setAvailableEmployees] = React.useState([]);
    const [cargoFuncionario, setCargoFuncionario] = React.useState('');
    const [nomeFuncionario, setNomeFuncionario] = React.useState('');
    const [etapaConfirm, setEtapaConfirm] = React.useState(false);
    const [nomeServico, setNomeServico] = React.useState('');
    const [valorServico, setValorServico] = React.useState('');
    const [etapaDate, setEtapaDate] = React.useState('');
    const [horarioManual, setManualHorarios] = React.useState([]);
    const [dateManual, setDateManual] = React.useState('');
    const [employeesManual, setEmployeesManual] = React.useState([]);
    const [selectedHorarioManual, setSelectedHorarioManual] = React.useState('');
    const [servicosManual, setServicosManual] = React.useState({ servicosSelecionados: [] });
    const [selectedServicosManual, setSelectedServicoManual] = React.useState([]);
    const [selectedEmployeeManual, setSelectedEmployeeManual] = React.useState([]);
    const [nomeClienteManual, setNomeClienteManual] = React.useState('');
    const [numeroClienteManual, setNumeroClienteManual] = React.useState('');
    const [atendimentoEtapa, setAtendimentoEtapa] = React.useState(false);
    const [attendedAppointments, setAttendedAppointments] = React.useState([]);



    const handleChangeHorario = (event) => {
        setSelectedHorarioManual(event.target.value);
    };

    const handleChangeFuncionario = (event) => {
        setEmployeesManual(event.target.value);
    };

    const handleChangeServicos = (event) => {
        const selectedValues = event.target.value;
        console.log(selectedValues)
        setServicosManual(selectedValues);
    };








    const ContainerT = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width:90%
  padding: 20px;
  align-items:center;
  justify-content:center;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;



    const Card = styled.div`
  background-color: #0073b1;
  color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

    const CardR = styled.div`
background-color: #42adda;
color: white;
padding: 20px;
border-radius: 10px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
text-align: center;
transition: transform 0.3s;

&:hover {
  transform: translateY(-5px);
}
`;

    const TitleT = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

    const Value = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
`;

    const Percentage = styled.div`
  font-size: 1.2rem;
  color: #28a745;
  margin-top: 10px;
`;

    const CardT = styled.div`
  display: flex;
  align-items: center;
  background: #e3f2fd;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  transition: transform 0.3s ease-in-out;
  width:80%
  height:400px;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width:80%;
  }
`;

    const Icon = styled.div`
  background: #64b5f6;
  padding: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
  font-size: 26px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

    const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

    const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #1565c0;
  font-weight: bold;
`;

    const Time = styled.p`
  margin: 5px 0 0;
  font-size: 16px;
  color: #424242;
  font-weight: 500;
`;

    const Details = styled.p`
  margin: 5px 0 0;
  font-size: 14px;
  color: #616161;
  font-style: italic;
`;


    const ServiceCardContainer = styled.div`
  position: relative;
  width: 100px;
  padding: 24px;
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 40px;
    height: 40px;
    background: radial-gradient(circle at 70% 30%, rgba(106, 17, 203, 0.1) 0%, transparent 70%);
  }
`;

    const ServiceTitle = styled.h3`
  margin: 0 0 12px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
`;

    const ServiceDescription = styled.p`
  margin: 0 0 16px 0;
  color: #666;
  font-size: 13;
  line-height: 1.5;
`;

    const ServicePrice = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background: rgba(37, 117, 252, 0.1);
  color: #2575fc;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
`;

    const DeleteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  background: rgba(255, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  color: #ff4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 0, 0, 0.2);
    transform: scale(1.1);
  }
`;

    const CopyContainer = styled.div`
  display: flex;
  max-width: 600px;
  margin: 10px auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

    const LinkInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: none;
  outline: none;
  font-size: 16px;
  background-color: #f5f5f5;

  &:focus {
    background-color: #fff;
  }
`;

    const CopyButton = styled.button`
  padding: 0 15px;
  border: none;
  background-color: ${props => props.isCopied ? '#4CAF50' : '#2196F3'};
  color: white;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.3s;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : props.isCopied ? '#45a049' : '#0b7dda'};
  }

  &:disabled {
    background-color: #ccc;
  }
`;


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleOpenRegister = () => setOpenRegister(true);
    const handleCloseRegister = () => setOpenRegister(false);

    const handleOpenList = () => setOpenList(true);
    const handleCloseList = () => setOpenList(false);
    const columns = [
        { field: 'servico', headerName: 'Serviço:', width: 150 },
        { field: 'nome', headerName: 'Nome', width: 130 },
        { field: 'employee', headerName: 'Quem Atende', width: 150 },
        { field: 'time', headerName: 'Horário', width: 130 },
        { field: 'date', headerName: 'Data ( para ):', width: 150 },
        { field: 'phone', headerName: 'Contato', width: 150 },
        { field: 'valorServico', headerName: 'Valor do Serviço', width: 150 }

    ];


    const services = [
        { nome: "Corte de Cabelo", preco: "R$30" },
        { nome: "Barba", preco: "R$20" },
        { nome: "Corte + Barba", preco: "R$45" }
    ];


    const data = [
        { title: "Agendamentos", value: relatorio ? relatorio.clientes : 0, percentage: "+0%" },
        { title: "Agendamentos atendidos", value: relatorio.clientesAtendidos ? relatorio.clientesAtendidos : 0, percentage: "+0%" },
        { title: "Valor Agendado", value: `R$ ${relatorio.valorEmClientes ? relatorio.valorEmClientes.toFixed(2).replace('.', ',') : 0}`, percentage: "+0%" },

        { title: "Receita Líquida", value: `R$ ${relatorio.valorEmClientesAtendidos ? relatorio.valorEmClientesAtendidos.toFixed(2).replace('.', ',') : 0}`, percentage: "+0%" },
    ];

    const paginationModel = { page: 0, pageSize: 5 };



    async function dataInstanceValue() {
        const idi = '3E019F6A2AD3400FBE778E66062CE0C1';

        const tokeni = '0F4CC44688C0009373197BB4';

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

    const handleRowSelection = (selectedId) => {
        console.log('--- INÍCIO DA SELEÇÃO ---');
        console.log('ID recebido:', selectedId, 'Tipo:', typeof selectedId);

        // Verifica se bookedAppointments existe e tem dados
        console.log('Total de agendamentos:', bookedAppointments?.length || 0);

        if (!bookedAppointments || bookedAppointments.length === 0) {
            console.error('Nenhum dado em bookedAppointments');
            setDataRow([]);
            return;
        }

        // Busca o item correspondente (com verificação de tipo)
        const selectedRowData = bookedAppointments.find((row) => {
            console.log(`Comparando: row.id=${row.id} (${typeof row.id}) com selectedId=${selectedId} (${typeof selectedId})`);
            return row.id == selectedId; // Usamos == para compatibilidade de tipos
        });

        if (!selectedRowData) {
            console.warn('Nenhum dado encontrado para o ID:', selectedId);
        } else {
            console.log('Dados encontrados:', selectedRowData);
        }

        setDataRow(selectedRowData ? [selectedRowData] : []);
    };

    console.log('ATENDIDOVALORES::::::::::::::', relatorio)

    const handleRowRecompra = (selectionModel) => {
        // Pegar os dados das linhas selecionadas
        const selectedRowsData = clientesRecompra.filter((row) => selectionModel.includes(row.id));
        setDataRowRecompra(selectedRowsData);

        console.log('Linhas selecionadas:', selectedRowsData);
    };

    console.log('VALORR LINHA SELECIONADA', datarow[0]);

    const clientesAtendidos = () => {
        const db = getDatabase();

        const postData = {
            time: datarow[0].time,
            date: datarow[0].date,
            employee: datarow[0].employee,
            id: datarow[0].id,
            phone: datarow[0].phone,
            nome: datarow[0].nome,
            servico: datarow[0].servico,
            digit: datarow[0].digit,
            valorServico: datarow[0].valorServico,
            atendido: true
        };

        const updatesData = {};
        updatesData[`${base64.encode(user.email)}/agendamentos/${base64.encode(datarow[0].phone + datarow[0].digit)}`] = postData;
        update(ref(db), updatesData).then(() => {
            console.log('passou')

        }).catch(console.error);

        const post = {
            clientesAtendidos: parseFloat(relatorio?.clientesAtendidos) + 1,
            valorEmClientesAtendidos: parseFloat(relatorio?.valorEmClientesAtendidos) + parseFloat(datarow[0].valorServico),
            clientes: relatorio.clientes,
            valorEmClientes: parseFloat(relatorio.valorEmClientes)
        };

        const updates = {};
        updates[`${base64.encode(user.email)}/relatorios`] = post;
        update(ref(db), updates).then(() => {
            setAtendimentoEtapa(!atendimentoEtapa)
            alert('Atendimento concluído com Sucesso!')
        }).catch(console.error);

    }

    const deleteAgendamento = (selectionModel) => {
        const db = getDatabase();
        const post = {
            clientes: relatorio.clientes - 1,
            valorEmClientes: parseFloat(relatorio?.valorEmClientes) ,
            valorEmClientesAtendidos: parseFloat(relatorio?.valorEmClientesAtendidos),
            clientesAtendidos: parseFloat(relatorio?.clientesAtendidos)
        };



        remove(ref(db, `${base64.encode(user.email)}/agendamentos/${base64.encode(datarow[0].phone + datarow[0].digit)}`))
            .then(() => {
                const updates = {};
                updates[`${base64.encode(user.email)}/relatorios`] = post;
                update(ref(db), updates).then(() => alert('Agendamento Cancelado')).catch(console.error);
            })
            .catch(err => console.log(err));
    };

    console.log('REALTORIOSSSS:::::::::::::', relatorio.valorEmClientes)

    console.log('REALTORIOSSSSVALORSERVICOMANUAL:::::::::::::', servicosManual.valor)

    const cadastrarManualCliente = () => {

        if (!selectedHorarioManual || !dateManual || !employeesManual || !nomeClienteManual) {
            window.alert('Preencha os Campos!')
        } {
            const digit1 = bookedAppointments.length + 1

            const db = getDatabase();
            set(ref(db, `${base64.encode(user.email)}/agendamentos/${base64.encode(numeroClienteManual + digit1)}`), {
                time: selectedHorarioManual,
                date: dateManual,
                employee: employeesManual,
                id: digit1,
                phone: numeroClienteManual,
                nome: nomeClienteManual,
                servico: servicosManual.nome,
                digit: digit1,
                atendido: false,
                valorServico: servicosManual.valor
            })
                .then(() => sendMessageAll(body))
                .catch(() => sendMessageAll(bodyError));



            const post = {
                clientes: relatorio.clientes + 1,
                valorEmClientes: parseFloat(relatorio?.valorEmClientes) + parseFloat(servicosManual.valor),
                valorEmClientesAtendidos: parseFloat(relatorio?.valorEmClientesAtendidos),
                clientesAtendidos: parseFloat(relatorio?.clientesAtendidos)
            };

            const updates = {};
            updates[`${base64.encode(user.email)}/relatorios`] = post;
            update(ref(db), updates).catch(console.error);
            const body = {
                message: `✅ Agendamento Confirmado com ${employeesManual} às ${selectedHorarioManual} para ${servicosManual} no dia ${dateManual}.`,
                phone: `+${numeroClienteManual}`,
                delayMessage: 2
            };
            sendMessageAll(body)
            handleCloseList()
        }

    }




    React.useEffect(() => {
        const db = getDatabase()
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
                const db = getDatabase();
                const appointmentsRef = ref(db, `${base64.encode(user.email)}/agendamentos`);

                onValue(appointmentsRef, (snapshot) => {
                    const data = snapshot.val();

                    if (data) {
                        // Obtém a data atual no formato dd/mm
                        const today = new Date();
                        const day = String(today.getDate()).padStart(2, '0');
                        const month = String(today.getMonth() + 1).padStart(2, '0');
                        const todayFormatted = `${day}/${month}`;

                        const allAppointments = Object.values(data).map((appt) => ({
                            time: appt.time,
                            employee: appt.employee,
                            id: appt.id,
                            phone: appt.phone,
                            nome: appt.nome,
                            servico: appt.servico,
                            date: appt.date,
                            digit: appt.digit,
                            atendido: appt.atendido,
                            valorServico: appt.valorServico
                        }));

                        // Filtra agendamentos NÃO atendidos E de hoje
                        const notAttendedToday = allAppointments.filter((appt) =>
                            appt.atendido === false && appt.date === todayFormatted
                        );
                        setBookedAppointments(notAttendedToday);

                        // Filtra agendamentos ATENDIDOS E de hoje (opcional)
                        const attendedToday = allAppointments.filter((appt) =>
                            appt.atendido === true && appt.date === todayFormatted
                        );
                        setAttendedAppointments(attendedToday);
                    } else {
                        setBookedAppointments([]);
                        setAttendedAppointments([]);
                    }
                });

                const appointments = ref(db, `${base64.encode(user.email)}`);

                onValue(appointments, (snapshot) => {
                    setUserData(snapshot.val())
                    setLink(userData?.nameBase64 ? `https://wa.me/5561990008359?text=${snapshot.val().nameBase64}` : null)
                });

                dataInstanceValue()
              
            }
        }
        )

    }, [user,userData])

    React.useEffect(() => {
        const instancia = "3E019F6A2AD3400FBE778E66062CE0C1"; // Substitua pelo ID da instância
        const token = "0F4CC44688C0009373197BB4"; // Substitua pelo token
        const novaUrlWebhook = "https://backendpedro.vercel.app/webhook";

        const atualizarWebhook = async () => {
            try {
                const resposta = await fetch(
                    `https://api.z-api.io/instances/${instancia}/token/${token}/update-webhook-received`,
                    {
                        method: "PUT",
                        headers: {
                            "Client-Token": "F47c6b24b03ef4ecb84a2a76b0fc8617eS",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ value: novaUrlWebhook }),
                    }
                );

                const dados = await resposta.json();
                console.log("✅ Webhook atualizado com sucesso:", dados);
            } catch (erro) {
                console.error("❌ Erro ao atualizar o webhook:", erro);
            }
        };

        const interval = setInterval(atualizarWebhook, 5000);

        return () => clearInterval(interval);
    }, []);

    console.log('USERDATA::::::::', userData)


    React.useEffect(() => {
        const atualizar = async () => {
            try {
                const response = await fetch('https://backendpedro.vercel.app/dadosChat', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                if (!response.ok) {
                    throw new Error(`Erro: ${response.status} - ${response.statusText}`);
                }

                const result = await response.json();

                setMessageDataUser(result)
                setUserMessage(result.text.message)
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };



        const interval = setInterval(() => {
            atualizar();
        }, 5000);

        return () => clearInterval(interval);
    }, []);


    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const [year, month, day] = isoDate.split("-");
        return `${day}/${month}`;
    };


    React.useEffect(() => {
        if (
            bookedAppointments &&
            Object.keys(userData.funcionarios || {}).length > 0
        ) {
            const appointmentsForDate = bookedAppointments.filter(
                (appt) => appt.date === selectedDate
            );
            const updatedAvailableTimes = workHours.filter((time) => {
                const hasFreeEmployee = Object.entries(userData.funcionarios).some(
                    ([empKey]) => {
                        return !appointmentsForDate.some(
                            (appt) => appt.time === time && appt.employee === empKey
                        );
                    }
                );
                return hasFreeEmployee;
            });

            setAvailableTimes(updatedAvailableTimes);

            const filteredEmployees = Object.entries(userData.funcionarios)
                .filter(([empKey]) =>
                    updatedAvailableTimes.some(
                        (time) =>
                            !appointmentsForDate.some(
                                (appt) =>
                                    appt.time === time && appt.employee === empKey
                            )
                    )
                )
                .map(([empKey, empData]) => ({
                    key: empKey,
                    nome: empData.nome,
                    cargo: empData.cargo
                }));

            setAvailableEmployees(filteredEmployees);

            // Logs de debug
            console.log("📋 Selecteddate", selectedDate);
            console.log("🕒 Horários disponíveis:", updatedAvailableTimes);
            console.log("👥 Funcionários disponíveis:", filteredEmployees);
        }
    }, [bookedAppointments, userData, workHours, userMessage]);


    React.useEffect(() => {

        // Filtra os agendamentos
        const appointmentsForDate = bookedAppointments.filter(
            appt => appt.date === dateManual
        );

        const availableTimes = workHours.filter(time =>
            !appointmentsForDate.some(appt => appt.time === time)
        );

        setManualHorarios(availableTimes)

        const servicesArray = userData?.servicos
            ? Object.entries(userData.servicos).map(([_, servico], index) => ({
                tempId: index, // Criamos um ID temporário
                nome: servico?.nome || 'Nome não definido',
                valor: servico?.valor || 0
            }))
            : [];

        setSelectedServicoManual(servicesArray);


    }, [dateManual, userData]);

    React.useEffect(() => {
        if (!dateManual || !horarioManual || !userData.funcionarios || !bookedAppointments) {
            setEmployeesManual([]); // Limpa se faltar algum dado
            return;
        }

        // 1. Converte bookedAppointments para array (se necessário)
        const appointmentsArray = Array.isArray(bookedAppointments)
            ? bookedAppointments
            : Object.values(bookedAppointments || {});

        // 2. Filtra e mapeia apenas os NOMES dos funcionários disponíveis
        const availableEmployeeNames = Object.entries(userData.funcionarios)
            .filter(([empKey]) => { // Usamos apenas a chave (empKey)
                return !appointmentsArray.some(appt =>
                    appt.time === horarioManual &&
                    appt.date === dateManual &&
                    appt.employee === empKey
                );
            })
            .map(([, empData]) => empData.nome); // Extrai apenas o nome

        // 3. Atualiza o estado com a lista de nomes
        setSelectedEmployeeManual(availableEmployeeNames);

    }, [dateManual, horarioManual, userData.funcionarios, bookedAppointments]);


    React.useEffect(() => {

        if (userMessage.toLowerCase() === "agendar") {
            const bodyT = {
                phone: `+${messageDataUser.phone}`,
                message: `${userData.mensagens.msgCadastro}`,
                delayMessage: 2
            };

            sendMessageAll(bodyT);
            setProxAgendar(true)

        }

        else if (userMessage.toLowerCase() === "1" && !selectedDate && proxAgendar) {
            const body = {
                message: `Qual a data desejada? (Digite no formato dia/mês: *Ex: 22/04*)`,
                phone: `+${messageDataUser.phone}`,
                delayMessage: 2
            };
            sendMessageAll(body);
            setProxAgendar(false)

        }

        else if (!selectedDate && /^\d{2}\/\d{2}$/.test(userMessage)) {
            // Validação melhorada da data (corrigida)
            const [day, month] = userMessage.split('/').map(Number);
            const currentYear = new Date().getFullYear();

            // Cria a data corretamente (mês -1 porque JavaScript usa 0-11)
            const dateObj = new Date(currentYear, month - 1, day);

            // Verifica se a data é válida (agora comparando com os valores originais)
            if (dateObj.getDate() !== day ||
                dateObj.getMonth() + 1 !== month ||
                dateObj.getFullYear() !== currentYear) {
                const body = {
                    message: `Data inválida. Por favor, digite no formato dia/mês válido: *Ex: 22/04*`,
                    phone: `+${messageDataUser.phone}`,
                    delayMessage: 2
                };
                sendMessageAll(body);
                return;
            }

            setSelectedDate(userMessage);
            setEtapaDate(true);

            // Formata a data para o padrão do seu sistema (se necessário)
            const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`;

            // Filtra os agendamentos
            const appointmentsForDate = bookedAppointments.filter(
                appt => appt.date === formattedDate
            );

            const availableTimes = workHours.filter(time =>
                !appointmentsForDate.some(appt => appt.time === time)
            );

            // Envia a resposta
            if (availableTimes.length > 0) {
                const body = {
                    message: `Horários disponíveis para ${formattedDate}:\n\n${availableTimes.join('\n')}\n\n*Digite o horário desejado (ex: 14:00)*`,
                    phone: `+${messageDataUser.phone}`,
                    delayMessage: 2
                };
                sendMessageAll(body);
            } else {
                const body = {
                    message: `Não há horários disponíveis para ${formattedDate}. Por favor, escolha outra data.`,
                    phone: `+${messageDataUser.phone}`,
                    delayMessage: 2
                };
                sendMessageAll(body);
                setSelectedDate(userMessage);
                setEtapaDate(false);
            }
        }

        else if (selectedDate && !selectedTime && /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(userMessage)) {
            setSelectedTime(userMessage);

            // Verifica se userData e userData.servicos existem
            if (userData && userData.servicos) {
                // Converte o objeto de serviços em array
                const servicesArray = Object.entries(userData.servicos).map(([key, servico]) => ({
                    id: key,
                    ...servico
                }));

                // Cria a lista de serviços para a mensagem
                const serviceList = servicesArray
                    .map((servico, index) => `${index + 1}. ${servico.nome} - ${servico.valor}`)
                    .join("\n");

                const serviceBody = {
                    phone: `+${messageDataUser.phone}`,
                    message: `Escolha um dos serviços disponíveis abaixo:\n\n${serviceList}\n\n*Digite o número do serviço desejado.*`,
                    delayMessage: 2
                };

                sendMessageAll(serviceBody);
            } else {
                console.error("Serviços não disponíveis no userData");
                // Você pode adicionar um tratamento de erro aqui, como enviar uma mensagem ao usuário
            }
        }
        // Usuário escolheu um serviço pelo índice
        else if (selectedTime && selectedDate && !servicoSelecionado && /^\d+$/.test(userMessage)) {
            const services = Object.entries(userData.servicos).map(([key, servico]) => ({
                id: key,
                nome: servico.nome,
                valor: servico.valor  // Note que mudei de "valor" para "preco" para manter compatibilidade
            }));

            const serviceIndex = parseInt(userMessage) - 1;
            const selectedService = services[serviceIndex];
            setServicoSelecionado(selectedService);
            if (selectedService) {
                const availableEmployees = Object.keys(userData.funcionarios).filter(
                    (emp) =>
                        Array.isArray(bookedAppointments) &&
                        !bookedAppointments.some(
                            (appt) =>
                                appt.time === selectedTime &&
                                appt.date === selectedDate &&
                                appt.employee === emp
                        )
                );

                if (availableEmployees.length > 0) {
                    const employeesList = availableEmployeesa
                        .map((emp, index) => `${index + 1}. ${emp.nome}`)
                        .join("\n");

                    const employeeBody = {
                        phone: `+${messageDataUser.phone}`,
                        message: `Funcionários disponíveis para ${selectedTime} no dia ${selectedDate}:\n\n${employeesList}\n\n*Digite o número correspondente ao funcionário desejado.*`,
                        delayMessage: 2
                    };



                    sendMessageAll(employeeBody)



                    setTimeout(() => {
                        setEtapaConfirm(true)
                    }, 8000);



                }

            }
        } else if (selectedEmployee) {
            console.log('EMPLYEEESELEICOADOOO')
        }



    }, [userMessage, selectedDate, servicoSelecionado]);


    React.useEffect(() => {
        const podeAgendar = etapaConfirm && servicoSelecionado && /^\d+$/.test(userMessage);

        if (podeAgendar) {
            const index = parseInt(userMessage) - 1;
            const selectedFunc = availableEmployeesa[index];

            if (!selectedFunc) return;

            setSelectedEmployee(selectedFunc.nome);

            const body = {
                message: `✅ Agendamento Confirmado com ${selectedFunc.nome} às ${selectedTime} no dia ${selectedDate}.`,
                phone: `+${messageDataUser.phone}`,
                delayMessage: 2
            };

            const bodyError = {
                message: `❌ Instabilidade para agendamentos com ${selectedFunc.nome} às ${selectedTime} no dia ${selectedDate}.`,
                phone: `+${messageDataUser.phone}`,
                delayMessage: 2
            };

            const digit1 = bookedAppointments.length + 1

            const db = getDatabase();
            set(ref(db, `${base64.encode(user.email)}/agendamentos/${base64.encode(messageDataUser.phone + digit1)}`), {
                time: selectedTime,
                date: selectedDate,
                employee: selectedFunc.nome,
                id: messageDataUser.phone,
                phone: messageDataUser.phone,
                nome: messageDataUser.senderName,
                servico: servicoSelecionado?.nome ?? "",
                digit: digit1,
                atendido: false,
                valorServico: servicoSelecionado.valor
            })
                .then(() => sendMessageAll(body))
                .catch(() => sendMessageAll(bodyError));

            const post = {
                clientes: relatorio.clientes + 1,
                valorEmClientes: parseFloat(relatorio?.valorEmClientes) + parseFloat(servicoSelecionado.valor),
                valorEmClientesAtendidos: parseFloat(relatorio?.valorEmClientesAtendidos),
                clientesAtendidos: parseFloat(relatorio?.clientesAtendidos)
            };

            const updates = {};
            updates[`${base64.encode(user.email)}/relatorios`] = post;
            update(ref(db), updates).catch(console.error);

            setEtapaConfirm(false);
            setProxAgendar(false);
            setSelectedDate(false);
            setSelectedTime(false)
            setServicoSelecionado(false)
        }
    }, [userMessage, etapaConfirm]);





    console.log('agendamentos::::::::', selectedDate)


    /*          const isEmployeeAvailable = Array.isArray(bookedAppointments) && !bookedAppointments.some(
            (appt) => appt.time === selectedTime && appt.employee === userMessage
          ); 
          
         

          ---
          ---
          ---

       
          */


    React.useEffect(() => {
        if (bookedAppointments) {
            const next = getNextBookedTime(bookedAppointments);
            setNextBooked(next);
        }
    }, [bookedAppointments]);

    const getNextBookedTime = (bookedAppointments = []) => {
        if (!Array.isArray(bookedAppointments) || bookedAppointments.length === 0) {
            return null;
        }

        const sortedAppointments = [...bookedAppointments].sort((a, b) => {
            return a.time.localeCompare(b.time);
        });

        return sortedAppointments[0]; // Retorna o objeto inteiro { time, employee }
    };


    React.useEffect(() => {
        const dataa = getDatabase()
        const dbRef = ref(getDatabase());

        get(child(dbRef, `${base64.encode(user.email)}/relatorios`)).then((snapshot) => {
            if (snapshot.exists()) {
                setRelatorio(snapshot.val())
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });

    }, [user, bookedAppointments])




    const handleChangeMenu = (event) => {

        if (event == 'Cadastrar Funcionário') {
            handleOpen()
        } else if (event == 'Cadastrar Serviços') {
            handleOpenRegister()
        }


    };

    const handleCopy = async () => {
        if (!isLink) return;

        navigator.clipboard.writeText(isLink)
        .then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
            console.error('Falha ao copiar texto: ', err);
        });
      
    };

    const onDeleteService = (service) => {

        const db = getDatabase();
        remove(ref(db, `${base64.encode(user.email)}/servicos/${base64.encode(service.valor + service.nome)}`), {})
            .then(() => alert('Serviço removido!'))
            .catch(err => console.log(err));

    };

    const onDeleteEmployee = (service) => {

        const db = getDatabase();
        remove(ref(db, `${base64.encode(user.email)}/funcionarios/${base64.encode(service.nome + service.cargo)}`), {})
            .then(() => alert('Serviço removido!'))
            .catch(err => console.log(err));

    };

    async function registerFuncionario() {
        const db = getDatabase();
        set(ref(db, `${base64.encode(user.email)}/funcionarios/${base64.encode(nomeFuncionario + cargoFuncionario)}`), {
            nome: nomeFuncionario,
            cargo: cargoFuncionario
        }).then(() => handleClose()).catch(() => console.log());


    }

    async function registerServico() {
        const db = getDatabase();
        set(ref(db, `${base64.encode(user.email)}/servicos/${base64.encode(valorServico + nomeServico)}`), {
            nome: nomeServico,
            valor: valorServico
        }).then(() => handleCloseRegister()).catch(error => console.log('ERRO AO CADASTRAR SERVIÇO:::::::', error));


    }

    const fetchBookedAppointments = async () => {
        const dbRef = ref(database, `${base64.encode(user.email)}/agendamentos`); // Referência para a coleção 'clientes'

        // Escuta mudanças em tempo real
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const dataList = Object.keys(data).map((key) => ({
                    id: key,

                    fotoUrl: data[key].fotoUrl
                }));

                setDataClientes(dataList);

            }
        })
    }


    const handleFilterChange = (e) => {
        const value = e.target.value.toLowerCase(); // Converte o valor do filtro para minúsculas
        setFilterValue(value); // Atualiza o valor do filtro

        const filtered = bookedAppointments.filter((item) =>
            item.nome.toLowerCase().includes(value) ||
            item.employee.toLowerCase().includes(value) ||
            item.time.toLowerCase().includes(value) ||
            item.doses.toLowerCase().includes(value) ||
            item.remedio.toLowerCase().includes(value)
        );

        setFilteredData(filtered); // Atualiza os dados filtrados
    };

    const RenderConnected = () => {
        if (connectednumber) {
            return (
                <GreenBox>Conectado</GreenBox>
            )
        } else {
            return (
                <RedBox>Desconectado</RedBox>
            )
        }
    }


    const RenderPayment = () => {
        if (paymentState.assinatura) {
            return (
                <GreenBox>Assinatura Ativa</GreenBox>
            )
        } else {
            return (
                <RedBox>Assinatura Inativa</RedBox>
            )
        }
    }

    console.log('HORARIOS DISPONÍVEIS::::', horarioManual)


    if (!user) {
        navigate('/loading')
    }

    return (
        <>
            <Header />

            <Body>


                <Container2>
                    <div style={{ display: 'flex', gap: 20 }} >
                        <RenderConnected />

                    </div>

                    <CopyContainer>
                        <LinkInput
                            type="text"
                            value={isLink}
                            readOnly
                        />
                        <CopyButton
                            onClick={handleCopy}
                            disabled={!isLink}
                            isCopied={isCopied}
                        >
                            {isCopied ? 'Copiado!' : 'Copiar'}
                        </CopyButton>
                    </CopyContainer>


                    <ContainerRules>

                        <ContainerT>
                            {data.map((item, index) => (
                                <Card key={index}>
                                    <TitleT>{item.title}</TitleT>
                                    <Value>{item.value}</Value>
                                    <Percentage>{item.percentage}</Percentage>

                                </Card>


                            ))}

                            <CardT>
                                <Icon>
                                    <img style={{ width: 30, height: 30 }} alt='icon' src='time-left.png' />
                                </Icon>
                                <Info>
                                    <Title>Próximo Horário</Title>
                                    <Time>{nextBooked?.time}</Time>
                                    {<Details>{nextBooked?.nome} - {nextBooked?.phone}</Details>}
                                </Info>
                            </CardT>


                        </ContainerT>
                        <div style={styleFuncServ} >
                            <div style={{ display: "flex", flexDirection: 'column' }} >
                                <h3 style={{ color: 'Black', alignSelf: 'flex-start', fontSize: 22 }} >Serviços:</h3>
                                <div style={{ display: 'flex', width: '45%', gap: 10, minWidth: 220, flexWrap: 'wrap' }} >

                                    {
                                        userData?.servicos ? (
                                            Object.keys(userData.servicos).map((key, index) => {
                                                const servico = userData.servicos[key];
                                                return (
                                                    <ServiceCardContainer key={key}>
                                                        <DeleteButton onClick={() => onDeleteService(servico)}>
                                                            ×
                                                        </DeleteButton>
                                                        <ServiceTitle>{index + 1} - {servico.nome}</ServiceTitle>
                                                        <ServiceDescription>Serviço</ServiceDescription>
                                                        <ServicePrice>{servico.valor}</ServicePrice>
                                                    </ServiceCardContainer>
                                                );
                                            })
                                        ) : (
                                            <p style={{ fontWeight: "bold", color: 'white' }} >Nenhum serviço cadastrado</p>
                                        )
                                    }
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: 'column', width: '40%' }} >
                                <h3 style={{ color: 'Black', alignSelf: 'flex-start', fontSize: 22 }} >Funcionários:</h3>
                                <div style={{ display: 'flex', minWidth: '100%', gap: 10, flexWrap: 'wrap' }} >

                                    {
                                        userData?.funcionarios ? (
                                            Object.keys(userData.funcionarios).map((key, index) => {
                                                const servico = userData.funcionarios[key];
                                                return (
                                                    <ServiceCardContainer key={key}>
                                                        <DeleteButton onClick={() => onDeleteEmployee(servico)}>
                                                            ×
                                                        </DeleteButton>
                                                        <ServiceTitle>{index + 1} - {servico.nome}</ServiceTitle>
                                                        <ServiceDescription>Função:</ServiceDescription>
                                                        <ServicePrice>{servico.cargo}</ServicePrice>
                                                    </ServiceCardContainer>
                                                );
                                            })
                                        ) : (
                                            <p style={{ fontWeight: "bold", color: 'white' }} >Nenhum Funcionário cadastrado</p>
                                        )
                                    }
                                </div>
                            </div>
                        </div>

                    </ContainerRules>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '95%' }} >

                        <Typography style={{ fontWeight: 'bold', color: 'black', fontSize: '22px', alignSelf: 'flex-start' }} >Agendamentos para hoje:</Typography>
                        <InputText placeholder='Pesquisar...' value={filterValue} onChange={e => handleFilterChange(e)} />
                        <Paper sx={{ height: 400, width: '100%', alignSelf: 'flex-start' }}>
                            <DataGrid

                                rows={bookedAppointments}
                                columns={columns}
                                initialState={{ pagination: { paginationModel } }}
                                pageSizeOptions={[10]}
                                checkboxSelection
                                sx={{ border: 0 }}
                                onRowSelectionModelChange={handleRowSelection}
                                disableRowSelectionOnClick={false}
                                getRowId={bookedAppointments.id}
                                {...bookedAppointments}
                            />
                        </Paper>
                        <div style={{ width: '100%', display: 'flex', gap: 10, justifyContent: 'flex-end' }} >

                            {
                                datarow ? (<Button style={{ alignSelf: 'flex-end', marginTop: 10, backgroundColor: 'red' }} variant='contained' onClick={() => deleteAgendamento()}>Cancelar Agendamento</Button>

                                ) : <Button style={{ alignSelf: 'flex-end', marginTop: 10, backgroundColor: 'red', color: "white" }} variant='outlined' onClick={() => null}>Cancelar Agendamento</Button>
                            }

                            <Button style={{ alignSelf: 'flex-end', marginTop: 10, backgroundColor: 'green', color: "white" }} variant='contained' onClick={() => setOpenList(true)}>Agendar Manual</Button>


                            <Button style={{ alignSelf: 'flex-end', marginTop: 10, color: "white" }} variant='contained' onClick={() => clientesAtendidos()}>Atendimento Concluído</Button>


                        </div>

                        <Typography style={{ fontWeight: 'bold', color: 'white', fontSize: '22px' }} >Atendidos: </Typography>

                        <Paper sx={{ height: 300, width: '100%', alignSelf: 'center' }}>

                            <DataGrid

                                rows={attendedAppointments}
                                columns={columns}
                                initialState={{ pagination: { paginationModel } }}
                                pageSizeOptions={[10]}
                                checkboxSelection
                                sx={{ border: '6px dotted #0073b1' }}
                                onRowSelectionModelChange={handleRowRecompra}
                                {...attendedAppointments}
                            />
                        </Paper>

                        {
                            dataRowRecompra ? (<Button style={{ alignSelf: 'flex-end', marginTop: 10 }} variant='contained' onClick={() => rowSelectedRecompra()}>Recoomprado</Button>

                            ) : <Button style={{ alignSelf: 'flex-end', marginTop: 10 }} variant='outlined' onClick={() => rowSelectedRecompra()}>Recomprado</Button>
                        }

                    </div>

                    <SpeedDial
                        ariaLabel="SpeedDial basic example"
                        sx={{ position: 'absolute', bottom: 25, right: 25 }}
                        icon={<SpeedDialIcon />}

                    >
                        {actions.map((action) => (

                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={() => handleChangeMenu(action.name)}
                                style={{ backgroundColor: '#0073b1' }}
                            />
                        ))}
                    </SpeedDial>
                </Container2>




            </Body>





            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 7 }} >
                        <Typography id="modal-modal-title" variant="h3" style={{ fontWeight: 'bold', fontSize: 20 }} >
                            Cadastrar Funcionário:
                        </Typography>

                    </div>
                    <Typography id="modal-modal-title" variant="h5" style={{ fontWeight: '500', marginTop: 10, fontSize: 16 }} >
                        Nome:
                    </Typography>
                    <TextField id="outlined-basic-cpf" style={{ marginTop: 15 }} value={nomeFuncionario} label="Insira um nome...." onChange={text => setNomeFuncionario(text.target.value)} placeholder='Mensagem' fullWidth variant="outlined" />

                    <Typography id="modal-modal-title" variant="h5" style={{ fontWeight: '500', marginTop: 10, fontSize: 16 }} >
                        Cargo:
                    </Typography>
                    <TextField id="outlined-basic-cpf" style={{ marginTop: 15 }} value={cargoFuncionario} label="insira um cargo..." onChange={text => setCargoFuncionario(text.target.value)} placeholder='Mensagem' fullWidth variant="outlined" />

                    <Button style={{ marginTop: 10, backgroundColor: '#0073b1' }} variant='contained' fullWidth onClick={() => registerFuncionario()}>Cadastrar</Button>


                </Box>
            </Modal>


            <Modal
                open={openRegister}
                onClose={handleCloseRegister}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 7 }} >
                        <Typography id="modal-modal-title" variant="h3" style={{ fontWeight: 'bold', fontSize: 20 }} >
                            Cadastrar Serviço:
                        </Typography>

                    </div>
                    <Typography id="modal-modal-title" variant="h5" style={{ fontWeight: '500', marginTop: 10, fontSize: 16 }} >
                        Nome Do Serviço:
                    </Typography>
                    <TextField id="outlined-basic-cpf" style={{ marginTop: 15 }} value={nomeServico} label="Insira um nome...." onChange={text => setNomeServico(text.target.value)} placeholder='Mensagem' fullWidth variant="outlined" />

                    <Typography id="modal-modal-title" variant="h5" style={{ fontWeight: '500', marginTop: 10, fontSize: 16 }} >
                        Valor Do Serviço:
                    </Typography>
                    <TextField id="outlined-basic-cpf" style={{ marginTop: 15 }} value={valorServico} label="Ex: 15.50..." onChange={text => setValorServico(text.target.value)} placeholder='Mensagem' fullWidth variant="outlined" />

                    <Button style={{ marginTop: 10, backgroundColor: '#0073b1' }} variant='contained' fullWidth onClick={() => registerServico()}>Cadastrar</Button>


                </Box>
            </Modal>


            <Modal
                open={openList}
                onClose={handleCloseList}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 7 }} >
                        <Typography id="modal-modal-title" variant="h3" style={{ fontWeight: 'bold', fontSize: 20 }} >
                            Adicionar Agendamento:
                        </Typography>

                    </div>
                    <Typography id="modal-modal-title" variant="h5" style={{ fontWeight: '500', marginTop: 10, fontSize: 16 }} >
                        Nome Do Cliente:
                    </Typography>

                    <TextField id="outlined-basic-cpf" style={{ marginTop: 15 }} value={nomeClienteManual} label="Insira o Nome...." onChange={text => setNomeClienteManual(text.target.value)} placeholder='Mensagem' fullWidth variant="outlined" />

                    <Typography id="modal-modal-title" variant="h5" style={{ fontWeight: '500', marginTop: 10, fontSize: 16 }} >
                        Número WhatsApp
                    </Typography>

                    <TextField id="outlined-basic-cpf" style={{ marginTop: 15 }} value={numeroClienteManual} label="Insira o Número...." onChange={text => setNumeroClienteManual(text.target.value)} placeholder='Mensagem' fullWidth variant="outlined" />

                    <Typography id="modal-modal-title" variant="h5" style={{ fontWeight: '500', marginTop: 10, fontSize: 16 }} >
                        Data Formato: - Ex:. 16/04:
                    </Typography>

                    <TextField id="outlined-basic-cpf" style={{ marginTop: 15 }} value={dateManual} label="Insira uma data Ex:.DD/MM...." onChange={text => setDateManual(text.target.value)} placeholder='Mensagem' fullWidth variant="outlined" />


                    <Typography id="modal-modal-title" variant="h5" style={{ fontWeight: '500', marginTop: 10, fontSize: 16 }} >
                        Horários disponíveis:
                    </Typography>

                    <FormControl fullWidth>
                        <Select
                            labelId="horario-select-label"
                            id="horario-select"
                            value={selectedHorarioManual}
                            label="Horário"
                            onChange={handleChangeHorario}
                            disabled={dateManual != '' ? false : true}

                        >
                            {horarioManual.map((horario, index) => (
                                <MenuItem key={index} value={horario} >
                                    {horario}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>



                    <Typography id="modal-modal-title" variant="h5" style={{ fontWeight: '500', marginTop: 10, fontSize: 16 }} >
                        Escolha o Funcionário:
                    </Typography>

                    <FormControl fullWidth>
                        <Select
                            labelId="horario-select-label"
                            id="employee-select"
                            value={employeesManual}
                            label="Horário"
                            onChange={handleChangeFuncionario}
                            disabled={dateManual !== '' ? false : true}
                        >
                            {/* Supondo que você tenha um array de horários chamado 'availableTimes' */}
                            {selectedEmployeeManual.map((employee, index) => (
                                <MenuItem key={index} value={employee} >
                                    {employee}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography id="modal-modal-title" variant="h5" style={{ fontWeight: '500', marginTop: 10, fontSize: 16 }} >
                        Escolha o serviço:
                    </Typography>

                    <FormControl fullWidth>
                        <Select
                            value={servicosManual}
                            onChange={handleChangeServicos}
                            disabled={dateManual !== '' ? false : true}
                        >
                            {selectedServicosManual.map((servico) => (
                                <MenuItem key={servico.tempId} value={servico}>
                                    {servico.nome} - R$ {servico.valor}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                    <Button style={{ marginTop: 10, backgroundColor: '#0073b1' }} variant='contained' fullWidth onClick={() => cadastrarManualCliente()}>Cadastrar</Button>


                </Box>
            </Modal>



        </>
    );
}

export default Measurement


/* 



   {
                            dataClientes.length > 0 ? (dataClientes.map((item) => {
                                if (item.nome) {
                                    return 
                                } else {
                                    return null
                                }
                            })) : (
                                <Typography style={{ fontWeight: '600', color: '#999592', fontSize: '14px', alignSelf: 'flex-start' }} > Nenhum usuário cadastrado </Typography>

                            )
                        }





                            <Container1>
                        <ContainerRules1>   <Typography style={{ alignSelf: 'flex-start', fontWeight: 'bold', color: '#da4103', fontSize: '22px' }} >Estabelecimento: Drogasil</Typography>

                        </ContainerRules1>



                        <div style={{ flexDirection: 'row', display: 'flex', width: '100%', gap: '40%' }} >
                            <Typography style={{ alignSelf: 'flex-start', fontWeight: 'bold', color: 'white', fontSize: '22px' }} >Cadastros:</Typography>
                            <Button style={{ alignSelf: 'flex-end' }} onClick={handleOpenRegister} variant="outlined">Cadastrar</Button>
                        </div>





                     

                    </Container1>







                    Automação horário remedeio


                    React.useEffect(() => {
        if (user) {
            const dbRef = ref(database, `${base64.encode(user.email)}/clientes`); // Referência para a coleção 'clientes'

            // Escuta mudanças em tempo real
            onValue(dbRef, (snapshot) => {
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
                        mensagens: data[key].mensagens,
                        horario: data[key].horario,
                        dataCadastro: data[key].dataCadastro,
                        emailDono: user.email,
                        valorMedicamento: data[key].valorMedicamento,
                        msgUsoContinuo: data[key].msgUsoContinuo,
                        msgReceita: data[key].msgReceita,
                        digit: data[key].digit,
                        fotoUrl: data[key].fotoUrl
                    }));

                    setDataClientes(dataList);




                    // Carregar mensagens
                    const dbRefMensagens = ref(getDatabase());
                    get(child(dbRefMensagens, `${base64.encode(user.email)}/mensagens`))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                setUserData(snapshot.val());
                            } else {
                                console.log("No data available");
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                } else {
                    setFilteredData([]);
                    setDataClientes([]);
                    setClientesRecompra([]); // Define lista vazia se não houver dados
                }
            });
        } else {
            setFilteredData([]);
            setDataClientes([]);
            setClientesRecompra([]); // Define lista vazia se o usuário não estiver logado
        }
    }, [user]);



    React.useEffect(() => {
        if (dataClientes) {
            const hoje = new Date(); // Data atual

            const clientesRecompra = dataClientes.filter((item) => {
                // Divide o formato "DD/MM/YYYY" em partes
                const [dia, mes, ano] = item.acabaEm.split("/").map(Number);

                // Cria um objeto Date no formato correto (mês é 0-indexado)
                const dataAcabaEm = new Date(ano, mes - 1, dia);

                // Calcula três dias antes de dataAcabaEm
                const tresDiasAntes = new Date(dataAcabaEm);
                tresDiasAntes.setDate(tresDiasAntes.getDate() - 3);

                // Verifica se hoje está dentro do intervalo de 3 dias ou menos
                return hoje >= tresDiasAntes && hoje <= dataAcabaEm;
            });

            setClientesRecompra(clientesRecompra); // Atualiza o array com os clientes filtrados

            const soma = clientesRecompra.reduce(
                (acumulador, objeto) => Number(acumulador) + Number(objeto.valorMedicamento),
                0
            );

            // Chama o método setValorNegativoRecompra com o valor negativo
            setValorNegativoRecompra(soma);
        }
    }, [dataClientes]); // Inclua dataClientes


    React.useEffect(() => {
        if (dataClientes) {
            const hoje = new Date(); // Data atual

            const clientesRecompra = dataClientes.filter((item) => {
                // Divide o formato "DD/MM/YYYY" em partes
                const [dia, mes, ano] = item.acabaEm.split("/").map(Number);

                // Cria um objeto Date no formato correto (mês é 0-indexado)
                const dataAcabaEm = new Date(ano, mes - 1, dia);

                // Calcula três dias antes de dataAcabaEm
                const tresDiasAntes = new Date(dataAcabaEm);
                tresDiasAntes.setDate(tresDiasAntes.getDate() - 3);

                // Retorna os itens que NÃO têm diferença de 3 dias
                return hoje.toDateString() !== tresDiasAntes.toDateString();
            });

            setFilteredData(clientesRecompra); // Atualiza o array com os clientes filtrados
        }
    }, [dataClientes]); // Inclua dataClientes na lista de dependências


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
                        assinar: data[key].assinar,
                        isconnected: data[key].isconnected,
                        relatorios: data[key].relatorios
                    }));
                    setClientforTime(dataList);




                } else {
                    return null // Define uma lista vazia caso não haja dados
                }
                console.log(clientForTime)

            });
            return unsubscribe;
        }, 60000);
        return () => clearInterval(intervalo);




    }, [])

    React.useEffect(() => {
        const agora = new Date();
        if (clientForTime) {
            clientForTime.forEach((client) => {
                if (client.clientes) {
                    Object.values(client.clientes).forEach((cliente) => {
                        const acabaEmStr = cliente.acabaEm; // Ex: "16/10/2024"
                        const [dia, mes, ano] = acabaEmStr.split("/").map(Number); // Quebra o formato DD/MM/YYYY
                        const dataAcabaEm = new Date(ano, mes - 1, dia); // Cria objeto Date para `acabaEm`

                        // Calcula o momento exato para envio (36 horas antes)
                        const momentoEnvio = new Date(dataAcabaEm);
                        momentoEnvio.setHours(momentoEnvio.getHours() - 58);

                        // Verifica se o horário atual corresponde ao momento de envio
                        const horas = String(agora.getHours()).padStart(2, "0");
                        const minutos = String(agora.getMinutes()).padStart(2, "0");
                        const dataAtualStr = `${agora.getFullYear()}-${String(
                            agora.getMonth() + 1
                        ).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")} ${horas}:${minutos}`;

                        const momentoEnvioStr = `${momentoEnvio.getFullYear()}-${String(
                            momentoEnvio.getMonth() + 1
                        ).padStart(2, "0")}-${String(momentoEnvio.getDate()).padStart(2, "0")} ${String(
                            momentoEnvio.getHours()
                        ).padStart(2, "0")}:${String(momentoEnvio.getMinutes()).padStart(2, "0")}`;

                        console.log('momentoenvio::::', momentoEnvioStr, 'dataatualizar:::', dataAtualStr)

                        if (dataAtualStr === momentoEnvioStr) {
                            const body = {
                                message: `,${cliente.msgUsoContinuo} - Medicação: ${cliente.remedio}`,
                                phone: `55${cliente.contato}`,
                                delayMessage: 10,
                            };

                            console.log("Enviando mensagem para:", cliente.contato);
                            sendMessageAll(body); // Função já implementada para envio de mensagem
                        }
                    });
                }
            });
        }
    }, [clientForTime])




    React.useEffect(() => {
        const processClients = async () => {
            if (clientForTime) {
                for (const client of clientForTime) {
                    if (client.clientes) {
                        for (const cliente of Object.values(client.clientes)) {
                            for (const clienteT of Object.values(cliente.horario)) {
                                const agora = new Date();
                                const horas = String(agora.getHours()).padStart(2, "0");
                                const minutos = String(agora.getMinutes()).padStart(2, "0");

                                // Converter cliente.acabaEm para objeto Date
                                const [dia, mes, ano] = cliente.acabaEm.split('/');
                                const dataFinal = new Date(`${ano}-${mes}-${dia}`);

                                if (clienteT.hora === `${horas}:${minutos}` && agora <= dataFinal) {
                                    if (user.email === 'pedroyago132@gmail.com') {

                                        if (client.mensagens.msgHorario != 'undefined' && client.mensagens.msgHorario) {
                                            const body = {
                                                message: `${client.mensagens.msgHorario} - ${cliente.remedio}, agora às ${horas}:${minutos}`,
                                                phone: `55${cliente.contato}`,
                                                delayMessage: 10,

                                            }
                                            await sendMessageAll(body);
                                        }




                                        if (cliente.fotoUrl) {
                                            const bodyImage = {
                                                phone: `55${cliente.contato}`,
                                                image: `${cliente.fotoUrl}`,
                                                caption: "Remédio",
                                            };
                                            await sendImage(bodyImage);
                                        }

                                        if (cliente) {
                                            az(cliente);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }


        };

        // Executa a função a cada 60 segundos
        const interval = setInterval(() => {
            processClients();
        }, 40000);

        // Limpa o intervalo quando o componente é desmontado
        return () => clearInterval(interval);
    }, [clientForTime]);


    async function az(cliente) {
        const db = getDatabase();
        const postNome = {
            nome: cliente.nome,
            cpf: cliente.cpf,
            contato: cliente.contato,
            acabaEm: cliente.acabaEm,
            doses: cliente.doses - 1,
            remedio: cliente.remedio,
            horario: cliente.horario,
            dataCadastro: cliente.dataCadastro,
            receita: true,
            usoContinuo: cliente.usoContinuo,
            msgUsoContinuo: cliente.msgUsoContinuo,
            msgReceita: cliente.msgReceita,
            digit: cliente.digit,
            fotoUrl: cliente.fotoUrl,
            emailDono: cliente.emailDono,
            valorMedicamento: cliente.valorMedicamento
        };

        const updates = {};
        updates[`${base64.encode(cliente.emailDono)}/clientes/${base64.encode(cliente.cpf + cliente.digit + cliente.remedio)}`] = postNome;

        try {
            await update(ref(db), updates);
            console.log('Dose alterada');
        } catch (log) {
            console.log('ERROREDITUSER:::::', log);
        }
    }

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






   
    
*/




/*

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
const db = getDatabase()
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        setUser(user)


        const dbRef = ref(db, `${base64.encode(user.email)}/assinar`);
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                setPaymentState(data)
                if (data.id) {
                    const fetchPaymentLinks = async () => {
                        try {
                            const response = await fetch(`https://backend-nine-gamma-70.vercel.app/payment-link-status/${data.id}`); // URL do backend

                            if (!response.ok) {
                                throw new Error('Erro ao buscar os links de pagamento');
                            }

                            const dataT = await response.json();
                            console.log(dataT)
                            setPaymentLinks(dataT)
                            if (dataT.orders_paid > 0) {
                                const databasePath = `${base64.encode(user.email)}/assinar`;
                                await set(ref(db, databasePath), {
                                    id: dataT.id,
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

        })
        // ...
    } else {
        // User is signed out
        // ...
    }
});
}, []) */