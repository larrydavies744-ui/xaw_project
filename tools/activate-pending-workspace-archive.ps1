$ErrorActionPreference = 'Stop'
$root = 'D:\REPAIR SUITE WINDOWS'
$resourceDir = Join-Path $root 'Xpressive Autoworks Customer App\resources'
$archive = Join-Path $resourceDir 'app.asar'
$pending = Join-Path $resourceDir 'app.asar.workspace-editors-next'
$log = Join-Path $root 'tools\pending-archive-activation.log'

function Write-Status([string]$Message) {
  Add-Content -LiteralPath $log -Value "$(Get-Date -Format o) $Message"
}

try {
  Write-Status 'Waiting for all Repair Suite windows to close before replacing the locked archive.'
  while (Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq 'Xpressive Autoworks Engineering Repair Suite' }) {
    Start-Sleep -Seconds 5
  }
  if (-not (Test-Path -LiteralPath $pending)) { throw "Staged archive is missing: $pending" }
  $backup = Join-Path $resourceDir ("app.asar.backup-multiscreen-{0}.asar" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
  [System.IO.File]::Replace($pending, $archive, $backup, $true)
  Write-Status "Activated the staged archive. Backup: $backup"
} catch {
  Write-Status "Activation failed; staged archive was left in place. $($_.Exception.Message)"
}
