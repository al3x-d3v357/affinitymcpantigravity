# ðŸŽ¨ Affinity MCP Server para Google Antigravity

<p align="center">
  <img src="https://img.shields.io/badge/MCP_Tools-36_Ferramentas-6366f1?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Serif-Affinity_Suite_2-00b4d8?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Antigravity-Compatible-00c853?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Platform-Windows_|_macOS-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

Servidor oficial do **Model Context Protocol (MCP)** para controle, automaÃ§Ã£o e geraÃ§Ã£o de design na suÃ­te **Serif Affinity (Designer, Photo e Publisher)** integrado diretamente com o **Google Antigravity IDE**.

---

## ðŸ“¥ Como Baixar (Download)

VocÃª pode obter o projeto de duas formas:

### 1. Download do Pacote ZIP (Release)
Baixe o arquivo pronto com o cÃ³digo compilado e instaladores:
ðŸ‘‰ **[Download Affinity MCP (.zip)](https://github.com/al3x-d3v357/affinitymcpantigravity/raw/main/releases/affinity-mcp-v1.0.0.zip)**

### 2. Clonar via Git
```bash
git clone https://github.com/al3x-d3v357/affinitymcpantigravity.git
cd arts3d/affinity-mcp
```

---

## âš¡ Como Instalar no Google Antigravity

### ðŸªŸ No Windows (InstalaÃ§Ã£o em 1 Clique)

1. Extraia o `.zip` ou entre na pasta clonada `affinity-mcp`.
2. Abra o terminal (PowerShell) dentro da pasta e execute:
   ```powershell
   .\install.ps1
   ```
*O instalador irÃ¡ baixar as dependÃªncias, compilar o cÃ³digo e registrar automaticamente o servidor no arquivo `%USERPROFILE%\.gemini\config\mcp_config.json` do seu Antigravity.*

---

### ðŸŽ No macOS / Linux (InstalaÃ§Ã£o em 1 Clique)

1. Abra o Terminal dentro da pasta do projeto e execute:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

---

## ðŸ› ï¸ ConfiguraÃ§Ã£o Manual (Opcional)

Se preferir configurar manualmente:

1. **Instale as dependÃªncias e compile:**
   ```bash
   npm install
   npm run build
   ```

2. **Abra o arquivo de configuraÃ§Ã£o de MCPs do Antigravity:**
   - **Windows:** `%USERPROFILE%\.gemini\config\mcp_config.json`
   - **macOS/Linux:** `~/.gemini/config/mcp_config.json`

3. **Adicione a entrada `affinity` dentro de `mcpServers`:**
   ```json
   {
     "mcpServers": {
       "affinity": {
         "command": "node",
         "args": [
           "/caminho/completo/para/affinity-mcp/dist/index.js"
         ]
       }
     }
   }
   ```
   *(No Windows, utilize barras invertidas duplas `\\`, ex: `"C:\\meus-projetos\\affinity-mcp\\dist\\index.js"`)*.

---

## ðŸ› ï¸ Lista Completa das 36 Ferramentas MCP

### ðŸ“± Ciclo de Vida e Arquivos
1. `affinity_status`: Verifica se o Affinity estÃ¡ em execuÃ§Ã£o e lista documentos abertos.
2. `affinity_launch`: Inicia o Affinity Designer, Photo ou Publisher.
3. `affinity_open_file`: Abre arquivos (`.afdesign`, `.afphoto`, `.psd`, `.svg`, etc.).
4. `affinity_new_document`: Cria novos documentos a partir de predefiniÃ§Ãµes.
5. `affinity_save`: Salva o projeto (`Ctrl+S` / `Cmd+S`) ou Salva Como.
6. `affinity_export`: Exporta em formatos (`PNG`, `JPG`, `SVG`, `PDF`, `WEBP`, etc.).
7. `affinity_close_document`: Fecha o documento ativo.

### ðŸ“ CriaÃ§Ã£o, Vetores & Design
8. `affinity_create_shape`: Cria formas geomÃ©tricas paramÃ©tricas (retÃ¢ngulos, cantos arredondados, elipses, estrelas, polÃ­gonos).
9. `affinity_add_text_frame`: Cria caixas de texto estilizadas com fonte, tamanho, alinhamento e cor.
10. `affinity_set_color`: Define a cor de preenchimento (*fill*) ou contorno (*stroke*) via HEX ou RGB.
11. `affinity_set_stroke`: Configura espessura, estilo (sÃ³lido, tracejado) e alinhamento do traÃ§o.
12. `affinity_transform_object`: Redimensiona, posiciona e rotaciona objetos selecionados por coordenadas.
13. `affinity_align_distribute`: Alinha e distribui objetos (esquerda, centro, direita, topo, espaÃ§amento horizontal/vertical).
14. `affinity_boolean_operation`: OperaÃ§Ãµes booleanas vetoriais (Unir/Add, Subtrair, Intersectar, XOR, Dividir).
15. `affinity_convert_to_curves`: Converte formas ou textos em curvas vetoriais editÃ¡veis por nÃ³s.
16. `affinity_group_layers`: Agrupa, desengrupa, bloqueia, desbloqueia, oculta ou exibe camadas.
17. `affinity_layer_opacity_blend`: Ajusta a opacidade (0-100%) e modo de mesclagem da camada (Multiply, Screen, Overlay, etc.).
18. `affinity_apply_fx`: Aplica efeitos visuais de camada (Desfoque Gaussiano FX, Sombra Projetada, Brilho, 3D, Contorno).
19. `affinity_history_snapshot`: Cria ou restaura snapshots no painel de HistÃ³rico do Affinity.
20. `affinity_batch_export_slices`: Exporta em lote pranchetas/fatias em mÃºltiplas escalas (@1x, @2x, @3x).

### ðŸŽ¨ EdiÃ§Ã£o, Menus & Visual
21. `affinity_select_tool`: Seleciona ferramentas da barra lateral (retÃ¢ngulo, caneta, nÃ³, texto, pincel, borracha, zoom, etc.).
22. `affinity_mouse_action`: Desenha e clica na tela por coordenadas absolutas.
23. `affinity_type_text`: DigitaÃ§Ã£o de texto direto.
24. `affinity_click_menu`: Aciona itens da barra de menus por caminho hierÃ¡rquico.
25. `affinity_get_menus`: Lista itens disponÃ­veis em menus principais.
26. `affinity_get_submenu`: Lista submenus especÃ­ficos.
27. `affinity_get_ui`: Inspeciona elementos de interface da janela ativa.
28. `affinity_click_ui`: Clica em botÃµes e caixas de diÃ¡logo do Affinity.
29. `affinity_keystroke`: Envia atalhos de teclado customizados.
30. `affinity_key_code`: Envia cÃ³digos de tecla do sistema (Escape, Enter, Tab).
31. `affinity_document_ops`: OperaÃ§Ãµes de documento (achatar, espelhar, rotacionar, recortar tela).
32. `affinity_add_layer`: Cria camadas de pixel, ajuste, mÃ¡scara ou preenchimento.
33. `affinity_undo_redo`: Desfaz e refaz aÃ§Ãµes.
34. `affinity_filters`: Lista e aplica filtros de imagem.
35. `affinity_run_macro`: Executa macros `.afmacro`.
36. `affinity_screenshot`: Captura screenshots em tempo real para o Antigravity validar as criaÃ§Ãµes visuais.

---

## ðŸ’¡ Exemplos de Prompts no Antigravity

- *"Abra o Affinity Designer e crie um novo documento A4."*
- *"Crie uma forma retangular no centro da prancheta com cantos arredondados, cor #1E1E2E e contorno azul."*
- *"Adicione um tÃ­tulo estilizado 'Design com Antigravity' e tire um screenshot para me mostrar."*
- *"Exporte o documento em PNG na pasta de assets."*

---

<div align="center">
  <sub>Desenvolvido por <b>Alex Sandro (@al3x-d3v357)</b> para o ecossistema Google Antigravity ðŸš€</sub>
</div>

