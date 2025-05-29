import express from 'express';
import { ventaServicio } from '../services/ventaService.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const ventas = await ventaServicio.obtenerVentas();
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const venta = await ventaServicio.obtenerVentaPorId(req.params.id);
        res.json(venta);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevaVenta = await ventaServicio.crearVenta(req.body);
        res.status(201).json(nuevaVenta);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Updated PATCH routes with explicit path syntax
router.patch('/:id(estado)', async (req, res) => {
    try {
        const { estado } = req.body;
        const ventaActualizada = await ventaServicio.actualizarEstadoVenta(req.params.id, estado);
        res.json(ventaActualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch('/:id(cancelar)', async (req, res) => {
    try {
        const resultado = await ventaServicio.cancelarVenta(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;