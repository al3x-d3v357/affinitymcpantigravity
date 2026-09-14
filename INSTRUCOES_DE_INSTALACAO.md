# 📋 Guia de Instalação do Affinity MCP Server

Este guia foi elaborado para que qualquer pessoa possa baixar, instalar e utilizar o **Affinity MCP Server** no **Google Antigravity IDE**.

---

## 📥 1. Como Baixar os Arquivos

Você pode escolher uma das duas opções:

### Opção A: Download Direto do Arquivo ZIP
Baixe o pacote pronto para uso através do link oficial:
👉 **[Clique aqui para baixar o affinity-mcp-v1.0.0.zip](https://github.com/al3x-d3v357/arts3d/raw/main/releases/affinity-mcp-v1.0.0.zip)**

Após baixar, extraia o arquivo ZIP em uma pasta da sua preferência no seu computador.

### Opção B: Clonar o Repositório via Git
```bash
git clone https://github.com/al3x-d3v357/arts3d.git
cd arts3d/affinity-mcp
```

---

## ⚡ 2. Instalação Automática (Recomendada - 1 Clique)

### 🪟 No Windows:

1. Abra a pasta onde você extraiu ou clonou o `affinity-mcp`.
2. Clique com o botão direito dentro da pasta e selecione **"Abrir no Terminal"** (PowerShell).
3. Execute o comando:
   ```powershell
   .\install.ps1
   ```
4. O instalador faz tudo de forma autônoma:
   - Baixa e instala as dependências necessárias via `npm`
   - Compila o código TypeScript para JavaScript na pasta `dist/`
   - Registra o servidor MCP diretamente no seu arquivo de configuração do Antigravity (`%USERPROFILE%\.gemini\config\mcp_config.json`).

---

### 🍎 No macOS / Linux:

1. Abra o Terminal dentro da pasta `affinity-mcp`.
2. Dê permissão e execute o script:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

---

## 🛠️ 3. Instalação Manual (Alternativa)

Caso queira configurar passo a passo:

1. **Instale as dependências e faça a compilação:**
   ```bash
   npm install
   npm run build
   ```

2. **Abra o arquivo de configuração MCP do Antigravity:**
   - **Windows:** `%USERPROFILE%\.gemini\config\mcp_config.json`
   - **macOS/Linux:** `~/.gemini/config/mcp_config.json`

3. **Insira a configuração do servidor:**
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
   *(Substitua `CAMINHO_DA_SUA_PASTA` pelo local onde você descompactou os arquivos. No Windows, use barras duplas `\\`)*.

---

## 🚀 4. Como Usar no Antigravity

Após a instalação, abra o Google Antigravity e converse com o agente:

* *"Abra o Affinity Designer e crie um novo documento A4."*
* *"Desenhe um retângulo estilizado no centro com cantos arredondados e cor #6366F1."*
* *"Adicione uma camada de texto com o título 'Meu Projeto' e tire um screenshot."*
* *"Exporte o resultado em formato PNG."*

---

<div align="center">
  <sub>Desenvolvido por <b>Alex Sandro (@al3x-d3v357)</b> 🚀</sub>
</div>
