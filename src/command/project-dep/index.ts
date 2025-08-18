// 查看项目依赖源码

import * as vscode from 'vscode';
import fs from 'fs';
import {loadJson, handleDep, createDepTable,viewDepSourceCode, updateDep,deleteDep, getDepItemByPksJon}  from './utils';

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

export class ViewDepCode implements vscode.WebviewViewProvider {
  public static readonly viewType = 'view.depCode';
  private dirPath:string;
  // private _view?: vscode.WebviewView;
  private _webPanelView?:vscode.WebviewPanel;
  private depContent:any;
	constructor(
		private readonly _extensionUri: vscode.Uri,
    private readonly htmlName:any
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
    try {
      // data = fs.readFileSync('./vite-project/dist/index.html','utf8');
      const indexPath = vscode.Uri.joinPath(
        this._extensionUri,
        DIST_DIR,
        this.htmlName
      );
      let contentHtml = fs.readFileSync(indexPath.path, 'utf-8');
      // 替换js
      contentHtml = contentHtml.replace(
        /src="\/assets\//g,
        `src="${webview.asWebviewUri(
          vscode.Uri.file(
            vscode.Uri.joinPath(this._extensionUri, DIST_DIR, "assets").path
          )
        )}/`
      );
      // 替换css
      contentHtml = contentHtml.replace(
        /href="\/assets\//g,
        `href="${webview.asWebviewUri(
          vscode.Uri.file(
            vscode.Uri.joinPath(this._extensionUri, DIST_DIR, "assets").path
          )
        )}/`
      );
      return contentHtml;
    } catch(err:any) {  
      console.log(err);
      vscode.window.showInformationMessage(err.message);
    }
    return '';
  }

  public async getProjectDeps(path:string) {
    this.dirPath = path;
    const me= this;
    this._webPanelView = vscode.window.createWebviewPanel(
      ViewDepCode.viewType, "项目依赖详情", -1, 
      {
        ...getWebviewOptions(this._extensionUri),
        retainContextWhenHidden: true,
      }
    );
    this._webPanelView.webview.html = this._getHtmlForWebview(this._webPanelView.webview);
    this.depContent = await this.getDepContent();
    this.painPanel(this.depContent);
    this._webPanelView.webview.onDidReceiveMessage(data => {
      me.handleAction.call(me, data, path);
		});
  }

  // 获取依赖
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
      });
    } else {
      this.depContent.forEach((val:any) => {
        if (val.name === item?.value?.name) {
          val.isUpdating = item.isUpdating;
          val.isDeleting = item.isDeleting;
        }
      });
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

