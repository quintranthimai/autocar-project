$files = Get-ChildItem -Path "src" -Recurse -Include "*.vue","*.js"
foreach ($f in $files) {
    $content = Get-Content -Path $f.FullName -Raw
    if ($content -match "http://localhost:8000" -or $content -match "http://127.0.0.1:8000") {
        $content = $content -replace "http://localhost:8000", "https://autocar-citx.onrender.com"
        $content = $content -replace "http://127.0.0.1:8000", "https://autocar-citx.onrender.com"
        Set-Content -Path $f.FullName -Value $content -NoNewline
    }
}
