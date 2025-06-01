import express from 'express';
import { usuarioServicio } from '../services/usuarioService.js';

const router = express.Router();

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', async (req, res, next) => {
    try {
        const usuarios = await usuarioServicio.obtenerUsuarios();
        res.json(usuarios);
    } catch (error) {
        next(error);
    }
});

// GET /api/usuarios/:id - Obtener un usuario por ID
router.get('/:id', async (req, res, next) => {
    try {
        const usuario = await usuarioServicio.obtenerUsuarioPorId(req.params.id);
        res.json(usuario);
    } catch (error) {
        next(error);
    }
});

// POST /api/usuarios - Crear nuevo usuario
router.post('/', async (req, res, next) => {
    try {
        const nuevoUsuario = await usuarioServicio.crearUsuario(req.body);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        next(error);
    }
});

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', async (req, res, next) => {
    try {
        const usuarioActualizado = await usuarioServicio.actualizarUsuario(
            req.params.id, 
            req.body
        );
        res.json(usuarioActualizado);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/usuarios/:id - Eliminar usuario
router.delete('/:id', async (req, res, next) => {
    try {
        const resultado = await usuarioServicio.borrarUsuario(req.params.id);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
});

export default router;