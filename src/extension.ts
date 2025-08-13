// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {ViewDepCode} from './command/project-dep';
import {CodeAiByQwenSideBarViewProvider} from './command/code-ai-by-qwen';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
	// 项目依赖处理插件
	function getViewDepCodeProvider() {
		const ViewDepCodeProvider = new ViewDepCode(
			context.extensionUri as vscode.Uri,
			"index.html"
		);
		return  vscode.commands.registerCommand("view-project-dep-source-code", (e) => {
      console.log(e.fsPath);
      ViewDepCodeProvider.getProjectDeps(e.fsPath);
    });
	}


  // 注册 code-ai-by-qwen sideBar view
	function getCodeAiByQwenSideBarViewProvider() {
		const provider = new CodeAiByQwenSideBarViewProvider(
      context.extensionUri as vscode.Uri,
			"code-ai-by-qwen.html"
		);
		return vscode.window.registerWebviewViewProvider(
      "code-ai-by-qwen-container",
      provider
    );
	}

	context.subscriptions.push(
    getViewDepCodeProvider(),
    // getCodeAiByQwenSideBarViewProvider()
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
