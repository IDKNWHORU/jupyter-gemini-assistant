# Jupyter Gemini Assistant

> This extension requires VS Code version **1.89.0** or higher to install and use.

- [한국어](/docs/kokr/README.md)를 선호하신 다면 이 문서를 확인해보세요.
- [日本語]のドキュメントをご希望の方は、[こちらの文書](/docs/ja/README.md)をご確認ください。
- Если вы предпочитаете [документацию на русском языке](/docs/ru/README.md), ознакомьтесь с этим документом.
- [اسناد فارسی](/docs/fa/README.md) را ترجیح می دهید، این سند را بررسی کنید.


An assistant designed to help beginners easily understand and resolve errors occurring in Jupyter notebook (.ipynb) files.

## Features

- Provides insights into the cause of errors occurring in Jupyter notebooks
- Suggests solutions for resolving errors
- **Gemini Model Selection:** A feature to directly select the AI model for analysis based on your needs.
- **Multi-language Support:** Supports multiple languages (English, Korean, Japanese, Persian and Russian.)
- Displays error analysis results in a side panel

![Error Analyse Button Click](https://github.com/user-attachments/assets/f35a7fb8-2cad-4403-af48-acd68881a874)
![Show Analyse Result](https://github.com/user-attachments/assets/04db91e6-8530-4914-a0ad-db4461f67c81)

## How to Use

1. Run your code in a Jupyter Notebook.
2. If an error occurs, click the `analyse` button that appears in the cell.
3. The Gemini Assistant will analyze the error and suggest solutions.
4. View the detailed analysis results in the side panel and, if needed, **you can re-analyze by selecting a different Gemini model from the dropdown menu**.

## Installation

To install the Jupyter Gemini Assistant:

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the square icon in the left sidebar or pressing `Ctrl+Shift+X`.
3. Search for "Jupyter Gemini Assistant" in the Extensions view search box.
4. Click on the "Install" button next to the Jupyter Gemini Assistant extension.
5. Once installed, you may need to reload VS Code to activate the extension.

Here's a visual guide to help you find the extension:

![VSCode Extension Installation](https://github.com/user-attachments/assets/25d74b06-56e9-49e0-8458-f77147bf0943)

## Configuration

You can configure the language used by the Jupyter Gemini Assistant:

1. Open VS Code settings (File > Preferences > Settings).
2. Search for "Jupyter Gemini Assistant".
3. Choose your preferred language (English or Korean) from the dropdown menu.

Alternatively, you can use the command:

1. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on macOS).
2. Type "Select Language for Jupyter Gemini assistant" and select it.
3. Choose your preferred language from the options presented.

## Gemini Server

This extension utilizes the [gemini-server](https://github.com/IDKNWHORU/gemini-server) for error analysis and solution suggestions. The `gemini-server` acts as an intermediary, facilitating communication between the Jupyter environment and the Google Gemini Pro API, enabling the assistant to provide intelligent and helpful insights.

## Release Notes

For detailed changes, please refer to the [CHANGELOG.md](CHANGELOG.md) file.

## Contributing

While we don't have a formal contribution process at the moment, we welcome any suggestions or feedback. If you have ideas for improvements or encounter any issues, please feel free to open an issue in the GitHub repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file in the project root for the full license text.
