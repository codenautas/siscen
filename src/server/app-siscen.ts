"use strict";

// import * as Path from 'path';
import { AppBackend, ExpressPlus, Context, Request, 
    ClientModuleDefinition, OptsClientPage, MenuDefinition, MenuInfoBase
} from "backend-plus";
import * as MiniTools from 'mini-tools';

// import {changing} from 'best-globals';

import {ProceduresSisCen} from "./procedures-siscen";

import { sistema_control_versiones } from './table-sistema_control_versiones';
import { repositorio_org } from './table-repositorio_org';
import { repositorio_tipo } from './table-repositorio_tipo';
import { repositorio_estado } from './table-repositorio_estado';
import { repositorio_importancia } from './table-repositorio_importancia';
import { repositorios } from './table-repositorios';
import { issues } from './table-issues';
import { usuarios   } from './table-usuarios';

import {staticConfigYaml} from './def-config';

function json(sql:string, orderby:string){
    return `COALESCE((SELECT jsonb_agg(to_jsonb(j.*) ORDER BY ${orderby}) from (${sql}) as j),'[]'::jsonb)`
}

console.log('RESERVA', !!json)

export class AppSisCen extends AppBackend{
    constructor(){
        super();
    }
    async postConfig(){
        await super.postConfig();
    }
    configStaticConfig(){
        super.configStaticConfig();
        this.setStaticConfig(staticConfigYaml);
    }
    addSchrödingerServices(mainApp:ExpressPlus, baseUrl:string){
        var be=this;
        if(baseUrl=='/'){
            baseUrl='';
        }   
        mainApp.get(baseUrl+'/pub',async function(req,res,_next){
            // @ts-ignore useragent existe
            var {useragent} = req;
            var htmlMain=be.mainPage({useragent}, false, {skipMenu:true}).toHtmlDoc();
            MiniTools.serveText(htmlMain,'html')(req,res);
        });
        super.addSchrödingerServices(mainApp, baseUrl);
    }
    addUnloggedServices(mainApp:ExpressPlus, baseUrl:string){
        super.addUnloggedServices(mainApp, baseUrl);
    }
    async getProcedures(){
        var be = this;
        return [
            ...await super.getProcedures(),
            ...ProceduresSisCen
        ].map(be.procedureDefCompleter, be);
    }
    getMenu(context:Context):MenuDefinition{
        var menuContent:MenuInfoBase[]=[
            {menuType:'menu', name:'desarrollo', label:'redacción',  menuContent:[
                {menuType:'table', name:'repositorios'},
                {menuType:'table', name:'issues'},
                {menuType:'menu', name:'referenciales', menuContent:[
                    {menuType:'table', name:'sistema_control_versiones', label:'sitios'},
                    {menuType:'table', name:'repositorio_org', label:'organizaciones'},
                    {menuType:'table', name:'repositorio_tipo', label:'tipos'},
                    {menuType:'table', name:'repositorio_estado', label:'estados'},
                    {menuType:'table', name:'repositorio_importancia', label:'importancias'},
                ]}
            ]},
        ];
        if(context.user && context.user.rol=="admin"){
            menuContent.push(
                {menuType:'menu', name:'config', label:'configurar', menuContent:[
                    {menuType:'table', name:'usuarios'  },
                ]}
            )
        };
        return {menu:menuContent};
    }
    clientIncludes(req:Request|null, opts:OptsClientPage):ClientModuleDefinition[]{
        var menuedResources:ClientModuleDefinition[]=req && opts && !opts.skipMenu ? [
            { type:'js' , src:'client.js' },
        ]:[
            {type:'js' , src:'unlogged.js' },
        ];
        return [
            /* quitar desde acá si no se usa react */
            { type: 'js', module: 'react', modPath: 'umd', fileDevelopment:'react.development.js', file:'react.production.min.js' },
            { type: 'js', module: 'react-dom', modPath: 'umd', fileDevelopment:'react-dom.development.js', file:'react-dom.production.min.js' },
            { type: 'js', module: '@material-ui/core', modPath: 'umd', fileDevelopment:'material-ui.development.js', file:'material-ui.production.min.js' },
            { type: 'js', module: 'material-styles', fileDevelopment:'material-styles.development.js', file:'material-styles.production.min.js' },
            { type: 'js', module: 'clsx', file:'clsx.min.js' },
            { type: 'js', module: 'redux', modPath:'../dist', fileDevelopment:'redux.js', file:'redux.min.js' },
            { type: 'js', module: 'react-redux', modPath:'../dist', fileDevelopment:'react-redux.js', file:'react-redux.min.js' },
            /* quitar hasta acá si no se usa react */
            ...super.clientIncludes(req, opts),
            /* quitar desde acá si no se usa react */
            { type: 'js', module: 'redux-typed-reducer', modPath:'../dist', file:'redux-typed-reducer.js' },
            { type: 'js', src: 'adapt.js' },
            /* quitar hasta acá si no se usa react */
            { type: 'js', src: 'ejemplo_publicaciones.js' },
            { type: 'js', src: 'pub-siscen.js' },
            { type: 'css', file: 'pub-siscen.css' },
            { type: 'css', file: 'menu.css' },
             ... menuedResources
        ];
    }
    prepareGetTables(){
        super.prepareGetTables();
        this.getTableDefinition={
            ... this.getTableDefinition,
            usuarios,
            sistema_control_versiones,
            repositorio_org,
            repositorio_tipo,
            repositorio_estado,
            repositorio_importancia,
            repositorios,    
            issues,    
        }
    }       
}

