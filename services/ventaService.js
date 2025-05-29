import { Venta, DetalleVenta, Cliente, Producto } from '../models/index.js';
import { sequelize } from '../config/database.js';

class VentaServicio {
    async obtenerVentas() {
        try {
            return await Venta.findAll({
                include: [
                    { model: Cliente },
                    { 
                        model: DetalleVenta,
                        include: [{ model: Producto }]
                    }
                ]
            });
        } catch (error) {
            throw new Error(`Error obteniendo ventas: ${error.message}`);
        }
    }

    async obtenerVentaPorId(id) {
        try {
            const venta = await Venta.findByPk(id, {
                include: [
                    { model: Cliente },
                    { 
                        model: DetalleVenta,
                        include: [{ model: Producto }]
                    }
                ]
            });
            
            if (!venta) {
                throw new Error('Venta no encontrada');
            }
            return venta;
        } catch (error) {
            throw new Error(`Error obteniendo venta: ${error.message}`);
        }
    }

    async crearVenta(datosVenta) {
        const transaction = await sequelize.transaction();
        
        try {
            const { clienteId, productos } = datosVenta;
            
            // Verificar que el cliente existe
            const cliente = await Cliente.findByPk(clienteId);
            if (!cliente) {
                throw new Error('Cliente no encontrado');
            }

            // Crear la venta
            const venta = await Venta.create({
                clienteId,
                fecha: new Date(),
                total: 0
            }, { transaction });

            let total = 0;

            // Crear detalles de venta
            for (const item of productos) {
                const producto = await Producto.findByPk(item.productoId);
                if (!producto) {
                    throw new Error(`Producto con ID ${item.productoId} no encontrado`);
                }

                if (producto.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto ${producto.nombre}`);
                }

                const subtotal = parseFloat(producto.precio) * item.cantidad;
                total += subtotal;

                // Crear detalle de venta
                await DetalleVenta.create({
                    ventaId: venta.id,
                    productoId: item.productoId,
                    cantidad: item.cantidad,
                    precioUnitario: producto.precio,
                    subtotal: subtotal
                }, { transaction });

                // Actualizar stock del producto
                await producto.update({
                    stock: producto.stock - item.cantidad
                }, { transaction });
            }

            // Actualizar el total de la venta
            await venta.update({ total }, { transaction });

            await transaction.commit();

            // Retornar la venta completa con relaciones
            return await this.obtenerVentaPorId(venta.id);

        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error creando venta: ${error.message}`);
        }
    }

    async actualizarEstadoVenta(id, nuevoEstado) {
        try {
            const [numFilasActualizadas] = await Venta.update(
                { estado: nuevoEstado },
                { where: { id } }
            );

            if (numFilasActualizadas === 0) {
                throw new Error('Venta no encontrada');
            }

            return await this.obtenerVentaPorId(id);
        } catch (error) {
            throw new Error(`Error actualizando estado de venta: ${error.message}`);
        }
    }

    async cancelarVenta(id) {
        const transaction = await sequelize.transaction();
        
        try {
            const venta = await this.obtenerVentaPorId(id);
            
            if (venta.estado === 'cancelada') {
                throw new Error('La venta ya está cancelada');
            }

            // Restaurar stock de productos
            for (const detalle of venta.DetalleVenta) {
                const producto = await Producto.findByPk(detalle.productoId);
                await producto.update({
                    stock: producto.stock + detalle.cantidad
                }, { transaction });
            }

            // Actualizar estado de la venta
            await venta.update({ estado: 'cancelada' }, { transaction });

            await transaction.commit();
            return { message: 'Venta cancelada exitosamente' };

        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error cancelando venta: ${error.message}`);
        }
    }
}

export const ventaServicio = new VentaServicio();