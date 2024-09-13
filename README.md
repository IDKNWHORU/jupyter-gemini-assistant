# Jupyter Gemini Assistant README

An assistant designed to help beginners easily understand and resolve errors occurring in Jupyter notebook (.ipynb) files.

## Features

- Provides insights into the cause of errors occurring in Jupyter notebooks
- Suggests solutions for resolving errors
- Supports multiple languages (English and Korean)
- Displays error analysis results in a side panel Markdown preview

![Error Analyse Button Click](https://github.com/user-attachments/assets/f35a7fb8-2cad-4403-af48-acd68881a874)
![Show Analyse Result](https://github.com/user-attachments/assets/8abcd730-0a81-4e04-97e8-981150fa73cd)

## How to Use

1. Run your code in a Jupyter Notebook.
2. If an error occurs, click the `analyse` button that appears in the cell.
3. The Gemini Assistant will analyze the error and suggest solutions.
4. View the detailed analysis in the new side panel Markdown preview.

## Installation

To install the Jupyter Gemini Assistant:

1. Open Visual Studio Code
2. Go to the Extensions view by clicking on the square icon in the left sidebar or pressing `Ctrl+Shift+X`
3. Search for "Jupyter Gemini Assistant" in the Extensions view search box
4. Click on the "Install" button next to the Jupyter Gemini Assistant extension
5. Once installed, you may need to reload VS Code to activate the extension

Here's a visual guide to help you find the extension:

![VSCode Extension Installation](https://github.com/user-attachments/assets/967e3485-3ffe-4cb3-8a8e-c7cc7cb790b3)

## Configuration

You can configure the language used by the Jupyter Gemini Assistant:

1. Open VS Code settings (File > Preferences > Settings)
2. Search for "Jupyter Gemini Assistant"
3. Choose your preferred language (English or Korean) from the dropdown menu

Alternatively, you can use the command:

1. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on macOS)
2. Type "Select Language for Jupyter Gemini assistant" and select it
3. Choose your preferred language from the options presented

## Release Notes

### 0.2.0 (2024-09-13)

- Added language selection feature (English or Korean)
- Improved error analysis with new `ErrorAnalyzer` class
- Enhanced user experience with improved error handling and feedback

### 0.1.2 (2024-09-05)

- Fixed a bug in MarkdownContentProvider.js where 'vscode' module was not imported
- Resolved issues related to undefined vscode object

### 0.1.1 (2024-09-05)

- Changed AI analysis results output to a Markdown preview in the side panel
- Improved user experience for viewing and interacting with analysis results

### 0.1.0 (2024-09-02)

- Improved program operation
- Added `analyse` button to cells where errors occur
- Enhanced user experience: Easy error analysis with a button click

### 0.0.1 (2024-07-10)

- Initial release of "jupyter-gemini-assistant"
- Implemented basic error analysis functionality

## Contributing

While we don't have a formal contribution process at the moment, we welcome any suggestions or feedback. If you have ideas for improvements or encounter any issues, please feel free to open an issue in the GitHub repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file in the project root for the full license text.