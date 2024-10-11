const assert = require('assert');
const vscode = require('vscode');
const sinon = require('sinon');
const extension = require('../src/extension');
const ErrorAnalyzer = require('../src/ErrorAnalyzer');

suite("Command Test Suite", () => {
    let sandbox;
    let mockContext;
    let mockWindow;
    let mockWorkspace;
    let mockCommands;
    let mockNotebooks;

    setup(() => {
        sandbox = sinon.createSandbox();

        mockContext = { subscriptions: [] };

        mockWindow = {
            showQuickPick: sandbox.stub().resolves('English'),
            showInformationMessage: sandbox.stub(),
            withProgress: sandbox.stub().callsFake((options, task) => Promise.resolve(task({ report: sandbox.stub() }))),
            showTextDocument: sandbox.stub().resolves(),
            visibleTextEditors: []
        };

        mockWorkspace = {
            getConfiguration: sandbox.stub().returns({
                get: sandbox.stub().returns('English'),
                update: sandbox.stub().resolves()
            }),
            onDidChangeConfiguration: sandbox.stub().returns({ dispose: sandbox.stub() }),
            registerTextDocumentContentProvider: sandbox.stub().returns({ dispose: sandbox.stub() })
        };

        mockCommands = {
            registerCommand: sandbox.stub().returns({ dispose: sandbox.stub() }),
            executeCommand: sandbox.stub().resolves()
        };

        mockNotebooks = {
            registerNotebookCellStatusBarItemProvider: sandbox.stub().returns({ dispose: sandbox.stub() })
        };

        sandbox.stub(vscode, 'window').value(mockWindow);
        sandbox.stub(vscode, 'workspace').value(mockWorkspace);
        sandbox.stub(vscode, 'commands').value(mockCommands);
        sandbox.stub(vscode, 'notebooks').value(mockNotebooks);

        // Mock ErrorAnalyzer
        sandbox.stub(ErrorAnalyzer, 'analyzeError').resolves('Mocked analysis result');
    });

    teardown(() => {
        sandbox.restore();
    });

    test('jupyter.gemini.selectLanguage command sets language correctly', async () => {
        await extension.activate(mockContext);
        const selectLanguageCommand = mockCommands.registerCommand.args.find(arg => arg[0] === 'jupyter.gemini.selectLanguage')[1];

        await selectLanguageCommand();

        assert(mockWindow.showQuickPick.calledOnce);
        assert(mockWorkspace.getConfiguration().update.calledWith('language', 'English', vscode.ConfigurationTarget.Global));
        assert(mockWindow.showInformationMessage.calledOnce);
    });

    test('analyzeCellError command shows progress bar and analyzes error', async () => {
        await extension.activate(mockContext);
        const analyzeCellErrorCommand = mockCommands.registerCommand.args.find(arg => arg[0] === 'jupyter.gemini.analyzeCellError')[1];

        const mockCell = {
            document: { getText: sandbox.stub().returns('code') },
            outputs: [{ metadata: { outputType: 'error', originalError: { traceback: ['error'] } } }]
        };

        await analyzeCellErrorCommand(mockCell);

        assert(mockWindow.withProgress.calledOnce, 'withProgress should be called once');
        assert(ErrorAnalyzer.analyzeError.calledOnce, 'ErrorAnalyzer.analyzeError should be called once');
        assert(mockCommands.executeCommand.calledWith('markdown.showPreviewToSide'), 'markdown.showPreviewToSide should be called');
    });
});