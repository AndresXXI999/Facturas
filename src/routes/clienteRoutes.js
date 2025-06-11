import express from 'express';
import clienteServicio from '../services/clienteService.js';

const router = express.Router();

// GET /api/clientes - Obtener todos los clientes
router.get('/', async (req, res, next) => {
    try {
        const clientes = await clienteServicio.obtenerClientes();
        res.json(clientes);
    } catch (error) {
        next(error);
    }
});

// GET /api/clientes/:id - Obtener cliente por ID
router.get('/:id', async (req, res, next) => {
    try {
        const cliente = await clienteServicio.obtenerClientePorId(req.params.id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        next(error);
    }
});

// POST /api/clientes - Crear nuevo cliente
router.post('/', async (req, res, next) => {
    try {
        const nuevoCliente = await clienteServicio.crearCliente(req.body);
        res.status(201).json(nuevoCliente);
    } catch (error) {
        next(error);
    }
});

// PUT /api/clientes/:id - Actualizar cliente
router.put('/:id', async (req, res, next) => {
    try {
        const clienteActualizado = await clienteServicio.actualizarCliente(req.params.id, req.body);
        res.json(clienteActualizado);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/clientes/:id - Eliminar cliente
router.delete('/:id', async (req, res, next) => {
    try {
        const resultado = await clienteServicio.borrarCliente(req.params.id);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

export default router;