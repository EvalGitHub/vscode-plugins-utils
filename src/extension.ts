// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {ViewDepCode} from './command/project-dep/view-dep-code';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// 项目依赖处理插件
	const ViewDepCodeProvider = new ViewDepCode(context.extensionUri);
	context.subscriptions.push(
		vscode.commands.registerCommand("view-project-dep-source-code", (e) => {
			console.log(e.fsPath);
			ViewDepCodeProvider.getProjectDeps(e.fsPath);
		}));
}

// This method is called when your extension is deactivated
export function deactivate() {}
