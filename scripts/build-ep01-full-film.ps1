param(
    [switch]$SkipInstall,
    [switch]$SkipRender
)

$ErrorActionPreference = "Stop"

if ($PSVersionTable.PSEdition -ne "Core" -or $PSVersionTable.PSVersion.Major -lt 7) {
    throw "PowerShell 7+ is required."
}

$upstreamCommit = "7e5eb56feb2dd573f890e1b7b34748af43d58263"
$repoRoot = Split-Path -Parent $PSScriptRoot
$repoRoot = [System.IO.Path]::GetFullPath($repoRoot)
$upstreamRoot = Join-Path $repoRoot "third_party/animate"
$skillRoot = Join-Path $upstreamRoot "plugins/animate/skills/animate"
$pieceRoot = Join-Path $repoRoot "episodes/EP01/full-film"
$artifactRoot = Join-Path $repoRoot "artifacts/ep01-full-film/release"
$logRoot = Join-Path $artifactRoot "logs"
$browserRoot = Join-Path $repoRoot ".tools/browsers"

function Assert-NativeSuccess([string]$step) {
    if ($LASTEXITCODE -ne 0) { throw "$step failed with exit code $LASTEXITCODE" }
}

$expectedPrefix = $repoRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
if (-not $artifactRoot.StartsWith($expectedPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "artifact directory escapes repository: $artifactRoot"
}
if (Test-Path -LiteralPath $artifactRoot) {
    Remove-Item -LiteralPath $artifactRoot -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $logRoot, $browserRoot | Out-Null

if (-not (Test-Path -LiteralPath (Join-Path $upstreamRoot ".git"))) {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $upstreamRoot) | Out-Null
    git clone https://github.com/cth9191/animate.git $upstreamRoot
    Assert-NativeSuccess "clone upstream"
}

$upstreamDirty = @(git -C $upstreamRoot status --porcelain)
Assert-NativeSuccess "inspect upstream status"
if ($upstreamDirty.Count -gt 0) { throw "upstream checkout contains local changes" }
$origin = (git -C $upstreamRoot remote get-url origin).Trim()
Assert-NativeSuccess "read upstream origin"
if ($origin -ne "https://github.com/cth9191/animate.git") { throw "unexpected upstream origin: $origin" }
git -C $upstreamRoot fetch origin $upstreamCommit
Assert-NativeSuccess "fetch upstream commit"
git -C $upstreamRoot checkout --detach $upstreamCommit
Assert-NativeSuccess "checkout upstream commit"
$actualCommit = (git -C $upstreamRoot rev-parse HEAD).Trim()
Assert-NativeSuccess "read upstream commit"
if ($actualCommit -ne $upstreamCommit) { throw "upstream commit mismatch: $actualCommit" }

Push-Location $repoRoot
try {
    if (-not $SkipInstall) {
        npm ci --no-audit --no-fund 2>&1 | Tee-Object -FilePath (Join-Path $logRoot "npm-ci.log")
        Assert-NativeSuccess "npm ci"
        $env:PLAYWRIGHT_BROWSERS_PATH = $browserRoot
        & (Join-Path $repoRoot "node_modules/.bin/playwright.cmd") install chromium 2>&1 |
            Tee-Object -FilePath (Join-Path $logRoot "playwright-install.log")
        Assert-NativeSuccess "install Chromium"
    }

    $env:PLAYWRIGHT_BROWSERS_PATH = $browserRoot
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
    Assert-NativeSuccess "build full film"

    if (-not $SkipRender) {
        node (Join-Path $skillRoot "tools/export.mjs") $pieceRoot --workers 4 --share 2>&1 |
            Tee-Object -FilePath (Join-Path $logRoot "export.log")
        Assert-NativeSuccess "export full film"
    }

    $sourceVideo = Join-Path $pieceRoot "renders/final.mp4"
    if (-not (Test-Path -LiteralPath $sourceVideo)) { throw "rendered master missing: $sourceVideo" }
    $guideVideo = Join-Path $artifactRoot "ep01-full-film-guide-audio.mp4"
    $cleanVideo = Join-Path $artifactRoot "ep01-full-film-clean-master.mp4"
    $phoneVideo = Join-Path $artifactRoot "ep01-full-film-phone-360x640.mp4"
    Copy-Item -LiteralPath $sourceVideo -Destination $guideVideo -Force
    & $ffmpegPath -y -hide_banner -loglevel error -i $sourceVideo -c:v copy -an -movflags +faststart $cleanVideo
    Assert-NativeSuccess "create clean no-narration master"
    & $ffmpegPath -y -hide_banner -loglevel error -i $guideVideo -vf "scale=360:640" -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 96k -movflags +faststart $phoneVideo
    Assert-NativeSuccess "create phone preview"

    node (Join-Path $pieceRoot "src/subtitles.js") (Join-Path $artifactRoot "ep01-full-film-zh-CN.srt")
    Assert-NativeSuccess "write SRT"

    & $ffprobePath -v error -show_entries "format=duration,size,bit_rate:stream=index,codec_name,codec_type,width,height,r_frame_rate,nb_frames,sample_rate,channels" -of json $guideVideo |
        Set-Content -LiteralPath (Join-Path $artifactRoot "ffprobe-guide.json") -Encoding utf8NoBOM
    Assert-NativeSuccess "probe guide master"
    & $ffprobePath -v error -show_entries "format=duration,size,bit_rate:stream=index,codec_name,codec_type,width,height,r_frame_rate,nb_frames" -of json $cleanVideo |
        Set-Content -LiteralPath (Join-Path $artifactRoot "ffprobe-clean.json") -Encoding utf8NoBOM
    Assert-NativeSuccess "probe clean master"

    & $ffmpegPath -nostats -hide_banner -i $guideVideo -vf "blackdetect=d=0.08:pix_th=0.10,freezedetect=n=-45dB:d=0.75" -an -f null NUL 2>&1 |
        Tee-Object -FilePath (Join-Path $logRoot "frame-integrity.log")
    Assert-NativeSuccess "frame integrity scan"

    $sceneRanges = @(
        @{ Name = "01"; Start = 0; End = 10 },
        @{ Name = "02"; Start = 10; End = 22 },
        @{ Name = "03"; Start = 22; End = 32 },
        @{ Name = "04"; Start = 32; End = 41 },
        @{ Name = "05"; Start = 41; End = 66 },
        @{ Name = "06"; Start = 66; End = 78 },
        @{ Name = "07"; Start = 78; End = 99 },
        @{ Name = "08"; Start = 99; End = 111 }
    )
    foreach ($scene in $sceneRanges) {
        $frames = for ($second = $scene.Start; $second -lt $scene.End; $second += 0.5) { [int][Math]::Round($second * 24) }
        node (Join-Path $skillRoot "tools/tile.mjs") $pieceRoot (Join-Path $artifactRoot "contact-scene-$($scene.Name)-0.5s.png") @frames 2>&1 |
            Tee-Object -FilePath (Join-Path $logRoot "tile-scene-$($scene.Name).log")
        Assert-NativeSuccess "render scene $($scene.Name) contact sheet"
    }
    $poseFrames = @(192, 552, 570, 1848)
    node (Join-Path $skillRoot "tools/tile.mjs") $pieceRoot (Join-Path $artifactRoot "character-poses-P0-P3.png") @poseFrames 2>&1 |
        Tee-Object -FilePath (Join-Path $logRoot "tile-character-poses.log")
    Assert-NativeSuccess "render character pose evidence"
    $scaleFrames = 936..1680 | Where-Object { ($_ - 936) % 24 -eq 0 }
    node (Join-Path $skillRoot "tools/tile.mjs") $pieceRoot (Join-Path $artifactRoot "scale-journey-04-06-1s.png") @scaleFrames 2>&1 |
        Tee-Object -FilePath (Join-Path $logRoot "tile-scale-journey.log")
    Assert-NativeSuccess "render scale journey evidence"

    Push-Location $upstreamRoot
    try {
        node (Join-Path $skillRoot "tools/review.mjs") $pieceRoot 2>&1 |
            Tee-Object -FilePath (Join-Path $logRoot "review.log")
        Assert-NativeSuccess "upstream review"
    } finally {
        Pop-Location
    }
    foreach ($name in @("phone.jpg", "shot01-sheet.jpg", "shot02-sheet.jpg", "shot03-sheet.jpg", "shot04-sheet.jpg", "shot05-sheet.jpg", "shot06-sheet.jpg", "shot07-sheet.jpg", "shot08-sheet.jpg")) {
        $source = Join-Path $pieceRoot "review/$name"
        if (Test-Path -LiteralPath $source) { Copy-Item -LiteralPath $source -Destination (Join-Path $artifactRoot $name) -Force }
    }

    $fontFiles = @("C:/Windows/Fonts/simkai.ttf", "C:/Windows/Fonts/msyh.ttc") | Where-Object { Test-Path -LiteralPath $_ }
    if ($fontFiles.Count -eq 0) { throw "no approved Simplified Chinese font is installed" }
    $sourceCommit = (git rev-parse HEAD).Trim()
    Assert-NativeSuccess "read source commit"
    $environment = @(
        (git --version), (node --version), (npm --version), (pwsh --version),
        (& $ffmpegPath -version | Select-Object -First 1),
        (& $ffprobePath -version | Select-Object -First 1),
        "os=$([System.Environment]::OSVersion.VersionString)",
        "upstream_origin=$origin", "upstream_commit=$actualCommit", "upstream_clean=true",
        "source_commit=$sourceCommit", "playwright_browsers_path=$browserRoot"
    )
    foreach ($font in $fontFiles) {
        $environment += "font=$font sha256=$((Get-FileHash -Algorithm SHA256 -LiteralPath $font).Hash.ToLowerInvariant())"
    }
    $environment | Set-Content -LiteralPath (Join-Path $artifactRoot "environment.txt") -Encoding utf8NoBOM

    $guideHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $guideVideo).Hash.ToLowerInvariant()
    $cleanHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $cleanVideo).Hash.ToLowerInvariant()
    $delivery = @"
# EP01 full-film production delivery

- Source commit: ``$sourceCommit``
- Reviewed content baseline: ``content/ep01-story-rebuild-v2@b1d7dde6f591837d57e15af7a5866207992e2367``
- Upstream engine: ``cth9191/animate@$actualCommit``
- Guide-audio master: ``ep01-full-film-guide-audio.mp4``
- Guide-audio SHA-256: ``$guideHash``
- Clean no-narration master: ``ep01-full-film-clean-master.mp4``
- Clean-master SHA-256: ``$cleanHash``
- Format: 1080×1920, 24fps, 2664 frames, 111.000 seconds

## Audio and release boundary

The embedded audio is a sparse timing guide, not formal Mandarin narration. The package includes ``ep01-full-film-zh-CN.srt`` and a clean master for Jianying AI narration or the user's recording. Final A-dimension review, independent full-video review, independent engineering review, user release approval, merge, and publication are not claimed.
"@
    $delivery | Set-Content -LiteralPath (Join-Path $artifactRoot "DELIVERY.md") -Encoding utf8NoBOM

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

Write-Host "EP01 full film rendered at $artifactRoot"
