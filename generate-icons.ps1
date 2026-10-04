Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "public\logo.png"
if (-not (Test-Path $srcPath)) {
    Write-Error "Source logo not found at $srcPath"
    exit 1
}

$src = [System.Drawing.Image]::FromFile($srcPath)

$sizes = @(
    @{ Dir = "android\app\src\main\res\mipmap-mdpi"; Launcher = 48; Fg = 108 },
    @{ Dir = "android\app\src\main\res\mipmap-hdpi"; Launcher = 72; Fg = 162 },
    @{ Dir = "android\app\src\main\res\mipmap-xhdpi"; Launcher = 96; Fg = 216 },
    @{ Dir = "android\app\src\main\res\mipmap-xxhdpi"; Launcher = 144; Fg = 324 },
    @{ Dir = "android\app\src\main\res\mipmap-xxxhdpi"; Launcher = 192; Fg = 432 }
)

function Resize-Image($img, $w, $h, $destPath) {
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::FromArgb(11, 14, 20)) # Dark matching background
    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose()
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

foreach ($item in $sizes) {
    $dirPath = Join-Path $PSScriptRoot $item.Dir
    if (Test-Path $dirPath) {
        Resize-Image $src $item.Launcher $item.Launcher (Join-Path $dirPath "ic_launcher.png")
        Resize-Image $src $item.Launcher $item.Launcher (Join-Path $dirPath "ic_launcher_round.png")
        Resize-Image $src $item.Fg $item.Fg (Join-Path $dirPath "ic_launcher_foreground.png")
    }
}

$src.Dispose()
Write-Host "Success: All Pixel Shooters Android launcher icons created from logo.png!"
