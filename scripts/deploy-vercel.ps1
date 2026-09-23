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
  $normalizedName = $ProjectName.Trim().ToLowerInvariant()
  $normalizedName = $normalizedName -replace '[^a-z0-9._-]+', '-'
  $normalizedName = $normalizedName -replace '-{3,}', '--'
  $normalizedName = $normalizedName -replace '^[._-]+|[._-]+$', ''
  if (-not $normalizedName) {
    throw "ProjectName must contain at least one letter or number."
  }
  Write-Host "Using Vercel project name: $normalizedName"
  $vercelArgs += @("--name", $normalizedName)
}

Write-Host "Deploying the Vite build to Vercel..."
npx @vercelArgs
