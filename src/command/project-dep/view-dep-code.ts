// 查看项目依赖源码
import * as vscode from 'vscode';
import {loadJson, handleDep, createDepTable,viewDepSourceCode}  from './utils';

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
	return {
		// Enable javascript in the webview
		enableScripts: true,
		// And restrict the webview to only loading content from our extension's `media` directory.
		localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
	};
}

export class ViewDepCode implements vscode.WebviewViewProvider {
  public static readonly viewType = 'view.depCode';

  private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { 
  }

  public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
    this._view = webviewView;
    webviewView.webview.options = getWebviewOptions(this._extensionUri);
		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media/view-dep-code', 'main.js'));
		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
    return  `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <!--
        Use a content security policy to only allow loading styles from our extension directory,
        and only allow scripts that have a specific nonce.
        (See the 'webview-sample' extension sample for img-src content security policy examples)
      -->
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <link href="${styleResetUri}" rel="stylesheet">
      <link href="${styleVSCodeUri}" rel="stylesheet">
      <link href="${styleMainUri}" rel="stylesheet">

      <title>deps detail</title>
    </head>
    <body>
      <table class="content-note">
        <tr>
          <th width="150">来源</th>
          <th width="150">版本</th>
          <th>依赖名</th>
          <th>操作</th>
        </tr>
      </table>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
  }

  public async getProjectDeps(path:string) {
    const panel = vscode.window.createWebviewPanel(ViewDepCode.viewType, "项目依赖详情", -1, getWebviewOptions(this._extensionUri),);
    panel.webview.html = this._getHtmlForWebview(panel.webview);

    const pkgJson = await loadJson(path);
    const depList = handleDep(pkgJson);
    const depContent = createDepTable(depList);
    panel.webview.postMessage({
      type: "depContent",
      data: depContent
    });

    panel.webview.onDidReceiveMessage(data => {
			switch (data.type) {
        case "viewDetail": 
          viewDetail(data, path);
          break;
				/* case 'colorSelected':
					{
						vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`#${data.value}`));
						break;
					} */
			}
		});
  }
}

function viewDetail(data:any, pkgPath:string)  {
  const dirPath = pkgPath.split("package.json")[0];
  viewDepSourceCode(dirPath + "node_modules", data.value.name, dirPath);
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text; 
}