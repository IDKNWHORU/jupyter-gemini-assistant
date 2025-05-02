const vscode = require("vscode");

function getLocalizedString(key, language) {
  const strings = {
    title: {
      한국어: "에러 분석 결과",
      English: "Error Analysis Result",
      日本語: "エラー分析結果",
      Русский: "Результат анализа ошибки",
      فارسی: "نتیجه تحلیل خطا",
    },
    user_info: {
      한국어: "사용자 정보",
      English: "User Info",
      日本語: "ユーザー情報",
      Русский: "Информация о пользователе",
      فارسی: "اطلاعات کاربر",
    },
    error_trace_back: {
      한국어: "오류 추적",
      English: "Error Trace",
      日本語: "エラートレース",
      Русский: "Трассировка ошибки",
      فارسی: "ردیابی خطا",
    },
    error_code: {
      한국어: "오류 코드",
      English: "Error code",
      日本語: "エラーコード",
      Русский: "Код ошибки",
      فارسی: "کد خطا",
    },
    assistant: {
      한국어: "해결 도우미",
      English: "Error Assistant",
      日本語: "解決アシスタント",
      Русский: "Помощник по устранению ошибок",
      فارسی: "دستیار حل خطا",
    },
    loading_message: {
      한국어: "오류를 분석 중입니다... 잠시만 기다려주세요\u231B",
      English: "Analyzing error... Please wait\u231B",
      日本語: "エラーを分析中です... しばらくお待ちください\u231B",
      Русский: "Анализ ошибки... Пожалуйста, подождите\u231B",
      فارسی: "در حال تجزیه و تحلیل خطا... لطفا منتظر بمانید\u231B",
    },
    copy: {
      한국어: "복사",
      English: "Copy",
      日本語: "コピー",
      Русский: "Копировать",
      فارسی: "کپی",
    },
    copied: {
      한국어: "복사됨",
      English: "Copied",
      日本語: "コピーしました",
      Русский: "Скопировано",
      فارسی: "کپی شد",
    },
    change_language: {
      한국어: "언어가 한국어로 설정되었습니다. 다시 한번 분석을 시도해주세요.",
      English: "Language set to English. Please try analyzing again.",
      日本語: "言語が日本語に設定されました。もう一度分析を実行してください。",
      Русский:
        "Язык установлен на Русский. Пожалуйста, попробуйте провести анализ снова.", // 또는 "Язык изменен..."
      فارسی: "زبان به فارسی تنظیم شد. لطفا دوباره تحلیل را امتحان کنید.", // 또는 "زبان تغییر یافت..."
    },
    selected_language: {
      한국어: "선택된 언어",
      English: "Selected Language",
      日本語: "選択された言語",
      Русский: "Выбранный язык",
      فارسی: "زبان انتخاب شده",
    },
  };

  return strings[key][language] || strings[key]["English"];
}

let currentPanel = undefined;

function createOrUpdateWebviewPanel(
  errorTraceback,
  cellCode,
  selectedLanguage,
  context
) {
  const columnToShowIn = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.viewColumn
    : undefined;

  if (currentPanel) {
    // 이미 패널이 열려 있다면 내용을 업데이트
    updateWebviewContent(
      currentPanel,
      errorTraceback,
      cellCode,
      selectedLanguage
    );
    currentPanel.reveal(columnToShowIn);
  } else {
    // 패널이 열려 있지 않다면 새로 생성
    currentPanel = vscode.window.createWebviewPanel(
      "analyzeError",
      getLocalizedString("title", selectedLanguage),
      columnToShowIn || vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    currentPanel.onDidDispose(
      () => {
        currentPanel = undefined;
      },
      null,
      context.subscriptions
    );

    currentPanel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.command === "updateLanguage") {
          const newLanguage = message.language;
          console.log("Received language update request:", newLanguage);
          try {
            await vscode.workspace
              .getConfiguration("jupyterGeminiAssistant")
              .update(
                "language",
                newLanguage,
                vscode.ConfigurationTarget.Global
              );

            if (currentPanel) {
              vscode.window.showInformationMessage(
                getLocalizedString("change_language", newLanguage)
              );
            }
          } catch (error) {
            console.error("Error updating language:", error);
            vscode.window.showErrorMessage("Failed to update language.");
          }
        }
      },
      undefined,
      context.subscriptions
    );

    updateWebviewContent(
      currentPanel,
      errorTraceback,
      cellCode,
      selectedLanguage
    );
  }

  return currentPanel;
}

