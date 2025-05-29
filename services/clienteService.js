import { Cliente } from '../models/index.js';

class ClienteServicio {

    async obtenerClientes() {
        try {
            return await Cliente.findAll();
        } catch (error) {
            throw new Error(`Error getting clients: ${error.message}`); //backquotes para poder usar "variables"
        }
    }

    async obtenerClientePorId(id) {
        try {
            const cliente = await Cliente.findByPk(id);
            if(!cliente) {
                throw new Error('No se encontro el cliente');
            }
            return cliente;
        } catch (error) {
            throw new Error(`Error al obtener el cliente: ${error.message}`);
        }
    }

    async crearCliente(nuevoCliente) {
        try {
            return await Cliente.create(nuevoCliente);
        } catch (error) {
            throw new Error(`Error al crear el cliente: ${error.message}`);
        }
    }

    async actualizarCliente(id, datosActualizados) {
        try {
            const [numFilasActualizadas] = await Cliente.update(datosActualizados, {
                where: {id}
            });

            if (numFilasActualizadas === 0) {
                throw new Error('No se encontro el cliente o no se hicieron cambios');
            }

            return await this.obtenerClientePorId(id);
        } catch (error) {
            throw new Error(`Error al actualizar el cliente: ${error.message}`);
        }
    }

    async borrarCliente(id) {
        try {
            const numFilasBorradas = await Cliente.destroy({
                where: {id}
            });

            if (numFilasBorradas === 0) {
            throw new Error('No se encontro el cliente');
            }

            return { message: 'El cliente se elimino exitosamente' };
        } catch (error) {
            throw new Error(`Error al borrar el cliente: ${error.message}`);
        }
    }
}

export default new ClienteServicio();