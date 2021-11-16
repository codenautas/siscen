"use strict";

import {TableDefinition, TableContext} from "./types-siscen";

export function sistema_control_versiones(context:TableContext):TableDefinition{
    var admin = context.user.rol==='admin';
    var organizador = context.user.rol==='organizador';
    return {
        name:'sistema_control_versiones',
        elementName:'sistema', 
        editable:admin || organizador,
        fields:[
            {name:'sitio'            , typeName:'text'    }, 
            {name:'vinculo'          , typeName:'text'    },
            {name:'url'              , typeName:'text'    , clientSide:'displayUrl', serverSide:true, inTable:false},
        ],
        primaryKey:['sitio'],
        detailTables:[
            {table:'repositorio_org', fields:['sitio'], abr:'O', label:'organizaciones'},
            {table:'repositorios', fields:['sitio'], abr:'R'}
        ],
        sql:{
            fields:{
                url:{expr:`vinculo`}
            }
        }
    };
}
