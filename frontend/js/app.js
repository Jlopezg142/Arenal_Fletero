"use strict";

const API_URL = "";

const ROL_ADMIN = "ADMIN";
const ROL_FLETERO = "FLETERO";

let ubicacionActual = null;
let usuarioActual = null;
let consultaAdministradorEnProceso = false;
let modoFormularioAgencia = "crear";
let agenciaEditandoId = null;
let modoFormularioUsuario = "crear";
let usuarioEditandoId = null;
let usuarioPasswordId = null;


/* =========================================================
   ELEMENTOS GENERALES
========================================================= */

const subtituloAplicacion = document.getElementById(
    "subtitulo-aplicacion"
);

const seccionLogin = document.getElementById(
    "seccion-login"
);

const seccionEntrega = document.getElementById(
    "seccion-entrega"
);

const seccionAdministrador = document.getElementById(
    "seccion-administrador"
);

const formLogin = document.getElementById(
    "form-login"
);

const botonLogin = document.getElementById(
    "boton-login"
);

const mensajeLogin = document.getElementById(
    "mensaje-login"
);


/* =========================================================
   ELEMENTOS DEL FLETERO
========================================================= */

const formEntrega = document.getElementById(
    "form-entrega"
);

const bienvenidaFletero = document.getElementById(
    "bienvenida-fletero"
);

const mensajeEntrega = document.getElementById(
    "mensaje-entrega"
);

const botonObtenerUbicacion = document.getElementById(
    "boton-obtener-ubicacion"
);

const botonRegistrar = document.getElementById(
    "boton-registrar"
);

const botonCerrarSesion = document.getElementById(
    "boton-cerrar-sesion"
);

const estadoUbicacion = document.getElementById(
    "estado-ubicacion"
);

const inputLatitud = document.getElementById(
    "latitud"
);

const inputLongitud = document.getElementById(
    "longitud"
);

const selectAgencia = document.getElementById(
    "agencia_id"
);

const estadoAgencias = document.getElementById(
    "estado-agencias"
);

const inputFotoEnvio = document.getElementById(
    "foto_envio"
);

const inputFotoLugar = document.getElementById(
    "foto_lugar"
);


/* =========================================================
   ELEMENTOS DEL ADMINISTRADOR
========================================================= */

const bienvenidaAdministrador = document.getElementById(
    "bienvenida-administrador"
);

const botonCerrarSesionAdmin = document.getElementById(
    "boton-cerrar-sesion-admin"
);

const formFiltros = document.getElementById(
    "form-filtros"
);

const filtroFechaInicio = document.getElementById(
    "filtro-fecha-inicio"
);

const filtroFechaFin = document.getElementById(
    "filtro-fecha-fin"
);

const filtroAgencia = document.getElementById(
    "filtro-agencia"
);

const filtroFletero = document.getElementById(
    "filtro-fletero"
);

const mensajeAdministrador = document.getElementById(
    "mensaje-administrador"
);

const totalEntregas = document.getElementById(
    "total-entregas"
);

const cuerpoTablaEntregas = document.getElementById(
    "cuerpo-tabla-entregas"
);

const botonExportar = document.getElementById(
    "boton-exportar"
);
const botonNuevaAgencia = document.getElementById(
    "boton-nueva-agencia"
);

const modalAgencia = document.getElementById(
    "modal-agencia"
);

const botonCerrarModalAgencia = document.getElementById(
    "cerrar-modal-agencia"
);

const botonCancelarModalAgencia = document.getElementById(
    "cancelar-modal-agencia"
);

const botonGuardarAgencia = document.getElementById(
    "guardar-agencia"
);

const inputNombreAgencia = document.getElementById(
    "nombre-agencia"
);

const mensajeModalAgencia = document.getElementById(
    "mensaje-modal-agencia"
);

const mensajeAgenciasAdmin = document.getElementById(
    "mensaje-agencias-admin"
);

const cuerpoTablaAgencias = document.getElementById(
    "cuerpo-tabla-agencias"
);

const tituloModalAgencia = document.getElementById(
    "titulo-modal-agencia"
);

const botonNuevoUsuario = document.getElementById(
    "boton-nuevo-usuario"
);

const mensajeUsuariosAdmin = document.getElementById(
    "mensaje-usuarios-admin"
);

const cuerpoTablaUsuarios = document.getElementById(
    "cuerpo-tabla-usuarios"
);

const modalUsuario = document.getElementById(
    "modal-usuario"
);

const tituloModalUsuario = document.getElementById(
    "titulo-modal-usuario"
);

const botonCerrarModalUsuario = document.getElementById(
    "cerrar-modal-usuario"
);

const botonCancelarModalUsuario = document.getElementById(
    "cancelar-modal-usuario"
);

const botonGuardarUsuario = document.getElementById(
    "guardar-usuario"
);

const inputNombreUsuarioAdmin = document.getElementById(
    "nombre-usuario-admin"
);

const inputUsuarioAdmin = document.getElementById(
    "usuario-admin"
);

const inputPasswordUsuarioAdmin = document.getElementById(
    "password-usuario-admin"
);

const selectRolUsuarioAdmin = document.getElementById(
    "rol-usuario-admin"
);

const mensajeModalUsuario = document.getElementById(
    "mensaje-modal-usuario"
);

const grupoPasswordUsuario = document.getElementById(
    "grupo-password-usuario"
);

const modalPasswordUsuario = document.getElementById(
    "modal-password-usuario"
);

const tituloModalPasswordUsuario = document.getElementById(
    "titulo-modal-password-usuario"
);

const textoUsuarioPasswordSeleccionado = document.getElementById(
    "usuario-password-seleccionado"
);

const botonCerrarModalPasswordUsuario = document.getElementById(
    "cerrar-modal-password-usuario"
);

const botonCancelarModalPasswordUsuario = document.getElementById(
    "cancelar-modal-password-usuario"
);

const botonGuardarPasswordUsuario = document.getElementById(
    "guardar-password-usuario"
);

const inputNuevaPasswordUsuario = document.getElementById(
    "nueva-password-usuario"
);

const inputConfirmarPasswordUsuario = document.getElementById(
    "confirmar-password-usuario"
);

const mensajeModalPasswordUsuario = document.getElementById(
    "mensaje-modal-password-usuario"
);

/* =========================================================
   NAVEGACION DEL PANEL ADMINISTRADOR
========================================================= */

const botonesModuloAdministrador =
    document.querySelectorAll(
        ".boton-modulo-admin"
    );

const subvistasAdministrador =
    document.querySelectorAll(
        ".subvista-admin"
    );

/* =========================================================
   SESIÓN
========================================================= */

function obtenerToken() {
    return sessionStorage.getItem(
        "arenal_token"
    );
}


function guardarToken(token) {
    sessionStorage.setItem(
        "arenal_token",
        token
    );
}


function guardarUsuario(usuario) {
    usuarioActual = usuario;

    sessionStorage.setItem(
        "arenal_usuario",
        JSON.stringify(usuario)
    );
}


function obtenerUsuarioGuardado() {
    const usuarioGuardado = sessionStorage.getItem(
        "arenal_usuario"
    );

    if (!usuarioGuardado) {
        return null;
    }

    try {
        return JSON.parse(
            usuarioGuardado
        );

    } catch {
        sessionStorage.removeItem(
            "arenal_usuario"
        );

        return null;
    }
}


function limpiarSesion() {
    sessionStorage.removeItem(
        "arenal_token"
    );

    sessionStorage.removeItem(
        "arenal_usuario"
    );

    usuarioActual = null;
}


async function consultarUsuarioActual() {
    const token = obtenerToken();

    if (!token) {
        throw new Error(
            "No existe una sesión activa."
        );
    }

    const respuesta = await fetch(
        `${API_URL}/auth/me`,
        {
            method: "GET",
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.detail
            || "La sesión no es válida."
        );
    }

    return datos;
}


/* =========================================================
   MENSAJES
========================================================= */

function mostrarMensaje(
    elemento,
    mensaje,
    tipo
) {
    elemento.textContent = mensaje;

    elemento.classList.remove(
        "oculto",
        "mensaje-exito",
        "mensaje-error"
    );

    elemento.classList.add(
        tipo === "exito"
            ? "mensaje-exito"
            : "mensaje-error"
    );
}


