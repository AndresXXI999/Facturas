# Facturas API - Sistema de Facturación

## Descripción del Proyecto

Sistema de gestión de facturas desarrollado en Node.js con Express y Sequelize ORM. 
Permite gestionar clientes, productos, proveedores, usuarios y generar facturas con 
exportación a PDF.

## Características Principales

• Gestión completa de facturas con detalles de productos
• Generación automática de PDFs para cada factura
• Control de inventario con actualización automática de stock
• API RESTful con endpoints organizados
• Manejo de transacciones para operaciones críticas

## Tecnologías Utilizadas

• Node.js - Runtime de JavaScript
• Express 5.1.0 - Framework web  
• Sequelize 6.37.7 - ORM para base de datos
• SQL Server - Base de datos (tedious driver)
• PDFKit 0.17.1 - Generación de PDFs
• CORS - Manejo de políticas de origen cruzado
• dotenv - Gestión de variables de entorno

## Instalación

### Requisitos Previos
• Node.js (versión 14 o superior)
• SQL Server
• npm o yarn

### Pasos de Instalación

    # Clonar o descargar el proyecto
    cd facturas
    
    # Instalar dependencias
    npm install
    
    # Crear archivo de variables de entorno
    cp .env.example .env

### Variables de Entorno (.env)

    DB_NAME=FacturasDB
    DB_USER=usuario_sql_server
    DB_PASSWORD=contraseña_sql_server
    DB_HOST=localhost
    DB_PORT=1433
    DB_DIALECT=mssql
    PORT=3000

### Configuración de Base de Datos

    -- Crear únicamente la base de datos vacía en SQL Server
    CREATE DATABASE FacturasDB;

NOTA: Las tablas se crean automáticamente al iniciar el servidor.

### Ejecutar la Aplicación

    # Modo desarrollo
    npm run dev
    
    # Modo producción
    npm start

## Uso Básico

### Base URL
    http://localhost:3000

### Crear una Factura

    POST http://localhost:3000/api/facturas
    Content-Type: application/json
    
    {
      "clienteId": 1,
      "usuarioId": 1,
      "productos": [
        {
          "productoId": 1,
          "cantidad": 2
        }
      ]
    }

### Obtener Facturas

    GET http://localhost:3000/api/facturas

### Descargar PDF de Factura

    GET http://localhost:3000/api/facturas/1/pdf

## API Endpoints

### Principales Endpoints
• GET /api/facturas - Obtener todas las facturas
• GET /api/facturas/:id - Obtener factura por ID
• POST /api/facturas - Crear factura
• PUT /api/facturas/:id - Actualizar factura
• DELETE /api/facturas/:id - Eliminar factura por ID
• GET /api/facturas/:id/pdf - Descargar factura por medio de ID

• GET /api/clientes - Gestión de clientes
• GET /api/clientes/:id - Obtener cliente por ID
• POST /api/clientes - Crear nuevo cliente
• PUT /api/clientes/:id - Actualizar cliente
• DELETE /api/clientes/:id - Eliminar cliente

• GET api/productos - obtener todos los productos
• GET /api/productos/:id - Obtener producto por ID
• POST /api/productos - Crear nuevo producto
• PUT /api/productos/:id - Actualizar producto
• DELETE /api/productos/:id - Eliminar producto

• GET /api/proveedores - Obtener todos los proveedores
• GET /api/proveedores/:id - Obtener un proveedor por ID
• POST /api/proveedores - Crear nuevo proveedor
• PUT /api/proveedores/:id - Actualizar proveedor
• DELETE /api/proveedores/:id - Eliminar proveedor

• GET /api/usuarios - Obtener todos los usuarios
• GET /api/usuarios/:id - Obtener un usuario por ID
• POST /api/usuarios - Crear nuevo usuario
• PUT /api/usuarios/:id - Actualizar usuario
• DELETE /api/usuarios/:id - Eliminar usuario

## Scripts Disponibles

    # Iniciar servidor de desarrollo
    npm run dev
    
    # Iniciar servidor de producción
    npm start
    
    # Resetear base de datos (ELIMINA TODOS LOS DATOS)
    npm run reset-db
    
    # Ejecutar tests
    npm test

### Script de Reseteo de Base de Datos

ADVERTENCIA: El comando 'npm run reset-db' elimina todos los datos existentes 
y recrea las tablas.

Uso recomendado:
• Solo en desarrollo para limpiar datos de prueba
• Nunca en producción  
• Hacer backup antes de ejecutar con datos importantes

## Modelo de Datos

### Relaciones Principales

    Cliente (1) ──── (N) Factura (N) ──── (1) Usuario
                          │
                          │ (1)
                          │
                          │ (N)
                     DetalleFactura
                          │
                          │ (N)
                          │
                          │ (1)
                       Producto (N) ──── (1) Proveedor

## Funcionalidades Clave

### Creación de Facturas
El sistema maneja automáticamente:
• Validación de cliente y usuario
• Verificación de stock de productos
• Actualización de inventario
• Cálculo de totales
• Generación de PDF
• Manejo de transacciones para consistencia

### Generación de PDFs
Los PDFs se generan automáticamente e incluyen:
• Información completa del cliente
• Detalles de productos y cantidades  
• Totales calculados
• Se guardan en la carpeta /facturasPDF/

## Estructura del Proyecto

    facturas/
    ├── src/
    │   ├── config/         # Configuración de base de datos
    │   ├── models/         # Modelos de Sequelize
    │   ├── routes/         # Rutas de la API
    │   ├── services/       # Lógica de negocio
    │   ├── scripts/        # Scripts utilitarios
    │   ├── app.js          # Configuración de Express
    │   └── server.js       # Punto de entrada
    ├── facturasPDF/        # PDFs generados
    ├── package.json
    └── .env               # Variables de entorno

## Flujo de Creación de Factura

1. Recibir datos de factura
2. Iniciar transacción de base de datos
3. Validar existencia de cliente y usuario
4. Crear registro de factura
5. Para cada producto:
   - Verificar stock disponible
   - Crear detalle de factura
   - Actualizar inventario
6. Calcular total de la factura
7. Confirmar transacción
8. Generar PDF automáticamente
9. Retornar factura completa

## Errores Comunes

• "Cliente no encontrado" - Verificar que el cliente exista
• "Usuario no encontrado" - Verificar que el usuario exista  
• "Stock insuficiente" - Reducir cantidad o reabastecer
• "Producto no encontrado" - Verificar que el producto exista


## Soporte

Si encuentras algún problema o tienes preguntas:
• Revisa los logs del servidor para errores específicos
• Asegúrate de que SQL Server esté corriendo
• Confirma que las variables de entorno estén configuradas correctamente

---
Sistema desarrollado con Node.js y Express para gestión integral de facturación.