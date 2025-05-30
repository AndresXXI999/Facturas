import { Venta, DetalleVenta, Cliente, Producto } from '../models/index.js';
import { sequelize } from '../config/database.js';
import { pdfService } from './pdfService.js';

class VentaServicio {
    async obtenerVentas() {
        try {
            return await Venta.findAll({
                include: [
                    { model: Cliente, as: 'cliente' },
                    { 
                        model: DetalleVenta, as: 'detalles',
                        include: [{ model: Producto, as: 'producto' }]
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
                    { model: Cliente, as: 'cliente' },
                    { 
                        model: DetalleVenta, as: 'detalles',
                        include: [{ model: Producto, as: 'producto' }]
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

            // Obtener datos de la venta completos para generación del pdf
            const ventaCompleta = await this.obtenerVentaParaPDF(venta.id);

            // Generate PDF asynchronously
            pdfService.generarFactura(ventaCompleta)
                .catch(err => console.error("Error al generar PDF:", err));
                
            return ventaCompleta;

        } catch (error) {
            await transaction.rollback();
            throw error;
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

            // Utilizar el nombre de propiedad correcto basado en las asociaciones del modelo
            const detalles = venta.detalles || venta.DetalleVenta || [];

            // Restaurar stock de productos
            for (const detalle of detalles) {
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

    async obtenerVentaParaPDF(id) {
        try {
            const venta = await this.obtenerVentaPorId(id);
            
            // Verificar si el cliente existe
            if (!venta.cliente && !venta.Cliente) {
                throw new Error('Cliente no encontrado para esta venta');
            }
            
            // Utilizar clienteData estándar
            venta.clienteData = venta.cliente || venta.Cliente;
            
            // Revisar si los detalles existen y si se pueden iterar
            const detalles = venta.detalles || venta.DetalleVenta || [];
            if (!Array.isArray(detalles) || detalles.length === 0) {
                throw new Error('Venta no tiene productos');
            }
            venta.detallesData = detalles;
            
            return venta;
        } catch (error) {
            throw new Error(`Error preparando venta para PDF: ${error.message}`);
        }
    }
}

export const ventaServicio = new VentaServicio();