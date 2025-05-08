import  React from 'react';
import { Container, Input, Title, FormControl, Logo, SubTitle, Body, Container1, ImageBackground } from './styles';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get, child, onValue, update } from "firebase/database";
import TextField from '@mui/material/TextField';
import base64 from 'base-64'
import { database } from '../../App';


const Home = () => {
    const [connected, setConnected] = React.useState(false);
    const [emailInput, setEmailInput] = React.useState(false);
    const [user, setUser] = React.useState(false);
    const [senhaInput, setSenha] = React.useState(false);
    const [state, setState] = React.useState({
        open: false,
        vertical: 'right',
        horizontal: 'center',
    });

    const { vertical, horizontal, open } = state;

    const navigate = useNavigate();

    const handleClick = (newState) => () => {
        setState({ ...newState, open: true });
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    React.useEffect(() => {
        const db = getDatabase()
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
                const dbRef = ref(db, `${base64.encode(user.email)}/isconnected`);
                onValue(dbRef, (snapshot) => {
                    const data = snapshot.val();
                    setConnected(data)
                })
            }
        }
        )

    }, [])

    const loginfake = () => {
        if(emailInput =='anderson@gmail.com' && senhaInput == 'senha1234'){
            navigate('/measure')
        }
    }


    const goMeansure = () => {
        const db = getDatabase();
        if (!emailInput || !senhaInput) {
            window.alert('Insira os campos de usuário e senha')
        } else {
            const dbRef = ref(database, `${base64.encode(emailInput)}/isconnected`);

            onValue(dbRef, (snapshot) => {
                const data = snapshot.val();
                console.log('ITEM1::::::::', data)
      


                    const auth = getAuth();
                    signInWithEmailAndPassword(auth, emailInput, senhaInput)
                        .then((userCredential) => {
            
                             
                                           
            
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            window.alert('Verifique Usuário e senha')
                        });


             

            })

        }
    };

    if(user){
        navigate('/loading')
    }

        return (
            <>
                <Body>
                    <Container>

                        <FormControl color='primary'  >
                            <Logo src='/medical.png' alt='id' />
                            <Title>
                               Sistema Agendei - Geilson
                            </Title>
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Email"
                                multiline
                                fullWidth
                                maxRows={4}
                                variant='outlined'
                                placeholder='Insira seu Email'
                                onChange={text => setEmailInput(text.target.value)}
                            />

                            <TextField
                                id="outlined-multiline-flexibl1"
                                label="Senha"
                                fullWidth
                                multiline
                                maxRows={4}
                                variant='outlined'
                                placeholder='Senha'
                                onChange={text => setSenha(text.target.value)}

                            />
                            <Button style={{ alignSelf: 'center' }} onClick={() => goMeansure()} variant="contained">Entrar</Button>

                            <div style={{ display: 'flex', gap: 7 }} >
                                <SubTitle   >
                                    Ainda não tem uma conta?
                                </SubTitle>
                                <a style={{ fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }} onClick={() => navigate('/registro')} >
                                    Clique Aqui
                                </a>
                            </div>

                            <div style={{ display: 'flex', gap: 7 }} >
                                <SubTitle   >
                                    Esqueceu sua senha?
                                </SubTitle>
                                <a style={{ fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }} onClick={() => navigate('/password')} >
                                    Clique Aqui
                                </a>
                            </div>
                        </FormControl>


                    </Container>
                    <Container1>
                        <ImageBackground id='logoa' src='/medical.png' />
                    </Container1>
                    <Snackbar
                        anchorOrigin={{ vertical, horizontal }}
                        open={open}
                        onClose={handleClose}
                        message="Erro ao efetuar Login"
                        key={vertical + horizontal}
                    />
                </Body>
            </>
        );
    

}

export default Home


/*
const employees = ["Carlos", "Maria", "João", "Ana", "Pedro"];
const workHours = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];
const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const sendWhatsAppMessage = (message) => {
  const phoneNumber = "5511999999999"; // Substitua pelo número desejado
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

const fetchBookedAppointments = async () => {
  const response = await fetch("/api/appointments");
  const data = await response.json();
  return data;
};

export default function MockAppointments() {
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [userMessage, setUserMessage] = useState("");

  useEffect(() => {
    const loadBookedAppointments = async () => {
      const booked = await fetchBookedAppointments();
      setBookedAppointments(booked);
    };
    loadBookedAppointments();
  }, []);

  useEffect(() => {
    const freeTimes = workHours.filter(
      (time) => !bookedAppointments.some((appt) => appt.time === time)
    );
    setAvailableTimes(freeTimes);
  }, [bookedAppointments]);

  useEffect(() => {
    if (userMessage.toLowerCase() === "agendar") {
      const timesMessage = `Horários disponíveis:\n${availableTimes.join("\n")}`;
      sendWhatsAppMessage(timesMessage);
    } else if (availableTimes.includes(userMessage)) {
      setSelectedTime(userMessage);
      const availableEmployees = employees.filter(
        (emp) => !bookedAppointments.some((appt) => appt.time === userMessage && appt.employee === emp)
      );
      if (availableEmployees.length > 0) {
        const employeesList = availableEmployees.map((emp, index) => `${index + 1}. ${emp}`).join("\n");
        sendWhatsAppMessage(`Funcionários disponíveis para ${userMessage}:\n${employeesList}`);
      }
    } else if (employees.includes(userMessage)) {
      const isEmployeeAvailable = !bookedAppointments.some(
        (appt) => appt.time === selectedTime && appt.employee === userMessage
      );
      if (isEmployeeAvailable) {
        setSelectedEmployee(userMessage);
        console.log("Agendamento confirmado:", { horario: selectedTime, funcionario: userMessage });
      }
    } else if (userMessage) {
      sendWhatsAppMessage("Entrada inválida. Escolha um horário disponível ou um funcionário válido.");
    }
  }, [userMessage]);

*/