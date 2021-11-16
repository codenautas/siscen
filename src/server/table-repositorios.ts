"use strict";

import {TableDefinition, TableContext, AppBackend} from "./types-siscen";

export function getPolicies(be:AppBackend){
    return {
        select:{ using: `${be.dbUserRolExpr} = 'admin' or redactor = ${be.dbUserNameExpr} or publicar`},
        all:{ using: `${be.dbUserRolExpr} = 'admin' or redactor = ${be.dbUserNameExpr} and publicar is not true` }
    }
}

export function issuesField(sql:string){
    return {
        expr:`(select count(*) from issues where sitio = repositorios.sitio and org=repositorios.org and repo=repositorios.repo ${sql})`
    }
}

export function repositorios(context:TableContext):TableDefinition{
    var admin = context.user.rol==='admin';
    var organizador = context.user.rol==='organizador';
    return {
        name:'repositorios',
        elementName:'repositorio', 
        editable:admin || organizador,
        fields:[
            {name:'sitio'            , typeName:'text'    }, 
            {name:'org'              , typeName:'text'    },
            {name:'repo'             , typeName:'text'    },
            {name:'tipo'             , typeName:'text'    },
            {name:'estado'           , typeName:'text'    },
            {name:'importancia'      , typeName:'text'    },
            {name:'objetivo'         , typeName:'text'    },
            {name:'organizador'      , typeName:'text'    },
            {name:'revision'         , typeName:'date'    },
            {name:'reportes'         , typeName:'text'    },
            {name:'cucardas'         , typeName:'text'    },
            {name:'issues'           , typeName:'bigint'  , inTable:false},
            {name:'abiertos'         , typeName:'bigint'  , inTable:false},
            {name:'cerrados'         , typeName:'bigint'  , inTable:false},
            {name:'url'              , typeName:'text', clientSide:'displayUrl', serverSide:true, inTable:false},
        ],
        primaryKey:['sitio','org','repo'],
        foreignKeys:[
            {references:'sistema_control_versiones', fields:['sitio']},
            {references:'repositorio_org', fields:['sitio','org']},
            {references:'repositorio_tipo', fields:['tipo']},
            {references:'repositorio_importancia', fields:['importancia']},
            {references:'repositorio_estado', fields:['estado']},
        ],
        detailTables:[
            {table:'issues', fields:['sitio','org','repo'], abr:'I'},
            {table:'issues', fields:['sitio','org','repo',{target:'cerrado', value:false}], abr:'A', label:'abiertos'},
            {table:'issues', fields:['sitio','org','repo',{target:'cerrado', value:true }], abr:'C', label:'cerrados'},
        ],
        sql:{
            fields:{
                url:{expr:`sistema_control_versiones.vinculo||'/'||repositorios.org||'/'||repositorios.repo||'/issues'`},
                issues:  issuesField(''),
                abiertos:issuesField('and finalizacion is null'),
                cerrados:issuesField('and finalizacion is not null'),
            }
        }
    };
}
