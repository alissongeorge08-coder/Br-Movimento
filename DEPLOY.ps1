# =================================================================
#  BR + MOVIMENTO - Script de Deploy Completo
#  Como rodar: powershell -ExecutionPolicy Bypass -File DEPLOY.ps1
# =================================================================

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

function Write-Step($n, $msg) {
    Write-Host ""
    Write-Host "=== PASSO $n`: $msg ===" -ForegroundColor Cyan
}

function Write-OK($msg)   { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "  [!]  $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "  [X]  $msg" -ForegroundColor Red }
function Pause-Read($msg) {
    Write-Host "  --> $msg" -ForegroundColor White
    Read-Host "      Pressione ENTER quando pronto"
}

Clear-Host
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Magenta
Write-Host "      BR + MOVIMENTO - Deploy Setup                  " -ForegroundColor Magenta
Write-Host "=====================================================" -ForegroundColor Magenta


# =====================================================================
# PARTE 1 - CLOUDFLARE R2 (videos)
# =====================================================================

Write-Step 1 "Configurar Cloudflare R2 para os videos"
Write-Host ""
Write-Host "  O R2 e gratuito ate 10GB/mes de transferencia." -ForegroundColor White
Write-Host ""
Write-Host "  Faca isso agora no navegador:"
Write-Host "  1) Acesse: https://dash.cloudflare.com" -ForegroundColor Yellow
Write-Host "  2) Crie uma conta gratuita (ou faca login)"
Write-Host "  3) No menu esquerdo, clique em 'R2 Object Storage'"
Write-Host "  4) Clique em 'Create bucket'"
Write-Host "  5) Nome do bucket: br-movimento"
Write-Host "  6) Clique em 'Create bucket'"
Write-Host "  7) Dentro do bucket -> aba 'Settings' -> 'Public Access' -> 'Allow Access'"
Write-Host "  8) Copie a URL publica (parece: https://pub-abc123.r2.dev)"
Write-Host ""
Pause-Read "Termine os passos acima antes de continuar"

$R2_PUBLIC_URL = Read-Host "  Cole a URL publica do bucket (ex: https://pub-abc123.r2.dev)"
$R2_PUBLIC_URL = $R2_PUBLIC_URL.TrimEnd('/')


Write-Step 2 "Instalar rclone (ferramenta de upload)"
Write-Host ""

if (Get-Command rclone -ErrorAction SilentlyContinue) {
    Write-OK "rclone ja instalado"
} else {
    Write-Host "  Baixando rclone..." -ForegroundColor Gray
    $rcloneUrl = "https://downloads.rclone.org/rclone-current-windows-amd64.zip"
    $rcloneZip = "$env:TEMP\rclone.zip"
    $rcloneDir = "$env:TEMP\rclone_extract"
    Invoke-WebRequest -Uri $rcloneUrl -OutFile $rcloneZip -UseBasicParsing
    Expand-Archive -Path $rcloneZip -DestinationPath $rcloneDir -Force
    $rcloneExe = Get-ChildItem "$rcloneDir\*\rclone.exe" | Select-Object -First 1
    Copy-Item $rcloneExe.FullName "$env:USERPROFILE\rclone.exe"
    $env:PATH = "$env:USERPROFILE;" + $env:PATH
    Write-OK "rclone instalado em $env:USERPROFILE\rclone.exe"
}


Write-Step 3 "Credenciais do R2"
Write-Host ""
Write-Host "  Precisamos de uma chave de API do R2:"
Write-Host "  1) No painel do R2 -> 'Manage R2 API Tokens'"
Write-Host "  2) Clique em 'Create API token'"
Write-Host "  3) Permissoes: 'Object Read and Write'"
Write-Host "  4) Bucket: 'Specific bucket' -> br-movimento"
Write-Host "  5) Crie o token e copie:"
Write-Host "     - Account ID (esta no painel inicial do R2)"
Write-Host "     - Access Key ID"
Write-Host "     - Secret Access Key"
Write-Host ""

$ACCOUNT_ID = Read-Host "  Account ID"
$ACCESS_KEY  = Read-Host "  Access Key ID"
$SECRET_KEY  = Read-Host "  Secret Access Key"

$rcloneConfig = @"
[r2]
type = s3
provider = Cloudflare
access_key_id = $ACCESS_KEY
secret_access_key = $SECRET_KEY
endpoint = https://$ACCOUNT_ID.r2.cloudflarestorage.com
acl = public-read
"@

$rcloneConfigDir = "$env:APPDATA\rclone"
New-Item -ItemType Directory -Force -Path $rcloneConfigDir | Out-Null
Set-Content -Path "$rcloneConfigDir\rclone.conf" -Value $rcloneConfig -Encoding UTF8
Write-OK "rclone configurado para o R2"


Write-Step 4 "Upload dos videos para o R2"
Write-Host ""

$videoFolders = @("480p", "720p", "1080p")
$totalFiles = 0
foreach ($q in $videoFolders) {
    if (Test-Path "videos\$q") {
        $count = (Get-ChildItem "videos\$q\*.mp4" -ErrorAction SilentlyContinue).Count
        $totalFiles += $count
    }
}

Write-Host "  Encontrados $totalFiles arquivos .mp4 para enviar" -ForegroundColor White
Write-Host "  Isso pode demorar alguns minutos..." -ForegroundColor Gray
Write-Host ""

foreach ($q in $videoFolders) {
    $dir = "videos\$q"
    if (-not (Test-Path $dir)) { Write-Warn "Pasta $dir nao encontrada, pulando"; continue }
    Write-Host "  Enviando $q..." -ForegroundColor Gray
    & rclone copy $dir "r2:br-movimento/$q" --progress --transfers 4
    Write-OK "Videos $q enviados"
}


Write-Step 5 "Atualizar URL dos videos no codigo"
Write-Host ""

$mainJsPath = "js\main.js"
$mainJs = Get-Content $mainJsPath -Raw -Encoding UTF8
$mainJs = $mainJs -replace "const R2_BASE_URL = 'https://SEU_BUCKET\.r2\.dev'", "const R2_BASE_URL = '$R2_PUBLIC_URL'"
Set-Content $mainJsPath $mainJs -Encoding UTF8
Write-OK "URL atualizada em main.js: $R2_PUBLIC_URL"


# =====================================================================
# PARTE 2 - GITHUB PAGES (codigo/site)
# =====================================================================

Write-Step 6 "Verificar Git e GitHub CLI"
Write-Host ""

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Err "Git nao encontrado. Instale em: https://git-scm.com"
    pause; exit 1
}
Write-OK "Git encontrado"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "  GitHub CLI nao encontrado. Baixando..." -ForegroundColor Yellow
    $ghUrl = "https://github.com/cli/cli/releases/download/v2.45.0/gh_2.45.0_windows_amd64.msi"
    $ghMsi = "$env:TEMP\gh_setup.msi"
    Invoke-WebRequest -Uri $ghUrl -OutFile $ghMsi -UseBasicParsing
    Start-Process msiexec.exe -Wait -ArgumentList "/i `"$ghMsi`" /quiet"
    $ghPath = "$env:ProgramFiles\GitHub CLI"
    $env:PATH = "$ghPath;" + $env:PATH
    Write-OK "GitHub CLI instalado"
}
Write-OK "GitHub CLI encontrado"


Write-Step 7 "Login no GitHub"
Write-Host ""
Write-Host "  Uma janela do navegador vai abrir para voce fazer login." -ForegroundColor White
& gh auth login --web
Write-OK "Login GitHub concluido"


Write-Step 8 "Criar repositorio e publicar o site"
Write-Host ""

$REPO_NAME   = Read-Host "  Nome do repositorio (ex: br-movimento)"
if (-not $REPO_NAME) { $REPO_NAME = "br-movimento" }

$GITHUB_USER = (& gh api user --jq .login)
Write-OK "Usuario GitHub: $GITHUB_USER"

git init
git add .
git commit -m "BR + Movimento - primeiro deploy"

& gh repo create $REPO_NAME --public --source=. --remote=origin --push
Write-OK "Codigo enviado para github.com/$GITHUB_USER/$REPO_NAME"


Write-Step 9 "Ativar GitHub Pages"
Write-Host ""
& gh api "repos/$GITHUB_USER/$REPO_NAME/pages" --method POST -f build_type=workflow 2>$null | Out-Null
Write-OK "GitHub Pages ativado (site fica pronto em ~2 minutos)"


# =====================================================================
# RESUMO FINAL
# =====================================================================
Write-Host ""
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "   DEPLOY CONCLUIDO!" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Site (pronto em ~2 min):" -ForegroundColor White
Write-Host "  https://$GITHUB_USER.github.io/$REPO_NAME" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Videos online em:" -ForegroundColor White
Write-Host "  $R2_PUBLIC_URL/720p/D-01-A.mp4" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Para updates futuros de codigo:" -ForegroundColor White
Write-Host "  git add . && git commit -m 'update' && git push" -ForegroundColor Gray
Write-Host ""
pause
