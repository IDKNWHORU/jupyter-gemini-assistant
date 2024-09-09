const CellStatusBarItemProvider = require('../src/CellStatusBarItemProvider');
const assert = require("assert");

suite("CellStatusBarItemProvider Test Suite", () => {
    let provider;

    setup(() => {
        provider = new CellStatusBarItemProvider();
    });

    test("cellHasError should return true for a cell with an error MIME type", () => {
        const cellWithError = {
            outputs: [
                {
                    items: [
                        { mime: "application/vnd.code.notebook.error" }
                    ]
                }
            ]
        }

        assert.strictEqual(provider.cellHasError(cellWithError), true);
    });

    test("cellHasError should return false for a cell without an error MIME type", () => {
        const cellWithoutError = {
            outputs: [
                {
                    items: [
                        { mime: "text/plain" }
                    ]
                }
            ]
        }

        assert.strictEqual(provider.cellHasError(cellWithoutError), false);
    });

    test("provideCellStatusBarItems should return status bar item for a cell with an error", () => {
        const cellWithError = {
            outputs: [
                {
                    items: [
                        { mime: "application/vnd.code.notebook.error" }
                    ]
                }
            ]
        };

        const statusBarItems = provider.provideCellStatusBarItems(cellWithError);
        assert.strictEqual(statusBarItems.length, 1);
        assert.deepStrictEqual(statusBarItems[0], {
            text: '$(sparkle) analyse',
            command: 'jupyter.gemini.analyzeCellError',
            tooltip: 'Analyze cell error',
            arguments: [cellWithError]
        });
    });

    test("provideCellStatusBarItems should return an empty array for a cell without an error", () => {
        const cellWithError = {
            outputs: [
                {
                    items: [
                        { mime: "text/plain" }
                    ]
                }
            ]
        };

        const statusBarItems = provider.provideCellStatusBarItems(cellWithError);
        assert.deepStrictEqual(statusBarItems, []);
    })
})