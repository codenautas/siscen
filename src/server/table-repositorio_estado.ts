"use strict";

import {TableDefinition, TableContext} from "./types-siscen";

export function repositorio_estado(context:TableContext):TableDefinition{
    var admin = context.user.rol==='admin';
    var organizador = context.user.rol==='organizador';
    return {
        name:'repositorio_estado',
        elementName:'estado', 
        title:'estados',
        editable:admin || organizador,
        fields:[
            {name:'estado'             , typeName:'text'    }, 
        ],
        primaryKey:['estado'],
        detailTables:[
            {table:'repositorios', fields:['estado'], abr:'R'}
        ],
    };
}
