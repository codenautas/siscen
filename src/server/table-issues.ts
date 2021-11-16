"use strict";

import {TableDefinition, TableContext} from "./types-siscen";

export function issues(context:TableContext):TableDefinition{
    var admin = context.user.rol==='admin';
    var organizador = context.user.rol==='organizador';
    return {
        name:'issues',
        elementName:'issue', 
        editable:admin || organizador,
        fields:[
            {name:'sitio'            , typeName:'text'    }, 
            {name:'org'              , typeName:'text'    },
            {name:'repo'             , typeName:'text'    },
            {name:'issue'            , typeName:'bigint'  , specialDefaultValue:'next_number'},
            {name:'titulo'           , typeName:'text'    , label:'título'}, 
            {name:'inicio'           , typeName:'date'    , aggregate:'count'}, 
            {name:'cerrado'          , typeName:'boolean' , inTable:false}, 
            {name:'iniciador'        , typeName:'text'    }, 
            {name:'finalizacion'     , typeName:'date'    , aggregate:'count'}, 
            {name:'finalizador'      , typeName:'text'    }, 
            {name:'url'              , typeName:'text', clientSide:'displayUrl', serverSide:true, inTable:false},
        ],
        primaryKey:['sitio','org','repo','issue'],
        foreignKeys:[
            {references:'repositorios', fields:['sitio','org','repo']}
        ],
        sql:{
            fields:{
                cerrado:{expr:`finalizacion is not null`},
                url:{expr:`'https://'||case when issues.sitio ~ '\\.' then issues.sitio else issues.sitio||'.com' end ||'/'||issues.org||'/'||issues.repo||'/issues'||issues.issue`}
            }
        }
    };
}
