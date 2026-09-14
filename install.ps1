# Automated Installer for Affinity MCP Server in Antigravity (Windows)
$ErrorActionPreference = "Stop"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "🚀 Instalador do Affinity MCP Server para Antigravity" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$mcpConfigPath = "$HOME\.gemini\config\mcp_config.json"

# 1. Install Node.js dependencies and build
Write-Host "`n[1/3] Instalando dependências e compilando o servidor MCP..." -ForegroundColor Yellow
Set-Location $scriptDir
npm install
npm run build

# 2. Configure Antigravity global mcp_config.json
Write-Host "`n[2/3] Registrando o servidor MCP no Antigravity ($mcpConfigPath)..." -ForegroundColor Yellow

$serverDistPath = (Join-Path $scriptDir "dist\index.js").Replace("\", "\\")

if (Test-Path $mcpConfigPath) {
    $config = Get-Content $mcpConfigPath -Raw | ConvertFrom-Json
    if (-not $config.mcpServers) {
        $config | Add-Member -MemberType NoteProperty -Name "mcpServers" -Value ([PSCustomObject]@{})
    }
    
    $affinityEntry = [PSCustomObject]@{
        command = "node"
        args = @((Join-Path $scriptDir "dist\index.js"))
    }
    
    $config.mcpServers | Add-Member -MemberType NoteProperty -Name "affinity" -Value $affinityEntry -Force
    $config | ConvertTo-Json -Depth 10 | Set-Content $mcpConfigPath -Encoding UTF8
    Write-Host "✅ Servidor 'affinity' adicionado com sucesso em mcp_config.json!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Arquivo mcp_config.json não encontrado. Criando novo..." -ForegroundColor Yellow
    $newConfig = @{
        mcpServers = @{
            affinity = @{
                command = "node"
                args = @((Join-Path $scriptDir "dist\index.js"))
            }
        }
    }
    $newConfig | ConvertTo-Json -Depth 10 | Set-Content $mcpConfigPath -Encoding UTF8
}

# 3. Create JSON Schemas in Antigravity MCP directory
$antigravityMcpDir = "$HOME\.gemini\antigravity-ide\mcp\affinity"
if (-not (Test-Path $antigravityMcpDir)) {
    New-Item -ItemType Directory -Path $antigravityMcpDir -Force | Out-Null
}

Write-Host "`n[3/3] Instalação concluída com sucesso! 🎉" -ForegroundColor Green
Write-Host "Agora você pode usar comandos e automações do Affinity Designer / Photo / Publisher diretamente no Antigravity!" -ForegroundColor Cyan
