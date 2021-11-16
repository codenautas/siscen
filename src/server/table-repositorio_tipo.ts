"use strict";

import {TableDefinition, TableContext} from "./types-siscen";

export function repositorio_tipo(context:TableContext):TableDefinition{
    var admin = context.user.rol==='admin';
    var organizador = context.user.rol==='organizador';
    return {
        name:'repositorio_tipo',
        elementName:'tipo', 
        title:'tipos',
        editable:admin || organizador,
        fields:[
            {name:'tipo'             , typeName:'text'    }, 
        ],
        primaryKey:['tipo'],
        detailTables:[
            {table:'repositorios', fields:['tipo'], abr:'R'}
        ],
    };
}
