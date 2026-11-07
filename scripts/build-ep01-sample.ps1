$ErrorActionPreference = "Stop"

if ($PSVersionTable.PSEdition -ne "Core" -or $PSVersionTable.PSVersion.Major -lt 7) {
    throw "PowerShell 7+ is required."
}

$upstreamCommit = "7e5eb56feb2dd573f890e1b7b34748af43d58263"
$repoRoot = Split-Path -Parent $PSScriptRoot
$upstreamRoot = Join-Path $repoRoot "third_party/animate"
$skillRoot = Join-Path $upstreamRoot "plugins/animate/skills/animate"
$pieceRoot = Join-Path $repoRoot "episodes/EP01/sample15"
$artifactRoot = Join-Path $repoRoot "artifacts/ep01-sample15"
$logRoot = Join-Path $artifactRoot "logs"
$browserRoot = Join-Path $repoRoot ".tools/browsers"

function Assert-NativeSuccess([string]$step) {
    if ($LASTEXITCODE -ne 0) { throw "$step failed with exit code $LASTEXITCODE" }
}

New-Item -ItemType Directory -Force -Path $logRoot, $browserRoot | Out-Null

if (-not (Test-Path -LiteralPath (Join-Path $upstreamRoot ".git"))) {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $upstreamRoot) | Out-Null
    git clone https://github.com/cth9191/animate.git $upstreamRoot
    Assert-NativeSuccess "clone upstream"
}

$origin = (git -C $upstreamRoot remote get-url origin).Trim()
Assert-NativeSuccess "read upstream origin"
if ($origin -ne "https://github.com/cth9191/animate.git") {
    throw "unexpected upstream origin: $origin"
}
git -C $upstreamRoot fetch origin $upstreamCommit
Assert-NativeSuccess "fetch upstream commit"
git -C $upstreamRoot checkout --detach $upstreamCommit
Assert-NativeSuccess "checkout upstream commit"
$actualCommit = (git -C $upstreamRoot rev-parse HEAD).Trim()
Assert-NativeSuccess "read upstream commit"
if ($actualCommit -ne $upstreamCommit) { throw "upstream commit mismatch: $actualCommit" }

