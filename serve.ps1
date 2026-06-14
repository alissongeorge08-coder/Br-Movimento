# Servidor HTTP simples em PowerShell puro (sem Python/Node)
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 8080
$prefix = "http://localhost:$port/"

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css'
    '.js'   = 'application/javascript'
    '.json' = 'application/json'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.glb'  = 'model/gltf-binary'
    '.mp4'  = 'video/mp4'
    '.webm' = 'video/webm'
    '.ico'  = 'image/x-icon'
    '.woff2'= 'font/woff2'
    '.woff' = 'font/woff'
    '.mp3'  = 'audio/mpeg'
    '.ogg'  = 'audio/ogg'
    '.wav'  = 'audio/wav'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()

Write-Host ""
Write-Host "  ============================================" -ForegroundColor Green
Write-Host "   Servidor rodando em: $prefix" -ForegroundColor Cyan
Write-Host "   Abra o link acima no navegador!" -ForegroundColor White
Write-Host "   Pressione Ctrl+C para parar." -ForegroundColor Gray
Write-Host "  ============================================" -ForegroundColor Green
Write-Host ""

# Abrir o browser automaticamente
Start-Process $prefix

try {
    while ($listener.IsListening) {
        $ctx  = $listener.GetContext()
        $req  = $ctx.Request
        $res  = $ctx.Response

        $urlPath = $req.Url.LocalPath
        if ($urlPath -eq '/' -or $urlPath -eq '') { $urlPath = '/index.html' }

        $filePath = Join-Path $root ($urlPath.TrimStart('/').Replace('/', '\'))

        if (Test-Path $filePath -PathType Leaf) {
            $ext     = [System.IO.Path]::GetExtension($filePath).ToLower()
            $ct      = if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' }
            $bytes   = [System.IO.File]::ReadAllBytes($filePath)
            $res.ContentType   = $ct
            $res.ContentLength64 = $bytes.Length
            $res.StatusCode    = 200
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - $urlPath nao encontrado")
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }
        $res.OutputStream.Close()
    }
} finally {
    $listener.Stop()
}
