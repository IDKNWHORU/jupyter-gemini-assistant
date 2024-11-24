# 변경 로그

"Jupyter Gemini Assistant" 확장 프로그램의 모든 주요 변경 사항은 이 파일에 기록됩니다.

형식은 [변경 로그 유지](https://keepachangelog.com/ko/1.0.0/)를 기반으로 하며,
이 프로젝트는 [유의적 버전 관리](https://semver.org/spec/v2.0.0.html)를 준수합니다.

## [0.4.0] - 2024-11-24

### 추가됨

- 분석 결과 표시를 위한 웹뷰 패널
  - 사용자 경험 향상을 위해 마크다운 미리보기를 동적 웹뷰 패널로 교체했습니다.
  - 웹뷰 패널 내 코드 블록에 복사 기능을 추가했습니다.
  - 웹뷰에서 분석 결과 렌더링 및 스타일을 개선했습니다.
- Gemini 모델 업데이트
  - Gemini 모델을 Gemini 1.5 Flash에서 Gemini Exp 1121로 변경했습니다.

### 변경됨

- 웹뷰 패널 생성 및 업데이트를 관리하기 위해 `createOrUpdateWebviewPanel` 함수를 업데이트했습니다.
- 새로운 웹뷰 패널을 활용하도록 분석 결과 표시 로직을 리팩토링했습니다.

### 개선됨

- 웹뷰 패널을 통해 분석 결과와 사용자 상호 작용을 향상시켰습니다.
- 표시 로직에서 분석 로직을 분리하여 코드 유지 관리성을 개선했습니다.

## [0.3.0] - 2024-10-11

### 추가됨

- CellStatusBarItemProvider에서 분석 상태 추적
  - 진행 중인 분석 상태를 추적하기 위한 새로운 isAnalyzing 속성
  - 분석 상태를 업데이트하는 setAnalyzing 메서드
- 오류 분석 프로세스를 위한 진행률 표시줄
- getLocalizedString 함수를 사용한 현지화 지원
- 오류 분석 및 언어 지원을 위한 포괄적인 테스트 스위트
  - ErrorAnalyzer 테스트 스위트
  - 확장된 명령 테스트 스위트
  - 새로운 언어 테스트 스위트

### 변경됨

- 향상된 오류 감지 및 상태 표시줄 항목 제공 로직
- extension.js에서 오류 처리 및 사용자 피드백 개선
- 현지화된 문자열을 사용하도록 언어 선택 업데이트
- 언어 업데이트에 대한 구성 변경 처리 개선

### 개선됨

- JSDoc 주석을 사용한 코드 문서화
- 핵심 확장 기능에 대한 전반적인 테스트 커버리지
- 테스트에서 VSCode API 및 전역 fetch 함수 모의

## [0.2.0] - 2024-09-13

### 추가됨

- Jupyter Gemini Assistant의 언어를 선택하는 새로운 명령
- 언어 선택을 위한 구성 옵션(영어 또는 한국어)
- `ErrorAnalyzer` 클래스를 사용한 오류 분석 개선
- 분석 결과를 표시하기 위한 새로운 `MarkdownContentProvider`
- 확장을 위한 포괄적인 테스트 스위트
  ![output_select_language](https://github.com/user-attachments/assets/4383f5ef-3c56-4cc5-aa7f-2a32e04a7ef0)

### 변경됨

- Jupyter 노트북을 포함하도록 확장 활성화 이벤트 업데이트
- 새로운 클래스를 사용하고 모듈성을 개선하기 위해 `extension.js` 리팩토링
- 향상된 오류 처리 및 사용자 피드백

### 개선됨

- 전반적인 코드 구조 및 오류 처리
- 언어 선택 및 오류 분석 표시 사용자 경험

## [0.1.2] - 2024-09-05

### 수정됨

- 'vscode' 모듈이 import되지 않은 MarkdownContentProvider.js의 버그
  - 파일 시작 부분에 `const vscode = require('vscode');` 추가
  - 정의되지 않은 vscode 객체 관련 문제 해결

## [0.1.1] - 2024-09-05

### 변경됨

- AI 분석 결과의 출력 방법을 outputChannel에서 사이드 패널의 마크다운 미리보기로 변경
  - 사용자 경험 개선, 분석 결과 확인 및 상호 작용 용이성 향상

### 추가됨

- 새로운 사이드 패널 마크다운 미리보기 인터페이스 스크린샷
  ![새로운 사이드 패널 인터페이스](https://github.com/user-attachments/assets/5445d853-490c-469f-a060-5f6919d071e4)

## [0.1.0] - 2024-09-02

### 추가됨

- 향상된 오류 분석 로직을 위한 새로운 `ErrorAnalyzer` 클래스
- 보다 상세한 오류 메시지를 통한 오류 처리 개선
- 사용자 경험을 위한 새로운 `CellStatusBarItemProvider` 클래스

### 변경됨

- 오류 분석 함수에서 async/await 사용 개선
- 불필요한 조건문을 제거하고 더 나은 코드 구조를 위해 조기 반환 구현
- 옵셔널 체이닝을 사용하여 형식 안전성 향상

### 개선됨

- 전반적인 코드 가독성 및 유지 관리성

## [0.0.2] - 2024-07-10

### 추가됨

- 오류 분석 기능의 초기 구현
- Jupyter 노트북을 위한 기본 상태 표시줄 통합

### 수정됨

- 오류 감지 로직의 사소한 버그

## [0.0.1] - 2024-07-10

### 추가됨

- Jupyter Gemini Assistant의 초기 릴리스
- 기본 프로젝트 구조 및 구성