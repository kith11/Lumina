param(
  [string]$ProjectName
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
  throw "Node.js and npx are required."
}

npm run build

$vercelArgs = @("vercel", "--prod", "--yes")
if ($ProjectName) {
  $vercelArgs += @("--name", $ProjectName)
}

Write-Host "Deploying the Vite build to Vercel..."
npx @vercelArgs
