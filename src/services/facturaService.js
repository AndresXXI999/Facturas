import { Factura, DetalleFactura, Cliente, Producto, Usuario } from '../models/index.js';
import { sequelize } from '../config/database.js';
import { pdfService } from './pdfService.js';

class FacturaServicio {
    async obtenerFacturas() {
        try {
            return await Factura.findAll({
                include: [
                    { model: Cliente, as: 'cliente' },
                    { model: Usuario, as: 'usuario' },
                    { 
                        model: DetalleFactura, 
                        as: 'detalles',
                        include: [{ model: Producto, as: 'producto' }]
                    }
                ]
            });
        } catch (error) {
            throw new Error(`Error obteniendo facturas: ${error.message}`);
        }
    }

    async obtenerFacturaPorId(id) {
        try {
            const factura = await Factura.findByPk(id, {
                include: [
                    { model: Cliente, as: 'cliente' },
                    { model: Usuario, as: 'usuario' },
                    { 
                        model: DetalleFactura, 
                        as: 'detalles',
                        include: [{ model: Producto, as: 'producto' }]
                    }
                ]
            });
            
            if (!factura) {
                throw new Error('Factura no encontrada');
            }
            return factura;
        } catch (error) {
            throw new Error(`Error obteniendo factura: ${error.message}`);
        }
    }

    async crearFactura(datosFactura) {
        const transaction = await sequelize.transaction();
        
        try {
            const { clienteId, usuarioId, productos } = datosFactura;
            
            // Verificar si el cliente existe
            const cliente = await Cliente.findByPk(clienteId);
            if (!cliente) {
                throw new Error('Cliente no encontrado');
            }
            
            // Verificar si el usuario existe
            const usuario = await Usuario.findByPk(usuarioId);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }

            // Crear la factura
            const factura = await Factura.create({
                clienteId,
                usuarioId,
                fecha: new Date(),
                total: 0
            }, { transaction });

            let total = 0;

            // Crear los detalles de la factura
            for (const item of productos) {
                const producto = await Producto.findByPk(item.productoId);
                if (!producto) {
                    throw new Error(`Producto con ID ${item.productoId} no encontrado`);
                }

                if (producto.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto ${producto.nombre}`);
                }

                const subtotal = parseFloat(producto.precio_unitario) * item.cantidad;
                total += subtotal;

                // Crear detalle
                await DetalleFactura.create({
                    facturaId: factura.id,
                    productoId: item.productoId,
                    cantidad: item.cantidad,
                    precio_unitario: producto.precio_unitario
                }, { transaction });

                // Actualizar exitencias de producto
                await producto.update({
                    stock: producto.stock - item.cantidad
                }, { transaction });
            }

            // Actualizar el total de la factura
            await factura.update({ total }, { transaction });

            await transaction.commit();

            // Obtener datos completos para la creacion del PDF
            const facturaCompleta = await this.obtenerFacturaParaPDF(factura.id);

            // Generar PDF
            pdfService.generarFactura(facturaCompleta)
                .catch(err => console.error("Error al generar PDF:", err));
                
            return facturaCompleta;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async obtenerFacturaParaPDF(id) {
        try {
            const factura = await this.obtenerFacturaPorId(id);
            
            // Preparar datos del cliente
            factura.clienteData = factura.cliente;
            
            // Preparar datos de detalle
            const detalles = factura.detalles || [];
            factura.detallesData = detalles.map(detalle => ({
                ...detalle.toJSON(),
                subtotal: detalle.cantidad * detalle.precio_unitario
            }));
            
            return factura;
        } catch (error) {
            throw new Error(`Error preparando factura para PDF: ${error.message}`);
        }
    }

    async eliminarFactura(id) {
        const transaction = await sequelize.transaction();

        try {
            // Verificar que la factura exista
            const factura = await Factura.findByPk(id, { transaction });
            if (!factura) {
                throw new Error('Factura no encontrada');
            }

            // Eliminar los detalles de la factura
            await DetalleFactura.destroy({
                where: { facturaId: id },
                transaction
            });

            // Eliminar la factura
            await Factura.destroy({
                where: { id },
                transaction
            });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error eliminando factura: ${error.message}`);
        }
    }

    async actualizarFactura(id, datosFactura) {
        const transaction = await sequelize.transaction();

        try {
            const factura = await Factura.findByPk(id, {
                include: [
                    { model: DetalleFactura, as: 'detalles', include: ['producto'] }
                ],
                transaction
            });

            if (!factura) throw new Error('Factura no encontrada');

            const { clienteId, usuarioId, productos } = datosFactura;

            // Restaurar stock anterior
            for (const detalle of factura.detalles) {
                const producto = detalle.producto;
                await producto.update({
                    stock: producto.stock + detalle.cantidad
                }, { transaction });
            }

            // Eliminar detalles anteriores
            await DetalleFactura.destroy({ where: { facturaId: id }, transaction });

            let nuevoTotal = 0;

            // Agregar nuevos detalles y actualizar stock
            for (const item of productos) {
                const producto = await Producto.findByPk(item.productoId);
                if (!producto) throw new Error(`Producto ${item.productoId} no encontrado`);

                if (producto.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para ${producto.nombre}`);
                }

                const subtotal = producto.precio_unitario * item.cantidad;
                nuevoTotal += subtotal;

                await DetalleFactura.create({
                    facturaId: id,
                    productoId: item.productoId,
                    cantidad: item.cantidad,
                    precio_unitario: producto.precio_unitario
                }, { transaction });

                await producto.update({
                    stock: producto.stock - item.cantidad
                }, { transaction });
            }

            // Actualizar la factura
            await factura.update({
                clienteId,
                usuarioId,
                total: nuevoTotal,
                fecha: new Date() // opcionalmente actualizas la fecha
            }, { transaction });

            await transaction.commit();

            const facturaActualizada = await this.obtenerFacturaParaPDF(id);

            // Regenerar el PDF
            pdfService.generarFactura(facturaActualizada)
                .catch(err => console.error("Error al generar PDF:", err));

            return facturaActualizada;

        } catch (error) {
            await transaction.rollback();
            throw new Error(`Error actualizando factura: ${error.message}`);
        }
    }
}



export const facturaServicio = new FacturaServicio();