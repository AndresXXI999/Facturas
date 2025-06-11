import express from 'express';
import { facturaServicio } from '../services/facturaService.js';
import { pdfService } from '../services/pdfService.js';

const router = express.Router();

// GET /api/facturas - Obtener todas las facturas
router.get('/', async (req, res, next) => {
    try {
        const facturas = await facturaServicio.obtenerFacturas();
        res.json(facturas);
    } catch (error) {
        next(error);
    }
});

// GET /api/facturas/:id - Obtener factura por ID
router.get('/:id', async (req, res, next) => {
    try {
        const factura = await facturaServicio.obtenerFacturaPorId(req.params.id);
        res.json(factura);
    } catch (error) {
        next(error);
    }
});

// POST /api/facturas - Crear factura
router.post('/', async (req, res, next) => {
    try {
        const nuevaFactura = await facturaServicio.crearFactura(req.body);
        res.status(201).json(nuevaFactura);
    } catch (error) {
        next(error);
    }
});

// GET /api/facturas/:id/pdf - Descargar factura por medio de ID
router.get('/:id/pdf', async (req, res, next) => {
    try {
        const factura = await facturaServicio.obtenerFacturaParaPDF(req.params.id);
        const filePath = await pdfService.generarFactura(factura);
        
        res.download(filePath, `factura_${factura.id}.pdf`, (err) => {
            if (err) console.error('Error sending file:', err);
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/facturas/:id - Eliminar factura por ID
router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await facturaServicio.eliminarFactura(id);
        res.status(204).send(); // No Content
    } catch (error) {
        next(error);
    }
});

// PUT /api/facturas/:id - Actualizar factura
router.put('/:id', async (req, res, next) => {
    try {
        const facturaActualizada = await facturaServicio.actualizarFactura(req.params.id, req.body);
        res.json(facturaActualizada);
    } catch (error) {
        next(error);
    }
});

export default router;