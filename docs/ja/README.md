# Jupyter Gemini Assistant

> この拡張機能は VS Code バージョン **1.89.0** 以上でのみインストールして使用できます。

Jupyter ノートブック（.ipynb）ファイルで発生するエラーを、初心者でも容易に理解し、解決できるように設計されたアシスタントです。

## 機能

- Jupyterノートブックで発生するエラーの原因に関する洞察を提供します。
- エラーを解決するための解決策を提案します。
- **Geminiモデルの選択:** 必要に応じて分析に使用するAIモデルを直接選択する機能。
- **多言語サポート:** 英語、韓国語、日本語、ペルシア語、ロシア語。
- エラー分析結果をサイドパネルで確認できます。

![エラー分析ボタンのクリック](https://github.com/user-attachments/assets/f35a7fb8-2cad-4403-af48-acd68881a874)
![分析結果の表示](https://github.com/user-attachments/assets/04db91e6-8530-4914-a0ad-db4461f67c81)

## 使用方法

1. Jupyterノートブックでコードを実行します。
2. エラーが発生したら、セルに表示される`分析`ボタンをクリックします。
3. Gemini Assistantがエラーを分析し、解決策を提案します。
4. サイドパネルで分析結果を確認し、**必要であればドロップダウンメニューから別のGeminiモデルを選択して再度分析**することができます。

## インストール

Jupyter Gemini Assistantをインストールするには、次の手順に従ってください。

1.  Visual Studio Codeを開きます。
2.  左側のサイドバーにある四角いアイコンをクリックするか、`Ctrl+Shift+X`を押して、拡張機能ビューに移動します。
3.  拡張機能ビューの検索ボックスで「Jupyter Gemini Assistant」を検索します。
4.  Jupyter Gemini Assistant拡張機能の横にある「インストール」ボタンをクリックします。
5.  インストールが完了したら、拡張機能を有効にするためにVS Codeの再読み込みが必要になる場合があります。

拡張機能を見つけるための視覚的なガイドは次のとおりです。

![VSCode 拡張機能のインストール](https://github.com/user-attachments/assets/25d74b06-56e9-49e0-8458-f77147bf0943)

## 設定

Jupyter Gemini Assistantで使用する言語を設定できます。

1.  VS Codeの設定を開きます（ファイル > 基本設定 > 設定）。
2.  「Jupyter Gemini Assistant」を検索します。
3.  ドロップダウンメニューから、お好みの言語（英語、韓国語、日本語）を選択します。

または、次のコマンドを使用することもできます。

1.  コマンドパレットを開きます（`Ctrl+Shift+P`、macOSでは`Cmd+Shift+P`）。
2.  「Jupyter Gemini Assistant: Select Language」のようなコマンド名を入力し、選択します。
3.  表示されるオプションから、お好みの言語を選択します。

## Gemini サーバー

この拡張機能は、エラー分析と解決策の提案のために [gemini-server](https://github.com/IDKNWHORU/gemini-server) を利用します。`gemini-server` は、Jupyter環境とGoogle Gemini Pro API間の通信を仲介する役割を果たし、Assistantがインテリジェントで有用な洞察を提供できるようにします。

## リリースノート

詳細な変更履歴については、[CHANGELOG.md](CHANGELOG.md) ファイルを参照してください。

## コントリビューション

現在、公式なコントリビューションプロセスはありませんが、提案やフィードバックは歓迎します。改善に関するアイデアがある場合や問題が発生した場合は、GitHubリポジトリにIssueを立ててください。

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。ライセンスの全文については、プロジェクトルートにある [LICENSE](LICENSE) ファイルを参照してください。