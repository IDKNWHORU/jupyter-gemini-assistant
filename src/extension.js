const vscode = require("vscode");
const CellStatusBarItemProvider = require("./CellStatusBarItemProvider");
const ErrorAnalyzer = require("./ErrorAnalyzer");
const { createOrUpdateWebviewPanel } = require("./AnalyzeWebViewProvider");

function getLocalizedString(key, language) {
  const strings = {
    analyzing_error: {
      한국어: "에러 분석 중...",
      English: "Analyzing error...",
    },
    error_occurred: {
      한국어: "에러 분석 중 오류 발생: ",
      English: "Error occurred during analysis: ",
    },
    language_set: {
      한국어: "언어가 다음으로 설정되었습니다: ",
      English: "Language set to: ",
    },
  };
  return strings[key][language] || strings[key]["English"];
}

function activate(context) {
  const cellStatusProvider = new CellStatusBarItemProvider();

  let config = vscode.workspace.getConfiguration("jupyterGeminiAssistant");
  let selectedLanguage = config.get("language");

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "jupyter.gemini.selectLanguage",
      async () => {
        const language = await vscode.window.showQuickPick(
          ["한국어", "English"],
          {
            placeHolder: "Select a language",
          }
        );
        if (language) {
          selectedLanguage = language;
          await config.update(
            "language",
            language,
            vscode.ConfigurationTarget.Global
          );
          vscode.window.showInformationMessage(
            getLocalizedString("language_set", selectedLanguage) + language
          );
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.notebooks.registerNotebookCellStatusBarItemProvider(
      "jupyter-notebook",
      cellStatusProvider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "jupyter.gemini.analyzeCellError",
      async (cell) => {
        if (!cell || !cell.outputs) return;
        if (cellStatusProvider.isAnalyzing) return; // 이미 분석 중이면 실행하지 않음

        const errorOutput = cell.outputs.find(
          (output) => output.metadata?.outputType === "error"
        );
        if (!errorOutput) return;

        cellStatusProvider.setAnalyzing(true);

        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: getLocalizedString("analyzing_error", selectedLanguage),
            cancellable: false,
          },
          async (progress) => {
            let increment = 0;
            const progressInterval = setInterval(() => {
              increment += 0.2;
              if (increment <= 95) {
                progress.report({ increment: 0.2 });
              }
            }, 60); // 60ms마다 0.2%씩 증가

            try {
              const errorTraceback =
                errorOutput.metadata.originalError.traceback.join("\n");
              const cellCode = cell.document.getText();

              const panel = createOrUpdateWebviewPanel(
                errorTraceback,
                cellCode,
                selectedLanguage,
                context
              );

              const analysis = await ErrorAnalyzer.analyzeError(
                errorTraceback,
                cellCode,
                selectedLanguage
              );

              panel.webview.postMessage(analysis);
            } catch (error) {
              vscode.window.showErrorMessage(
                getLocalizedString("error_occurred", selectedLanguage) +
                  error.message
              );
            } finally {
              clearInterval(progressInterval);
              cellStatusProvider.setAnalyzing(false);
            }
          }
        );
      }
    )
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("jupyterGeminiAssistant.language")) {
        selectedLanguage = vscode.workspace
          .getConfiguration("jupyterGeminiAssistant")
          .get("language");
      }
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
  getLocalizedString,
};
