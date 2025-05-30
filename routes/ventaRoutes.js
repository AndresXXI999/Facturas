import express from 'express';
import { ventaServicio } from '../services/ventaService.js';
import { pdfService } from '../services/pdfService.js';
import { Venta, Cliente, DetalleVenta, Producto } from '../models/index.js';

const router = express.Router();

// GET /api/ventas - Obtener todas las ventas
router.get('/', async (req, res, next) => {
    try {
        const ventas = await ventaServicio.obtenerVentas();
        res.json(ventas);
    } catch (error) {
        next(error);
    }
});

// GET /api/ventas/:id - Obtener venta por ID
router.get('/:id', async (req, res, next) => {
    try {
        const venta = await ventaServicio.obtenerVentaPorId(req.params.id);
        res.json(venta);
    } catch (error) {
        next(error);
    }
});


// POST /api/ventas - Crear Venta
router.post('/', async (req, res, next) => {
    try {
        const nuevaVenta = await ventaServicio.crearVenta(req.body);
        res.status(201).json(nuevaVenta);
    } catch (error) {
        next(error);
    }
});

// PATCH /api/ventas/:id/estado - Actualizar estado de venta
router.patch('/:id/estado', async (req, res, next) => {
    try {
        const { estado } = req.body;
        const ventaActualizada = await ventaServicio.actualizarEstadoVenta(req.params.id, estado);
        res.json(ventaActualizada);
    } catch (error) {
        next(error);
    }
});

// PATCH api/ventas/:id/cancelar - Cancelar venta
router.patch('/:id/cancelar', async (req, res, next) => {
    try {
        const resultado = await ventaServicio.cancelarVenta(req.params.id);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

// GET /api/ventas/:id/pdf - Descargar factura por medio de ID
router.get('/:id/pdf', async (req, res, next) => {
    try {
        // Use the service layer properly
        const venta = await ventaServicio.obtenerVentaParaPDF(req.params.id);
        const filePath = await pdfService.generarFactura(venta);
        
        res.download(filePath, `factura_${venta.id}.pdf`, (err) => {
            if (err) console.error('Error sending file:', err);
        });
    } catch (error) {
        next(error);
    }
});

export default router;