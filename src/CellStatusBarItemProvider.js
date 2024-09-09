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

    /**
     * Checks if a cell has an error.
     * 
     * @param {object} cell - The cell object to check.
     * @returns {boolean} - True if the cell has an error, false otherwise.
     */
    cellHasError(cell) {
        return cell.outputs.some(output =>
            output.items?.some(item => item.mime === 'application/vnd.code.notebook.error')
        );
    }
};