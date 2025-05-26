import * as React from 'react';
import { Body, ContainerRules, InputText, Container2, ContainerEditAccordion, GreenBox, RedBox } from './styles';

import Typography from '@mui/material/Typography';

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
import { setItem } from '../../storage/serviceState';





const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const style = {
    minHeight: 300,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 500,
    bgcolor: 'white',
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
    const [descricaoServico, setDescricaoServico] = React.useState('');
    const db = getDatabase();



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
            valorEmClientes: parseFloat(relatorio?.valorEmClientes),
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

            const body = {
                message: `✅ Agendamento Confirmado com ${employeesManual} às ${selectedHorarioManual} para ${servicosManual} no dia ${dateManual}.`,
                phone: `+${numeroClienteManual}`,
                delayMessage: 2
            };

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
            handleCloseList()
        }

    }




    React.useEffect(() => {

        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)

                const appointmentsRef = ref(db, `${base64.encode(user.email)}/agendamentos`);
                setItem('user', user)

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
                  //  setLink(snapshot.val()?.nameBase64 ? `https://wa.me/5561990008359?text=${snapshot.val().nameBase64}` : null)
                });

                dataInstanceValue()

            }
        }
        )

    }, [user])






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
            valor: valorServico,
            descricao:descricaoServico
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

                    <Typography id="modal-modal-title" variant="h5" style={{ fontWeight: '500', marginTop: 10, fontSize: 16 }} >
                        Descrição do Serviço ( Opcional ):
                    </Typography>
                    <TextField id="outlined-basic-cpf" style={{ marginTop: 15 }} value={descricaoServico} label="Degradê alto e limpo ✨ + topo médio com textura (produto: pomada ou wax) 💈🔥" onChange={text => setDescricaoServico(text.target.value)} placeholder='Descrição' fullWidth variant="outlined" />


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
