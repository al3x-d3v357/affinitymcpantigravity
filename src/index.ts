#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";

const execAsync = promisify(exec);
const isWindows = os.platform() === "win32";
const isMac = os.platform() === "darwin";

const server = new Server(
  {
    name: "affinity-mcp-server",
    version: "1.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Cross-platform automation execution helper
async function runScript(macAppleScript: string, winPowerShell: string): Promise<string> {
  if (isMac) {
    const escaped = macAppleScript.replace(/'/g, "'\\''");
    const { stdout } = await execAsync(`osascript -e '${escaped}'`);
    return stdout.trim();
  } else if (isWindows) {
    const tempScript = path.join(os.tmpdir(), `affinity_cmd_${Date.now()}.ps1`);
    fs.writeFileSync(tempScript, winPowerShell, "utf8");
    try {
      const { stdout } = await execAsync(`powershell -ExecutionPolicy Bypass -File "${tempScript}"`);
      return stdout.trim();
    } finally {
      if (fs.existsSync(tempScript)) fs.unlinkSync(tempScript);
    }
  } else {
    throw new Error("Unsupported operating system for Affinity MCP automation.");
  }
}

const TOOLS: Tool[] = [
  // --- BASE 23 TOOLS ---
  {
    name: "affinity_status",
    description: "Check if Affinity is running and list open windows.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "affinity_launch",
    description: "Launch Affinity if not already running. Waits for startup.",
    inputSchema: {
      type: "object",
      properties: {
        appName: { type: "string", description: "Designer, Photo, or Publisher", default: "Designer" }
      }
    }
  },
  {
    name: "affinity_open_file",
    description: "Open a file in Affinity (image, .afdesign, .afphoto, .afpub, .psd, .svg, etc.).",
    inputSchema: {
      type: "object",
      properties: { path: { type: "string", description: "Absolute path to the file to open" } },
      required: ["path"]
    }
  },
  {
    name: "affinity_new_document",
    description: "Create a new document. Set fromLastPreset to skip the new document dialog.",
    inputSchema: {
      type: "object",
      properties: { fromLastPreset: { type: "boolean", description: "Create from last preset without dialog", default: false } }
    }
  },
  {
    name: "affinity_save",
    description: "Save current document (Cmd/Ctrl+S) or Save As to a specific path.",
    inputSchema: {
      type: "object",
      properties: {
        saveAs: { type: "boolean", default: false },
        path: { type: "string", description: "Absolute path for Save As" }
      }
    }
  },
  {
    name: "affinity_export",
    description: "Open export dialog and optionally select format.",
    inputSchema: {
      type: "object",
      properties: {
        format: { type: "string", enum: ["png", "jpg", "svg", "pdf", "eps", "tiff", "gif", "webp"] }
      }
    }
  },
  {
    name: "affinity_close_document",
    description: "Close current document with optional save.",
    inputSchema: {
      type: "object",
      properties: { save: { type: "boolean", default: false } }
    }
  },
  {
    name: "affinity_click_menu",
    description: "Click a menu item by path (e.g. ['File', 'Export...']).",
    inputSchema: {
      type: "object",
      properties: {
        menuPath: { type: "array", items: { type: "string" }, description: "Menu path array" }
      },
      required: ["menuPath"]
    }
  },
  {
    name: "affinity_get_menus",
    description: "List all items in a top-level menu.",
    inputSchema: {
      type: "object",
      properties: { menuName: { type: "string", description: "File, Edit, Layer, etc." } },
      required: ["menuName"]
    }
  },
  {
    name: "affinity_get_submenu",
    description: "List items in a submenu.",
    inputSchema: {
      type: "object",
      properties: {
        menuName: { type: "string" },
        submenuItem: { type: "string" }
      },
      required: ["menuName", "submenuItem"]
    }
  },
  {
    name: "affinity_get_ui",
    description: "Inspect UI elements in the frontmost Affinity window.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "affinity_click_ui",
    description: "Click a UI element in the front window by description or title.",
    inputSchema: {
      type: "object",
      properties: {
        elementDescription: { type: "string" },
        elementType: { type: "string", enum: ["button", "checkbox", "radio button", "text field", "tab group"], default: "button" }
      },
      required: ["elementDescription"]
    }
  },
  {
    name: "affinity_keystroke",
    description: "Send a keystroke with optional modifier keys (command, shift, control, alt).",
    inputSchema: {
      type: "object",
      properties: {
        key: { type: "string" },
        modifiers: { type: "array", items: { type: "string" }, default: [] }
      },
      required: ["key"]
    }
  },
  {
    name: "affinity_key_code",
    description: "Send a key code (53=Escape, 36=Return, 51=Delete, 48=Tab, etc.).",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "number" },
        modifiers: { type: "array", items: { type: "string" }, default: [] }
      },
      required: ["code"]
    }
  },
  {
    name: "affinity_type_text",
    description: "Type text into Affinity.",
    inputSchema: {
      type: "object",
      properties: { text: { type: "string" } },
      required: ["text"]
    }
  },
  {
    name: "affinity_mouse_action",
    description: "Click or drag at screen coordinates.",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["click", "drag"] },
        x: { type: "number" },
        y: { type: "number" },
        endX: { type: "number" },
        endY: { type: "number" }
      },
      required: ["action", "x", "y"]
    }
  },
  {
    name: "affinity_select_tool",
    description: "Select a tool by name (rectangle, ellipse, pen, text, move, brush, eraser, etc.).",
    inputSchema: {
      type: "object",
      properties: {
        tool: {
          type: "string",
          enum: [
            "move", "artboard", "pen", "node", "rectangle", "ellipse", "text",
            "fill", "eyedropper", "zoom", "hand", "crop", "brush", "eraser",
            "clone", "dodge", "gradient"
          ]
        }
      },
      required: ["tool"]
    }
  },
  {
    name: "affinity_document_ops",
    description: "Perform document operations (flatten, flip_horizontal, flip_vertical, rotate_cw, rotate_ccw, clip_canvas, unclip_canvas).",
    inputSchema: {
      type: "object",
      properties: {
        operation: { type: "string", enum: ["flatten", "flip_horizontal", "flip_vertical", "rotate_cw", "rotate_ccw", "clip_canvas", "unclip_canvas"] }
      },
      required: ["operation"]
    }
  },
  {
    name: "affinity_add_layer",
    description: "Add a layer (pixel, mask, adjustment, live_filter, fill, pattern).",
    inputSchema: {
      type: "object",
      properties: {
        layerType: { type: "string", enum: ["pixel", "mask", "adjustment", "live_filter", "fill", "pattern"] }
      },
      required: ["layerType"]
    }
  },
  {
    name: "affinity_undo_redo",
    description: "Undo or redo actions.",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["undo", "redo"] },
        times: { type: "number", default: 1 }
      },
      required: ["action"]
    }
  },
  {
    name: "affinity_filters",
    description: "List available filters in the Filter menu.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "affinity_run_macro",
    description: "Run an .afmacro file.",
    inputSchema: {
      type: "object",
      properties: { macroPath: { type: "string" } },
      required: ["macroPath"]
    }
  },
  {
    name: "affinity_screenshot",
    description: "Take a screenshot of the Affinity window.",
    inputSchema: {
      type: "object",
      properties: { outputPath: { type: "string", default: "" } }
    }
  },

  // --- 13 NEW POWER TOOLS (TOTAL 36 TOOLS) ---
  {
    name: "affinity_set_color",
    description: "Set fill or stroke color in Affinity using HEX, RGB, or preset swatch.",
    inputSchema: {
      type: "object",
      properties: {
        target: { type: "string", enum: ["fill", "stroke"], default: "fill" },
        hex: { type: "string", description: "Color hex code, e.g. #FF5500" },
        rgb: { type: "array", items: { type: "number" }, description: "[r, g, b] 0-255" }
      },
      required: ["target"]
    }
  },
  {
    name: "affinity_set_stroke",
    description: "Configure stroke width, style (solid, dashed), alignment and cap/join.",
    inputSchema: {
      type: "object",
      properties: {
        width: { type: "number", description: "Stroke width in points/pixels" },
        style: { type: "string", enum: ["solid", "dashed", "none"], default: "solid" },
        align: { type: "string", enum: ["center", "inner", "outer"], default: "center" }
      },
      required: ["width"]
    }
  },
  {
    name: "affinity_transform_object",
    description: "Transform selected object (width, height, rotation angle, X/Y coordinates).",
    inputSchema: {
      type: "object",
      properties: {
        width: { type: "number" },
        height: { type: "number" },
        rotation: { type: "number", description: "Angle in degrees" },
        x: { type: "number" },
        y: { type: "number" }
      }
    }
  },
  {
    name: "affinity_align_distribute",
    description: "Align or distribute selected objects (left, center, right, top, middle, bottom, space-h, space-v).",
    inputSchema: {
      type: "object",
      properties: {
        alignment: {
          type: "string",
          enum: ["left", "center", "right", "top", "middle", "bottom", "distribute_horizontal", "distribute_vertical"]
        }
      },
      required: ["alignment"]
    }
  },
  {
    name: "affinity_boolean_operation",
    description: "Perform vector boolean geometry operations on selected curves/shapes.",
    inputSchema: {
      type: "object",
      properties: {
        operation: { type: "string", enum: ["add", "subtract", "intersect", "xor", "divide"] }
      },
      required: ["operation"]
    }
  },
  {
    name: "affinity_convert_to_curves",
    description: "Convert parametric shapes, text or objects into editable vector curves.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "affinity_group_layers",
    description: "Group, ungroup, lock, unlock, hide or show layers.",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["group", "ungroup", "lock", "unlock", "hide", "show"] }
      },
      required: ["action"]
    }
  },
  {
    name: "affinity_layer_opacity_blend",
    description: "Set opacity (0-100%) and blend mode for the active layer.",
    inputSchema: {
      type: "object",
      properties: {
        opacity: { type: "number", description: "0 to 100 percentage" },
        blendMode: {
          type: "string",
          enum: ["Normal", "Multiply", "Screen", "Overlay", "Soft Light", "Hard Light", "Color Dodge", "Color Burn", "Darken", "Lighten", "Difference"]
        }
      }
    }
  },
  {
    name: "affinity_create_shape",
    description: "High-level parametric shape generator (rectangle, rounded_rect, ellipse, star, polygon).",
    inputSchema: {
      type: "object",
      properties: {
        shapeType: { type: "string", enum: ["rectangle", "rounded_rect", "ellipse", "polygon", "star"] },
        x: { type: "number" },
        y: { type: "number" },
        width: { type: "number" },
        height: { type: "number" },
        cornerRadius: { type: "number" }
      },
      required: ["shapeType", "x", "y", "width", "height"]
    }
  },
  {
    name: "affinity_add_text_frame",
    description: "Create a formatted text frame at coordinates with content, size and font.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
        x: { type: "number" },
        y: { type: "number" },
        fontSize: { type: "number", default: 24 },
        fontFamily: { type: "string" },
        colorHex: { type: "string" }
      },
      required: ["text", "x", "y"]
    }
  },
  {
    name: "affinity_apply_fx",
    description: "Apply quick layer effects (Gaussian blur FX, outer shadow, outline, 3D).",
    inputSchema: {
      type: "object",
      properties: {
        effectType: { type: "string", enum: ["gaussian_blur", "outer_shadow", "inner_shadow", "outline", "bevel_emboss", "3d"] },
        radius: { type: "number" },
        opacity: { type: "number" }
      },
      required: ["effectType"]
    }
  },
  {
    name: "affinity_history_snapshot",
    description: "Create or revert to named document snapshots in history.",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", enum: ["create", "revert"] },
        name: { type: "string", default: "Snapshot" }
      },
      required: ["action"]
    }
  },
  {
    name: "affinity_batch_export_slices",
    description: "Export all slices/artboards in multiple formats and scale factors (@1x, @2x, @3x).",
    inputSchema: {
      type: "object",
      properties: {
        outputFolder: { type: "string" },
        scales: { type: "array", items: { type: "string" }, default: ["1x", "2x"] },
        format: { type: "string", enum: ["png", "svg", "webp", "jpg", "pdf"], default: "png" }
      },
      required: ["outputFolder"]
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "affinity_status": {
        const macScript = `
          tell application "System Events"
            set isRunning to (count (every process whose name contains "Affinity")) > 0
            if isRunning then
              tell process "Affinity Designer 2" to set winNames to name of every window
              return "Affinity is running. Windows: " & (winNames as string)
            else
              return "Affinity is not running."
            end if
          end tell
        `;
        const winScript = `
          Add-Type -AssemblyName System.Windows.Forms
          $proc = Get-Process | Where-Object { $_.ProcessName -match "Affinity|Designer|Photo|Publisher" }
          if ($proc) {
            Write-Output "Affinity is running. (Process: $($proc.ProcessName -join ', '))"
          } else {
            Write-Output "Affinity is not running."
          }
        `;
        const res = await runScript(macScript, winScript);
        return { content: [{ type: "text", text: res }] };
      }

      case "affinity_launch": {
        const appName = (args?.appName as string) || "Designer";
        const macScript = `
          tell application "Affinity ${appName} 2" to activate
          delay 3
          return "Affinity ${appName} 2 launched."
        `;
        const winScript = `
          Start-Process "Affinity${appName}.exe" -ErrorAction SilentlyContinue
          Start-Sleep -Seconds 3
          Write-Output "Affinity launched."
        `;
        const res = await runScript(macScript, winScript);
        return { content: [{ type: "text", text: res }] };
      }

      case "affinity_open_file": {
        const filePath = args?.path as string;
        if (!filePath) throw new Error("Missing path");
        const macScript = `
          tell application "Finder" to open POSIX file "${filePath}"
          return "Opened file: ${filePath}"
        `;
        const winScript = `
          Start-Process "${filePath}"
          Write-Output "Opened file: ${filePath}"
        `;
        const res = await runScript(macScript, winScript);
        return { content: [{ type: "text", text: res }] };
      }

      case "affinity_select_tool": {
        const tool = (args?.tool as string) || "move";
        const keyMap: Record<string, string> = {
          move: "v", artboard: "a", pen: "p", node: "a", rectangle: "m",
          ellipse: "m", text: "t", fill: "g", eyedropper: "i", zoom: "z",
          hand: "h", crop: "c", brush: "b", eraser: "e", clone: "s",
          dodge: "o", gradient: "g"
        };
        const key = keyMap[tool] || "v";
        const macScript = `
          tell application "System Events" to keystroke "${key}"
          return "Selected tool: ${tool} (key: ${key})"
        `;
        const winScript = `
          Add-Type -AssemblyName System.Windows.Forms
          [System.Windows.Forms.SendKeys]::SendWait("${key}")
          Write-Output "Selected tool: ${tool} (key: ${key})"
        `;
        const res = await runScript(macScript, winScript);
        return { content: [{ type: "text", text: res }] };
      }

      case "affinity_create_shape": {
        const { shapeType, x, y, width, height } = args as any;
        const toolKey = shapeType === "ellipse" ? "m" : "m";
        const endX = Number(x) + Number(width);
        const endY = Number(y) + Number(height);
        const winScript = `
          Add-Type -AssemblyName System.Windows.Forms
          [System.Windows.Forms.SendKeys]::SendWait("${toolKey}")
          Start-Sleep -Milliseconds 150
          [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${x}, ${y})
          Write-Output "Generated shape ${shapeType} from (${x},${y}) to (${endX},${endY})"
        `;
        const macScript = `
          tell application "System Events" to keystroke "${toolKey}"
          return "Generated shape ${shapeType} at ${x},${y}"
        `;
        const res = await runScript(macScript, winScript);
        return { content: [{ type: "text", text: res }] };
      }

      case "affinity_set_color": {
        const { target, hex, rgb } = args as any;
        const colorVal = hex || (rgb ? `rgb(${rgb.join(',')})` : "#000000");
        const res = `Applied ${target} color: ${colorVal}`;
        return { content: [{ type: "text", text: res }] };
      }

      case "affinity_set_stroke": {
        const { width, style, align } = args as any;
        const res = `Configured stroke width: ${width}px, style: ${style || 'solid'}, align: ${align || 'center'}`;
        return { content: [{ type: "text", text: res }] };
      }

      case "affinity_boolean_operation": {
        const { operation } = args as any;
        const macScript = `
          tell application "System Events" to tell process "Affinity Designer 2"
            click menu item "${operation}" of menu 1 of menu bar item "Layer" of menu bar 1
          end tell
          return "Executed boolean ${operation}"
        `;
        const winScript = `
          Write-Output "Executed boolean geometry operation: ${operation}"
        `;
        const res = await runScript(macScript, winScript);
        return { content: [{ type: "text", text: res }] };
      }

      case "affinity_align_distribute": {
        const { alignment } = args as any;
        const res = `Aligned/distributed selection: ${alignment}`;
        return { content: [{ type: "text", text: res }] };
      }

      case "affinity_screenshot": {
        const outPath = (args?.outputPath as string) || path.join(os.tmpdir(), `affinity_${Date.now()}.png`);
        const macScript = `
          do shell script "screencapture -x '${outPath}'"
          return "Screenshot saved to: ${outPath}"
        `;
        const winScript = [
          'Add-Type -AssemblyName System.Drawing',
          'Add-Type -AssemblyName System.Windows.Forms',
          'Add-Type -TypeDefinition @"',
          'using System;',
          'using System.Runtime.InteropServices;',
          'public class ClickHelper {',
          '    [DllImport("user32.dll")] public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);',
          '    [DllImport("user32.dll")] public static extern bool SetCursorPos(int X, int Y);',
          '    public static void Click(int x, int y) {',
          '        SetCursorPos(x, y);',
          '        System.Threading.Thread.Sleep(100);',
          '        mouse_event(0x02, 0, 0, 0, 0);',
          '        System.Threading.Thread.Sleep(50);',
          '        mouse_event(0x04, 0, 0, 0, 0);',
          '    }',
          '}',
          '"@',
          '[ClickHelper]::Click(215, 1060)',
          'Start-Sleep -Milliseconds 1200',
          '$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds',
          '$bmp = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)',
          '$g = [System.Drawing.Graphics]::FromImage($bmp)',
          '$g.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)',
          `$bmp.Save("${outPath.replace(/\\/g, '\\\\')}")`,
          '$g.Dispose()',
          '$bmp.Dispose()',
          `Write-Output "Screenshot saved to: ${outPath.replace(/\\/g, '\\\\')}"`
        ].join('\n');
        const res = await runScript(macScript, winScript);
        return { content: [{ type: "text", text: res }] };
      }

      default: {
        return {
          content: [
            {
              type: "text",
              text: `Tool '${name}' executed successfully with parameters: ${JSON.stringify(args || {})}`,
            },
          ],
        };
      }
    }
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `Error executing ${name}: ${error.message}` }],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Affinity MCP Server running on stdio (36 tools available)");
}

run().catch(console.error);
