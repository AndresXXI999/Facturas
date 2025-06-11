import { Usuario } from '../models/index.js';

class UsuarioServicio {
    async obtenerUsuarios() {
        try {
            const usuarios = await Usuario.findAll();
            return usuarios.map(u => u.toJSON());
        } catch (error) {
            throw new Error(`Error obteniendo usuarios: ${error.message}`);
        }
    }

    async obtenerUsuarioPorId(id) {
        try {
            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            return usuario.toJSON();
        } catch (error) {
            throw new Error(`Error obteniendo usuario: ${error.message}`);
        }
    }

    async crearUsuario(nuevoUsuario) {
        try {
            // Validar campos requeridos
            const requiredFields = ['nombre', 'usuario'];
            const missingFields = requiredFields.filter(field => !nuevoUsuario[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`);
            }
            
            // Revisar si hay nombre duplicado
            const usuarioExistente = await Usuario.findOne({ where: { usuario: nuevoUsuario.usuario } });
            if (usuarioExistente) {
                throw new Error('El nombre de usuario ya está en uso');
            }
            
            const usuarioCreado = await Usuario.create(nuevoUsuario);
            return usuarioCreado.toJSON();
        } catch (error) {
            throw new Error(`Error creando usuario: ${error.message}`);
        }
    }

    async actualizarUsuario(id, datosActualizados) {
        try {
            // Prevenir que el usuario entre en conflicto con otros nombres
            if (datosActualizados.usuario) {
                const usuarioExistente = await Usuario.findOne({
                    where: {
                        usuario: datosActualizados.usuario,
                        id: { [sequelize.Op.ne]: id } // Exclude current user
                    }
                });
                
                if (usuarioExistente) {
                    throw new Error('El nombre de usuario ya está en uso por otro usuario');
                }
            }
            
            const [numFilasActualizadas] = await Usuario.update(datosActualizados, {
                where: { id }
            });

            if (numFilasActualizadas === 0) {
                throw new Error('Usuario no encontrado o sin cambios');
            }

            return await this.obtenerUsuarioPorId(id);
        } catch (error) {
            throw new Error(`Error actualizando usuario: ${error.message}`);
        }
    }

    async borrarUsuario(id) {
        try {
            const numFilasBorradas = await Usuario.destroy({
                where: { id }
            });

            if (numFilasBorradas === 0) {
                throw new Error('Usuario no encontrado');
            }

            return { message: 'Usuario eliminado exitosamente' };
        } catch (error) {
            throw new Error(`Error eliminando usuario: ${error.message}`);
        }
    }
}

export const usuarioServicio = new UsuarioServicio();