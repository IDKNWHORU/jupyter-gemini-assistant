const vscode = require('vscode');

// Gemini API 키 설정
function activate(context) {
    console.log('Jupyter Error Detector is now active');

    vscode.workspace.onDidChangeNotebookDocument(event => {
        event.cellChanges.forEach(change => {
            const cell = change.cell;
            if (cell.executionSummary) {
                checkForErrors(cell);
            }
        });
    });
}

let timeoutId;

async function checkForErrors(cell) {
    if (cell.kind === vscode.NotebookCellKind.Code) {
        clearTimeout(timeoutId); // 이전 타이머를 취소

        timeoutId = setTimeout(async () => {
            cell.outputs.forEach(output => {
                output.items.forEach(item => {
                    if (item.mime === 'application/vnd.code.notebook.error') {
                        const errorOutput = item.data.toString();
                        analyzeError(errorOutput, cell.document.getText());
                    }
                });
            });
        }, 500); // 0.5초 동안 이벤트를 무시
    }
}

async function analyzeError(errorOutput, code) {
    try {
        const response = await fetch("https://gemini-server-kappa.vercel.app/generate", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                errorOutput,
                code
            }),
        });

        const data = await response.json();

        const analysis = data.candidates[0].content.parts[0].text;
        
        const outputChannel = vscode.window.createOutputChannel("Jupyter Error Assistant");
        outputChannel.appendLine(analysis)
        outputChannel.show(true)

    } catch (error) {
        console.error('Error analyzing error:', error);
        vscode.window.showErrorMessage(`Error analyzing error. Please check your API key and connection. \n ${error}`);
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}