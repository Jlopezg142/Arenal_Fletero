"use strict";

const API_URL = "";

const ROL_ADMIN = "ADMIN";
const ROL_FLETERO = "FLETERO";

let ubicacionActual = null;
let usuarioActual = null;
let consultaAdministradorEnProceso = false;


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
                colspan="8"
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
   CATÁLOGO DE AGENCIAS PARA FLETERO
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
                if (
                    respuesta.status === 401
                    || respuesta.status === 403
                ) {
                    throw new Error(
                        datos.detail
                        || "No tiene permisos "
                        + "para registrar la entrega."
                    );
                }

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
   CONSULTA DE ENTREGAS DEL ADMINISTRADOR
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


function mostrarTablaVacia(mensaje) {
    cuerpoTablaEntregas.innerHTML = `
        <tr>
            <td
                colspan="8"
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

    botonExportar.disabled = true;

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

        const celdaFoto = document.createElement(
            "td"
        );

        if (entrega.foto_envio) {
            celdaFoto.appendChild(
                crearEnlaceTabla(
                    "Ver",
                    entrega.foto_envio
                )
            );
        } else {
            celdaFoto.textContent = "—";
        }

        fila.appendChild(
            celdaFoto
        );

        const celdaMapa = document.createElement(
            "td"
        );

        if (
            entrega.latitud !== null
            && entrega.longitud !== null
        ) {
            const urlMapa = (
                "https://www.google.com/maps"
                + `/search/?api=1&query=${
                    encodeURIComponent(
                        `${entrega.latitud},${entrega.longitud}`
                    )
                }`
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


/* =========================================================
   INICIALIZACIÓN DEL PANEL ADMINISTRATIVO
========================================================= */

async function inicializarPanelAdministrador() {
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
        ]);

        await consultarEntregasAdministrador();

    } catch (error) {
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
   RESTAURAR SESIÓN AL RECARGAR
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