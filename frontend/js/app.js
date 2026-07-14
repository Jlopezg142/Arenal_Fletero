"use strict";

const API_URL = "";

let ubicacionActual = null;

const seccionLogin = document.getElementById(
    "seccion-login"
);

const seccionEntrega = document.getElementById(
    "seccion-entrega"
);

const formLogin = document.getElementById(
    "form-login"
);

const formEntrega = document.getElementById(
    "form-entrega"
);

const mensajeLogin = document.getElementById(
    "mensaje-login"
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


function eliminarToken() {
    sessionStorage.removeItem(
        "arenal_token"
    );
}


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


function mostrarFormularioEntrega() {
    seccionLogin.classList.add(
        "oculto"
    );

    seccionEntrega.classList.remove(
        "oculto"
    );
}


function mostrarFormularioLogin() {
    seccionEntrega.classList.add(
        "oculto"
    );

    seccionLogin.classList.remove(
        "oculto"
    );
}


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

    if (!datos.access_token) {
        throw new Error(
            "El servidor no devolvió "
            + "el token de acceso."
        );
    }

    return datos.access_token;
}


formLogin.addEventListener(
    "submit",
    async (evento) => {
        evento.preventDefault();

        ocultarMensaje(
            mensajeLogin
        );

        const usuario = document.getElementById(
            "usuario"
        ).value.trim();

        const password = document.getElementById(
            "password"
        ).value;

        try {
            const token = await iniciarSesion(
                usuario,
                password
            );

            guardarToken(token);

            formLogin.reset();

            mostrarFormularioEntrega();

        } catch (error) {
            mostrarMensaje(
                mensajeLogin,
                error.message,
                "error"
            );
        }
    }
);


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
                /*
                Si ya había una ubicación válida,
                se conserva aunque falle el intento
                de actualizarla.
                */
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


formEntrega.addEventListener(
    "submit",
    async (evento) => {
        evento.preventDefault();

        ocultarMensaje(
            mensajeEntrega
        );

        const token = obtenerToken();

        if (!token) {
            mostrarFormularioLogin();

            mostrarMensaje(
                mensajeLogin,
                "La sesión ha finalizado. "
                + "Inicia sesión nuevamente.",
                "error"
            );

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

        /*
        Se vuelven a colocar las coordenadas antes
        de crear FormData. Esto evita perderlas si
        el navegador restableció los campos ocultos.
        */
        restaurarUbicacionEnFormulario();

        const datosEntrega = new FormData(
            formEntrega
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
                    eliminarToken();
                    eliminarUbicacion();

                    mostrarFormularioLogin();

                    mostrarMensaje(
                        mensajeLogin,
                        "La sesión ha finalizado. "
                        + "Inicia sesión nuevamente.",
                        "error"
                    );

                    return;
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

            /*
            La ubicación solo se elimina después
            de un registro exitoso.
            */
            eliminarUbicacion();

        } catch (error) {
            /*
            Ante errores como agencia inexistente,
            se conservan la ubicación, la fotografía
            y los demás datos del formulario.
            */
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
        }
    }
);


botonCerrarSesion.addEventListener(
    "click",
    () => {
        eliminarToken();

        formEntrega.reset();

        eliminarUbicacion();

        botonRegistrar.disabled = false;
        botonObtenerUbicacion.disabled = false;

        ocultarMensaje(
            mensajeEntrega
        );

        mostrarFormularioLogin();
    }
);


if (obtenerToken()) {
    mostrarFormularioEntrega();
} else {
    mostrarFormularioLogin();
}