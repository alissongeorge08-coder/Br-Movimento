# =================================================================
#  BR + MOVIMENTO — Recompressão de Vídeos com Qualidade Superior
#  Corrige: resolução errada (608x1080 → 1080x1920) e bitrate baixo
#  Parâmetros: CRF 20 + preset medium (qualidade visualmente excelente)
# =================================================================

$videosDir = ".\videos"
$out1080 = Join-Path $videosDir "1080p"
$out720  = Join-Path $videosDir "720p"
$out480  = Join-Path $videosDir "480p"

# Tenta encontrar o ffmpeg
$ffmpegPath = $null
$candidates = @(
    "ffmpeg",  # PATH do sistema
    "C:\ProgramData\chocolatey\bin\ffmpeg.exe",
    (Get-ChildItem "C:\Users\$env:USERNAME\AppData\Local\Microsoft\WinGet\Packages" -Recurse -Filter "ffmpeg.exe" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName)
)
foreach ($c in $candidates) {
    if ($c -and (Get-Command $c -ErrorAction SilentlyContinue)) {
        $ffmpegPath = $c
        break
    }
}
if (-not $ffmpegPath) {
    Write-Host "[ERRO] ffmpeg nao encontrado! Instale com: winget install Gyan.FFmpeg" -ForegroundColor Red
    exit 1
}
Write-Host "Usando ffmpeg: $ffmpegPath" -ForegroundColor Green

# Cria pastas de saída
foreach ($d in @($out1080, $out720, $out480)) {
    if (!(Test-Path $d)) { New-Item -ItemType Directory -Path $d | Out-Null }
}

$folders = @("Casal", "Cavalheiro", "Dama")
$totalFiles = 0
$processedFiles = 0

foreach ($folder in $folders) {
    $folderPath = Join-Path $videosDir $folder
    if (Test-Path $folderPath) {
        $totalFiles += (Get-ChildItem -Path $folderPath -Filter "*.mov").Count
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Recompressao de $totalFiles videos"     -ForegroundColor Cyan
Write-Host "  CRF 20 (1080p) / CRF 22 (720/480p)"    -ForegroundColor Cyan
Write-Host "  Preset: medium (melhor qualidade)"       -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$startTime = Get-Date

foreach ($folder in $folders) {
    $folderPath = Join-Path $videosDir $folder
    if (!(Test-Path $folderPath)) { continue }

    $files = Get-ChildItem -Path $folderPath -Filter "*.mov"
    foreach ($file in $files) {
        $processedFiles++
        $baseName = $file.BaseName
        $inFile   = $file.FullName

        $f1080 = Join-Path $out1080 "$baseName.mp4"
        $f720  = Join-Path $out720  "$baseName.mp4"
        $f480  = Join-Path $out480  "$baseName.mp4"

        Write-Host "[$processedFiles/$totalFiles] $baseName..." -ForegroundColor Yellow -NoNewline

        # Para vídeo VERTICAL (1080x1920), usamos scale=W:-2
        # 1080p = largura 1080, altura proporcional
        # 720p  = largura 720
        # 480p  = largura 480

        # --- 1080p (CRF 20, preset medium) ---
        & $ffmpegPath -y -i $inFile `
            -vf "scale=1080:-2" `
            -c:v libx264 -crf 20 -preset medium `
            -c:a aac -b:a 128k `
            -movflags +faststart `
            $f1080 2>&1 | Out-Null

        # --- 720p (CRF 22, preset medium) ---
        & $ffmpegPath -y -i $inFile `
            -vf "scale=720:-2" `
            -c:v libx264 -crf 22 -preset medium `
            -c:a aac -b:a 128k `
            -movflags +faststart `
            $f720 2>&1 | Out-Null

        # --- 480p (CRF 24, preset medium) ---
        & $ffmpegPath -y -i $inFile `
            -vf "scale=480:-2" `
            -c:v libx264 -crf 24 -preset medium `
            -c:a aac -b:a 96k `
            -movflags +faststart `
            $f480 2>&1 | Out-Null

        # Show sizes
        $s1080 = [math]::Round((Get-Item $f1080).Length / 1MB, 1)
        $s720  = [math]::Round((Get-Item $f720).Length / 1MB, 1)
        $s480  = [math]::Round((Get-Item $f480).Length / 1MB, 1)
        Write-Host " OK (1080p: ${s1080}MB | 720p: ${s720}MB | 480p: ${s480}MB)" -ForegroundColor Green
    }
}

$elapsed = (Get-Date) - $startTime
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Concluido em $([math]::Round($elapsed.TotalMinutes, 1)) minutos!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Show totals
$total1080 = [math]::Round((Get-ChildItem $out1080 -File | Measure-Object -Property Length -Sum).Sum / 1MB, 1)
$total720  = [math]::Round((Get-ChildItem $out720  -File | Measure-Object -Property Length -Sum).Sum / 1MB, 1)
$total480  = [math]::Round((Get-ChildItem $out480  -File | Measure-Object -Property Length -Sum).Sum / 1MB, 1)
Write-Host "  1080p total: ${total1080} MB"
Write-Host "  720p  total: ${total720} MB"
Write-Host "  480p  total: ${total480} MB"
Write-Host "  TOTAL:       $($total1080 + $total720 + $total480) MB"
