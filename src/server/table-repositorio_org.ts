"use strict";

import {TableDefinition, TableContext} from "./types-siscen";

export function repositorio_org(context:TableContext):TableDefinition{
    var admin = context.user.rol==='admin';
    var organizador = context.user.rol==='organizador';
    return {
        name:'repositorio_org',
        elementName:'organización', 
        title:'organizaciones',
        editable:admin || organizador,
        fields:[
            {name:'sitio'            , typeName:'text'    }, 
            {name:'org'              , typeName:'text'    }, 
            {name:'url'              , typeName:'text'    , clientSide:'displayUrl', serverSide:true, inTable:false},
        ],
        primaryKey:['sitio','org'],
        foreignKeys:[
            {references:'sistema_control_versiones', fields:['sitio']}
        ],
        detailTables:[
            {table:'repositorios', fields:['sitio','org'], abr:'R'}
        ],
        sql:{
            fields:{
                url:{expr:`sistema_control_versiones.vinculo||'/'||org`}
            }
        }
    };
}
