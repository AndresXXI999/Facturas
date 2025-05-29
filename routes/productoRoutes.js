import express from 'express';
import { productoServicio } from '../services/productoService.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const productos = await productoServicio.obtenerProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const producto = await productoServicio.obtenerProductoPorId(req.params.id);
        res.json(producto);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoProducto = await productoServicio.crearProducto(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const productoActualizado = await productoServicio.actualizarProducto(req.params.id, req.body);
        res.json(productoActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const resultado = await productoServicio.borrarProducto(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;