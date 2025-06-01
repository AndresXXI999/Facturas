import express from 'express';
import { proveedorServicio } from '../services/proveedorService.js';

const router = express.Router();

// GET /api/proveedores - Obtener todos los proveedores
router.get('/', async (req, res, next) => {
    try {
        const proveedores = await proveedorServicio.obtenerProveedores();
        res.json(proveedores);
    } catch (error) {
        next(error);
    }
});

// GET /api/proveedores/:id - Obtener un proveedor por ID
router.get('/:id', async (req, res, next) => {
    try {
        const proveedor = await proveedorServicio.obtenerProveedorPorId(req.params.id);
        res.json(proveedor);
    } catch (error) {
        next(error);
    }
});

// POST /api/proveedores - Crear nuevo proveedor
router.post('/', async (req, res, next) => {
    try {
        const nuevoProveedor = await proveedorServicio.crearProveedor(req.body);
        res.status(201).json(nuevoProveedor);
    } catch (error) {
        next(error);
    }
});

// PUT /api/proveedores/:id - Actualizar proveedor
router.put('/:id', async (req, res, next) => {
    try {
        const proveedorActualizado = await proveedorServicio.actualizarProveedor(
            req.params.id, 
            req.body
        );
        res.json(proveedorActualizado);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/proveedores/:id - Eliminar proveedor
router.delete('/:id', async (req, res, next) => {
    try {
        const resultado = await proveedorServicio.borrarProveedor(req.params.id);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

export default router;