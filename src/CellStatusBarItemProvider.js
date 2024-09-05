module.exports = class {
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
};