Push-Location $repoRoot
try {
    npm ci --no-audit --no-fund 2>&1 | Tee-Object -FilePath (Join-Path $logRoot "npm-ci.log")
    Assert-NativeSuccess "npm ci"

    $env:PLAYWRIGHT_BROWSERS_PATH = $browserRoot
    & (Join-Path $repoRoot "node_modules/.bin/playwright.cmd") install chromium 2>&1 |
        Tee-Object -FilePath (Join-Path $logRoot "playwright-install.log")
    Assert-NativeSuccess "install Chromium"

    $env:NODE_PATH = Join-Path $repoRoot "node_modules"
    $ffmpegPath = Join-Path $repoRoot "node_modules/ffmpeg-static/ffmpeg.exe"
    $ffprobePath = Join-Path $repoRoot "node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe"
    if (-not (Test-Path -LiteralPath $ffmpegPath)) { throw "missing ffmpeg: $ffmpegPath" }
    if (-not (Test-Path -LiteralPath $ffprobePath)) { throw "missing ffprobe: $ffprobePath" }
    $env:PATH = @((Split-Path -Parent $ffmpegPath), (Split-Path -Parent $ffprobePath), $env:PATH) -join ";"

    npm test 2>&1 | Tee-Object -FilePath (Join-Path $logRoot "tests.log")
    Assert-NativeSuccess "tests"

    node (Join-Path $skillRoot "tools/build.mjs") $pieceRoot 2>&1 |
        Tee-Object -FilePath (Join-Path $logRoot "build.log")
    Assert-NativeSuccess "build sample"

    $contactFrames = 0..29 | ForEach-Object { $_ * 12 }
    node (Join-Path $skillRoot "tools/tile.mjs") $pieceRoot (Join-Path $artifactRoot "contact-sheet-0.5s.png") @contactFrames 2>&1 |
        Tee-Object -FilePath (Join-Path $logRoot "tile.log")
    Assert-NativeSuccess "render contact sheet"

    node (Join-Path $skillRoot "tools/export.mjs") $pieceRoot --workers 4 --share 2>&1 |
        Tee-Object -FilePath (Join-Path $logRoot "export.log")
    Assert-NativeSuccess "export sample"

    $sourceVideo = Join-Path $pieceRoot "renders/final.mp4"
    $sampleVideo = Join-Path $artifactRoot "sample.mp4"
    Copy-Item -LiteralPath $sourceVideo -Destination $sampleVideo -Force
    & $ffmpegPath -y -hide_banner -loglevel error -i $sampleVideo -vf "scale=360:640" -c:v libx264 -crf 22 -preset slow -c:a aac -b:a 128k -movflags +faststart (Join-Path $artifactRoot "sample-phone-360x640.mp4")
    Assert-NativeSuccess "make phone preview"

    & $ffprobePath -v error -show_entries "format=duration,size,bit_rate:stream=index,codec_name,codec_type,width,height,r_frame_rate,nb_frames,sample_rate,channels" -of json $sampleVideo |
        Set-Content -LiteralPath (Join-Path $artifactRoot "ffprobe.json") -Encoding utf8NoBOM
    Assert-NativeSuccess "probe sample"

    & $ffmpegPath -hide_banner -i $sampleVideo -vf "blackdetect=d=0.08:pix_th=0.10,freezedetect=n=-45dB:d=0.5" -an -f null NUL 2>&1 |
        Tee-Object -FilePath (Join-Path $logRoot "frame-integrity.log")
    Assert-NativeSuccess "frame integrity scan"

    Push-Location $upstreamRoot
    try {
        node (Join-Path $skillRoot "tools/review.mjs") $pieceRoot 2>&1 |
            Tee-Object -FilePath (Join-Path $logRoot "review.log")
        Assert-NativeSuccess "upstream review"
    } finally {
        Pop-Location
    }
    foreach ($name in @("phone.jpg", "shot01-sheet.jpg", "shot02-sheet.jpg", "shot03-sheet.jpg", "shot04-sheet.jpg")) {
        Copy-Item -LiteralPath (Join-Path $pieceRoot "review/$name") -Destination (Join-Path $artifactRoot $name) -Force
    }

    $environment = @(
        (git --version),
        (node --version),
        (npm --version),
        (pwsh --version),
        (& $ffmpegPath -version | Select-Object -First 1),
        (& $ffprobePath -version | Select-Object -First 1),
        "os=$([System.Environment]::OSVersion.VersionString)",
        "upstream_origin=$origin",
        "upstream_commit=$actualCommit",
        "playwright_browsers_path=$browserRoot"
    )
    foreach ($font in @("C:/Windows/Fonts/simkai.ttf", "C:/Windows/Fonts/msyh.ttc")) {
        if (Test-Path -LiteralPath $font) {
            $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $font).Hash.ToLowerInvariant()
            $environment += "font=$font sha256=$hash"
        }
    }
    $environment | Set-Content -LiteralPath (Join-Path $artifactRoot "environment.txt") -Encoding utf8NoBOM

    Get-ChildItem -LiteralPath $artifactRoot -Recurse -File |
        Where-Object Name -ne "manifest.sha256" |
        Sort-Object FullName |
        ForEach-Object {
            $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName).Hash.ToLowerInvariant()
            $relative = [System.IO.Path]::GetRelativePath($artifactRoot, $_.FullName).Replace("\", "/")
            "$hash  $relative"
        } | Set-Content -LiteralPath (Join-Path $artifactRoot "manifest.sha256") -Encoding utf8NoBOM
} finally {
    Pop-Location
}

Write-Host "EP01 sample rendered at $artifactRoot"
