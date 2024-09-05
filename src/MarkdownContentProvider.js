module.exports = class {
    constructor() {
        this._onDidChange = new vscode.EventEmitter();
        this._latestAnalysis = null;
    }

    get onDidChange() {
        return this._onDidChange.event;
    }

    setLatestAnalysis(analysis) {
        this._latestAnalysis = analysis;
        // 콘텐츠가 변경되었음을 알립니다
        this._onDidChange.fire(vscode.Uri.parse('markdown-preview:error-analysis.md'));
    }

    provideTextDocumentContent(uri) {
        if (this._latestAnalysis) {
            return `# Jupyter Gemini Assistant

${this._latestAnalysis}

---
Generated at: ${new Date().toLocaleString()}
`;
        } else {
            return '# Waiting for Error Analysis\n\nPlease run the error analysis command to see results.';
        }
    }
}