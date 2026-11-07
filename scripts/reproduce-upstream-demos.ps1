$ErrorActionPreference = "Stop"
if ($PSVersionTable.PSEdition -ne "Core" -or $PSVersionTable.PSVersion.Major -lt 7) {
    throw "PowerShell 7+ is required. Run this script with pwsh, not Windows PowerShell."
}
$UpstreamCommit = "7e5eb56feb2dd573f890e1b7b34748af43d58263"
$repoRoot = Split-Path -Parent $PSScriptRoot
$upstreamRoot = Join-Path $repoRoot "third_party/animate"
$skillRoot = Join-Path $upstreamRoot "plugins/animate/skills/animate"
$toolRoot = Join-Path $repoRoot ".tools/ffmpeg"
$artifactRoot = Join-Path $repoRoot "artifacts/upstream-reproduction"
$logRoot = Join-Path $artifactRoot "logs"

function Assert-NativeSuccess([string]$Step) {
    if ($LASTEXITCODE -ne 0) {
        throw "$Step failed with exit code $LASTEXITCODE"
    }
}

New-Item -ItemType Directory -Force -Path $logRoot | Out-Null
foreach ($style in @("sketchbook", "crosshatch")) {
    $redundantFinal = Join-Path $artifactRoot "$style/demo-final.mp4"
    if (Test-Path -LiteralPath $redundantFinal) {
        Remove-Item -LiteralPath $redundantFinal -Force
    }
}

if (-not (Test-Path -LiteralPath (Join-Path $upstreamRoot ".git"))) {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $upstreamRoot) | Out-Null
    git clone https://github.com/cth9191/animate.git $upstreamRoot
    Assert-NativeSuccess "git clone"
}

git -C $upstreamRoot fetch origin $UpstreamCommit
Assert-NativeSuccess "git fetch"
git -C $upstreamRoot checkout --detach $UpstreamCommit
Assert-NativeSuccess "git checkout"
$actualUpstreamCommit = (git -C $upstreamRoot rev-parse HEAD).Trim()
Assert-NativeSuccess "git rev-parse"
if ($actualUpstreamCommit -ne $UpstreamCommit) {
    throw "upstream HEAD mismatch: expected $UpstreamCommit, got $actualUpstreamCommit"
}

npm install --prefix $toolRoot playwright@1.65.0 ffmpeg-static@5.3.0 ffprobe-static@3.1.0 --no-audit --no-fund
Assert-NativeSuccess "npm install"

$requiredPackages = [ordered]@{
    "playwright" = "1.65.0"
    "ffmpeg-static" = "5.3.0"
    "ffprobe-static" = "3.1.0"
}
foreach ($package in $requiredPackages.GetEnumerator()) {
    $packageJson = Join-Path $toolRoot "node_modules/$($package.Key)/package.json"
    if (-not (Test-Path -LiteralPath $packageJson)) { throw "missing package: $($package.Key)" }
    $actualVersion = (Get-Content -Raw -LiteralPath $packageJson | ConvertFrom-Json).version
    if ($actualVersion -ne $package.Value) {
        throw "package version mismatch for $($package.Key): expected $($package.Value), got $actualVersion"
    }
}

$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $toolRoot "browsers"
& (Join-Path $toolRoot "node_modules/.bin/playwright.cmd") install chromium
Assert-NativeSuccess "playwright install chromium"

$env:NODE_PATH = Join-Path $toolRoot "node_modules"
$ffmpegPath = Join-Path $toolRoot "node_modules/ffmpeg-static/ffmpeg.exe"
$ffprobePath = Join-Path $toolRoot "node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe"
if (-not (Test-Path -LiteralPath $ffmpegPath)) { throw "missing ffmpeg executable: $ffmpegPath" }
if (-not (Test-Path -LiteralPath $ffprobePath)) { throw "missing ffprobe executable: $ffprobePath" }
$env:PATH = @(
    (Split-Path -Parent $ffmpegPath),
    (Split-Path -Parent $ffprobePath),
    $env:PATH
) -join ";"