function ocultarMensaje(elemento) {
    elemento.textContent = "";

    elemento.classList.add(
        "oculto"
    );

    elemento.classList.remove(
        "mensaje-exito",
        "mensaje-error"
    );
}


/* =========================================================
   NAVEGACIÓN SEGÚN ROL
========================================================= */

function ocultarSeccionesPrivadas() {
    seccionEntrega.classList.add(
        "oculto"
    );

    seccionAdministrador.classList.add(
        "oculto"
    );
}


function mostrarFormularioLogin() {
    ocultarSeccionesPrivadas();

    seccionLogin.classList.remove(
        "oculto"
    );

    subtituloAplicacion.textContent = (
        "Registro de entregas"
    );
}


function mostrarFormularioFletero(usuario) {
    seccionLogin.classList.add(
        "oculto"
    );

    seccionAdministrador.classList.add(
        "oculto"
    );

    seccionEntrega.classList.remove(
        "oculto"
    );

    subtituloAplicacion.textContent = (
        "Registro de entregas"
    );

    bienvenidaFletero.textContent = (
        `Bienvenido, ${usuario.nombre}. `
        + "Registra la evidencia del envío."
    );
}


function mostrarPanelAdministrador(usuario) {
    seccionLogin.classList.add(
        "oculto"
    );

    seccionEntrega.classList.add(
        "oculto"
    );

    seccionAdministrador.classList.remove(
        "oculto"
    );

    subtituloAplicacion.textContent = (
        "Administración de entregas"
    );

    bienvenidaAdministrador.textContent = (
        `Bienvenido, ${usuario.nombre}. `
        + "Consulta y filtra las entregas registradas."
    );
}


async function prepararInterfazPorRol(usuario) {
    guardarUsuario(usuario);

    if (usuario.rol === ROL_ADMIN) {
        mostrarPanelAdministrador(
            usuario
        );

        await inicializarPanelAdministrador();

        return;
    }

    if (usuario.rol === ROL_FLETERO) {
        mostrarFormularioFletero(
            usuario
        );

        await cargarAgenciasActivas();

        return;
    }

    limpiarSesion();
    mostrarFormularioLogin();

    mostrarMensaje(
        mensajeLogin,
        "El usuario no tiene un rol válido.",
        "error"
    );
}


/* =========================================================
   LOGIN
========================================================= */

async function iniciarSesion(
    usuario,
    password
) {
    const datosLogin = new URLSearchParams();

    datosLogin.append(
        "username",
        usuario
    );

    datosLogin.append(
        "password",
        password
    );

    const respuesta = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
            },
            body: datosLogin,
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.detail
            || "No fue posible iniciar sesión."
        );
    }

    if (
        !datos.access_token
        || !datos.usuario
    ) {
        throw new Error(
            "La respuesta del servidor "
            + "no contiene la sesión completa."
        );
    }

    return datos;
}


formLogin.addEventListener(
    "submit",
    async (evento) => {
        evento.preventDefault();

        ocultarMensaje(
            mensajeLogin
        );

        botonLogin.disabled = true;

        botonLogin.textContent = (
            "Ingresando..."
        );

        const nombreUsuario = document.getElementById(
            "usuario"
        ).value.trim();

        const password = document.getElementById(
            "password"
        ).value;

        try {
            const datosSesion = await iniciarSesion(
                nombreUsuario,
                password
            );

            guardarToken(
                datosSesion.access_token
            );

            guardarUsuario(
                datosSesion.usuario
            );

            formLogin.reset();

            await prepararInterfazPorRol(
                datosSesion.usuario
            );

        } catch (error) {
            limpiarSesion();

            mostrarFormularioLogin();

            mostrarMensaje(
                mensajeLogin,
                error.message,
                "error"
            );

        } finally {
            botonLogin.disabled = false;

            botonLogin.textContent = (
                "Ingresar"
            );
        }
    }
);


/* =========================================================
   CIERRE DE SESIÓN
========================================================= */

function reiniciarFormularioFletero() {
    formEntrega.reset();

    eliminarUbicacion();

    botonRegistrar.disabled = false;
    botonObtenerUbicacion.disabled = false;

    selectAgencia.disabled = true;

    selectAgencia.innerHTML = `
        <option value="">
            Cargando agencias...
        </option>
    `;

    estadoAgencias.textContent = "";

    ocultarMensaje(
        mensajeEntrega
    );
}


function reiniciarPanelAdministrador() {
    formFiltros.reset();

    filtroAgencia.disabled = true;
    filtroFletero.disabled = true;

    filtroAgencia.innerHTML = `
        <option value="">
            Todas
        </option>
    `;

    filtroFletero.innerHTML = `
        <option value="">
            Todos
        </option>
    `;

    totalEntregas.textContent = "0";

    botonExportar.disabled = true;

    cuerpoTablaEntregas.innerHTML = `
        <tr>
            <td
                colspan="9"
                class="tabla-vacia"
            >
                No hay información para mostrar.
            </td>
        </tr>
    `;

    ocultarMensaje(
        mensajeAdministrador
    );
}


function cerrarSesion() {
    limpiarSesion();

    reiniciarFormularioFletero();
    reiniciarPanelAdministrador();

    mostrarFormularioLogin();
}


botonCerrarSesion.addEventListener(
    "click",
    cerrarSesion
);


botonCerrarSesionAdmin.addEventListener(
    "click",
    cerrarSesion
);


/* =========================================================
   CATÁLOGO DE AGENCIAS
========================================================= */

function reiniciarListadoAgencias() {
    selectAgencia.disabled = true;

    selectAgencia.innerHTML = `
        <option value="">
            Cargando agencias...
        </option>
    `;

    estadoAgencias.textContent = "";
}


async function obtenerAgenciasActivas() {
    const token = obtenerToken();

    const respuesta = await fetch(
        `${API_URL}/agencias/activas`,
        {
            method: "GET",
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.detail
            || "No fue posible cargar las agencias."
        );
    }

    return Array.isArray(datos)
        ? datos
        : [];
}


async function cargarAgenciasActivas() {
    reiniciarListadoAgencias();

    try {
        const agencias = await obtenerAgenciasActivas();

        selectAgencia.innerHTML = `
            <option value="">
                Seleccione una agencia
            </option>
        `;

        if (agencias.length === 0) {
            selectAgencia.innerHTML = `
                <option value="">
                    No hay agencias activas
                </option>
            `;

            selectAgencia.disabled = true;

            return;
        }

        agencias.forEach((agencia) => {
            const opcion = document.createElement(
                "option"
            );

            opcion.value = agencia.id;
            opcion.textContent = agencia.nombre;

            selectAgencia.appendChild(
                opcion
            );
        });

        selectAgencia.disabled = false;

    } catch (error) {
        selectAgencia.innerHTML = `
            <option value="">
                Error al cargar agencias
            </option>
        `;

        selectAgencia.disabled = true;

        mostrarMensaje(
            mensajeEntrega,
            error.message,
            "error"
        );
    }
}


/* =========================================================
   UBICACIÓN GPS DEL FLETERO
========================================================= */

function guardarUbicacion(
    latitud,
    longitud
) {
    ubicacionActual = {
        latitud: latitud.toFixed(8),
        longitud: longitud.toFixed(8),
    };

    inputLatitud.value =
        ubicacionActual.latitud;

    inputLongitud.value =
        ubicacionActual.longitud;

    estadoUbicacion.textContent = (
        "Ubicación obtenida correctamente."
    );

    botonObtenerUbicacion.textContent = (
        "Actualizar ubicación"
    );
}


function restaurarUbicacionEnFormulario() {
    if (!ubicacionActual) {
        return;
    }

    inputLatitud.value =
        ubicacionActual.latitud;

    inputLongitud.value =
        ubicacionActual.longitud;

    estadoUbicacion.textContent = (
        "Ubicación obtenida correctamente."
    );

    botonObtenerUbicacion.textContent = (
        "Actualizar ubicación"
    );
}


