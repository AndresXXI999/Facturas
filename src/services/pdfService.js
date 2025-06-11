import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class PdfService {
async generarFactura(venta) {
        return new Promise((resolve, reject) => {
            try {
                // Crear documento pdf
                const doc = new PDFDocument({ size: 'A4', margin: 50 });
                
                // Crear directorio si aun no existe
                const dir = path.resolve('./facturasPDF');
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                
                // Crear directorio
                const filePath = path.join(dir, `factura_${venta.id}.pdf`);
                const stream = fs.createWriteStream(filePath);
                
                // Cambiar pdf a archivo
                doc.pipe(stream);
                
                // Añadir contenido al pdf
                this._generarContenidoFactura(doc, venta);
                
                // Fnizalizar pdf
                doc.end();
                
                stream.on('finish', () => resolve(filePath));
                stream.on('error', reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    _generarContenidoFactura(doc, factura) {
        // Header
        doc.fontSize(20).text('FACTURA', { align: 'center' });
        doc.moveDown();
        
        // Informacion de factura
        doc.fontSize(12)
           .text(`Número: ${factura.id}`, { align: 'left' })
           .text(`Fecha: ${factura.fecha.toLocaleDateString()}`, { align: 'left' })
           .moveDown();
        
        // Informacion de cliente
        const cliente = factura.clienteData;
        doc.fontSize(14).text('Cliente:', { underline: true });
        doc.fontSize(12)
            .text(`Nombre: ${cliente.nombre}`)
            .text(`Dirección: ${cliente.direccion}`)
            .text(`Teléfono: ${cliente.telefono}`)
            .text(`Email: ${cliente.correo}`)
            .moveDown();
        
        // Informacion de usuario
        const usuario = factura.usuario;
        doc.fontSize(14).text('Atendido por: ');
        doc.fontSize(12).text(`${usuario.nombre}`)
            .moveDown();
        
        // Header de productos
        doc.fontSize(14).text('Productos:', { underline: true });
        
        // Obtener detalles
        const detalles = factura.detallesData || [];
        this._generarTablaProductos(doc, detalles);
        
        // Total
        doc.moveDown()
           .fontSize(14)
           .text(`Total: Q.${factura.total.toFixed(2)}`, { align: 'right' });
    }

    _generarTablaProductos(doc, detalles) {
        // Validar detalles en un array
        if (!Array.isArray(detalles) || detalles.length === 0) {
            doc.fontSize(12).text('No hay productos en esta venta');
            return;
        }
        
        const tableTop = doc.y;
        const col1 = 50;
        const col2 = 300;
        const col3 = 350;
        const col4 = 450;
        
        // Header de tabla
        doc.font('Helvetica-Bold')
           .fontSize(12)
           .text('Producto', col1, tableTop)
           .text('Cantidad', col2, tableTop)
           .text('Precio Unit.', col3, tableTop)
           .text('Subtotal', col4, tableTop)
           .moveDown();
        
        // Filas de tabla
        let y = doc.y;
        detalles.forEach(detalle => {
            const producto = detalle.producto;
            const subtotal = detalle.cantidad * detalle.precio_unitario;
            
            doc.font('Helvetica')
               .fontSize(10)
               .text(producto.nombre, col1, y)
               .text(detalle.cantidad.toString(), col2, y)
               .text(`Q.${detalle.precio_unitario.toFixed(2)}`, col3, y)
               .text(`Q.${subtotal.toFixed(2)}`, col4, y);
            
            y += 25;
        });

        doc.y = y;
    }
}

export const pdfService = new PdfService();