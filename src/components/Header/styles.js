import styled from 'styled-components';
import { backgroundMenu, textMenu } from '../../Globals/globals';
import AppBar from '@mui/material/AppBar';

export const ContainerMenu = styled.div`
  width: 100%;
  height: 7vh;
  flex-direction: row;
  display:flex;
  align-items:center;
  justify-content:flex-start;
  background-color:${backgroundMenu};
  gap:10px;
  padding:8px;
`;


export const TextMenu = styled.a`
color:${textMenu};
font-size:22px;
font-weight:500;
  &:hover {
    text-decoration: underline;
    text-decoration-color: ${textMenu}; 
  }
`

export const AppTopBar = styled(AppBar)`

`


