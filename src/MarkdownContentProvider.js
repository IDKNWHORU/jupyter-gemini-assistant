const vscode = require('vscode');

module.exports = class {
    constructor() {
        this._onDidChange = new vscode.EventEmitter();
        this._latestAnalysis = null;
    }

    get onDidChange() {
        return this._onDidChange.event;
    }

    /**
     * Sets the latest analysis result and notifies listeners of the change.
     * 
     * @param {string} analysis - The latest analysis result to be set.
     * @returns {void}
     * 
     * This method updates the internal _latestAnalysis property with the new analysis result
     * and fires an event to notify listeners that the content has changed. The event includes
     * a URI that points to the markdown preview of the error analysis.
     */
    setLatestAnalysis(analysis) {
        this._latestAnalysis = analysis;
        // 콘텐츠가 변경되었음을 알립니다
        this._onDidChange.fire(vscode.Uri.parse('markdown-preview:error-analysis.md'));
    }

    /**
     * Provides the text document content for the markdown preview.
     * 
     * @returns {string} The markdown content to be displayed.
     * 
     * This method generates and returns the markdown content for the preview. If there's a latest
     * analysis result available, it returns a formatted markdown string including the analysis
     * result and a timestamp. If no analysis result is available, it returns a waiting message.
     */
    provideTextDocumentContent() {
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