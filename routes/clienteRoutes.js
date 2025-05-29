import express from 'express';
import clienteServicio from '../services/clienteService.js';

const router = express.Router();

// GET /api/clientes - Obtener todos los clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await clienteServicio.obtenerClientes();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/clientes/:id - Obtener cliente por ID
router.get('/:id', async (req, res) => {
    try {
        const cliente = await clienteServicio.obtenerClientePorId(req.params.id);
        res.json(cliente);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /api/clientes - Crear nuevo cliente
router.post('/', async (req, res) => {
    try {
        const nuevoCliente = await clienteServicio.crearCliente(req.body);
        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/clientes/:id - Actualizar cliente
router.put('/:id', async (req, res) => {
    try {
        const clienteActualizado = await clienteServicio.actualizarCliente(req.params.id, req.body);
        res.json(clienteActualizado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/clientes/:id - Eliminar cliente
router.delete('/:id', async (req, res) => {
    try {
        const resultado = await clienteServicio.borrarCliente(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;