function eliminarUbicacion() {
    ubicacionActual = null;

    inputLatitud.value = "";
    inputLongitud.value = "";

    estadoUbicacion.textContent = (
        "La ubicación todavía "
        + "no ha sido obtenida."
    );

    botonObtenerUbicacion.textContent = (
        "Obtener ubicación"
    );
}


function ubicacionDisponible() {
    return Boolean(
        ubicacionActual
        && ubicacionActual.latitud
        && ubicacionActual.longitud
    );
}


function mensajeErrorUbicacion(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return (
                "Permiso de ubicación rechazado. "
                + "Debes permitir el acceso al GPS."
            );

        case error.POSITION_UNAVAILABLE:
            return (
                "La ubicación actual "
                + "no está disponible."
            );

        case error.TIMEOUT:
            return (
                "El dispositivo tardó demasiado "
                + "en obtener la ubicación."
            );

        default:
            return (
                "No fue posible obtener "
                + "la ubicación."
            );
    }
}


botonObtenerUbicacion.addEventListener(
    "click",
    () => {
        ocultarMensaje(
            mensajeEntrega
        );

        if (!navigator.geolocation) {
            estadoUbicacion.textContent = (
                "Este navegador no permite "
                + "obtener la ubicación."
            );

            return;
        }

        botonObtenerUbicacion.disabled = true;
        botonRegistrar.disabled = true;

        botonObtenerUbicacion.textContent = (
            "Obteniendo..."
        );

        estadoUbicacion.textContent = (
            "Obteniendo ubicación actual..."
        );

        navigator.geolocation.getCurrentPosition(
            (posicion) => {
                guardarUbicacion(
                    posicion.coords.latitude,
                    posicion.coords.longitude
                );

                botonObtenerUbicacion.disabled = false;
                botonRegistrar.disabled = false;
            },

            (error) => {
                if (ubicacionDisponible()) {
                    restaurarUbicacionEnFormulario();

                    mostrarMensaje(
                        mensajeEntrega,
                        "No se pudo actualizar la ubicación. "
                        + "Se conservará la ubicación anterior.",
                        "error"
                    );

                } else {
                    eliminarUbicacion();

                    estadoUbicacion.textContent =
                        mensajeErrorUbicacion(error);
                }

                botonObtenerUbicacion.disabled = false;
                botonRegistrar.disabled = false;
            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    }
);


/* =========================================================
   VALIDACIONES DE FOTOGRAFÍAS
========================================================= */

function fotografiaSeleccionada(inputFoto) {
    return Boolean(
        inputFoto.files
        && inputFoto.files.length > 0
    );
}


function validarFotografias() {
    if (!fotografiaSeleccionada(inputFotoEnvio)) {
        mostrarMensaje(
            mensajeEntrega,
            "Debes seleccionar la fotografía del envío.",
            "error"
        );

        inputFotoEnvio.focus();

        return false;
    }

    if (!fotografiaSeleccionada(inputFotoLugar)) {
        mostrarMensaje(
            mensajeEntrega,
            "Debes seleccionar la fotografía del lugar.",
            "error"
        );

        inputFotoLugar.focus();

        return false;
    }

    return true;
}


/* =========================================================
   REGISTRO DE ENTREGA DEL FLETERO
========================================================= */

formEntrega.addEventListener(
    "submit",
    async (evento) => {
        evento.preventDefault();

        ocultarMensaje(
            mensajeEntrega
        );

        const token = obtenerToken();

        if (!token) {
            cerrarSesion();

            mostrarMensaje(
                mensajeLogin,
                "La sesión ha finalizado. "
                + "Inicia sesión nuevamente.",
                "error"
            );

            return;
        }

        if (
            !usuarioActual
            || usuarioActual.rol !== ROL_FLETERO
        ) {
            mostrarMensaje(
                mensajeEntrega,
                "Solo los fleteros pueden "
                + "registrar entregas.",
                "error"
            );

            return;
        }

        if (!selectAgencia.value) {
            mostrarMensaje(
                mensajeEntrega,
                "Debes seleccionar una agencia.",
                "error"
            );

            selectAgencia.focus();

            return;
        }

        if (!validarFotografias()) {
            return;
        }

        if (!ubicacionDisponible()) {
            mostrarMensaje(
                mensajeEntrega,
                "Debes obtener la ubicación "
                + "antes de registrar la entrega.",
                "error"
            );

            estadoUbicacion.textContent = (
                "La ubicación es obligatoria "
                + "para registrar la entrega."
            );

            return;
        }

        restaurarUbicacionEnFormulario();

        const datosEntrega = new FormData(
            formEntrega
        );

        datosEntrega.set(
            "agencia_id",
            selectAgencia.value
        );

        datosEntrega.set(
            "latitud",
            ubicacionActual.latitud
        );

        datosEntrega.set(
            "longitud",
            ubicacionActual.longitud
        );

        botonRegistrar.disabled = true;
        botonObtenerUbicacion.disabled = true;
        selectAgencia.disabled = true;
        inputFotoEnvio.disabled = true;
        inputFotoLugar.disabled = true;

        botonRegistrar.textContent = (
            "Registrando..."
        );

        try {
            const respuesta = await fetch(
                `${API_URL}/entregas`,
                {
                    method: "POST",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: datosEntrega,
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.detail
                    || "No fue posible registrar "
                    + "la entrega."
                );
            }

            mostrarMensaje(
                mensajeEntrega,
                `Entrega ${datos.envio} registrada `
                + "correctamente.",
                "exito"
            );

            formEntrega.reset();

            eliminarUbicacion();

            selectAgencia.value = "";

        } catch (error) {
            restaurarUbicacionEnFormulario();

            mostrarMensaje(
                mensajeEntrega,
                error.message,
                "error"
            );

        } finally {
            botonRegistrar.textContent = (
                "Registrar entrega"
            );

            botonRegistrar.disabled = false;
            botonObtenerUbicacion.disabled = false;
            selectAgencia.disabled = false;
            inputFotoEnvio.disabled = false;
            inputFotoLugar.disabled = false;
        }
    }
);


/* =========================================================
   CATÁLOGOS DEL ADMINISTRADOR
========================================================= */

async function cargarAgenciasAdministrador() {
    filtroAgencia.disabled = true;

    filtroAgencia.innerHTML = `
        <option value="">
            Cargando agencias...
        </option>
    `;

    const agencias = await obtenerAgenciasActivas();

    filtroAgencia.innerHTML = `
        <option value="">
            Todas
        </option>
    `;

    agencias.forEach((agencia) => {
        const opcion = document.createElement(
            "option"
        );

        opcion.value = agencia.id;
        opcion.textContent = agencia.nombre;

        filtroAgencia.appendChild(
            opcion
        );
    });

    filtroAgencia.disabled = false;
}


async function cargarFleterosAdministrador() {
    filtroFletero.disabled = true;

    filtroFletero.innerHTML = `
        <option value="">
            Cargando fleteros...
        </option>
    `;

    const token = obtenerToken();

    const respuesta = await fetch(
        `${API_URL}/admin/usuarios/fleteros`,
        {
            method: "GET",
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.detail
            || "No fue posible cargar los fleteros."
        );
    }

    const fleteros = Array.isArray(datos)
        ? datos
        : [];

    filtroFletero.innerHTML = `
        <option value="">
            Todos
        </option>
    `;

    fleteros.forEach((fletero) => {
        const opcion = document.createElement(
            "option"
        );

        opcion.value = fletero.id;
        opcion.textContent = fletero.nombre;

        filtroFletero.appendChild(
            opcion
        );
    });

    filtroFletero.disabled = false;
}


/* =========================================================
   CONSULTA ADMINISTRATIVA
========================================================= */

function formatearFechaHora(fechaTexto) {
    const fecha = new Date(
        fechaTexto
    );

    if (Number.isNaN(fecha.getTime())) {
        return fechaTexto;
    }

    return new Intl.DateTimeFormat(
        "es-GT",
        {
            dateStyle: "short",
            timeStyle: "short",
        }
    ).format(fecha);
}


function formatearCoordenada(valor) {
    if (
        valor === null
        || valor === undefined
        || valor === ""
    ) {
        return "—";
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return String(valor);
    }

    return numero.toFixed(6);
}


function crearCelda(texto, clase = "") {
    const celda = document.createElement(
        "td"
    );

    celda.textContent = texto;

    if (clase) {
        celda.classList.add(
            clase
        );
    }

    return celda;
}


function crearEnlaceTabla(
    texto,
    url
) {
    const enlace = document.createElement(
        "a"
    );

    enlace.className = "enlace-tabla";
    enlace.textContent = texto;
    enlace.href = url;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";

    return enlace;
}


function crearCeldaFotografia(
    fotografiaUrl
) {
    const celda = document.createElement(
        "td"
    );

    if (fotografiaUrl) {
        celda.appendChild(
            crearEnlaceTabla(
                "Ver",
                fotografiaUrl
            )
        );

    } else {
        celda.textContent = "—";
    }

    return celda;
}


function mostrarTablaVacia(mensaje) {
    cuerpoTablaEntregas.innerHTML = `
        <tr>
            <td
                colspan="9"
                class="tabla-vacia"
            >
                ${mensaje}
            </td>
        </tr>
    `;
}


function renderizarEntregas(entregas) {
    cuerpoTablaEntregas.innerHTML = "";

    totalEntregas.textContent = String(
        entregas.length
    );

    botonExportar.disabled = (
        entregas.length === 0
    );

    if (entregas.length === 0) {
        mostrarTablaVacia(
            "No se encontraron entregas."
        );

        return;
    }

    entregas.forEach((entrega) => {
        const fila = document.createElement(
            "tr"
        );

        fila.appendChild(
            crearCelda(
                formatearFechaHora(
                    entrega.fecha_envio
                )
            )
        );

        fila.appendChild(
            crearCelda(
                String(entrega.envio)
            )
        );

        fila.appendChild(
            crearCelda(
                entrega.agencia?.nombre || "—"
            )
        );

        fila.appendChild(
            crearCelda(
                entrega.usuario?.nombre || "—"
            )
        );

        fila.appendChild(
            crearCelda(
                formatearCoordenada(
                    entrega.latitud
                ),
                "coordenada"
            )
        );

        fila.appendChild(
            crearCelda(
                formatearCoordenada(
                    entrega.longitud
                ),
                "coordenada"
            )
        );

        fila.appendChild(
            crearCeldaFotografia(
                entrega.foto_envio
            )
        );

        fila.appendChild(
            crearCeldaFotografia(
                entrega.foto_lugar
            )
        );

        const celdaMapa = document.createElement(
            "td"
        );

        if (
            entrega.latitud !== null
            && entrega.longitud !== null
        ) {
            const coordenadas = (
                `${entrega.latitud},`
                + `${entrega.longitud}`
            );

            const urlMapa = (
                "https://www.google.com/maps"
                + "/search/?api=1&query="
                + encodeURIComponent(
                    coordenadas
                )
            );

            celdaMapa.appendChild(
                crearEnlaceTabla(
                    "Abrir",
                    urlMapa
                )
            );

        } else {
            celdaMapa.textContent = "—";
        }

        fila.appendChild(
            celdaMapa
        );

        cuerpoTablaEntregas.appendChild(
            fila
        );
    });
}


function construirParametrosConsulta() {
    const parametros = new URLSearchParams();

    if (filtroFechaInicio.value) {
        parametros.set(
            "fecha_inicio",
            filtroFechaInicio.value
        );
    }

    if (filtroFechaFin.value) {
        parametros.set(
            "fecha_fin",
            filtroFechaFin.value
        );
    }

    if (filtroAgencia.value) {
        parametros.set(
            "agencia_id",
            filtroAgencia.value
        );
    }

    if (filtroFletero.value) {
        parametros.set(
            "usuario_id",
            filtroFletero.value
        );
    }

    return parametros;
}


/* =========================================================
   EXPORTACIÓN CSV
========================================================= */

function obtenerNombreArchivoCSV(
    encabezadoContentDisposition
) {
    if (!encabezadoContentDisposition) {
        return "arenal_entregas.csv";
    }

    const coincidencia = encabezadoContentDisposition.match(
        /filename="?([^"]+)"?/i
    );

    if (!coincidencia) {
        return "arenal_entregas.csv";
    }

    return coincidencia[1];
}


