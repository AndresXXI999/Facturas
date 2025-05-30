import express from 'express';
import { productoServicio } from '../services/productoService.js';

const router = express.Router();


// GET api/productos - obtener todos los productos
router.get('/', async (req, res, next) => {
    try {
        const productos = await productoServicio.obtenerProductos();
        res.json(productos);
    } catch (error) {
        next(error);
    }
});

// GET /api/productos/:id - Obtener producto por ID
router.get('/:id', async (req, res, next) => {
    try {
        const producto = await productoServicio.obtenerProductoPorId(req.params.id);
        res.json(producto);
    } catch (error) {
        next(error);
    }
});

// POST /api/productos - Crear nuevo producto
router.post('/', async (req, res, next) => {
    try {
        const nuevoProducto = await productoServicio.crearProducto(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        next(error);
    }
});


// PUT /api/productos/:id - Actualizar producto
router.put('/:id', async (req, res, next) => {
    try {
        const productoActualizado = await productoServicio.actualizarProducto(req.params.id, req.body);
        res.json(productoActualizado);
    } catch (error) {
        next(error);
    }
});


// DELETE /api/productos/:id - Eliminar producto
router.delete('/:id', async (req, res, next) => {
    try {
        const resultado = await productoServicio.borrarProducto(req.params.id);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

export default router;