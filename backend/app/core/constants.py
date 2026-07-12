"""
Constantes generales del proyecto Arenal Fletero.
Todas las constantes que puedan reutilizarse en varios módulos
deben definirse aquí.
"""


class Roles:
    ADMIN = "ADMIN"
    FLETERO = "FLETERO"


class TiposFoto:
    FOTO_ENVIO = "foto_envio"
    FOTO_LUGAR = "foto_lugar"


class Storage:
    LOCAL = "local"
    R2 = "r2"


class Mensajes:
    LOGIN_INCORRECTO = "Usuario o contraseña incorrectos."
    USUARIO_INACTIVO = "El usuario se encuentra inactivo."
    ENVIO_EXISTENTE = "El número de envío ya fue registrado."
    ENVIO_REGISTRADO = "Entrega registrada correctamente."


class Limites:
    TAMANO_MAXIMO_IMAGEN_MB = 5
    EXTENSIONES_PERMITIDAS = (
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    )