foreach ($style in @("sketchbook", "crosshatch")) {
    $demo = Join-Path $skillRoot "styles/$style/demo"
    $destination = Join-Path $artifactRoot $style
    New-Item -ItemType Directory -Force -Path $destination | Out-Null

    & node (Join-Path $skillRoot "tools/build.mjs") $demo 2>&1 |
        Tee-Object -FilePath (Join-Path $logRoot "$style-build.log")
    if ($LASTEXITCODE -ne 0) { throw "$style build failed" }

    & node (Join-Path $skillRoot "tools/tile.mjs") $demo (Join-Path $demo "tile.png") 0 12 24 48 60 72 84 108 132 143 2>&1 |
        Tee-Object -FilePath (Join-Path $logRoot "$style-tile.log")
    if ($LASTEXITCODE -ne 0) { throw "$style determinism tile failed" }

    & node (Join-Path $skillRoot "tools/export.mjs") $demo --workers 4 --share 2>&1 |
        Tee-Object -FilePath (Join-Path $logRoot "$style-export.log")
    if ($LASTEXITCODE -ne 0) { throw "$style export failed" }

    Push-Location $upstreamRoot
    try {
        & node (Join-Path $skillRoot "tools/review.mjs") $demo 2>&1 |
            Tee-Object -FilePath (Join-Path $logRoot "$style-review.log")
        if ($LASTEXITCODE -ne 0) { throw "$style review failed" }
    } finally {
        Pop-Location
    }

    Copy-Item -LiteralPath (Join-Path $demo "renders/share.mp4") -Destination (Join-Path $destination "demo-share.mp4") -Force
    Copy-Item -LiteralPath (Join-Path $demo "tile.png") -Destination (Join-Path $destination "determinism-tile.png") -Force
    Copy-Item -LiteralPath (Join-Path $demo "review/shot01-sheet.jpg") -Destination (Join-Path $destination "shot01-sequence.jpg") -Force
    Copy-Item -LiteralPath (Join-Path $demo "review/shot02-sheet.jpg") -Destination (Join-Path $destination "shot02-sequence.jpg") -Force
    Copy-Item -LiteralPath (Join-Path $demo "review/phone.jpg") -Destination (Join-Path $destination "phone-sheet.jpg") -Force
}

$environment = @(
    (git --version),
    (node --version),
    (npm --version),
    (& (Join-Path $toolRoot "node_modules/.bin/playwright.cmd") --version),
    (& $ffmpegPath -version | Select-Object -First 1),
    (& $ffprobePath -version | Select-Object -First 1),
    "os=$([System.Environment]::OSVersion.VersionString)",
    "upstream_commit=$actualUpstreamCommit",
    "playwright_browsers_path=$env:PLAYWRIGHT_BROWSERS_PATH"
)
foreach ($font in @("C:/Windows/Fonts/Inkfree.ttf", "C:/Windows/Fonts/segoepr.ttf", "C:/Windows/Fonts/segoeprb.ttf", "C:/Windows/Fonts/consola.ttf", "C:/Windows/Fonts/consolab.ttf")) {
    if (Test-Path -LiteralPath $font) {
        $fontHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $font).Hash.ToLowerInvariant()
        $environment += "font=$font sha256=$fontHash"
    }
}
$environment | Set-Content -LiteralPath (Join-Path $artifactRoot "environment.txt") -Encoding utf8NoBOM

$probes = [ordered]@{}
foreach ($style in @("sketchbook", "crosshatch")) {
    $video = Join-Path $artifactRoot "$style/demo-share.mp4"
    $probeJson = & $ffprobePath -v error -show_entries "format=duration,size,bit_rate:stream=index,codec_name,codec_type,width,height,r_frame_rate,nb_frames,sample_rate,channels" -of json $video
    Assert-NativeSuccess "ffprobe $style"
    $probes[$style] = $probeJson | ConvertFrom-Json
}
$probes | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $artifactRoot "media-probe.json") -Encoding utf8NoBOM

Get-ChildItem -LiteralPath $artifactRoot -Recurse -File |
    Where-Object Name -ne "manifest.sha256" |
    Sort-Object FullName |
    ForEach-Object {
        $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName).Hash.ToLowerInvariant()
        $relative = [System.IO.Path]::GetRelativePath($artifactRoot, $_.FullName).Replace("\", "/")
        "$hash  $relative"
    } | Set-Content -LiteralPath (Join-Path $artifactRoot "manifest.sha256") -Encoding utf8NoBOM

Write-Host "Upstream demos reproduced at $artifactRoot"

