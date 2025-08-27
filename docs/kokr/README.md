# Jupyter Gemini Assistant

> 이 확장 프로그램은 VS Code 버전 **1.89.0** 이상에서만 설치 및 사용할 수 있습니다.

Jupyter 노트북(.ipynb) 파일에서 발생하는 오류를 초보자가 쉽게 이해하고 해결할 수 있도록 설계된 Assistant입니다.

## 기능

- Jupyter 노트북에서 발생하는 오류 원인에 대한 통찰력 제공
- 오류 해결을 위한 해결책 제안
- **Gemini 모델 선택:** 필요에 따라 분석에 사용할 AI 모델을 직접 선택하는 기능
- 다국어 지원 (영어 및 한국어)
- 오류 분석 결과 표시 측면 패널에서 확인

![오류 분석 버튼 클릭](https://github.com/user-attachments/assets/f35a7fb8-2cad-4403-af48-acd68881a874)
![분석 결과 표시](https://github.com/user-attachments/assets/04db91e6-8530-4914-a0ad-db4461f67c81)

## 사용 방법

1. Jupyter 노트북에서 코드를 실행합니다.
2. 오류가 발생하면 셀에 나타나는 `분석` 버튼을 클릭합니다.
3. Gemini Assistant가 오류를 분석하고 해결책을 제안합니다.
4. 측면 패널에서 분석 결과를 확인하고, **필요시 드롭다운 메뉴에서 다른 Gemini 모델과 언어를 선택하여 다시 분석**할 수 있습니다.

## 설치

Jupyter Gemini Assistant를 설치하려면 다음 단계를 따르십시오.

1. Visual Studio Code를 엽니다.
2. 왼쪽 사이드바에 있는 사각형 아이콘을 클릭하거나 `Ctrl+Shift+X`를 눌러 확장 보기로 이동합니다.
3. 확장 보기 검색 상자에서 "Jupyter Gemini Assistant"를 검색합니다.
4. Jupyter Gemini Assistant 확장 옆에 있는 "설치" 버튼을 클릭합니다.
5. 설치가 완료되면 확장을 활성화하기 위해 VS Code를 다시 로드해야 할 수 있습니다.

다음은 확장을 찾는 데 도움이 되는 시각적 가이드입니다.

![VSCode 확장 설치](https://github.com/user-attachments/assets/25d74b06-56e9-49e0-8458-f77147bf0943)

## 구성

Jupyter Gemini Assistant에서 사용하는 언어를 구성할 수 있습니다.

1. VS Code 설정을 엽니다 (파일 > 환경 설정 > 설정).
2. "Jupyter Gemini Assistant"를 검색합니다.
3. 드롭다운 메뉴에서 선호하는 언어(영어 또는 한국어)를 선택합니다.

또는 다음 명령을 사용할 수 있습니다.

1. 명령 팔레트를 엽니다 (Ctrl+Shift+P 또는 macOS에서는 Cmd+Shift+P).
2. "Jupyter Gemini Assistant의 언어 선택"을 입력하고 선택합니다.
3. 제시된 옵션에서 선호하는 언어를 선택합니다.

## Gemini 서버

이 확장은 오류 분석 및 해결책 제안을 위해 [gemini-server](https://github.com/IDKNWHORU/gemini-server)를 활용합니다. `gemini-server`는 Jupyter 환경과 Google Gemini Pro API 간의 통신을 용이하게 하는 중개자 역할을 하여 Assistant가 지능적이고 유용한 통찰력을 제공할 수 있도록 합니다.

## 릴리스 노트

자세한 변경 사항은 [CHANGELOG.md](CHANGELOG.md) 파일을 참조하세요.

## 기여

현재 공식적인 기여 프로세스는 없지만 제안이나 피드백을 환영합니다. 개선 사항에 대한 아이디어가 있거나 문제가 발생하면 GitHub 리포지토리에 문제를 열어주십시오.

## 라이선스

이 프로젝트는 MIT 라이선스에 따라 라이선스가 부여됩니다. 전체 라이선스 텍스트는 프로젝트 루트의 [LICENSE](LICENSE) 파일을 참조하십시오.
