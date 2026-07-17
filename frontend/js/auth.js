"use strict";

window.Arenal = window.Arenal || {};

window.Arenal.auth = (() => {

    const {
        API_URL,
    } = window.Arenal.config;


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


    function guardarUsuarioEnStorage(usuario) {
        sessionStorage.setItem(
            "arenal_usuario",
            JSON.stringify(usuario)
        );
    }


    function obtenerUsuarioGuardado() {
        const usuarioGuardado =
            sessionStorage.getItem(
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


    function limpiarSesionEnStorage() {
        sessionStorage.removeItem(
            "arenal_token"
        );

        sessionStorage.removeItem(
            "arenal_usuario"
        );
    }


    async function consultarUsuarioActual() {
        const token = obtenerToken();

        if (!token) {
            throw new Error(
                "No existe una sesion activa."
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
                || "La sesion no es valida."
            );
        }

        return datos;
    }


    async function iniciarSesion(
        usuario,
        password
    ) {
        const datosLogin =
            new URLSearchParams();

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
                || "No fue posible iniciar sesion."
            );
        }

        if (
            !datos.access_token
            || !datos.usuario
        ) {
            throw new Error(
                "La respuesta del servidor "
                + "no contiene la sesion completa."
            );
        }

        return datos;
    }


    return {
        obtenerToken,
        guardarToken,
        guardarUsuarioEnStorage,
        obtenerUsuarioGuardado,
        limpiarSesionEnStorage,
        consultarUsuarioActual,
        iniciarSesion,
    };

})();