async function exportarCSV() {
    const token = obtenerToken();

    if (!token) {
        cerrarSesion();

        mostrarMensaje(
            mensajeLogin,
            "La sesión ha finalizado. "
            + "Inicia sesión nuevamente.",
            "error"
        );

        return;
    }

    ocultarMensaje(
        mensajeAdministrador
    );

    botonExportar.disabled = true;
    botonExportar.textContent = (
        "Exportando..."
    );

    try {
        const parametros = construirParametrosConsulta();

        const url = parametros.toString()
            ? (
                `${API_URL}/admin/exportar-entregas.csv`
                + `?${parametros.toString()}`
            )
            : `${API_URL}/admin/exportar-entregas.csv`;

        const respuesta = await fetch(
            url,
            {
                method: "GET",
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

        if (!respuesta.ok) {
            let mensaje = (
                "No fue posible exportar el CSV."
            );

            try {
                const datosError = await respuesta.json();

                mensaje = (
                    datosError.detail
                    || mensaje
                );

            } catch {
                // El servidor podría responder texto.
            }

            throw new Error(
                mensaje
            );
        }

        const archivo = await respuesta.blob();

        const nombreArchivo = obtenerNombreArchivoCSV(
            respuesta.headers.get(
                "Content-Disposition"
            )
        );

        const urlTemporal = URL.createObjectURL(
            archivo
        );

        const enlace = document.createElement(
            "a"
        );

        enlace.href = urlTemporal;
        enlace.download = nombreArchivo;

        document.body.appendChild(
            enlace
        );

        enlace.click();

        enlace.remove();

        URL.revokeObjectURL(
            urlTemporal
        );

        mostrarMensaje(
            mensajeAdministrador,
            "El archivo CSV fue generado correctamente.",
            "exito"
        );

    } catch (error) {
        mostrarMensaje(
            mensajeAdministrador,
            error.message,
            "error"
        );

    } finally {
        botonExportar.textContent = (
            "Exportar CSV"
        );

        botonExportar.disabled = (
            Number(totalEntregas.textContent) === 0
        );
    }
}


async function consultarEntregasAdministrador() {
    if (consultaAdministradorEnProceso) {
        return;
    }

    if (
        filtroFechaInicio.value
        && filtroFechaFin.value
        && filtroFechaFin.value
            < filtroFechaInicio.value
    ) {
        botonExportar.disabled = true;

        mostrarMensaje(
            mensajeAdministrador,
            "La fecha final no puede ser menor "
            + "que la fecha inicial.",
            "error"
        );

        return;
    }

    consultaAdministradorEnProceso = true;

    ocultarMensaje(
        mensajeAdministrador
    );

    mostrarTablaVacia(
        "Consultando entregas..."
    );

    totalEntregas.textContent = "0";
    botonExportar.disabled = true;

    try {
        const token = obtenerToken();

        const parametros = construirParametrosConsulta();

        const url = parametros.toString()
            ? `${API_URL}/entregas?${parametros.toString()}`
            : `${API_URL}/entregas`;

        const respuesta = await fetch(
            url,
            {
                method: "GET",
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                datos.detail
                || "No fue posible consultar "
                + "las entregas."
            );
        }

        const entregas = Array.isArray(datos)
            ? datos
            : [];

        renderizarEntregas(
            entregas
        );

    } catch (error) {
        totalEntregas.textContent = "0";
        botonExportar.disabled = true;

        mostrarTablaVacia(
            "No fue posible cargar las entregas."
        );

        mostrarMensaje(
            mensajeAdministrador,
            error.message,
            "error"
        );

    } finally {
        consultaAdministradorEnProceso = false;
    }
}


/* =========================================================
   FILTROS AUTOMÁTICOS
========================================================= */

[
    filtroFechaInicio,
    filtroFechaFin,
    filtroAgencia,
    filtroFletero,
].forEach((control) => {
    control.addEventListener(
        "change",
        consultarEntregasAdministrador
    );
});


formFiltros.addEventListener(
    "submit",
    (evento) => {
        evento.preventDefault();
    }
);


botonExportar.addEventListener(
    "click",
    exportarCSV
);

/* =========================================================
   LISTADO ADMINISTRATIVO DE AGENCIAS
========================================================= */

function mostrarTablaAgenciasVacia(mensaje) {
    cuerpoTablaAgencias.innerHTML = `
        <tr>
            <td
                colspan="4"
                class="tabla-vacia"
            >
                ${mensaje}
            </td>
        </tr>
    `;
}


function crearCeldaAgencia(texto) {
    const celda = document.createElement(
        "td"
    );

    celda.textContent = texto;

    return celda;
}


function crearIndicadorEstadoAgencia(activa) {
    const indicador = document.createElement(
        "span"
    );

    indicador.textContent = activa
        ? "Activa"
        : "Inactiva";

    indicador.className = activa
        ? "estado-activo"
        : "estado-inactivo";

    return indicador;
}


function crearBotonAccionAgencia(
    texto,
    accion
) {
    const boton = document.createElement(
        "button"
    );

    boton.type = "button";
    boton.textContent = texto;
    boton.className = "boton boton-secundario";

    boton.addEventListener(
        "click",
        accion
    );

    return boton;
}

function renderizarAgenciasAdministrador(agencias) {
    cuerpoTablaAgencias.innerHTML = "";

    if (agencias.length === 0) {
        mostrarTablaAgenciasVacia(
            "No hay agencias registradas."
        );

        return;
    }

    agencias.forEach((agencia) => {
        const fila = document.createElement(
            "tr"
        );

        fila.appendChild(
            crearCeldaAgencia(
                String(agencia.id)
            )
        );

        fila.appendChild(
            crearCeldaAgencia(
                agencia.nombre
            )
        );

        const celdaEstado = document.createElement(
            "td"
        );

        celdaEstado.appendChild(
            crearIndicadorEstadoAgencia(
                agencia.activa
            )
        );

        fila.appendChild(
            celdaEstado
        );

        const celdaAcciones = document.createElement(
            "td"
        );

        const contenedorAcciones = document.createElement(
            "div"
        );

        contenedorAcciones.className = "acciones-tabla";

        const botonEditar = crearBotonAccionAgencia(
            "Editar",
            () => {
                abrirModalAgencia(
                    "editar",
                    agencia
                );
            }
        );

        const botonEstado = crearBotonAccionAgencia(
            agencia.activa
                ? "Desactivar"
                : "Activar",
            (evento) => {
                cambiarEstadoAgencia(
                    agencia,
                    evento.currentTarget
                );
            }
        );

        contenedorAcciones.appendChild(
            botonEditar
        );

        contenedorAcciones.appendChild(
            botonEstado
        );

        celdaAcciones.appendChild(
            contenedorAcciones
        );

        fila.appendChild(
            celdaAcciones
        );

        cuerpoTablaAgencias.appendChild(
            fila
        );
    });
}


async function cargarAgenciasGestionAdministrador() {
    const token = obtenerToken();

    if (!token) {
        return;
    }

    ocultarMensaje(
        mensajeAgenciasAdmin
    );

    mostrarTablaAgenciasVacia(
        "Cargando agencias..."
    );

    try {
        const respuesta = await fetch(
            `${API_URL}/admin/agencias`,
            {
                method: "GET",
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                datos.detail
                || "No fue posible cargar las agencias."
            );
        }

        const agencias = Array.isArray(datos)
            ? datos
            : [];

        renderizarAgenciasAdministrador(
            agencias
        );

    } catch (error) {
        mostrarTablaAgenciasVacia(
            "No fue posible cargar las agencias."
        );

        mostrarMensaje(
            mensajeAgenciasAdmin,
            error.message,
            "error"
        );
    }
}

async function cambiarEstadoAgencia(
    agencia,
    boton
) {
    const token = obtenerToken();

    if (!token) {
        cerrarSesion();

        mostrarMensaje(
            mensajeLogin,
            "La sesión ha finalizado. "
            + "Inicia sesión nuevamente.",
            "error"
        );

        return;
    }

    const nuevoEstado = !agencia.activa;

    const accion = nuevoEstado
        ? "activar"
        : "desactivar";

    const confirmacion = window.confirm(
        `¿Deseas ${accion} la agencia "${agencia.nombre}"?`
    );

    if (!confirmacion) {
        return;
    }

    ocultarMensaje(
        mensajeAgenciasAdmin
    );

    boton.disabled = true;

    boton.textContent = nuevoEstado
        ? "Activando..."
        : "Desactivando...";

    try {
        const respuesta = await fetch(
            `${API_URL}/admin/agencias/${agencia.id}/estado`,
            {
                method: "PATCH",
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    activa: nuevoEstado,
                }),
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                obtenerMensajeErrorAgencia(
                    datos
                )
            );
        }

        await Promise.all([
            cargarAgenciasGestionAdministrador(),
            cargarAgenciasAdministrador(),
        ]);

        await consultarEntregasAdministrador();

        const mensajeEstado = datos.activa
            ? `Agencia "${datos.nombre}" activada correctamente.`
            : `Agencia "${datos.nombre}" desactivada correctamente.`;

        mostrarMensaje(
            mensajeAgenciasAdmin,
            mensajeEstado,
            "exito"
        );

    } catch (error) {
        mostrarMensaje(
            mensajeAgenciasAdmin,
            error.message,
            "error"
        );

        boton.disabled = false;

        boton.textContent = agencia.activa
            ? "Desactivar"
            : "Activar";
    }
}

