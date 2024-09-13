const vscode = require('vscode');
const CellStatusBarItemProvider = require("./CellStatusBarItemProvider");
const ErrorAnalyzer = require("./ErrorAnalyzer");
const MarkdownContentProvider = require("./MarkdownContentProvider");

function activate(context) {
    const cellStatusProvider = new CellStatusBarItemProvider();
    const mdProvider = new MarkdownContentProvider();

    let config = vscode.workspace.getConfiguration("jupyterGeminiAssistant");
    let selectedLanguage = config.get("language");

    context.subscriptions.push(
        vscode.commands.registerCommand('jupyter.gemini.selectLanguage', async () => {
            const language = await vscode.window.showQuickPick(["한국어", "English"], {
                placeHolder: "Select a language"
            });
            if (language) {
                selectedLanguage = language;
                await config.update('language', language, vscode.ConfigurationTarget.Global);
                vscode.window.showInformationMessage(`Language set to ${language}`);
            }
        })
    );

    context.subscriptions.push(
        vscode.notebooks.registerNotebookCellStatusBarItemProvider('jupyter-notebook', cellStatusProvider)
    );

    context.subscriptions.push(
        vscode.workspace.registerTextDocumentContentProvider('markdown-preview', mdProvider)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('jupyter.gemini.analyzeCellError', async (cell) => {
            if (!cell || !cell.outputs) return;

            const errorOutput = cell.outputs.find(output => output.metadata?.outputType === 'error');
            if (!errorOutput) return;

            const errorTraceback = errorOutput.metadata.originalError.traceback.join('\n');
            const cellCode = cell.document.getText();

            try {
                const analysis = await ErrorAnalyzer.analyzeError(errorTraceback, cellCode, selectedLanguage);

                mdProvider.setLatestAnalysis(analysis);

                const uri = vscode.Uri.parse('markdown-preview:error-analysis.md');
                const existingPreview = vscode.window.visibleTextEditors.find(
                    editor => editor.document.uri.scheme === 'markdown-preview'
                );

                if (existingPreview) {
                    await vscode.commands.executeCommand('markdown.preview.refresh', uri);
                    await vscode.window.showTextDocument(existingPreview.document, existingPreview.viewColumn, false);
                } else {
                    await vscode.commands.executeCommand('markdown.showPreviewToSide', uri);
                }
            } catch (error) {
                vscode.window.showErrorMessage(`Error analyzing error: ${error.message}`);
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('jupyterGeminiAssistant.language')) {
                selectedLanguage = vscode.workspace.getConfiguration('jupyterGeminiAssistant').get('language');
            }
        })
    );
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};