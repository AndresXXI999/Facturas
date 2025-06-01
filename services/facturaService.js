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
            
            // Verify client exists
            const cliente = await Cliente.findByPk(clienteId);
            if (!cliente) {
                throw new Error('Cliente no encontrado');
            }
            
            // Verify user exists
            const usuario = await Usuario.findByPk(usuarioId);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }

            // Create the invoice
            const factura = await Factura.create({
                clienteId,
                usuarioId,
                fecha: new Date(),
                total: 0
            }, { transaction });

            let total = 0;

            // Create invoice details
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

                // Create detail
                await DetalleFactura.create({
                    facturaId: factura.id,
                    productoId: item.productoId,
                    cantidad: item.cantidad,
                    precio_unitario: producto.precio_unitario
                }, { transaction });

                // Update product stock
                await producto.update({
                    stock: producto.stock - item.cantidad
                }, { transaction });
            }

            // Update invoice total
            await factura.update({ total }, { transaction });

            await transaction.commit();

            // Get complete invoice data for PDF generation
            const facturaCompleta = await this.obtenerFacturaParaPDF(factura.id);

            // Generate PDF asynchronously
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
            
            // Prepare client data
            factura.clienteData = factura.cliente;
            
            // Prepare details data
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
}

export const facturaServicio = new FacturaServicio();