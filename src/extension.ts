import * as vscode from 'vscode';
import { MarkdownExplorerProvider } from './markdownExplorer';

export function activate(context: vscode.ExtensionContext) {
  // Get the path of the currently opened workspace
  const rootPath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : '';

  // Create an instance of our custom TreeDataProvider
  const markdownExplorerProvider = new MarkdownExplorerProvider(rootPath);

  // Register our custom TreeDataProvider
  vscode.window.registerTreeDataProvider('markdownExplorer', markdownExplorerProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
