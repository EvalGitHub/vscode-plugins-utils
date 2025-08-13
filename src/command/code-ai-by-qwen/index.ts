import * as vscode from 'vscode';
import fs from "fs";

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
  return {
    // Enable javascript in the webview
    enableScripts: true,
    // And restrict the webview to only loading content from our extension's `media` directory.
    // localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'src/command/project-dep/vite-project/dist')]
    localResourceRoots: [vscode.Uri.joinPath(extensionUri)]
  };
}

const DIST_DIR = "vite-project/dist";
export class CodeAiByQwenSideBarViewProvider implements vscode.WebviewViewProvider {
  // private _webPanelView?: vscode.WebviewPanel;
  public static readonly viewType = "CodeAiByQwenSideBarViewProvider";
  constructor(
    private readonly _extensionUri: vscode.Uri, 
    private readonly htmlName: any
  ) {
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    webviewView.webview.options = getWebviewOptions(this._extensionUri);
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Use a nonce to only allow a specific script to be run.
    try {
      // data = fs.readFileSync('./vite-project/dist/index.html','utf8');
      const indexPath = vscode.Uri.joinPath(
        this._extensionUri,
        DIST_DIR,
        this.htmlName
      );
      let contentHtml = fs.readFileSync(indexPath.path, "utf-8");
      // 替换js
      contentHtml = contentHtml.replace(
        /src="\/assets\//g,
        `src="${webview.asWebviewUri(
          vscode.Uri.file(
            vscode.Uri.joinPath(
              this._extensionUri,
              `${DIST_DIR}/assets`,
            ).path
          )
        )}/`
      );
      // 替换css
      contentHtml = contentHtml.replace(
        /href="\/assets\//g,
        `href="${webview.asWebviewUri(
          vscode.Uri.file(
            vscode.Uri.joinPath(this._extensionUri, `${DIST_DIR}/assets`).path
          )
        )}/`
      );
      return contentHtml;
    } catch (err: any) {
      console.log(err);
      vscode.window.showInformationMessage(err.message);
    }
    return "";
  }
}