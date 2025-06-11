import { Proveedor } from '../models/index.js';

class ProveedorServicio {
    async obtenerProveedores() {
        try {
            const proveedores = await Proveedor.findAll();
            return proveedores.map(p => p.toJSON());
        } catch (error) {
            throw new Error(`Error obteniendo proveedores: ${error.message}`);
        }
    }

    async obtenerProveedorPorId(id) {
        try {
            const proveedor = await Proveedor.findByPk(id);
            if (!proveedor) {
                throw new Error('Proveedor no encontrado');
            }
            return proveedor.toJSON();
        } catch (error) {
            throw new Error(`Error obteniendo proveedor: ${error.message}`);
        }
    }

    async crearProveedor(nuevoProveedor) {
        try {
            // Validar campos requeridos
            const requiredFields = ['nombre', 'direccion', 'telefono', 'correo'];
            const missingFields = requiredFields.filter(field => !nuevoProveedor[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`);
            }
            
            const proveedorCreado = await Proveedor.create(nuevoProveedor);
            return proveedorCreado.toJSON();
        } catch (error) {
            throw new Error(`Error creando proveedor: ${error.message}`);
        }
    }

    async actualizarProveedor(id, datosActualizados) {
        try {
            const [numFilasActualizadas] = await Proveedor.update(datosActualizados, {
                where: { id }
            });

            if (numFilasActualizadas === 0) {
                throw new Error('Proveedor no encontrado o sin cambios');
            }

            return await this.obtenerProveedorPorId(id);
        } catch (error) {
            throw new Error(`Error actualizando proveedor: ${error.message}`);
        }
    }

    async borrarProveedor(id) {
        try {
            const numFilasBorradas = await Proveedor.destroy({
                where: { id }
            });

            if (numFilasBorradas === 0) {
                throw new Error('Proveedor no encontrado');
            }

            return { message: 'Proveedor eliminado exitosamente' };
        } catch (error) {
            throw new Error(`Error eliminando proveedor: ${error.message}`);
        }
    }
}

export const proveedorServicio = new ProveedorServicio();