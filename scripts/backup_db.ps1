$ErrorActionPreference = "Stop"

$fecha = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$nombreArchivo = "arenal_fletero_$fecha.sql"
$rutaLocal = "backups\$nombreArchivo"
$rutaContenedor = "/tmp/$nombreArchivo"

Write-Host "Generando respaldo de PostgreSQL..."

docker compose exec -T postgres `
    pg_dump `
    -U postgres `
    -d arenal_fletero `
    -f $rutaContenedor

if ($LASTEXITCODE -ne 0) {
    throw "No fue posible generar el respaldo."
}

docker cp `
    "arenal_postgres:$rutaContenedor" `
    $rutaLocal

if ($LASTEXITCODE -ne 0) {
    throw "No fue posible copiar el respaldo a Windows."
}

docker compose exec -T postgres `
    rm -f $rutaContenedor

if (-not (Test-Path $rutaLocal)) {
    throw "El archivo de respaldo no fue creado."
}

$archivo = Get-Item $rutaLocal

Write-Host ""
Write-Host "Respaldo completado correctamente."
Write-Host "Archivo: $($archivo.FullName)"
Write-Host "Tamaño: $($archivo.Length) bytes"