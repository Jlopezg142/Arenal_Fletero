##----- version Arenal Contexto--------

# PROGRESO_PROYECTO.md

# Proyecto Arenal Fletero

## Información General

**Objetivo:** Sistema para registrar entregas realizadas por fleteros,
con evidencia fotográfica, ubicación GPS y exportación administrativa.

## Tecnologías

-   FastAPI
-   PostgreSQL
-   SQLAlchemy
-   JWT + OAuth2
-   Argon2
-   Docker
-   Git/GitHub
-   Render
-   Almacenamiento de fotografías por URL

## Reglas de negocio

-   Roles: ADMIN y FLETERO.
-   Solo ADMIN crea usuarios y agencias.
-   El número de envío es único.
-   Una entrega no se puede editar.
-   Comentario opcional.
-   GPS automático.
-   Fotografías obligatorias cuando se implemente ese módulo.
-   Las fotografías no se almacenarán en PostgreSQL; solo la URL.

## Arquitectura

-   API
-   Services
-   Repositories
-   Models
-   Database

## Versiones implementadas

-   ✅ v0.1 Infraestructura
-   ✅ v0.2 PostgreSQL y modelos
-   ✅ v0.3 Seguridad
-   ✅ v0.4 Login OAuth2
-   ✅ v0.5 JWT y roles
-   ✅ v0.6 CRUD de usuarios
-   ✅ v0.7 CRUD de agencias
-   ✅ v0.8 Registro de entregas
-   ✅ v0.9 Consulta de entregas

## Pendiente

-   v1.0 Fotografías
-   v1.1 GPS
-   v1.2 Exportación CSV
-   v1.3 ZIP de fotografías
-   v1.4 Dashboard (solo ADMIN)
-   v1.5 Frontend Web
-   v1.6 Publicación en Render

## Dashboard (ADMIN)

-   Entregas de hoy
-   Entregas del mes
-   Entregas por agencia
-   Entregas por fletero
-   Usuarios activos
-   Agencias activas

## Fletero

-   Registrar entrega
-   Consultar mis entregas
-   Cerrar sesión

## Objetivo de producción

-   25 usuarios máximo
-   10 agencias máximo
-   Aproximadamente 1,000 entregas por mes


##----- version Arenal Fletero v1.0--------

# PROGRESO DEL PROYECTO
## Arenal Fletero

---

# Información general

Proyecto académico para el control de entregas realizadas por fleteros.

Tecnologías:

- FastAPI
- PostgreSQL
- SQLAlchemy
- Docker
- JWT
- Swagger
- GitHub

Repositorio:
https://github.com/Jlopezg142/Arenal_Fletero

---

# Historial de versiones

## ✅ v0.1 Infraestructura

Estado: Finalizada

Implementado:

- Docker
- FastAPI
- PostgreSQL
- Estructura inicial

---

## ✅ v0.2 Base de datos

Estado: Finalizada

Implementado:

- Modelos
- Conexión SQLAlchemy
- Creación automática de tablas

---

## ✅ v0.3 Seguridad

Estado: Finalizada

Implementado:

- Hash de contraseñas
- JWT
- Configuración de seguridad

---

## ✅ v0.4 Login

Estado: Finalizada

Implementado:

- Inicio de sesión
- OAuth2
- Swagger Authorize

---

## ✅ v0.5 Roles

Estado: Finalizada

Implementado:

- Administrador
- Fletero
- Restricciones por rol

---

## ✅ v0.6 Usuarios

Estado: Finalizada

Implementado:

- CRUD Usuarios
- Validaciones

---

## ✅ v0.7 Agencias

Estado: Finalizada

Implementado:

- CRUD Agencias
- Activar / Desactivar

---

## ✅ v0.8 Registro de entregas

Estado: Finalizada

Implementado:

- Registro de entrega
- Validación de número de envío
- Asociación con usuario y agencia

---

## ✅ v0.9 Consulta de entregas

Estado: Finalizada

Implementado:

- Consulta individual
- Consulta por filtros
- Restricción por roles
- Consulta por fechas
- Consulta por agencia
- Consulta por usuario
- Consulta por envío

---

## ✅ v1.0 Registro con fotografía

Estado: Finalizada

Implementado:

- Registro mediante multipart/form-data.
- Fotografía obligatoria.
- Validación de JPG, JPEG y PNG.
- Tamaño máximo 5 MB.
- Nombre único mediante UUID.
- Organización de imágenes por año y mes.
- Almacenamiento físico de imágenes.
- Publicación mediante /uploads.
- Ruta almacenada en foto_envio.
- Eliminación automática del archivo si falla PostgreSQL.
- Pruebas exitosas desde Swagger.

Commit:

v1.0 Registro de entregas con fotografia

Fecha:

12/07/2026

---

# Próxima versión

## 🔄 v1.1 GPS

Objetivo:

Capturar automáticamente la ubicación del teléfono.

Pendiente:

- Registrar latitud.
- Registrar longitud.
- Validar coordenadas.
- Mostrar coordenadas en consultas.
- Preparar integración con frontend móvil.

---

# Estado actual

Versión estable:

v1.0

Último commit:

4e45394

Repositorio sincronizado:

Sí

Estado Git:

Working tree clean