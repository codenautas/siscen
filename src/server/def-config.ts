export const staticConfigYaml=`
server:
  port: 3021
  session-store: memory-saved
db:
  motor: postgresql
  host: localhost
  database: siscen_db
  schema: siscen
  user: siscen_admin
login:
  table: usuarios
  userFieldName: usuario
  passFieldName: md5clave
  rolFieldName: rol
  infoFieldList: [usuario, rol]
  activeClausule: activo
  x-unloggedLandPage: false
  plus:
    allowHttpLogin: true
    fileStore: true
    loginForm:
      formTitle: entrada
      formImg: unlogged/tables-lock.png
    x-noLoggedUrlPath: /pub
client-setup:
  menu: true
  lang: es
  user-scalable: no
install:
  dump:
    db:
      owner: siscen_owner
    scripts:
      post-adapt: []
logo: 
  path: client/img
`;