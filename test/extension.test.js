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
			registerTextDocumentContentProvider: sandbox.stub().returns({ dispose: sandbox.stub() })
		};
		mockCommands = {
			registerCommand: sandbox.stub().returns({ dispose: sandbox.stub() }),
			executeCommand: sandbox.stub().resolves()
		};
		mockWindow = {
			showErrorMessage: sandbox.stub(),
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
		assert(mockCommands.registerCommand.calledOnce);
		assert.strictEqual(mockContext.subscriptions.length, 3);
	});

	test('analyzeCellError command handles valid cell and error output', async () => {
		const mockCell = {
			document: { getText: sandbox.stub().returns('code') },
			outputs: [{ metadata: { outputType: 'error', originalError: { traceback: ['error'] } } }]
		};

		sandbox.stub(ErrorAnalyzer, 'analyzeError').resolves('Analysis result');
		const setLatestAnalysisStub = sandbox.stub(MarkdownContentProvider.prototype, 'setLatestAnalysis');

		await extension.activate(mockContext);
		await mockCommands.registerCommand.args[0][1](mockCell);

		assert(ErrorAnalyzer.analyzeError.calledOnce);
		assert(setLatestAnalysisStub.calledOnce);
		assert(mockCommands.executeCommand.calledWith('markdown.showPreviewToSide'));
	});

	test('analyzeCellError command refreshes existing preview', async () => {
		const mockCell = {
			document: { getText: sandbox.stub().returns('code') },
			outputs: [{ metadata: { outputType: 'error', originalError: { traceback: ['error'] } } }]
		};

		sandbox.stub(ErrorAnalyzer, 'analyzeError').resolves('Analysis result');
		const setLatestAnalysisStub = sandbox.stub(MarkdownContentProvider.prototype, 'setLatestAnalysis');

		mockWindow.visibleTextEditors = [{ document: { uri: { scheme: 'markdown-preview' } } }];

		await extension.activate(mockContext);
		await mockCommands.registerCommand.args[0][1](mockCell);

		assert(mockCommands.executeCommand.calledWith('markdown.preview.refresh'));
		assert(mockWindow.showTextDocument.calledOnce);
	});

	test('analyzeCellError command handles errors', async () => {
		const mockCell = {
			document: { getText: sandbox.stub().returns('code') },
			outputs: [{ metadata: { outputType: 'error', originalError: { traceback: ['error'] } } }]
		};

		sandbox.stub(ErrorAnalyzer, 'analyzeError').rejects(new Error('Analysis failed'));

		await extension.activate(mockContext);
		await mockCommands.registerCommand.args[0][1](mockCell);

		assert(mockWindow.showErrorMessage.calledOnce);
		assert(mockWindow.showErrorMessage.calledWith('Error analyzing error: Analysis failed'));
	});
});