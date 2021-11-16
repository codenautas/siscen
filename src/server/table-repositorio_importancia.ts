"use strict";

import {TableDefinition, TableContext} from "./types-siscen";

export function repositorio_importancia(context:TableContext):TableDefinition{
    var admin = context.user.rol==='admin';
    var organizador = context.user.rol==='organizador';
    return {
        name:'repositorio_importancia',
        elementName:'importancia', 
        title:'importancias',
        editable:admin || organizador,
        fields:[
            {name:'importancia'             , typeName:'text'    }, 
            {name:'grado'                   , typeName:'bigint'  }, 
        ],
        primaryKey:['importancia'],
        detailTables:[
            {table:'repositorios', fields:['importancia'], abr:'R'}
        ],
    };
}
