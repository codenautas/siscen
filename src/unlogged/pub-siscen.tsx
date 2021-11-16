import * as React from "react";
import * as ReactDOM from "react-dom";
import {useState} from "react";

import {
    AppBar, Button, IconButton,
    List, ListItem, ListItemText, 
    SwipeableDrawer,
    Toolbar, Typography
} from "@material-ui/core";


// @ts-ignore 
var my=myOwn;


// @ts-ignore ejemplo_publicaciones viene sin tipo y es una global
var publicaciones:Publicacion[]=ejemplo_publicaciones.map(publicacion=>({...publicacion, fecha:new Date(publicacion.fecha)}))

function AppPrincipalOk(_props:{}){
    var [menuOpened, setMenuOpened] = useState(false);
    return <>
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu"  onClick={()=>setMenuOpened(true)}>
                    ≡
                </IconButton>
            <Typography>
                Puntapié inicial
            </Typography>
            <Button color="inherit"></Button>
            </Toolbar>
        </AppBar>
        <div className="seccion-final"></div>
        <SwipeableDrawer  
            open={menuOpened}
            onClose={()=>setMenuOpened(false)}
            onOpen={()=>setMenuOpened(true)}
        >
            <div
                role="presentation"
                onClick={()=>setMenuOpened(false)}
                onKeyDown={()=>setMenuOpened(false)}
            >
                <List>
                    <ListItem button 
                        onClick={()=>{
                            setMenuOpened(false);
                        }}
                    >
                        <ListItemText primary="administrar" 
                            onClick={()=>{
                                window.location.href="./login"
                            }}
                        />
                    </ListItem>
               </List>
            </div>
        </SwipeableDrawer>
    </>;
}


class DmCaptureError extends React.Component<
    {},
    {hasError:boolean, error:Error|{message:string}, info?:any}
>{
    constructor(props:any) {
        super(props);
        this.state = { hasError: false, error:{message:''} };
    }
    componentDidCatch(error:Error, info:any){
        this.setState({ hasError: true , error, info });
    }
    render(){
        if(this.state.hasError){
            return <>
                <Typography>Hubo un problema en la programación del dipositivo móvil.</Typography>
                <Typography>Error detectado:</Typography>
                <Typography>{this.state.error.message}</Typography>
                <Typography>{JSON.stringify(this.state.info)}</Typography>
            </>;
        }
        return this.props.children;
    }
}

function AppPrincipal(){
    return <DmCaptureError>
        <AppPrincipalOk/>
    </DmCaptureError>
}

export function mostrarPrincipal(){
    document.documentElement.setAttribute('letra','chica');
    ReactDOM.render(
        <AppPrincipal/>, 
        document.getElementById('main_layout')
    )
}

// @ts-ignore addrParams tiene un tipo que acá no importa
export async function pantallaPrincipal(_addrParams){
    mostrarPrincipal();
}

if(typeof window !== 'undefined'){
    // @ts-ignore para hacerlo
    window.pantallaPrincipal = pantallaPrincipal;
}
