import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class MarkdownExplorerProvider implements vscode.TreeDataProvider<MarkdownFile | MessageTreeItem> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: MarkdownFile | MessageTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: MarkdownFile): Thenable<(MarkdownFile | MessageTreeItem)[]> {
    if (!this.workspaceRoot) {
      return Promise.resolve([new MessageTreeItem('No workspace folder open')]);
    }

    if (element) {
      return element.isDirectory ?
        Promise.resolve(this.getMarkdownFiles(element.path)) :
        Promise.resolve([]);
    } else {
      const tutorialPath = path.join(this.workspaceRoot, '.tutorial');
      return Promise.resolve(this.getMarkdownFiles(tutorialPath));
    }
  }

  private getMarkdownFiles(folderPath: string): (MarkdownFile | MessageTreeItem)[] {
    if (!fs.existsSync(folderPath)) {
      return [new MessageTreeItem('There is no .tutorial folder in the workspace')];
    }

    const files = fs.readdirSync(folderPath);
    const markdownFiles = files.map(file => {
      const filePath = path.join(folderPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        return new MarkdownFile(
          file,
          vscode.TreeItemCollapsibleState.Collapsed,
          filePath,
          true
        );
      } else if (path.extname(file).toLowerCase() === '.md') {
        return new MarkdownFile(
          file,
          vscode.TreeItemCollapsibleState.None,
          filePath,
          false,
          {
            command: 'vscode.open',
            title: 'Open File',
            arguments: [vscode.Uri.file(filePath)]
          }
        );
      } else {
        return null;
      }
    }).filter((item): item is MarkdownFile => item !== null);

    return markdownFiles.length > 0 ? markdownFiles : [new MessageTreeItem('No Markdown files found in the .tutorial folder')];
  }
}

class MarkdownFile extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly path: string,
    public readonly isDirectory: boolean,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.tooltip = this.path;
    // this.description = this.isDirectory ? 'Folder' : '';
  }
}

class MessageTreeItem extends vscode.TreeItem {
  constructor(message: string) {
    super(message, vscode.TreeItemCollapsibleState.None);
    this.contextValue = 'message';
  }
}
