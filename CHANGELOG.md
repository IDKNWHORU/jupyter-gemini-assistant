# Changelog

All notable changes to the "Jupyter Gemini Assistant" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.0] - 2025-12-18

### Added
- **Error message for quota issues**: An error message stating "Quota exceeded! Change model!" will now appear when quota limits are reached.

### Changed
- Removed the Gemini Pro model from supported models due to frequent quota issues.
- Removed deprecated models that are no longer supported by the API.

## [0.7.0] - 2025-08-27

### Added

- **Gemini Model Selection in WebView**: Implemented a dropdown menu in the WebView panel that allows users to directly select the Gemini model for error analysis. This enables users to flexibly choose a model based on their needs for speed, cost, or performance.
- **New Model Support**: Added support for the following list of Gemini models:
  - `gemini-2.0-flash`
  - `gemini-2.0-flash-lite`
  - `gemini-2.5-flash`
  - `gemini-2.5-flash-lite`
  - `gemini-2.5-pro`

## [0.6.1] - 2025-05-02

### Changed

- Localized the label "사용 언어:" within the WebView panel to respect the user's language selection.

## [0.6.0] - 2025-04-28

### Added

- Added **Persian (فارسی)** language support for analysis results and the webview interface.
- Added **Russian (Русский)** language support for analysis results and the webview interface.

### Changed

- Updated the Gemini model used for analysis to `gemini-2.5-flash-preview-04-17`.

## [0.5.0] - 2025-04-12

### Added

- Added **Japanese (日本語)** language support for analysis results and the webview interface.
- Integrated a language selection dropdown menu into the analysis result webview panel header, allowing users to change the language directly within the panel.

### Changed

- Implemented the `panel.webview.onDidReceiveMessage` handler logic to receive and process language change requests (the `updateLanguage` message) from the webview.

## [0.4.0] - 2024-11-24

### Added

- Webview panel for displaying analysis results
  - Replaced Markdown preview with a dynamic webview panel for enhanced user experience.
  - Added copy functionality to code blocks within the webview panel.
  - Improved rendering and styling of analysis results in the webview.
- Gemini Model update
  - Changed Gemini Model from Gemini 1.5 Flash to Gemini Exp 1121.

### Changed

- Updated `createOrUpdateWebviewPanel` function to manage webview panel creation and updates.
- Refactored analysis result display logic to utilize the new webview panel.

### Improved

- Enhanced user interaction with analysis results through the webview panel.
- Improved code maintainability by decoupling analysis logic from display logic.

## [0.3.0] - 2024-10-11

### Added

- Analysis state tracking in CellStatusBarItemProvider
  - New isAnalyzing property to track ongoing analysis state
  - setAnalyzing method to update the analysis state
- Progress bar for error analysis process
- Localization support with getLocalizedString function
- Comprehensive test suites for error analysis and language support
  - ErrorAnalyzer test suite
  - Expanded Command Test Suite
  - New Language Test Suite

### Changed

- Enhanced error detection and status bar item provision logic
- Improved error handling and user feedback in extension.js
- Updated language selection to use localized strings
- Refined configuration change handling for language updates

### Improved

- Code documentation with JSDoc comments
- Overall test coverage for core extension functionality
- Mocking of VSCode API and global fetch function in tests

## [0.2.0] - 2024-09-13

### Added

- New command to select language for Jupyter Gemini assistant
- Configuration option for language selection (English or Korean)
- Improved error analysis with `ErrorAnalyzer` class
- New `MarkdownContentProvider` for displaying analysis results
- Comprehensive test suite for the extension
  ![output_select_language](https://github.com/user-attachments/assets/4383f5ef-3c56-4cc5-aa7f-2a32e04a7ef0)

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
