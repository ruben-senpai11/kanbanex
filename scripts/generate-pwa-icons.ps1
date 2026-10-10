Add-Type -AssemblyName System.Drawing

$srcPath = "apps/web/public/images/kanbanex-k-emblem.png"
$iconsDir = "apps/web/public/icons"

if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null
}

$srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

foreach ($size in $sizes) {
    # 1. Standard transparent icon
    $destBmp = [System.Drawing.Bitmap]::new($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($srcBmp, 0, 0, $size, $size)
    $g.Dispose()

    $destPath = Join-Path $iconsDir "icon-${size}x${size}.png"
    $destBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Dispose()
    Write-Output "Generated $destPath"

    # 2. Maskable icon with safe-zone margin on solid brand dark background
    $maskBmp = [System.Drawing.Bitmap]::new($size, $size)
    $gm = [System.Drawing.Graphics]::FromImage($maskBmp)
    $gm.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gm.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gm.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $bgColor = [System.Drawing.ColorTranslator]::FromHtml('#0B0D11')
    $gm.Clear($bgColor)
    
    $pad = [int]($size * 0.12)
    $drawSize = $size - (2 * $pad)
    $gm.DrawImage($srcBmp, $pad, $pad, $drawSize, $drawSize)
    $gm.Dispose()

    $maskPath = Join-Path $iconsDir "icon-maskable-${size}x${size}.png"
    $maskBmp.Save($maskPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $maskBmp.Dispose()
    Write-Output "Generated $maskPath"
}

$srcBmp.Dispose()
Write-Output "PWA icons generation complete!"
