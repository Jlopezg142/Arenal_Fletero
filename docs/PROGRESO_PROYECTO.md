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

# Versión 1.1 – Frontend inicial del fletero

Fecha: 13/07/2026

## Objetivo
Crear la primera interfaz web para el fletero, eliminando la dependencia de Swagger para el registro de entregas.

## Funcionalidades implementadas

- Inicio de sesión desde la aplicación web.
- Formulario de registro de entregas.
- Carga de fotografía del envío.
- Obtención automática de ubicación GPS mediante el navegador.
- Validación obligatoria de ubicación antes del registro.
- Conservación de la ubicación cuando ocurre un error de validación.
- Mensajes de éxito y error más claros para el usuario.
- Integración completa con la API de FastAPI.

## Mejoras técnicas

- Docker configurado para servir el frontend.
- Frontend servido desde `/app`.
- Persistencia de fotografías mediante volumen Docker.
- Mejor manejo del estado de los botones.
- Mejor experiencia de usuario durante el registro.

## Estado

Versión estable.
Lista para iniciar el desarrollo de la versión 1.2.

# Versión 1.1

Fecha: 14/07/2026

## Funcionalidades implementadas

- Desarrollo del frontend web inicial.
- Pantalla de inicio de sesión.
- Diseño institucional con colores de El Arenal.
- Integración del logotipo de la empresa.
- Inclusión de sello de agua "Jl-A".
- Formulario de registro de entregas.
- Captura de fotografía.
- Captura de ubicación GPS.
- Validación para exigir ubicación antes del registro.
- Conservación de la ubicación al corregir errores del formulario.
- Selector automático de agencias activas.
- Carga dinámica de agencias desde la API.
- Mensajes de éxito y error mejorados.
- Correcciones generales del frontend.

Estado del proyecto: Frontend funcional para registro de entregas.

# Versión 1.2 – Panel administrativo de consulta

## Funcionalidades implementadas

- Separación de interfaz por rol.
- Perfil FLETERO exclusivamente operativo.
- Perfil ADMIN exclusivamente administrativo.
- Restricción del endpoint POST /entregas para administradores.
- Panel administrativo de consulta de entregas.
- Filtros automáticos por:
  - fecha inicial;
  - fecha final;
  - agencia;
  - fletero.
- Opciones Todas y Todos en los filtros.
- Tabla con:
  - fecha y hora;
  - número de envío;
  - agencia;
  - fletero;
  - latitud;
  - longitud;
  - fotografía;
  - enlace a Google Maps.
- Coordenadas mostradas con seis decimales.
- Catálogo de fleteros activos para filtros.
- Pruebas satisfactorias de permisos, filtros, fotografías y mapas.

## Estado

Versión estable.
Cierre funcional de Arenal Fletero v1.

# Versión 2.1 – Evidencia fotográfica completa

Fecha: 14/07/2026

## Objetivo

Completar la evidencia de cada entrega mediante dos fotografías obligatorias:

- Fotografía del envío.
- Fotografía del lugar de entrega.

## Funcionalidades implementadas

- Se agregó la fotografía obligatoria del lugar.
- El formulario del fletero exige ambas fotografías.
- El backend recibe `foto_envio` y `foto_lugar`.
- Ambas imágenes son validadas como JPG, JPEG o PNG.
- Cada fotografía admite un tamaño máximo de 5 MB.
- Si falla el almacenamiento de una fotografía, se elimina la otra para evitar archivos huérfanos.
- Si falla el registro en PostgreSQL, se eliminan ambas fotografías.
- La tabla administrativa muestra:
  - Foto envío.
  - Foto lugar.
- Ambas fotografías pueden abrirse desde el panel administrativo.
- Se mantuvo la restricción que impide al administrador registrar entregas.
- Se verificó el funcionamiento desde computadora.

## Pruebas realizadas

- Registro exitoso con ambas fotografías.
- Validación de fotografías obligatorias.
- Almacenamiento de ambas rutas en la base de datos.
- Visualización de ambas fotografías en el panel administrativo.
- Funcionamiento correcto de filtros, coordenadas y mapa.

## Estado

Versión estable.

Lista para iniciar la versión 2.2:
Exportación CSV.

# Versión 2.2 – Exportación CSV

Fecha: 14/07/2026

## Objetivo

Permitir que el administrador descargue las entregas en formato CSV respetando los filtros seleccionados en el panel.

## Funcionalidades implementadas

- Se creó el endpoint administrativo:
  - GET /admin/exportar-entregas.csv
- La exportación es exclusiva para usuarios con rol ADMIN.
- El archivo CSV respeta los filtros activos de:
  - fecha inicial;
  - fecha final;
  - agencia;
  - fletero.
- Se agregó el botón Exportar CSV en el panel administrativo.
- El botón se habilita únicamente cuando existen resultados.
- La descarga se realiza directamente desde la aplicación.
- El archivo incluye:
  - fecha y hora;
  - número de envío;
  - agencia;
  - fletero;
  - usuario;
  - comentario;
  - latitud;
  - longitud;
  - URL de fotografía del envío;
  - URL de fotografía del lugar.
- Se mantiene la precisión completa de las coordenadas.
- Se agregó nombre automático con fecha y hora al archivo descargado.
- El archivo es compatible con Excel mediante codificación UTF-8 con BOM.

## Pruebas realizadas

- Exportación sin filtros.
- Exportación por rango de fechas.
- Exportación por agencia.
- Exportación por fletero.
- Exportación combinando filtros.
- Verificación de estructura y contenido del CSV.
- Verificación de enlaces de ambas fotografías.

## Estado

Versión estable.

Lista para iniciar la versión 2.3:
Administración visual de agencias.

# Versión 2.3 – Administración completa de agencias

Fecha: 15/07/2026

## Funcionalidades incorporadas

- Administración completa de agencias.
- Crear agencias.
- Editar agencias.
- Activar agencias.
- Desactivar agencias.
- Validación de nombres duplicados.
- Longitud máxima de 50 caracteres.
- Actualización automática de la tabla.
- Actualización automática del catálogo de agencias.
- Solo agencias activas disponibles para el fletero.
- Mejoras visuales del panel administrativo.
- Correcciones generales de estabilidad.

Estado:
Versión estable.