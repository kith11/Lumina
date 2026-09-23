param(
  [string]$RemoteUrl,
  [string]$Branch = "main",
  [string]$CommitMessage = "Build Lumina e-commerce MVP"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git is required. Install Git, then rerun this script."
}

if (-not (Test-Path ".git")) {
  git init | Out-Host
}

git branch -M $Branch
git add .
$staged = git diff --cached --name-only
if ($staged) {
  git commit -m $CommitMessage | Out-Host
} else {
  Write-Host "No new changes to commit."
}

$origin = git remote get-url origin 2>$null
if (-not $origin -and -not $RemoteUrl) {
  $RemoteUrl = Read-Host "Enter the GitHub repository URL (for example https://github.com/you/lumina-commerce.git)"
}

if ($RemoteUrl) {
  if ($origin) {
    git remote set-url origin $RemoteUrl
  } else {
    git remote add origin $RemoteUrl
  }
}

$finalOrigin = git remote get-url origin 2>$null
if (-not $finalOrigin) {
  throw "No GitHub remote is configured. Pass -RemoteUrl or add origin manually."
}

Write-Host "Pushing $Branch to $finalOrigin ..."
git push -u origin $Branch
Write-Host "GitHub push complete."
