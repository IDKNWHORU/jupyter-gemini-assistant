# Changelog
All notable changes to the "Jupyter Gemini Assistant" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2024-09-13
### Added
- New command to select language for Jupyter Gemini assistant
- Configuration option for language selection (English or Korean)
- Improved error analysis with `ErrorAnalyzer` class
- New `MarkdownContentProvider` for displaying analysis results
- Comprehensive test suite for the extension

### Changed
- Updated extension activation events to include Jupyter notebooks
- Refactored `extension.js` to use new classes and improve modularity
- Enhanced error handling and user feedback

### Improved
- Overall code structure and error handling
- User experience with language selection and error analysis display

## [0.1.2] - 2024-09-05
### Fixed
- Bug in MarkdownContentProvider.js where 'vscode' module was not imported
  - Added `const vscode = require('vscode');` at the beginning of the file
  - Resolved issues related to undefined vscode object

## [0.1.1] - 2024-09-05
### Changed
- Modified the output method for AI analysis results from outputChannel to a Markdown preview in the side panel
  - Improved user experience, allowing for easier viewing and interaction with analysis results

### Added
- Screenshot of the new side panel Markdown preview interface
  ![New Side Panel Interface](https://github.com/user-attachments/assets/5445d853-490c-469f-a060-5f6919d071e4)

## [0.1.0] - 2024-09-02
### Added
- New `ErrorAnalyzer` class for improved error analysis logic
- Enhanced error handling with more detailed error messages
- New `CellStatusBarItemProvider` class for user experience.

### Changed
- Improved async/await usage in error analysis function
- Removed unnecessary conditionals and implemented early returns for better code structure
- Enhanced type safety with optional chaining

### Improved
- Overall code readability and maintainability

## [0.0.2] - 2024-07-10
### Added
- Initial implementation of error analysis functionality
- Basic status bar integration for Jupyter notebooks

### Fixed
- Minor bugs in error detection logic

## [0.0.1] - 2024-07-10
### Added
- Initial release of Jupyter Gemini Assistant
- Basic project structure and configuration