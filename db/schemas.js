const { gql } = require("apollo-server");

//Schema
const typeDefs = gql`
  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
    rol: TipoRol
  }
  enum TipoRol{
    ADMINISTRADOR
    DELEGADO
    ENLACE
  }
  type Token {
    token: String
  }
  type Gestion {
    id: ID
    clienteId: String
    folio: String
    nombreCliente: String
    usuarioId: String
    lugar: String
    tipo: String
    descripcion: String
    estatus: EstatusGestion
    creado: String
  }
  enum  EstatusGestion{
    PENDIENTE
    ACTIVO
    ATENDIDO
    CANCELADO
  }
  type Cliente {
    id: ID
    nombre: String
    apellido: String
    email: String
    matricula: String
    municipio: String
    estado: String
    telefono: String
    curp: String
    creado: String
  }
  input UsuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
    rol: String!
  }
  input ClienteInput {
    nombre: String!
    apellido: String!
    email: String
    matricula: String!
    municipio: String!
    estado: String!
    telefono: String!
    curp: String!
  }
  input AutenticarInput {
    email: String!
    password: String!
  }
  input GestionInput {
    matricula: String!
    usuarioId: String
    lugar: String!
    tipo: String!
    descripcion: String!
    estatus: String!
  }
  type Query {
    #Usuarios
    obtenerUsuario: Usuario
    obtenerUsuarios:[Usuario]


    #Clientes
    obtenerCliente(id: ID!): Cliente
    obtenerClientes:[Cliente]

    #Gestiones
    obtenerGestiones:[Gestion]
    obtenerGestionesPorEstatus(estatus:String!):[Gestion]
    obtenerGestionById(id:ID!):Gestion
    obtenerGestionesByUsuarioId(usuarioId: ID!):[Gestion]
    obtenerGestionesByClienteId(clienteId: ID!):[Gestion]    

    #Busqueda avanzada
    buscarCliente(texto:String!): [Cliente]
  }
  type Mutation {
    #Usuarios
    nuevoUsuario(input: UsuarioInput): Usuario
    autenticarUsuario(input: AutenticarInput): Token
    actualizarUsuario(id:ID!, input: UsuarioInput):Usuario
    eliminarUsuario(id:ID!):String

    
    #Clientes
    nuevoCliente(input: ClienteInput): Cliente
    actualizarCliente(id:ID!, input: ClienteInput): Cliente
    eliminarCliente(id:ID!):String
    
    #Gestiones
    nuevaGestion(input: GestionInput): Gestion
    actualizarGestion(id:ID!, input: GestionInput):Gestion
    eliminarGestion(id:ID!):String
  }
`;
module.exports = typeDefs;