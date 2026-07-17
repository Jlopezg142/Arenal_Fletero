import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent.parent

load_dotenv(BASE_DIR / ".env")


class Settings:
    # URL completa usada en producción.
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        ""
    ).strip()

    # Configuración local de PostgreSQL.
    DB_HOST: str = os.getenv(
        "DB_HOST",
        "postgres"
    )

    DB_PORT: str = os.getenv(
        "DB_PORT",
        "5432"
    )

    DB_NAME: str = os.getenv(
        "DB_NAME",
        "arenal_fletero"
    )

    DB_USER: str = os.getenv(
        "DB_USER",
        "postgres"
    )

    DB_PASSWORD: str = os.getenv(
        "DB_PASSWORD",
        "postgres123"
    )

    # Seguridad
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "cambiar_esta_clave_en_produccion"
    )

    ALGORITHM: str = os.getenv(
        "ALGORITHM",
        "HS256"
    )

    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv(
            "ACCESS_TOKEN_EXPIRE_MINUTES",
            "60"
        )
    )

    # Administrador inicial
    ADMIN_INITIAL_NAME: str = os.getenv(
        "ADMIN_INITIAL_NAME",
        "Administrador"
    )

    ADMIN_INITIAL_USER: str = os.getenv(
        "ADMIN_INITIAL_USER",
        "admin"
    )

    ADMIN_INITIAL_PASSWORD: str = os.getenv(
        "ADMIN_INITIAL_PASSWORD",
        "admin123"
    )

    # Almacenamiento de fotografías
    STORAGE_TYPE: str = os.getenv(
        "STORAGE_TYPE",
        "local"
    )

    R2_ACCOUNT_ID: str = os.getenv(
        "R2_ACCOUNT_ID",
        ""
    )

    R2_ACCESS_KEY_ID: str = os.getenv(
        "R2_ACCESS_KEY_ID",
        ""
    )

    R2_SECRET_ACCESS_KEY: str = os.getenv(
        "R2_SECRET_ACCESS_KEY",
        ""
    )

    R2_BUCKET_NAME: str = os.getenv(
        "R2_BUCKET_NAME",
        ""
    )

    R2_PUBLIC_URL: str = os.getenv(
        "R2_PUBLIC_URL",
        ""
    )

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL:
            if self.DATABASE_URL.startswith(
                "postgres://"
            ):
                return self.DATABASE_URL.replace(
                    "postgres://",
                    "postgresql://",
                    1,
                )

            return self.DATABASE_URL

        return (
            f"postgresql://{self.DB_USER}:"
            f"{self.DB_PASSWORD}@"
            f"{self.DB_HOST}:{self.DB_PORT}/"
            f"{self.DB_NAME}"
        )


settings = Settings()

