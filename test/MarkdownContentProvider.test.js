const assert = require("assert");
const vscode = require("vscode");
const sinon = require("sinon");
const MarkdownContentProvider = require("../src/MarkdownContentProvider");

suite("MarkdownContentProvider Test Suite", () => {
    let provider;
    let sandbox;
    let mockEventEmitter;

    setup(() => {
        sandbox = sinon.createSandbox();
        // Mock vscode.EventEmitter
        mockEventEmitter = {
            event: sandbox.stub(),
            fire: sandbox.stub()
        };

        sandbox.stub(vscode, "EventEmitter").returns(mockEventEmitter);

        provider = new MarkdownContentProvider();
    });

    teardown(() => {
        sandbox.restore();
    });

    test("setLatestAnalysis should set analysis and fire onDidChange event", () => {
        const analysis = "Test analysis result";
        provider.setLatestAnalysis(analysis);

        assert.strictEqual(provider._latestAnalysis, analysis);
        assert(provider._onDidChange.fire.calledOnce);
        assert(provider._onDidChange.fire.calledWith(vscode.Uri.parse("markdown-preview:error-analysis.md")));
    });

    test("provideTextDocumentContent should return correct markdown when analysis is available", () => {
        const analysis = "Test analysis result";
        provider.setLatestAnalysis(analysis);

        const content = provider.provideTextDocumentContent();
        assert(content.startsWith("# Jupyter Gemini Assistant\n\nTest analysis result\n\n---\nGenerated at:"));
        assert(content.includes(analysis));
        assert(content.includes("# Jupyter Gemini Assistant"));
        assert(content.includes("Generated at:"));
    });

    test("provideTextDocumentContent should return correct waiting message when no analysis is available", () => {
        const content = provider.provideTextDocumentContent();

        assert.strictEqual(content, "# Waiting for Error Analysis\n\nPlease run the error analysis command to see results.");
        assert(content.includes("# Waiting for Error Analysis"));
        assert(content.includes("Please run the error analysis command to see results."));
    });
});