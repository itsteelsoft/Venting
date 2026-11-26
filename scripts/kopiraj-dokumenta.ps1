# Kopira dokumenta za Venting proizvode u public\dokumentacija
#
# 1) Cita spisak dokumenata iz public\data\products.json (pravi ga "npm run sync")
# 2) Pronalazi fajlove po nazivu u izvornom folderu (npr. P:\) i kopira ih
# 3) Pravi lib\dokumentacija-spisak.mjs - sajt prikazuje SAMO dokumenta sa tog spiska
# 4) Fajlove koji nisu pronadjeni upisuje u nedostaju-dokumenti.txt (sa sifrom i nazivom proizvoda)
#
# Pokretanje iz foldera projekta:
#   powershell -ExecutionPolicy Bypass -File scripts\kopiraj-dokumenta.ps1 -Izvor "P:\"

param(
  [string]$Izvor = 'P:\'
)

$ErrorActionPreference = 'Stop'
$root     = Split-Path -Parent $PSScriptRoot
$json     = Join-Path $root 'public\data\products.json'
$cilj     = Join-Path $root 'public\dokumentacija'
$spisak   = Join-Path $root 'lib\dokumentacija-spisak.mjs'
$izvestaj = Join-Path $root 'nedostaju-dokumenti.txt'

if (-not (Test-Path $json))  { throw "Nema $json - prvo pokreni: npm run sync" }
if (-not (Test-Path $Izvor)) { throw "Izvorni folder ne postoji: $Izvor" }
New-Item -ItemType Directory -Force -Path $cilj | Out-Null

# 1) Potrebni fajlovi i kojim proizvodima pripadaju
$data   = Get-Content $json -Raw -Encoding UTF8 | ConvertFrom-Json
$trazim = @{}   # naziv (mala slova) -> pravi naziv
$gde    = @{}   # naziv (mala slova) -> proizvodi
foreach ($p in $data.products) {
  foreach ($d in @($p.docs)) {
    if ($d -and $d.file) {
      $k = $d.file.ToLower()
      $trazim[$k] = $d.file
      if (-not $gde.ContainsKey($k)) { $gde[$k] = @() }
      $gde[$k] += "$($p.id) $($p.name)"
    }
  }
}
Write-Host "Potrebno dokumenata: $($trazim.Count)"

# 2) Pretraga izvornog foldera (moze potrajati na velikom disku)
$nadjeno = @{}
if ($trazim.Count -gt 0) {
  Write-Host "Pretrazujem $Izvor ..."
  Get-ChildItem -Path $Izvor -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
    $k = $_.Name.ToLower()
    if ($trazim.ContainsKey($k)) {
      # ako postoji vise fajlova istog naziva, uzima se najnoviji
      if (-not $nadjeno.ContainsKey($k) -or $_.LastWriteTime -gt $nadjeno[$k].LastWriteTime) {
        $nadjeno[$k] = $_
      }
    }
  }
}

# 3) Kopiranje
$kopirano = 0
$veliki = @()
foreach ($k in $nadjeno.Keys) {
  $f = $nadjeno[$k]
  Copy-Item -LiteralPath $f.FullName -Destination (Join-Path $cilj $trazim[$k]) -Force
  $kopirano++
  if ($f.Length -gt 90MB) { $veliki += "$($f.Name) ($([math]::Round($f.Length / 1MB)) MB)" }
}

# 4) Spisak fajlova koji postoje u public\dokumentacija (sajt prikazuje samo njih)
$postoje = @(Get-ChildItem $cilj -File | ForEach-Object { $_.Name } | Sort-Object)
$jsonList = ConvertTo-Json -InputObject $postoje -Compress
if (-not $jsonList -or $postoje.Count -eq 0) { $jsonList = '[]' }
$sadrzaj = "// Spisak fajlova koji postoje u public/dokumentacija.`r`n" +
           "// Fajl automatski pravi scripts/kopiraj-dokumenta.ps1 - ne menjaj ga rucno.`r`n" +
           "export const DOC_FILES = $jsonList`r`n"
[IO.File]::WriteAllText($spisak, $sadrzaj, (New-Object Text.UTF8Encoding $false))

# 5) Izvestaj o fajlovima koji nedostaju
$postojeSet = @{}
foreach ($n in $postoje) { $postojeSet[$n.ToLower()] = $true }
$redovi = @()
foreach ($k in ($trazim.Keys | Sort-Object)) {
  if (-not $postojeSet.ContainsKey($k)) {
    $redovi += "$($trazim[$k])"
    foreach ($pr in $gde[$k]) { $redovi += "    - $pr" }
  }
}
$redovi | Set-Content -Path $izvestaj -Encoding UTF8
$brojNedostaje = @($trazim.Keys | Where-Object { -not $postojeSet.ContainsKey($_) }).Count

$velicina = (Get-ChildItem $cilj -File | Measure-Object Length -Sum).Sum
Write-Host ''
Write-Host "Kopirano:   $kopirano"
Write-Host "Nedostaje:  $brojNedostaje  (spisak: nedostaju-dokumenti.txt)"
Write-Host "Na sajtu ce biti prikazano: $($postoje.Count) fajlova"
Write-Host "Ukupno u public\dokumentacija: $([math]::Round($velicina / 1MB)) MB"
if ($brojNedostaje -gt 0) {
  Write-Host ''
  Write-Host 'Dokumenti koji nedostaju (nisu prikazani na sajtu):'
  $redovi | ForEach-Object { Write-Host "  $_" }
}
if ($veliki.Count -gt 0) {
  Write-Host ''
  Write-Host 'PAZNJA - fajlovi veci od 90 MB (GitHub ne prima fajlove preko 100 MB):'
  $veliki | ForEach-Object { Write-Host "  $_" }
}