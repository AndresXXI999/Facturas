import express from 'express';
import { ventaServicio } from '../services/ventaService.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const ventas = await ventaServicio.obtenerVentas();
        res.json(ventas);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const venta = await ventaServicio.obtenerVentaPorId(req.params.id);
        res.json(venta);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const nuevaVenta = await ventaServicio.crearVenta(req.body);
        res.status(201).json(nuevaVenta);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id/estado', async (req, res, next) => {
    try {
        const { estado } = req.body;
        const ventaActualizada = await ventaServicio.actualizarEstadoVenta(req.params.id, estado);
        res.json(ventaActualizada);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id/cancelar', async (req, res, next) => {
    try {
        const resultado = await ventaServicio.cancelarVenta(req.params.id);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

export default router;