async function cambiarEstadoAgencia(
    agencia,
    boton
) {
    const token = obtenerToken();

    if (!token) {
        cerrarSesion();

        mostrarMensaje(
            mensajeLogin,
            "La sesión ha finalizado. "
            + "Inicia sesión nuevamente.",
            "error"
        );

        return;
    }

    const nuevoEstado = !agencia.activa;

    const accion = nuevoEstado
        ? "activar"
        : "desactivar";

    const confirmacion = window.confirm(
        `¿Deseas ${accion} la agencia "${agencia.nombre}"?`
    );

    if (!confirmacion) {
        return;
    }

    ocultarMensaje(
        mensajeAgenciasAdmin
    );

    boton.disabled = true;

    boton.textContent = nuevoEstado
        ? "Activando..."
        : "Desactivando...";

    try {
        const respuesta = await fetch(
            `${API_URL}/admin/agencias/${agencia.id}/estado`,
            {
                method: "PATCH",
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    activa: nuevoEstado,
                }),
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                obtenerMensajeErrorAgencia(
                    datos
                )
            );
        }

        await Promise.all([
            cargarAgenciasGestionAdministrador(),
            cargarAgenciasAdministrador(),
        ]);

        await consultarEntregasAdministrador();

        const mensajeEstado = datos.activa
            ? `Agencia "${datos.nombre}" activada correctamente.`
            : `Agencia "${datos.nombre}" desactivada correctamente.`;

        mostrarMensaje(
            mensajeAgenciasAdmin,
            mensajeEstado,
            "exito"
        );

    } catch (error) {
        mostrarMensaje(
            mensajeAgenciasAdmin,
            error.message,
            "error"
        );

        boton.disabled = false;

        boton.textContent = agencia.activa
            ? "Desactivar"
            : "Activar";
    }
}

/* =========================================================
   MODAL DE AGENCIAS
========================================================= */

function obtenerMensajeErrorAgencia(datos) {
    if (
        datos
        && typeof datos.detail === "string"
    ) {
        return datos.detail;
    }

    if (
        datos
        && Array.isArray(datos.detail)
        && datos.detail.length > 0
    ) {
        return (
            datos.detail[0].msg
            || "Los datos de la agencia no son válidos."
        );
    }

    return "No fue posible guardar la agencia.";
}

function limpiarModalAgencia() {
    inputNombreAgencia.value = "";

    ocultarMensaje(
        mensajeModalAgencia
    );
}


