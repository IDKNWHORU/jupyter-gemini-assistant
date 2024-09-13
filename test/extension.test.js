const assert = require('assert');
const vscode = require('vscode');
const sinon = require('sinon');
const extension = require('../src/extension');
const ErrorAnalyzer = require('../src/ErrorAnalyzer');
const MarkdownContentProvider = require('../src/MarkdownContentProvider');

suite('Extension Test Suite', () => {
	let sandbox;
	let mockContext;
	let mockNotebooks;
	let mockWorkspace;
	let mockCommands;
	let mockWindow;

	setup(() => {
		sandbox = sinon.createSandbox();

		// Mock VSCode API
		mockNotebooks = {
			registerNotebookCellStatusBarItemProvider: sandbox.stub().returns({ dispose: sandbox.stub() })
		};
		mockWorkspace = {
			registerTextDocumentContentProvider: sandbox.stub().returns({ dispose: sandbox.stub() }),
			getConfiguration: sandbox.stub().returns({
				get: sandbox.stub().returns("English"),
				update: sandbox.stub().resolves()
			}),
			onDidChangeConfiguration: sandbox.stub().returns({ dispose: sandbox.stub() })
		};
		mockCommands = {
			registerCommand: sandbox.stub().returns({ dispose: sandbox.stub() }),
			executeCommand: sandbox.stub().resolves()
		};
		mockWindow = {
			showErrorMessage: sandbox.stub(),
			showInformationMessage: sandbox.stub(),
			showQuickPick: sandbox.stub().resolves("English"),
			visibleTextEditors: [],
			showTextDocument: sandbox.stub().resolves()
		};

		sandbox.stub(vscode, 'notebooks').value(mockNotebooks);
		sandbox.stub(vscode, 'workspace').value(mockWorkspace);
		sandbox.stub(vscode, 'commands').value(mockCommands);
		sandbox.stub(vscode, 'window').value(mockWindow);

		// Mock context
		mockContext = {
			subscriptions: []
		};
	});

	teardown(() => {
		sandbox.restore();
	});

	test('activate function registers providers and commands', async () => {
		await extension.activate(mockContext);

		assert(mockNotebooks.registerNotebookCellStatusBarItemProvider.calledOnce);
		assert(mockWorkspace.registerTextDocumentContentProvider.calledOnce);
		assert.strictEqual(mockCommands.registerCommand.callCount, 2); // Two commands should be registered
		assert.strictEqual(mockContext.subscriptions.length, 5); // Including onDidChangeConfiguration
	});

	test('analyzeCellError command handles valid cell and error output', async () => {
		const mockCell = {
			document: { getText: sandbox.stub().returns('code') },
			outputs: [{ metadata: { outputType: 'error', originalError: { traceback: ['error'] } } }]
		};

		sandbox.stub(ErrorAnalyzer, 'analyzeError').resolves('Analysis result');
		const setLatestAnalysisStub = sandbox.stub(MarkdownContentProvider.prototype, 'setLatestAnalysis');

		await extension.activate(mockContext);
		await mockCommands.registerCommand.args[1][1](mockCell); // Calling the second registered command

		assert(ErrorAnalyzer.analyzeError.calledOnce);
		assert(setLatestAnalysisStub.calledOnce);
		assert(mockCommands.executeCommand.calledWith('markdown.showPreviewToSide'));
	});

	test("selectLanguage command updates language setting", async () => {
		await extension.activate(mockContext);
		await mockCommands.registerCommand.args[0][1](); // Calling the first registered command

		assert(mockWindow.showQuickPick.calledOnce);
		assert(mockWorkspace.getConfiguration().update.calledOnce);
		assert(mockWindow.showInformationMessage.calledOnce);
	});

	test("configuration change updates selected language", async () => {
		await extension.activate(mockContext);

		// Simulate configuration change
		const configChangeHandler = mockWorkspace.onDidChangeConfiguration.args[0][0];
		configChangeHandler({ affectsConfiguration: () => true });

		assert(mockWorkspace.getConfiguration().get.calledTwice); // Called in activate and in change handler
	});

	test('analyzeCellError command handles errors', async () => {
		const mockCell = {
			document: { getText: sandbox.stub().returns('code') },
			outputs: [{ metadata: { outputType: 'error', originalError: { traceback: ['error'] } } }]
		};

		sandbox.stub(ErrorAnalyzer, 'analyzeError').rejects(new Error('Analysis failed'));

		await extension.activate(mockContext);
		await mockCommands.registerCommand.args[1][1](mockCell); // Calling the second registered command

		assert(mockWindow.showErrorMessage.calledOnce);
		assert(mockWindow.showErrorMessage.calledWith('Error analyzing error: Analysis failed'));
	});
});