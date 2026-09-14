# ðŸ“‹ Guia de InstalaÃ§Ã£o do Affinity MCP Server

Este guia foi elaborado para que qualquer pessoa possa baixar, instalar e utilizar o **Affinity MCP Server** no **Google Antigravity IDE**.

---

## ðŸ“¥ 1. Como Baixar os Arquivos

VocÃª pode escolher uma das duas opÃ§Ãµes:

### OpÃ§Ã£o A: Download Direto do Arquivo ZIP
Baixe o pacote pronto para uso atravÃ©s do link oficial:
ðŸ‘‰ **[Clique aqui para baixar o affinity-mcp-v1.0.0.zip](https://github.com/al3x-d3v357/affinitymcpantigravity/raw/main/releases/affinity-mcp-v1.0.0.zip)**

ApÃ³s baixar, extraia o arquivo ZIP em uma pasta da sua preferÃªncia no seu computador.

### OpÃ§Ã£o B: Clonar o RepositÃ³rio via Git
```bash
git clone https://github.com/al3x-d3v357/affinitymcpantigravity.git
cd arts3d/affinity-mcp
```

---

## âš¡ 2. InstalaÃ§Ã£o AutomÃ¡tica (Recomendada - 1 Clique)

### ðŸªŸ No Windows:

1. Abra a pasta onde vocÃª extraiu ou clonou o `affinity-mcp`.
2. Clique com o botÃ£o direito dentro da pasta e selecione **"Abrir no Terminal"** (PowerShell).
3. Execute o comando:
   ```powershell
   .\install.ps1
   ```
4. O instalador faz tudo de forma autÃ´noma:
   - Baixa e instala as dependÃªncias necessÃ¡rias via `npm`
   - Compila o cÃ³digo TypeScript para JavaScript na pasta `dist/`
   - Registra o servidor MCP diretamente no seu arquivo de configuraÃ§Ã£o do Antigravity (`%USERPROFILE%\.gemini\config\mcp_config.json`).

---

### ðŸŽ No macOS / Linux:

1. Abra o Terminal dentro da pasta `affinity-mcp`.
2. DÃª permissÃ£o e execute o script:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

---

## ðŸ› ï¸ 3. InstalaÃ§Ã£o Manual (Alternativa)

Caso queira configurar passo a passo:

1. **Instale as dependÃªncias e faÃ§a a compilaÃ§Ã£o:**
   ```bash
   npm install
   npm run build
   ```

2. **Abra o arquivo de configuraÃ§Ã£o MCP do Antigravity:**
   - **Windows:** `%USERPROFILE%\.gemini\config\mcp_config.json`
   - **macOS/Linux:** `~/.gemini/config/mcp_config.json`

3. **Insira a configuraÃ§Ã£o do servidor:**
   ```json
   {
     "mcpServers": {
       "affinity": {
         "command": "node",
         "args": [
           "CAMINHO_DA_SUA_PASTA/affinity-mcp/dist/index.js"
         ]
       }
     }
   }
   ```
   *(Substitua `CAMINHO_DA_SUA_PASTA` pelo local onde vocÃª descompactou os arquivos. No Windows, use barras duplas `\\`)*.

---

## ðŸš€ 4. Como Usar no Antigravity

ApÃ³s a instalaÃ§Ã£o, abra o Google Antigravity e converse com o agente:

* *"Abra o Affinity Designer e crie um novo documento A4."*
* *"Desenhe um retÃ¢ngulo estilizado no centro com cantos arredondados e cor #6366F1."*
* *"Adicione uma camada de texto com o tÃ­tulo 'Meu Projeto' e tire um screenshot."*
* *"Exporte o resultado em formato PNG."*

---

<div align="center">
  <sub>Desenvolvido por <b>Alex Sandro (@al3x-d3v357)</b> ðŸš€</sub>
</div>

