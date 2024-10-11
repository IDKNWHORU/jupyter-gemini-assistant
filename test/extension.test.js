const assert = require('assert');
const vscode = require('vscode');
const sinon = require('sinon');
const extension = require('../src/extension');
const ErrorAnalyzer = require('../src/ErrorAnalyzer');
const MarkdownContentProvider = require('../src/MarkdownContentProvider');
const CellStatusBarItemProvider = require("../src/CellStatusBarItemProvider");

suite('Extension Test Suite', () => {
	let sandbox;
	let mockContext;
	let mockNotebooks;
	let mockWorkspace;
	let mockCommands;
	let mockWindow;
	let mockProgressObject;

	setup(() => {
		sandbox = sinon.createSandbox();

		mockProgressObject = {
			report: sandbox.stub()
		};

		// Mock VSCode API
		mockNotebooks = {
			registerNotebookCellStatusBarItemProvider: sandbox.stub().returns({ dispose: sandbox.stub() })
		};
		mockWorkspace = {
			registerTextDocumentContentProvider: sandbox.stub().returns({ dispose: sandbox.stub() }),
			getConfiguration: sandbox.stub().returns({
				get: sandbox.stub().returns('English'),
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
			showQuickPick: sandbox.stub().resolves('English'),
			visibleTextEditors: [],
			showTextDocument: sandbox.stub().resolves(),
			withProgress: sandbox.stub().callsFake((options, task) => task(mockProgressObject))
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
		const setAnalyzingStub = sandbox.stub(CellStatusBarItemProvider.prototype, 'setAnalyzing');

		// 프로그레스 보고 시뮬레이션을 위한 타이머 모의
		const fakeTimer = sandbox.useFakeTimers();

		await extension.activate(mockContext);
		const analyzeCellErrorCommand = mockCommands.registerCommand.args.find(arg => arg[0] === 'jupyter.gemini.analyzeCellError')[1];
		const commandPromise = analyzeCellErrorCommand(mockCell);

		// 프로그레스 보고를 위해 타이머 진행
		fakeTimer.tick(100);
		await commandPromise;

		assert(ErrorAnalyzer.analyzeError.calledOnce);
		assert(setLatestAnalysisStub.calledOnce);
		assert(mockCommands.executeCommand.calledWith('markdown.showPreviewToSide'));
		assert(mockWindow.withProgress.calledOnce);
		assert(setAnalyzingStub.calledTwice);  // Called with true at start and false at end
		assert(mockProgressObject.report.called);

		fakeTimer.restore();
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
		const setAnalyzingStub = sandbox.stub(CellStatusBarItemProvider.prototype, 'setAnalyzing');

		await extension.activate(mockContext);
		const analyzeCellErrorCommand = mockCommands.registerCommand.args.find(arg => arg[0] === 'jupyter.gemini.analyzeCellError')[1];
		await analyzeCellErrorCommand(mockCell);

		assert(mockWindow.showErrorMessage.calledOnce, 'showErrorMessage should be called once');

		const actualErrorMessage = mockWindow.showErrorMessage.firstCall.args[0];
		assert(actualErrorMessage.includes('Analysis failed'), `Error message should include 'Analysis failed', but got: ${actualErrorMessage}`);

		assert(setAnalyzingStub.calledTwice, 'setAnalyzing should be called twice');
		assert(setAnalyzingStub.firstCall.args[0] === true, 'First call to setAnalyzing should be with true');
		assert(setAnalyzingStub.secondCall.args[0] === false, 'Second call to setAnalyzing should be with false');
	});
});