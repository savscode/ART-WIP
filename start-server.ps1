# Liten lokal webbserver för att kunna öppna ART utan att installera något.
# Startas via "Starta ART.bat". Stäng fönstret för att stänga av servern.
param([switch]$NoBrowser)
$root = $PSScriptRoot
$types = @{
    '.html' = 'text/html; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'
    '.css' = 'text/css; charset=utf-8'; '.json' = 'application/json'
    '.svg' = 'image/svg+xml'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'; '.png' = 'image/png'
    '.mp4' = 'video/mp4'; '.mov' = 'video/quicktime'
    '.otf' = 'font/otf'; '.woff' = 'font/woff'; '.woff2' = 'font/woff2'
}

# Hitta en ledig port
$listener = $null
foreach ($port in 8765..8785) {
    try {
        $l = New-Object System.Net.HttpListener
        $l.Prefixes.Add("http://localhost:$port/")
        $l.Start()
        $listener = $l
        break
    } catch { }
}
if (-not $listener) {
    Write-Host 'Kunde inte starta servern (ingen ledig port).' -ForegroundColor Red
    Read-Host 'Tryck Enter för att stänga'
    exit 1
}

$url = "http://localhost:$port/"
Write-Host ''
Write-Host "  ART körs nu på $url" -ForegroundColor Green
Write-Host '  Webbläsaren öppnas automatiskt.'
Write-Host '  Stäng det här fönstret när du är klar.'
Write-Host ''
if (-not $NoBrowser) { Start-Process $url }

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    try {
        $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart('/'))
        if ($path -eq '') { $path = 'index.html' }
        $file = [IO.Path]::GetFullPath((Join-Path $root $path))
        if ($file.StartsWith($root) -and (Test-Path -LiteralPath $file -PathType Leaf)) {
            $bytes = [IO.File]::ReadAllBytes($file)
            $ext = [IO.Path]::GetExtension($file).ToLower()
            if ($types.ContainsKey($ext)) { $ctx.Response.ContentType = $types[$ext] }
            $ctx.Response.ContentLength64 = $bytes.Length
            $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $ctx.Response.StatusCode = 404
        }
    } catch { } finally { $ctx.Response.Close() }
}