function updateWebviewContent(
  panel,
  errorTraceback,
  cellCode,
  selectedLanguage
) {
  const colorTheme = vscode.workspace
    .getConfiguration()
    .get("workbench.colorTheme");

  panel.title = getLocalizedString("title", selectedLanguage);
  panel.webview.html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${getLocalizedString("title", selectedLanguage)}</title>
      ${
        colorTheme.includes("Dark")
          ? `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">`
          : `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css">`
      }
      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/go.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.2.0/markdown-it.min.js"></script>
      <style>
        .loading-message {
          animation: blink 5s linear 6;
        }

        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }

        .details {
          border: 1px solid #787878;
          border-radius: 20px;
          margin: 1em 0;
        }

        .details-summary{
          font-size: 1.17em;
          margin-block-start: 1em;
          margin-block-end: 1em;
          margin-inline-start: 15px;
          margin-inline-end: 0px;
          font-weight: bold;
          unicode-bidi: isolate;
        }

        .detail-code {
          margin: 1em;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .language-select {
          background: transparent;
          color: var(--vscode-editor-foreground);
          border: 1px solid var(--vscode-editor-foreground);
        }

        .language-select > option {
          background: var(--vscode-editor-background);
          color: var(--vscode-editor-foreground);
        }
      </style>
  </head>
  <body>
      <div id="content">
        <header class="header">
          <h2>${getLocalizedString("user_info", selectedLanguage)}</h2>
          <div>
          <span>${getLocalizedString(
            "selected_language",
            selectedLanguage
          )}: </span>
          <select class="language-select" id="language-select">
            <option value="English" ${
              selectedLanguage === "English" ? "selected" : ""
            }>English</option>
            <option value="한국어" ${
              selectedLanguage === "한국어" ? "selected" : ""
            }>한국어</option>
            <option value="日本語" ${
              selectedLanguage === "日本語" ? "selected" : ""
            }>日本語</option>
            <option value="Русский" ${
              selectedLanguage === "Русский" ? "selected" : ""
            }>Русский</option>
            <option value="فارسی" ${
              selectedLanguage === "فارسی" ? "selected" : ""
            }>فارسی</option>
          </select>
          </div>
          
        </header>
        <details class="details">
          <summary class="details-summary">${getLocalizedString(
            "error_trace_back",
            selectedLanguage
          )}</summary>
          <pre class="detail-code">
            <code>${errorTraceback}</code>
          </pre>
        </details>
        <details class="details">
          <summary class="details-summary">${getLocalizedString(
            "error_code",
            selectedLanguage
          )}</summary>
          <pre class="detail-code">
            <code>${cellCode}</code>
          </pre>
        </details>
      </div>
      <hr>
      <div>
        <h2>${getLocalizedString("assistant", selectedLanguage)}</h2>
        <div id="analysis-result">
          <p class="loading-message">${getLocalizedString(
            "loading_message",
            selectedLanguage
          )}</p>
        </div>
      </div>
      <script>
          hljs.highlightAll();

          window.addEventListener('message', event => {
            const message = event.data; // The json data that the extension sent
          
            const md = new markdownit();
            const serializedMessage = JSON.stringify(message);
            const html = md.render(message);

            const contentDiv = document.getElementById('analysis-result')
            
            contentDiv.innerHTML = html;

            contentDiv.querySelectorAll('pre > code').forEach((codeBlock, index) => {
              // 코드 블록을 감싸는 컨테이너 생성
              const container = document.createElement('div');
              container.style.position = 'relative';
              codeBlock.parentNode.insertBefore(container, codeBlock);
              container.appendChild(codeBlock);

              // 복사 버튼 생성
              const copyButton = document.createElement('button');
              copyButton.textContent = '${getLocalizedString(
                "copy",
                selectedLanguage
              )}';
              copyButton.style.position = 'absolute';
              copyButton.style.top = '5px';
              copyButton.style.right = '5px';
              copyButton.style.zIndex = '10'; // 다른 요소 위에 버튼 표시
              container.appendChild(copyButton);

              // 복사 버튼 클릭 이벤트 핸들러 등록
              copyButton.addEventListener('click', () => {
                  navigator.clipboard.writeText(codeBlock.textContent)
                      .then(() => {
                          copyButton.textContent = '${getLocalizedString(
                            "copied",
                            selectedLanguage
                          )}';
                          setTimeout(() => {
                              copyButton.textContent = 'Copy';
                          }, 2000); // 2초 후 버튼 텍스트 복원
                      })
                      .catch(err => {
                          console.error('Failed to copy text: ', err);
                          copyButton.textContent = 'Error';
                      });
              });
            });
            hljs.highlightAll();
          });
      </script>
      <script>
          (function() {
            const vscode = acquireVsCodeApi();
            document.getElementById('language-select').addEventListener('change', (event) => {
              const selectedLanguage = event.target.value;
              vscode.postMessage({
                command: 'updateLanguage',
                language: selectedLanguage,
              });
            });
          })();
      </script>
  </body>
  </html>`;
}

module.exports = { createOrUpdateWebviewPanel };
