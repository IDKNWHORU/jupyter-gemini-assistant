const vscode = require("vscode");
const ErrorAnalyzer = require("./ErrorAnalyzer");

function getLocalizedString(key, language) {
  const strings = {
    title: {
      한국어: "에러 분석 결과",
      English: "Error Analysis Result",
    },
    user_info: {
      한국어: "사용자 정보",
      English: "User Info",
    },
    error_trace_back: {
      한국어: "오류 추적",
      English: "Error Trace",
    },
    error_code: {
      한국어: "오류 코드",
      English: "Error code",
    },
    assistant: {
      한국어: "해결 도우미",
      English: "Error Assistant",
    },
    loading_message: {
      한국어: "오류를 분석 중입니다... 잠시만 기다려주세요\u231B",
      English: "Analyzing error... Please wait\u231B",
    },
    copy: {
      한국어: "복사",
      English: "Copy",
    },
    copied: {
      한국어: "복사됨",
      English: "Copied",
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
      </style>
  </head>
  <body>
      <div id="content">
        <h2>${getLocalizedString("user_info", selectedLanguage)}</h2>
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
  </body>
  </html>`;
}

module.exports = { createOrUpdateWebviewPanel };
