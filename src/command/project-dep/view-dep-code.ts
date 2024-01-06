// 查看项目依赖源码
import * as vscode from 'vscode';
import {loadJson, handleDep, createDepTable,viewDepSourceCode, updateDep,deleteDep, getDepItemByPksJon}  from './utils';

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
  private dirPath:string;
  // private _view?: vscode.WebviewView;
  private _webPanelView?:vscode.WebviewPanel;
  private depContent:any;
	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { 
    this.dirPath = '';
  }

  public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext<unknown>, token: vscode.CancellationToken): void | Thenable<void> {
    // this._view = webviewView;
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
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media/view-dep-code', 'dep.css'));
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
      <table>
        <tr>
          <th width="100">序号</th>
          <th width="150">来源</th>
          <th width="150">版本</th>
          <th>依赖名</th>
          <th>操作</th>
        </tr>
        <tbody class="content-note">
        </tbody>
      </table>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
  }

  public async getProjectDeps(path:string) {
    this.dirPath = path;
    const me= this;
    this._webPanelView = vscode.window.createWebviewPanel(ViewDepCode.viewType, "项目依赖详情", -1, 
      {
        ...getWebviewOptions(this._extensionUri),
        retainContextWhenHidden: true
      });
    this._webPanelView.webview.html = this._getHtmlForWebview(this._webPanelView.webview);
    this.depContent = await this.getDepContent();
    this.painPanel(this.depContent);
    this._webPanelView.webview.onDidReceiveMessage(data => {
      me.handleAction.call(me, data, path);
		});
  }

  private async getDepContent() {
    const pkgJson = await loadJson(this.dirPath);
    const depList = handleDep(pkgJson);
    return createDepTable(depList);
  }

  private handleAction(data:any, pkgPath:string)  {
    const dirPath = pkgPath.split("package.json")[0];
    const callFun = this.callback;
    if (data.type === 'view') {
      viewDepSourceCode(dirPath + "node_modules", data.value.name, dirPath);
    } else if (data.type === 'update') {
      updateDep(dirPath + "node_modules", data, dirPath, callFun.bind(this));
    } else if (data.type  === 'delete') {
      deleteDep(dirPath + "node_modules", data, dirPath , callFun.bind(this));
    }
  }

  public async callback(item:any, status:string) {
    if (status === 'success') {
      // 读取最新版本，更新文件信息
      const pkgJson = await loadJson(this.dirPath);
      const depItem = getDepItemByPksJon(item?.value, pkgJson);
      this.depContent.forEach((val:any, index:number) => {
        if (val.name === depItem.name && val.tag === depItem.tag) {
          if (item.isDeleting === 'success') {
            this.depContent.splice(index, 1);
          }
          val.version = depItem.version;
          val.isUpdating = item.isUpdating;
          val.isDeleting = item.isDeleting;
        } 
      })
    } else {
      this.depContent.forEach((val:any) => {
        if (val.name === item?.value?.name) {
          val.isUpdating = item.isUpdating;
          val.isDeleting = item.isDeleting;
        }
      })
    }
    this.painPanel(this.depContent);
  }

  public async painPanel(depContent:Array<any>)  {
    if (this._webPanelView) {
      this._webPanelView.webview.postMessage({
        type: "depContent",
        data: depContent
      });
    }
  }
}



function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text; 
}