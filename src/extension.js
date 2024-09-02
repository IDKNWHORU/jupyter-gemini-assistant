const vscode = require('vscode');

// class MyStatusBarItemProvider {
//     provideCellStatusBarItems(cell) {
//         const statusBarItems = [];

//         // 셀의 실행 결과에 에러가 있는지 확인합니다.
//         const hasError = cell.outputs.some(({ items }) => items.some(({ mime }) => mime === 'application/vnd.code.notebook.error'));

//         if (hasError) {
//             // 에러가 있는 경우에만 "분석" 버튼을 추가합니다.
//             statusBarItems.push({
//                 text: '$(sparkle) analyse',
//                 command: 'jupyter.gemini.analyzeCellError',
//                 tooltip: 'Cell error analysis',
//             });
//         }

//         return statusBarItems;
//     }
// }

/**
 * @param {vscode.ExtensionContext} context
 */
// function activate(context) {
//     const provider = new MyStatusBarItemProvider();
//     context.subscriptions.push(
//         vscode.notebooks.registerNotebookCellStatusBarItemProvider('jupyter-notebook', provider)
//     );

//     // "분석" 버튼 클릭 시 실행되는 명령을 등록합니다.
//     context.subscriptions.push(
//         vscode.commands.registerCommand('jupyter.gemini.analyzeCellError', (cell) => {
//             if (cell && cell.outputs) {
//                 const errorOutput = cell.outputs.find(output => output.metadata.outputType === 'error');

//                 if (errorOutput) {
//                     // const errorMessage = errorOutput.metadata.originalError.evalue;
//                     const errorTraceback = errorOutput.metadata.originalError.traceback.join('\n');
//                     const cellCode = cell.document.getText();

//                     analyzeError(errorTraceback, cellCode)
//                 }
//             }
//         })
//     );
// }

// async function analyzeError(errorOutput, code) {
//     try {
//         const response = await fetch("https://gemini-server-kappa.vercel.app/generate", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 errorOutput,
//                 code
//             }),
//         });

//         const data = await response.json();

//         const analysis = data.candidates[0].content.parts[0].text;

//         const outputChannel = vscode.window.createOutputChannel("Jupyter Error Assistant");
//         outputChannel.appendLine(analysis)
//         outputChannel.show(true)

//     } catch (error) {
//         console.error('Error analyzing error:', error);
//         vscode.window.showErrorMessage(`Error analyzing error. Please check your API key and connection. \n ${error}`);
//     }
// }

class CellStatusBarItemProvider {
    provideCellStatusBarItems(cell) {
        if (this.cellHasError(cell)) {
            return [{
                text: '$(sparkle) analyse',
                command: 'jupyter.gemini.analyzeCellError',
                tooltip: 'Analyze cell error',
                arguments: [cell]
            }];
        }
        return [];
    }

    cellHasError(cell) {
        return cell.outputs.some(output =>
            output.items?.some(item => item.mime === 'application/vnd.code.notebook.error')
        );
    }
}


class ErrorAnalyzer {
    static async analyzeError(errorOutput, code) {
        try {
            const response = await fetch("https://gemini-server-kappa.vercel.app/generate", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ errorOutput, code }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error analyzing error:', error);
            throw error;
        }
    }
}

function activate(context) {
    const provider = new CellStatusBarItemProvider();
    context.subscriptions.push(
        vscode.notebooks.registerNotebookCellStatusBarItemProvider('jupyter-notebook', provider)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('jupyter.gemini.analyzeCellError', async (cell) => {
            if (!cell || !cell.outputs) return;

            const errorOutput = cell.outputs.find(output => output.metadata?.outputType === 'error');
            if (!errorOutput) return;

            const errorTraceback = errorOutput.metadata.originalError.traceback.join('\n');
            const cellCode = cell.document.getText();

            try {
                const analysis = await ErrorAnalyzer.analyzeError(errorTraceback, cellCode);
                const outputChannel = vscode.window.createOutputChannel("Jupyter Error Assistant");
                outputChannel.appendLine(analysis);
                outputChannel.show(true);
            } catch (error) {
                vscode.window.showErrorMessage(`Error analyzing error: ${error.message}`);
            }
        })
    );
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
}