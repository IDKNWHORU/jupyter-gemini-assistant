const vscode = require("vscode");
const CellStatusBarItemProvider = require("./CellStatusBarItemProvider");
const ErrorAnalyzer = require("./ErrorAnalyzer");
const { createOrUpdateWebviewPanel } = require("./AnalyzeWebViewProvider");

function getLocalizedString(key, language) {
  const strings = {
    analyzing_error: {
      한국어: "에러 분석 중...",
      English: "Analyzing error...",
      日本語: "エラー分析中...",
      Русский: "Анализ ошибки...",
      فارسی: "در حال تحلیل خطا...",
    },
    error_occurred: {
      한국어: "에러 분석 중 오류 발생: ",
      English: "Error occurred during analysis: ",
      日本語: "分析中にエラーが発生しました: ",
      Русский: "Произошла ошибка во время анализа: ",
      فارسی: "خطا در حین تحلیل رخ داد: ",
    },
    language_set: {
      한국어: "언어가 다음으로 설정되었습니다: ",
      English: "Language set to: ",
      日本語: "言語が設定されました: ",
      Русский: "Язык установлен на: ", // 또는 "Язык установлен как:"
      فارسی: "زبان تنظیم شده به: ", // 또는 "زبان به این تغییر یافت:"
    },
    model_set: {
      한국어: "모델이 다음으로 설정되었습니다: ",
      English: "Model set to: ",
      日本語: "モデルは次のように設定されています: ",
      Русский: "Модель настроена на: ",
      فارسی: "مدل تنظیم شده به: ",
    }
  };
  return strings[key][language] || strings[key]["English"];
}

function activate(context) {
  const cellStatusProvider = new CellStatusBarItemProvider();

  let config = vscode.workspace.getConfiguration("jupyterGeminiAssistant");
  let selectedLanguage = config.get("language");
  let selectedModel = config.get("model");

  context.subscriptions.push(
    vscode.commands.registerCommand("jupyter.gemini.selectModel", async () => {
      const model = await vscode.window.showQuickPick(
        ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-2.0-flash-lite"],
        {
          placeHolder: "Select a model for Jupyter Gemini Assistant",
        }
      );

      if (model) {
        selectedModel = model;
        await config.update(
          "model",
          model,
          vscode.ConfigurationTarget.Global
        );

        vscode.window.showInformationMessage(
          getLocalizedString("model_set", selectedLanguage) + model
        )
      }
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "jupyter.gemini.selectLanguage",
      async () => {
        const language = await vscode.window.showQuickPick(
          ["한국어", "English", "日本語", "Русский", "فارسی"],
          {
            placeHolder: "Select a language for Jupyter Gemini Assistant",
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
                selectedModel,
                context
              );

              const analysis = await ErrorAnalyzer.analyzeError(
                errorTraceback,
                cellCode,
                selectedLanguage,
                selectedModel
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

      if (event.affectsConfiguration("jupyterGeminiAssistant.model")) {
        selectedModel = vscode.workspace
          .getConfiguration("jupyterGeminiAssistant")
          .get("model");
      }
    })
  );
}

function deactivate() { }

module.exports = {
  activate,
  deactivate,
  getLocalizedString,
};
