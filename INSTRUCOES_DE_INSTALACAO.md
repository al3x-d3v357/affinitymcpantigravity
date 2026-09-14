# ðY“‹ Guia de InstalaA§A£o do Affinity MCP Server

Este guia foi elaborado para que qualquer pessoa possa baixar, instalar e utilizar o **Affinity MCP Server** no **Google Antigravity IDE**.

---

## ðY“¥ 1. Como Baixar os Arquivos

VocAª pode escolher uma das duas opA§Aµes:

### OpA§A£o A: Download Direto do Arquivo ZIP
Baixe o pacote pronto para uso atravA©s do link oficial:
ðY‘‰ **[Clique aqui para baixar o affinity-mcp-v1.0.0.zip](https://github.com/al3x-d3v357/affinitymcpantigravity/raw/main/releases/affinity-mcp-v1.0.0.zip)**

ApA³s baixar, extraia o arquivo ZIP em uma pasta da sua preferAªncia no seu computador.

### OpA§A£o B: Clonar o RepositA³rio via Git
```bash
git clone https://github.com/al3x-d3v357/affinitymcpantigravity.git
cd arts3d/affinity-mcp
```

---

## as¡ 2. InstalaA§A£o AutomA¡tica (Recomendada - 1 Clique)

### ðYªY No Windows:

1. Abra a pasta onde vocAª extraiu ou clonou o `affinity-mcp`.
2. Clique com o botA£o direito dentro da pasta e selecione **"Abrir no Terminal"** (PowerShell).
3. Execute o comando:
   ```powershell
   .\install.ps1
   ```
4. O instalador faz tudo de forma autA´noma:
   - Baixa e instala as dependAªncias necessA¡rias via `npm`
   - Compila o cA³digo TypeScript para JavaScript na pasta `dist/`
   - Registra o servidor MCP diretamente no seu arquivo de configuraA§A£o do Antigravity (`%USERPROFILE%\.gemini\config\mcp_config.json`).

---

### ðYZ No macOS / Linux:

1. Abra o Terminal dentro da pasta `affinity-mcp`.
2. DAª permissA£o e execute o script:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

---

## ðY› i¸ 3. InstalaA§A£o Manual (Alternativa)

Caso queira configurar passo a passo:

1. **Instale as dependAªncias e faA§a a compilaA§A£o:**
   ```bash
   npm install
   npm run build
   ```

2. **Abra o arquivo de configuraA§A£o MCP do Antigravity:**
   - **Windows:** `%USERPROFILE%\.gemini\config\mcp_config.json`
   - **macOS/Linux:** `~/.gemini/config/mcp_config.json`

3. **Insira a configuraA§A£o do servidor:**
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
   *(Substitua `CAMINHO_DA_SUA_PASTA` pelo local onde vocAª descompactou os arquivos. No Windows, use barras duplas `\\`)*.

---

## ðYs€ 4. Como Usar no Antigravity

ApA³s a instalaA§A£o, abra o Google Antigravity e converse com o agente:

* *"Abra o Affinity Designer e crie um novo documento A4."*
* *"Desenhe um retA¢ngulo estilizado no centro com cantos arredondados e cor #6366F1."*
* *"Adicione uma camada de texto com o tA­tulo 'Meu Projeto' e tire um screenshot."*
* *"Exporte o resultado em formato PNG."*

---

<div align="center">
  <sub>Desenvolvido por <b>Alex Sandro (@al3x-d3v357)</b> ðYs€</sub>
</div>

