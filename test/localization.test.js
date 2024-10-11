const assert = require('assert');
const vscode = require('vscode');
const sinon = require('sinon');
const extension = require('../src/extension');

suite("Language Test Suite", () => {
    let sandbox;
    let mockContext;
    let mockWindow;
    let mockWorkspace;
    let mockCommands;

    setup(() => {
        sandbox = sinon.createSandbox();

        mockContext = { subscriptions: [] };

        mockWindow = {
            showQuickPick: sandbox.stub().resolves('English'),
            showInformationMessage: sandbox.stub(),
            withProgress: sandbox.stub().callsFake((options, task) => task({ report: sandbox.stub() }))
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

        sandbox.stub(vscode, 'window').value(mockWindow);
        sandbox.stub(vscode, 'workspace').value(mockWorkspace);
        sandbox.stub(vscode, 'commands').value(mockCommands);
    });

    teardown(() => {
        sandbox.restore();
    });

    test('configuration change updates selected language', async () => {
        await extension.activate(mockContext);

        const configChangeHandler = mockWorkspace.onDidChangeConfiguration.args[0][0];
        mockWorkspace.getConfiguration().get.returns('한국어');

        configChangeHandler({ affectsConfiguration: () => true });

        assert(mockWorkspace.getConfiguration().get.calledWith('language'));
    });

    test('getLocalizedString returns correct strings for different languages', () => {
        const { getLocalizedString } = extension;

        assert.strictEqual(getLocalizedString('analyzing_error', 'English'), 'Analyzing error...');
        assert.strictEqual(getLocalizedString('analyzing_error', '한국어'), '에러 분석 중...');
        assert.strictEqual(getLocalizedString('error_occurred', 'English'), 'Error occurred during analysis: ');
        assert.strictEqual(getLocalizedString('error_occurred', '한국어'), '에러 분석 중 오류 발생: ');
    });
});