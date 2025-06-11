import { Producto, Proveedor } from '../models/index.js'; // Add Proveedor

class ProductoServicio {
    async obtenerProductos() {
        try {
            return await Producto.findAll();
        } catch (error) {
            throw new Error(`Error obteniendo productos: ${error.message}`);
        }
    }

    async obtenerProductoPorId(id) {
        try {
            const producto = await Producto.findByPk(id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }
            return producto;
        } catch (error) {
            throw new Error(`Error obteniendo producto: ${error.message}`);
        }
    }

    async crearProducto(nuevoProducto) {
        try {
            if (!nuevoProducto.nombre || !nuevoProducto.precio_unitario || !nuevoProducto.stock || !nuevoProducto.proveedorId) {
                throw new Error('Todos los campos son obligatorios');
            }
            
            // Verificar si proveedor existe
            const proveedor = await Proveedor.findByPk(nuevoProducto.proveedorId);
            if (!proveedor) {
                throw new Error('Proveedor no encontrado');
            }
            
            return await Producto.create(nuevoProducto);
        } catch (error) {
            throw new Error(`Error creando producto: ${error.message}`);
        }
    }

    async actualizarProducto(id, datosActualizados) {
        try {
            // Si se actualiza el proveedor, verificar si existe
            if (datosActualizados.proveedorId) {
                const proveedor = await Proveedor.findByPk(datosActualizados.proveedorId);
                if (!proveedor) {
                    throw new Error('Proveedor no encontrado');
                }
            }
            
            const [numFilasActualizadas] = await Producto.update(datosActualizados, {
                where: { id }
            });

            if (numFilasActualizadas === 0) {
                throw new Error('Producto no encontrado o sin cambios');
            }

            return await this.obtenerProductoPorId(id);
        } catch (error) {
            throw new Error(`Error actualizando producto: ${error.message}`);
        }
    }

    async borrarProducto(id) {
        try {
            const numFilasBorradas = await Producto.destroy({
                where: { id }
            });

            if (numFilasBorradas === 0) {
                throw new Error('Producto no encontrado');
            }

            return { message: 'Producto eliminado exitosamente' };
        } catch (error) {
            throw new Error(`Error eliminando producto: ${error.message}`);
        }
    }
}

export const productoServicio = new ProductoServicio();