function abrirModalAgencia(
    modo = "crear",
    agencia = null
) {
    if (
        !usuarioActual
        || usuarioActual.rol !== ROL_ADMIN
    ) {
        return;
    }

    limpiarModalAgencia();

    modoFormularioAgencia = modo;

    if (
        modo === "editar"
        && agencia
    ) {
        agenciaEditandoId = agencia.id;

        tituloModalAgencia.textContent = (
            "Editar agencia"
        );

        inputNombreAgencia.value = (
            agencia.nombre
        );

    } else {
        agenciaEditandoId = null;

        tituloModalAgencia.textContent = (
            "Nueva agencia"
        );
    }

    modalAgencia.classList.remove(
        "oculto"
    );

    setTimeout(
        () => {
            inputNombreAgencia.focus();
            inputNombreAgencia.select();
        },
        50
    );
}


function cerrarModalAgencia() {
    modalAgencia.classList.add(
        "oculto"
    );

    limpiarModalAgencia();
}

async function guardarAgencia() {
    ocultarMensaje(
        mensajeModalAgencia
    );

    const nombre = inputNombreAgencia.value
        .trim()
        .replace(/\s+/g, " ");

    if (nombre.length < 2) {
        mostrarMensaje(
            mensajeModalAgencia,
            "El nombre de la agencia debe tener "
            + "al menos 2 caracteres.",
            "error"
        );

        inputNombreAgencia.focus();

        return;
    }

    if (nombre.length > 50) {
        mostrarMensaje(
            mensajeModalAgencia,
            "El nombre de la agencia no puede superar "
            + "los 50 caracteres.",
            "error"
        );

        inputNombreAgencia.focus();

        return;
    }

    const token = obtenerToken();

    if (!token) {
        cerrarSesion();

        mostrarMensaje(
            mensajeLogin,
            "La sesión ha finalizado. "
            + "Inicia sesión nuevamente.",
            "error"
        );

        return;
    }

    botonGuardarAgencia.disabled = true;
    botonCancelarModalAgencia.disabled = true;
    botonCerrarModalAgencia.disabled = true;

    botonGuardarAgencia.textContent = (
        "Guardando..."
    );

    try {
        const esEdicion = (
    modoFormularioAgencia === "editar"
    && agenciaEditandoId !== null
);

    const urlAgencia = esEdicion
        ? `${API_URL}/admin/agencias/${agenciaEditandoId}`
        : `${API_URL}/admin/agencias`;

    const metodoAgencia = esEdicion
        ? "PUT"
        : "POST";

    const respuesta = await fetch(
        urlAgencia,
        {
            method: metodoAgencia,
            headers: {
                Authorization:
                    `Bearer ${token}`,
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify({
                nombre,
            }),
        }
);

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                obtenerMensajeErrorAgencia(datos)
            );
        }

        cerrarModalAgencia();

        await cargarAgenciasGestionAdministrador();

        const mensajeExito = esEdicion
            ? `Agencia "${datos.nombre}" actualizada correctamente.`
            : `Agencia "${datos.nombre}" creada correctamente.`;

    mostrarMensaje(
        mensajeAgenciasAdmin,
        mensajeExito,
        "exito"
    );

    } catch (error) {
        mostrarMensaje(
            mensajeModalAgencia,
            error.message,
            "error"
        );

        inputNombreAgencia.focus();

    } finally {
        botonGuardarAgencia.disabled = false;
        botonCancelarModalAgencia.disabled = false;
        botonCerrarModalAgencia.disabled = false;

        botonGuardarAgencia.textContent = (
            "Guardar"
        );
    }
}

botonNuevaAgencia.addEventListener(
    "click",
    () => {
        abrirModalAgencia(
            "crear"
        );
    }
);


botonCerrarModalAgencia.addEventListener(
    "click",
    cerrarModalAgencia
);


botonCancelarModalAgencia.addEventListener(
    "click",
    cerrarModalAgencia
);

botonGuardarAgencia.addEventListener(
    "click",
    guardarAgencia
);

inputNombreAgencia.addEventListener(
    "keydown",
    (evento) => {
        if (evento.key === "Enter") {
            evento.preventDefault();

            guardarAgencia();
        }
    }
);

modalAgencia.addEventListener(
    "click",
    (evento) => {
        if (evento.target === modalAgencia) {
            cerrarModalAgencia();
        }
    }
);


document.addEventListener(
    "keydown",
    (evento) => {
        if (
            evento.key === "Escape"
            && !modalAgencia.classList.contains(
                "oculto"
            )
        ) {
            cerrarModalAgencia();
        }
    }
);

botonNuevoUsuario.addEventListener(
    "click",
    () => {
        abrirModalUsuario(
            "crear"
        );
    }
);


botonCerrarModalUsuario.addEventListener(
    "click",
    cerrarModalUsuario
);


botonCancelarModalUsuario.addEventListener(
    "click",
    cerrarModalUsuario
);

botonGuardarUsuario.addEventListener(
    "click",
    crearNuevoUsuario
);

inputPasswordUsuarioAdmin.addEventListener(
    "keydown",
    (evento) => {
        if (evento.key === "Enter") {
            evento.preventDefault();

            crearNuevoUsuario();
        }
    }
);

modalUsuario.addEventListener(
    "click",
    (evento) => {
        if (evento.target === modalUsuario) {
            cerrarModalUsuario();
        }
    }
);


document.addEventListener(
    "keydown",
    (evento) => {
        if (
            evento.key === "Escape"
            && !modalUsuario.classList.contains(
                "oculto"
            )
        ) {
            cerrarModalUsuario();
        }
    }
);

/* =========================================================
   MODAL DE USUARIOS
========================================================= */

function obtenerMensajeErrorUsuario(datos) {
    if (
        datos
        && typeof datos.detail === "string"
    ) {
        return datos.detail;
    }

    if (
        datos
        && Array.isArray(datos.detail)
        && datos.detail.length > 0
    ) {
        return (
            datos.detail[0].msg
            || "Los datos del usuario no son validos."
        );
    }

    return "No fue posible guardar el usuario.";
}

function limpiarModalUsuario() {
    inputNombreUsuarioAdmin.value = "";
    inputUsuarioAdmin.value = "";
    inputPasswordUsuarioAdmin.value = "";
    selectRolUsuarioAdmin.value = ROL_FLETERO;

    ocultarMensaje(
        mensajeModalUsuario
    );
}


function abrirModalUsuario(
    modo = "crear",
    usuario = null
) {
    if (
        !usuarioActual
        || usuarioActual.rol !== ROL_ADMIN
    ) {
        return;
    }

    limpiarModalUsuario();

    modoFormularioUsuario = modo;

    if (
        modo === "editar"
        && usuario
    ) {
        usuarioEditandoId = usuario.id;

        tituloModalUsuario.textContent = (
            "Editar usuario"
        );

        inputNombreUsuarioAdmin.value = (
            usuario.nombre
        );

        inputUsuarioAdmin.value = (
            usuario.usuario
        );

        selectRolUsuarioAdmin.value = (
            usuario.rol
        );

        grupoPasswordUsuario.classList.add(
            "oculto"
        );

        inputPasswordUsuarioAdmin.disabled = true;

    } else {
        usuarioEditandoId = null;

        tituloModalUsuario.textContent = (
            "Nuevo usuario"
        );

        grupoPasswordUsuario.classList.remove(
            "oculto"
        );

        inputPasswordUsuarioAdmin.disabled = false;

        selectRolUsuarioAdmin.value = (
            ROL_FLETERO
        );
    }

    modalUsuario.classList.remove(
        "oculto"
    );

    setTimeout(
        () => {
            inputNombreUsuarioAdmin.focus();
            inputNombreUsuarioAdmin.select();
        },
        50
    );
}


function cerrarModalUsuario() {
    modalUsuario.classList.add(
        "oculto"
    );

    limpiarModalUsuario();
}

