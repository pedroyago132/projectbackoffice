import * as React from 'react';
import { AppTopBar } from './styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { setItem } from '../../storage/serviceState';
import { backgroundMenu } from '../../Globals/globals';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut ,onAuthStateChanged} from "firebase/auth";
import { getDatabase, ref, set, get, child, onValue, update } from "firebase/database";
import { database } from '../../App';
import { Buffer } from 'buffer'

const pages = ['Dashboard', 'Validar QRCode','Configurar Mensagens','Google Agenda'];
const settings = ['Perfil','Sair'];

const base64 = {
    encode: (input) => Buffer.from(input).toString('base64'),
    decode: (input) => Buffer.from(input, 'base64').toString('utf8'),
  };


const Header = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [user, setUser] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate()

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const selectItemMenu = (page) => {
   
        if(page == 'Validar QRCode'){
          navigate('/qrcode')
        } else if (page == 'Dashboard' ){
            navigate('/measure')
        }else if (page == 'Configurar Mensagens' ){
            navigate('/config')
        }else if (page == 'Editar Clientes' ){
            navigate('/clientes')
        }
        else if (page == 'Sair' ){
            deslogar();
        } else if (page == 'Assinar' ){
            navigate('/payment')
        }else if (page == 'Google Agenda' ){
            navigate('/google')
        }


       
    }

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

        const f = () => {
            const db = getDatabase();
            if(user){
                
             
                const post = {
                    isConnected: false,
                 };
         
                 const updates = {};
                 updates[`${base64.encode(user.email)}/isconnected`] = post;
                    update(ref(db), updates).then(log => navigate('/loading')).catch(log => window.alert(log)) 
            }
          
        }


    const deslogar = async () => {
        const auth = getAuth();
      
       try{
        await signOut(auth).then(log => f()).catch((error) => {
            console.log(error)
          });
       }catch{

       } 
    } 
   

    /* 
      <ContainerMenu>
            <TextMenu style={{fontWeight:'bold'}} > Sizer</TextMenu>
        </ContainerMenu> */

    return (

        <AppTopBar style={{backgroundColor:'#0073b1'}} position="static">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="#app-bar-with-responsive-menu"
                    sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    LOGO
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                        {pages.map((page) => (
                            <MenuItem key={page} onClick={() => selectItemMenu(page)}>
                                <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
                <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    href="#app-bar-with-responsive-menu"
                    sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    LOGO
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                        <Button
                            key={page}
                            onClick={() => selectItemMenu(page)}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {page}
                        </Button>
                    ))}
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting) => (
                            <MenuItem key={setting} onClick={() => selectItemMenu(setting)}>
                                <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </Container>
    </AppTopBar>


    );
}

export default Header;
