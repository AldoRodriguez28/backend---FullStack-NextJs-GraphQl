
const Usuario = require("../models/Usuario");
const Gestion = require("../models/Gestion");
const Cliente = require("../models/Cliente");

const bcrypt = require("bcryptjs");
require("dotenv").config({ path: "variables.env" });
const jwt = require("jsonwebtoken");

const crearToken = (usuario, secretKey, expiresIn) => {
  console.log(usuario);
 const { id, email, nombre, apellido, rol } = usuario;
  return jwt.sign({id, email, nombre, apellido, rol}, secretKey, { expiresIn });
};

//Resolvers
const resolvers = {
  Query: {
    //Usuarios
    obtenerUsuario: async (_, {}, ctx) => {
      console.log('desde obtenerUsuario',ctx);
      return ctx.usuario;
    },
    obtenerUsuarios: async (_,{},ctx) => {
      // const usuarioId = await jwt.verify(token, process.env.SECRETA);
      // if (!usuarioId) throw new Error("Token invalido");
      const usuarios = await Usuario.find({});
      console.log(usuarios);
      return usuarios;
    },
    //Clientes
    obtenerClientes: async (_,{},ctx) => {
        try {
          const clientes = await Cliente.find({});
          return clientes;
        } catch (error) {
          console.error(error)
        }
    },
    obtenerCliente: async (_, { id }, ctx) => {
      // const usuarioId = await jwt.verify(token, process.env.SECRETA);
      const ClienteDB = await Cliente.findById(id);
      console.log(ClienteDB);
      return ClienteDB;
    },
    //Gestiones
    obtenerGestiones: async (_,{},ctx) => {
      // 1.- Obtener el rol
      const rol = ctx.usuario.rol;
      if(rol == 'ADMINISTRADOR'){
        try {
          const gestiones = await Gestion.find({});
          console.log(gestiones.length)
          return gestiones;
        } catch (error) {
          console.log(error);
        }
      }else{
        try {
          const gestiones = await Gestion.find({ usuarioId: ctx.usuario.id.toString() });
          console.log(gestiones.length)
          return gestiones;
        } catch (error) {
          console.log(error);
        }
      }
    },
    obtenerGestionById: async (_, { id }, ctx) => {
      // const usuarioId = await jwt.verify(token, process.env.SECRETA);
      const gestion = await Gestion.findById(id);
      if (!gestion) {
        throw new Error("No se encontro la gestión");
      }
      return gestion;
    },
    obtenerGestionesPorEstatus: async (_, { estatus }, ctx) => {
      const gestiones = await Gestion.find({ estatus });
      return gestiones;
    },
    obtenerGestionesByUsuarioId: async (_, { usuarioId }) => {
      // const usuarioId = await jwt.verify(token, process.env.SECRETA);
      const gestiones = await Gestion.find({});
      const gestionesByUsuarioId = gestiones.filter(
        (gestion) => gestion.usuarioId.toString() === usuarioId
      );
      console.log(gestionesByUsuarioId);
      return gestionesByUsuarioId;
    },
    obtenerGestionesByClienteId: async (_, { clienteId }) => {
      // const usuarioId = await jwt.verify(token, process.env.SECRETA);
      const gestiones = await Gestion.find({});
      console.log(gestiones[0].clienteId.toString());
      console.log(clienteId);
      const gestionesByClienteId = gestiones.filter(
        (gestion) => gestion.clienteId.toString() === clienteId
      );
      console.log(gestionesByClienteId);
      return gestionesByClienteId;
    },
    //busqueda avanzada
    buscarCliente: async (_, { texto }) => {
      const clientes = await Cliente.find({ $text: { $search: texto } });
      return clientes
    },
  },
  Mutation: {
    //Usuarios
    nuevoUsuario: async (_, { input }) => {
      const { email, password } = input;
      //revisar si el usuario ya esta registrado
      const existeUsuario = await Usuario.findOne({ email });
      if (existeUsuario) {
        throw new Error(
          "El correo electronico ingresado ya se encuentra en uso"
        );
      }

      //hashear el password
      const salt = await bcrypt.genSalt(10);
      input.password = await bcrypt.hash(password, salt);
      try {
        //guardar en base de datos
        const usuario = new Usuario(input);
        usuario.save(); //guardando...
        return usuario;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarUsuario: async (_, { id, input }) => {
      const { password } = input;
      //hashear el password
      const salt = await bcrypt.genSalt(10);
      input.password = await bcrypt.hash(password, salt);
      try {
        let usuario = await Usuario.findById(id);
        if (!usuario) {
          throw new Error("Usuario no encontrada");
        }
        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, input, {
          new: true,
        });
        return usuarioActualizado;
      } catch (error) {
        console.log(error);
      }
    },
    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;
      //si el usuario existe
      const existeUsuario = await Usuario.findOne({ email });
      if (!existeUsuario) {
        throw new Error("El usuario no existe");
      }
      //revisar si el password es correcto
      const passwordCorrecto = await bcrypt.compare(
        password,
        existeUsuario.password
      );
      if (!passwordCorrecto) {
        throw new Error("Password incorrecto");
      }

      //crear el token
      return {
        token: crearToken(existeUsuario, process.env.SECRETA, "24h"),
      };
    },
    eliminarUsuario: async (_, { id }) => {
      try {
        let usuario = await Usuario.findById(id);
        if (!usuario) {
          throw new Error("Usuario no encontrada");
        }

        const gestiónEliminada = await Usuario.findByIdAndDelete({ _id: id });
        return `Se elimino con exito usuario con el id:${usuario.id}`;
      } catch (error) {
        console.log(error);
      }
    },

    //Clientes
    nuevoCliente: async (_, { input }) => {
      const {curp} = input;

      const existeCliente = await Cliente.findOne({ curp });
      if (existeCliente) {
        throw new Error(
          "El cliente ya ha sido dado de alta ya que el curp ya se encuentra registrado"
        );
      }

      try {
        //guardar en base de datos
        const cliente = new Cliente(input);
        cliente.save(); //guardando...
        return cliente;
      } catch (error) {
        console.log(error.graphQLErrors);
      }
    },
    actualizarCliente: async (_, { id, input }) => {
      try {
        let cliente = await Cliente.findById(id);
        if (!cliente) {
          throw new Error("Cliente no encontrada");
        }
        const clienteActualizado = await Cliente.findByIdAndUpdate(id, input, {
          new: true,
        });
        return clienteActualizado;
      } catch (error) {
        console.log(error);
      }
    },
    eliminarCliente: async (_, { id }) => {
      try {
        let cliente = await Cliente.findById(id);
        if (!cliente) {
          throw new Error("Cliente no encontrada");
        }
        const clienteEliminado = await Cliente.findByIdAndDelete({ _id: id });
        return `Se elimino con exito el cliente con el id:${cliente.id}`;
      } catch (error) {
        console.log(error);
      }
    },

    //Gestion
    nuevaGestion: async (_, { input }, ctx) => {
      //asignando el usuarioId  a la gestión obteniéndolo del context
      input.usuarioId = ctx.usuario.id;
      const { matricula } = input;

      try {
        //Verificar si el cliente existe por medio de su matricula
        const cliente = await Cliente.findOne({ matricula });
        if (!cliente) {
          throw new Error(
            `No existe un afiliado con la matricula ${matricula}`
          );
        }

        //Asignamos al cliente a la gestión
        input.clienteId = cliente.id;

        //guardar en base de datos
        const gestion = new Gestion(input);
        gestion.save(); //guardando...
        return gestion;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarGestion: async (_, { id, input }) => {
      try {
        let gestion = await Gestion.findById(id);
        if (!gestion) {
          throw new Error("gestion no encontrada");
        }
        const gestionActualizado = await Gestion.findByIdAndUpdate(id, input, {
          new: true,
        });
        return gestionActualizado;
      } catch (error) {
        console.log(error);
      }
    },
    eliminarGestion: async (_, { id }) => {
      try {
        let gestion = await Gestion.findById(id);
        if (!gestion) {
          throw new Error("gestion no encontrada");
        }

        const gestionEliminada = await Gestion.findByIdAndDelete({ _id: id });
        return `Se elimino con exito la gestion con el id:${gestion.id}`;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = resolvers;