async function crearNuevoUsuario() {
    ocultarMensaje(
        mensajeModalUsuario
    );

    const nombre = inputNombreUsuarioAdmin.value
        .trim()
        .replace(/\s+/g, " ");

    const nombreUsuario = inputUsuarioAdmin.value
        .trim()
        .toLowerCase();

    const password = inputPasswordUsuarioAdmin.value;

    const rol = selectRolUsuarioAdmin.value;

    if (nombre.length < 2) {
        mostrarMensaje(
            mensajeModalUsuario,
            "El nombre debe tener al menos 2 caracteres.",
            "error"
        );

        inputNombreUsuarioAdmin.focus();

        return;
    }

    if (nombre.length > 100) {
        mostrarMensaje(
            mensajeModalUsuario,
            "El nombre no puede superar los 100 caracteres.",
            "error"
        );

        inputNombreUsuarioAdmin.focus();

        return;
    }

    if (nombreUsuario.length < 3) {
        mostrarMensaje(
            mensajeModalUsuario,
            "El usuario debe tener al menos 3 caracteres.",
            "error"
        );

        inputUsuarioAdmin.focus();

        return;
    }

    if (nombreUsuario.length > 50) {
        mostrarMensaje(
            mensajeModalUsuario,
            "El usuario no puede superar los 50 caracteres.",
            "error"
        );

        inputUsuarioAdmin.focus();

        return;
    }

    const esEdicion = (
    modoFormularioUsuario === "editar"
    && usuarioEditandoId !== null
    );

    if (
       !esEdicion
        && password.length < 8
    ) {
        mostrarMensaje(
        mensajeModalUsuario,
        "La contraseña debe tener al menos 8 caracteres.",
        "error"
        );

        inputPasswordUsuarioAdmin.focus();

        return;
    }

    if (
        rol !== ROL_ADMIN
        && rol !== ROL_FLETERO
    ) {
        mostrarMensaje(
            mensajeModalUsuario,
            "Selecciona un rol valido.",
            "error"
        );

        selectRolUsuarioAdmin.focus();

        return;
    }

    const token = obtenerToken();

    if (!token) {
        cerrarSesion();

        mostrarMensaje(
            mensajeLogin,
            "La sesion ha finalizado. "
            + "Inicia sesion nuevamente.",
            "error"
        );

        return;
    }

    botonGuardarUsuario.disabled = true;
    botonCancelarModalUsuario.disabled = true;
    botonCerrarModalUsuario.disabled = true;

    botonGuardarUsuario.textContent = "Guardando...";

    try {
        const url = esEdicion
            ? `${API_URL}/admin/usuarios/${usuarioEditandoId}`
           : `${API_URL}/admin/usuarios`;

        const metodo = esEdicion
            ? "PUT"
            : "POST";

        const respuesta = await fetch(
            url,
            {
                method: metodo,
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify(
                    esEdicion
                        ? {
                            nombre,
                            usuario: nombreUsuario,
                            rol,
                        }
                        : {
                            nombre,
                            usuario: nombreUsuario,
                            password,
                            rol,
                        }
                ),
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                obtenerMensajeErrorUsuario(
                    datos
                )
            );
        }

        cerrarModalUsuario();

        modoFormularioUsuario = "crear";
        usuarioEditandoId = null;

        await Promise.all([
            cargarUsuariosGestionAdministrador(),
            cargarFleterosAdministrador(),
        ]);

        mostrarMensaje(
            mensajeUsuariosAdmin,
            `Usuario "${datos.nombre}" creado correctamente.`,
            "exito"
        );

    } catch (error) {

        mostrarMensaje(
            mensajeModalUsuario,
            error.message,
            "error"
        );

    } finally {

        botonGuardarUsuario.disabled = false;
        botonCancelarModalUsuario.disabled = false;
        botonCerrarModalUsuario.disabled = false;

        botonGuardarUsuario.textContent = "Guardar";
    }
}

async function cambiarEstadoUsuario(
    usuario,
    boton
) {
    const token = obtenerToken();

    if (!token) {
        limpiarSesion();
        mostrarFormularioLogin();

        mostrarMensaje(
            mensajeLogin,
            "La sesion ha finalizado. "
            + "Inicia sesion nuevamente.",
            "error"
        );

        return;
    }

    const nuevoEstado = !usuario.activo;

    const accion = nuevoEstado
        ? "activar"
        : "desactivar";

    const confirmacion = window.confirm(
        `¿Deseas ${accion} al usuario "${usuario.nombre}"?`
    );

    if (!confirmacion) {
        return;
    }

    ocultarMensaje(
        mensajeUsuariosAdmin
    );

    boton.disabled = true;

    boton.textContent = nuevoEstado
        ? "Activando..."
        : "Desactivando...";

    try {
        const respuesta = await fetch(
            `${API_URL}/admin/usuarios/${usuario.id}/estado`,
            {
                method: "PATCH",
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    activo: nuevoEstado,
                }),
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                obtenerMensajeErrorUsuario(
                    datos
                )
            );
        }

        await Promise.all([
            cargarUsuariosGestionAdministrador(),
            cargarFleterosAdministrador(),
        ]);

        const mensajeEstado = datos.activo
            ? `Usuario "${datos.nombre}" activado correctamente.`
            : `Usuario "${datos.nombre}" desactivado correctamente.`;

        mostrarMensaje(
            mensajeUsuariosAdmin,
            mensajeEstado,
            "exito"
        );

    } catch (error) {
        mostrarMensaje(
            mensajeUsuariosAdmin,
            error.message,
            "error"
        );

        boton.disabled = false;

        boton.textContent = usuario.activo
            ? "Desactivar"
            : "Activar";
    }
}

function limpiarModalPasswordUsuario() {
    usuarioPasswordId = null;

    inputNuevaPasswordUsuario.value = "";
    inputConfirmarPasswordUsuario.value = "";

    textoUsuarioPasswordSeleccionado.textContent = "";

    ocultarMensaje(
        mensajeModalPasswordUsuario
    );
}


function abrirModalPasswordUsuario(usuario) {
    if (
        !usuarioActual
        || usuarioActual.rol !== ROL_ADMIN
    ) {
        return;
    }

    limpiarModalPasswordUsuario();

    usuarioPasswordId = usuario.id;

    tituloModalPasswordUsuario.textContent = (
        "Restablecer contraseña"
    );

    textoUsuarioPasswordSeleccionado.textContent = (
        `Usuario: ${usuario.nombre} (${usuario.usuario})`
    );

    modalPasswordUsuario.classList.remove(
        "oculto"
    );

    setTimeout(
        () => {
            inputNuevaPasswordUsuario.focus();
        },
        50
    );
}


function cerrarModalPasswordUsuario() {
    modalPasswordUsuario.classList.add(
        "oculto"
    );

    limpiarModalPasswordUsuario();
}

async function guardarPasswordUsuario() {
    ocultarMensaje(
        mensajeModalPasswordUsuario
    );

    const password =
        inputNuevaPasswordUsuario.value.trim();

    const confirmarPassword =
        inputConfirmarPasswordUsuario.value.trim();

    if (password.length < 8) {
        mostrarMensaje(
            mensajeModalPasswordUsuario,
            "La contraseña debe tener al menos 8 caracteres.",
            "error"
        );
        return;
    }

    if (password !== confirmarPassword) {
        mostrarMensaje(
            mensajeModalPasswordUsuario,
            "Las contraseñas no coinciden.",
            "error"
        );
        return;
    }

    const token = obtenerToken();

    if (!token) {
        mostrarMensaje(
            mensajeModalPasswordUsuario,
            "La sesión ha expirado.",
            "error"
        );
        return;
    }

    botonGuardarPasswordUsuario.disabled = true;
    botonCancelarModalPasswordUsuario.disabled = true;
    botonCerrarModalPasswordUsuario.disabled = true;

    botonGuardarPasswordUsuario.textContent =
        "Guardando...";

    try {
        const respuesta = await fetch(
            `${API_URL}/admin/usuarios/${usuarioPasswordId}/password`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password: password,
                    confirmar_password: confirmarPassword
                })
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                datos.detail || "No fue posible actualizar la contraseña."
            );
        }

        cerrarModalPasswordUsuario();

        mostrarMensaje(
            mensajeUsuariosAdmin,
            "Contraseña restablecida correctamente.",
            "exito"
        );

    } catch (error) {

        mostrarMensaje(
            mensajeModalPasswordUsuario,
            error.message,
            "error"
        );

    } finally {

        botonGuardarPasswordUsuario.disabled = false;
        botonCancelarModalPasswordUsuario.disabled = false;
        botonCerrarModalPasswordUsuario.disabled = false;

        botonGuardarPasswordUsuario.textContent =
            "Guardar";
    }
}

botonCerrarModalPasswordUsuario.addEventListener(
    "click",
    cerrarModalPasswordUsuario
);


botonCancelarModalPasswordUsuario.addEventListener(
    "click",
    cerrarModalPasswordUsuario
);

botonGuardarPasswordUsuario.addEventListener(
    "click",
    guardarPasswordUsuario
);

inputConfirmarPasswordUsuario.addEventListener(
    "keydown",
    (evento) => {
        if (evento.key === "Enter") {
            evento.preventDefault();
            guardarPasswordUsuario();
        }
    }
);

modalPasswordUsuario.addEventListener(
    "click",
    (evento) => {
        if (
            evento.target
            === modalPasswordUsuario
        ) {
            cerrarModalPasswordUsuario();
        }
    }
);


document.addEventListener(
    "keydown",
    (evento) => {
        if (
            evento.key === "Escape"
            && !modalPasswordUsuario.classList.contains(
                "oculto"
            )
        ) {
            cerrarModalPasswordUsuario();
        }
    }
);

/* =========================================================
   LISTADO ADMINISTRATIVO DE USUARIOS
========================================================= */

function mostrarTablaUsuariosVacia(mensaje) {
    cuerpoTablaUsuarios.innerHTML = `
        <tr>
            <td
                colspan="6"
                class="tabla-vacia"
            >
                ${mensaje}
            </td>
        </tr>
    `;
}


function crearCeldaUsuario(texto) {
    const celda = document.createElement(
        "td"
    );

    celda.textContent = texto;

    return celda;
}


function crearIndicadorEstadoUsuario(activo) {
    const indicador = document.createElement(
        "span"
    );

    indicador.textContent = activo
        ? "Activo"
        : "Inactivo";

    indicador.className = activo
        ? "estado-activo"
        : "estado-inactivo";

    return indicador;
}


function crearIndicadorRolUsuario(rol) {
    const indicador = document.createElement(
        "span"
    );

    indicador.textContent = rol;

    indicador.className = (
        rol === ROL_ADMIN
            ? "estado-activo"
            : "estado-inactivo"
    );

    return indicador;
}


function crearBotonAccionUsuario(
    texto,
    accion = null
) {
    const boton = document.createElement(
        "button"
    );

    boton.type = "button";
    boton.textContent = texto;
    boton.className = "boton boton-secundario";

    if (typeof accion === "function") {
        boton.addEventListener(
            "click",
            accion
        );
    } else {
        boton.disabled = true;
    }

    return boton;
}


function renderizarUsuariosAdministrador(usuarios) {
    cuerpoTablaUsuarios.innerHTML = "";

    if (usuarios.length === 0) {
        mostrarTablaUsuariosVacia(
            "No hay usuarios registrados."
        );

        return;
    }

    usuarios.forEach((usuario) => {
        const fila = document.createElement(
            "tr"
        );

        fila.appendChild(
            crearCeldaUsuario(
                String(usuario.id)
            )
        );

        fila.appendChild(
            crearCeldaUsuario(
                usuario.nombre
            )
        );

        fila.appendChild(
            crearCeldaUsuario(
                usuario.usuario
            )
        );

        const celdaRol = document.createElement(
            "td"
        );

        celdaRol.appendChild(
            crearIndicadorRolUsuario(
                usuario.rol
            )
        );

        fila.appendChild(
            celdaRol
        );

        const celdaEstado = document.createElement(
            "td"
        );

        celdaEstado.appendChild(
            crearIndicadorEstadoUsuario(
                usuario.activo
            )
        );

        fila.appendChild(
            celdaEstado
        );

        const celdaAcciones = document.createElement(
            "td"
        );

        const contenedorAcciones = document.createElement(
            "div"
        );

        contenedorAcciones.className = "acciones-tabla";

       const botonEditar = crearBotonAccionUsuario(
            "Editar",
            () => {
                abrirModalUsuario(
                    "editar",
                    usuario
                );
            }
        );

        const botonPassword = crearBotonAccionUsuario(
            "Contraseña",
            () => {
                abrirModalPasswordUsuario(
                    usuario
                );
            }
        );    

        const botonEstado = crearBotonAccionUsuario(
            usuario.activo
                ? "Desactivar"
                : "Activar",
            (evento) => {
                cambiarEstadoUsuario(
                    usuario,
                    evento.currentTarget
                );
            }
        );

        contenedorAcciones.appendChild(
            botonEditar
        );

        contenedorAcciones.appendChild(
            botonPassword
        );

        contenedorAcciones.appendChild(
            botonEstado
        );

        celdaAcciones.appendChild(
            contenedorAcciones
        );

        fila.appendChild(
            celdaAcciones
        );

        cuerpoTablaUsuarios.appendChild(
            fila
        );
    });
}


async function cargarUsuariosGestionAdministrador() {
    const token = obtenerToken();

    if (!token) {
        return;
    }

    ocultarMensaje(
        mensajeUsuariosAdmin
    );

    mostrarTablaUsuariosVacia(
        "Cargando usuarios..."
    );

    try {
        const respuesta = await fetch(
            `${API_URL}/admin/usuarios`,
            {
                method: "GET",
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                datos.detail
                || "No fue posible cargar los usuarios."
            );
        }

        const usuarios = Array.isArray(datos)
            ? datos
            : [];

        renderizarUsuariosAdministrador(
            usuarios
        );

    } catch (error) {
        mostrarTablaUsuariosVacia(
            "No fue posible cargar los usuarios."
        );

        mostrarMensaje(
            mensajeUsuariosAdmin,
            error.message,
            "error"
        );
    }
}

/* =========================================================
   SUBVISTAS DEL ADMINISTRADOR
========================================================= */

function mostrarSubvistaAdministrador(
    nombreModulo
) {

    subvistasAdministrador.forEach(
        (subvista) => {

            if (
                subvista.dataset.subvistaAdmin
                === nombreModulo
            ) {
                subvista.classList.remove(
                    "oculto"
                );
            } else {
                subvista.classList.add(
                    "oculto"
                );
            }

        }
    );

    botonesModuloAdministrador.forEach(
        (boton) => {

            if (
                boton.dataset.moduloAdmin
                === nombreModulo
            ) {
                boton.classList.add(
                    "activo"
                );
            } else {
                boton.classList.remove(
                    "activo"
                );
            }

        }
    );

}

botonesModuloAdministrador.forEach(
    (boton) => {

        boton.addEventListener(
            "click",
            () => {

                mostrarSubvistaAdministrador(
                    boton.dataset.moduloAdmin
                );

            }
        );

    }
);

/* =========================================================
   INICIALIZACIÓN DEL PANEL ADMINISTRATIVO
========================================================= */

async function inicializarPanelAdministrador() {
    mostrarSubvistaAdministrador(
    "entregas"
    );
    
    ocultarMensaje(
        mensajeAdministrador
    );

    mostrarTablaVacia(
        "Preparando panel administrativo..."
    );

    try {
        await Promise.all([
            cargarAgenciasAdministrador(),
            cargarFleterosAdministrador(),
            cargarAgenciasGestionAdministrador(),
            cargarUsuariosGestionAdministrador(),
        ]);

        await consultarEntregasAdministrador();

    } catch (error) {
        botonExportar.disabled = true;

        mostrarTablaVacia(
            "No fue posible preparar el panel."
        );

        mostrarMensaje(
            mensajeAdministrador,
            error.message,
            "error"
        );
    }
}


/* =========================================================
   RESTAURAR SESIÓN
========================================================= */

async function restaurarSesion() {
    const token = obtenerToken();

    if (!token) {
        mostrarFormularioLogin();

        return;
    }

    try {
        let usuario = obtenerUsuarioGuardado();

        if (!usuario) {
            usuario = await consultarUsuarioActual();
        }

        await prepararInterfazPorRol(
            usuario
        );

    } catch {
        limpiarSesion();

        mostrarFormularioLogin();

        mostrarMensaje(
            mensajeLogin,
            "La sesión ha finalizado. "
            + "Inicia sesión nuevamente.",
            "error"
        );
    }
}


restaurarSesion();