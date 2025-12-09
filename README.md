# Conflux 🌊

> **"Where all streams merge."**
>
> 개발자를 위한 **개인화된 통합 알림 관제 센터 (Personal Control Center)**.

![Platform](https://img.shields.io/badge/Platform-Desktop%20%26%20Web-important?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Beta-blue?style=for-the-badge)

---

## 👋 Meet Conflux

**"하루에 몇 번이나 알림을 확인하느라 흐름이 끊기나요?"**

Conflux는 GitHub, Jira, Sentry 등 흩어진 개발 도구의 알림을 **하나의 타임라인**으로 통합합니다. 수많은 노이즈 속에서 당신에게 **진짜 중요한 정보**만을 필터링하여, 데스크톱과 웹 어디서든 놓치지 않게 도와줍니다.

단순한 알림함이 아닙니다. 당신의 Private 서버 상태를 감시하고, 배치 작업 결과를 수신하는 **당신만의 관제 탑**입니다.

---

## ✨ Key Features

### 1. 📥 Unified Inbox (통합 인박스)
더 이상 브라우저 탭을 헤매지 마세요.
* **All-in-One:** GitHub(PR, Push), Jira(Ticket), Slack, Sentry의 모든 알림이 한곳에 모입니다.
* **Focus View:** '빌드 성공' 같은 소음은 거르고, `@Mention`이나 `Critical Error` 같은 중요 알림만 모아보세요.

### 2. 🔒 Secure Health Check (보안 능동 감시)
당신의 API 서버가 살아있는지 Conflux가 대신 감시해 드립니다.
* **Smart Polling:** 등록한 API 엔드포인트를 1분마다 체크하여 상태를 모니터링합니다.
* **Security First:** 단순 URL 호출은 기본, **Authorization Header**나 **API Token**이 필요한 Private 서버도 안전하게 설정하여 감시할 수 있습니다.
* **Instant Alert:** 서버가 응답하지 않거나 에러(5xx)를 뱉는 순간, 데스크톱 알림을 보냅니다.

### 3. 🖥️ Cross-Platform (어디서나 접속)
* **Desktop App:** macOS와 Windows의 시스템 트레이에 상주하며, 네이티브 알림을 제공합니다.
* **Web Version:** 설치가 불가능한 환경인가요? 브라우저만 있다면 웹 대시보드를 통해 똑같은 기능을 사용할 수 있습니다.

---

## 🚀 Getting Started

현재 Beta 버전은 소스 코드를 통해 직접 실행할 수 있습니다.

### 1. Backend Setup (서버 실행)
Conflux의 두뇌를 실행합니다. (Java 17+ 필요)

```bash
cd conflux-backend
./gradlew bootRun
````

> *Tip: 로컬에서 외부 웹훅(GitHub 등)을 받으려면 `ngrok http 8080`을 실행하여 URL을 생성하세요.*

### 2\. Launch Client (앱 실행)

원하는 방식으로 클라이언트를 실행하세요. (Node.js 18+ 필요)

**🅰️ 데스크톱 앱으로 실행 (권장)**

```bash
cd conflux-client
npm run electron
```

**🅱️ 웹 버전으로 실행**

```bash
cd conflux-client
npm start
```

-----

## 💡 Usage Examples

### 1\. 나만의 배치 작업 알림 받기

파이썬 스크립트나 배치 작업이 끝났을 때, `curl` 한 줄이면 내 PC로 알림을 보낼 수 있습니다.

```bash
# 작업 완료 시 Conflux로 알림 전송
curl -X POST http://localhost:8080/api/webhook/custom \
  -H "Content-Type: application/json" \
  -d '{
    "title": "데이터 백업 완료",
    "message": "총 50GB 백업 성공. 소요시간: 120s",
    "status": "success"
  }'
```

### 2\. Private API 감시 설정 (예시)

보안 토큰이 필요한 내 서버를 감시하려면 설정 메뉴에서 다음과 같이 입력하세요.

  * **Target URL:** `https://api.my-service.com/health`
  * **Method:** `GET`
  * **Headers:** `Authorization: Bearer my-secret-token`
  * **Interval:** `60s`

-----

## 🛠️ Built With

Conflux는 현대적이고 안정적인 기술 스택으로 만들어졌습니다.

  * **Backend:** Spring Boot 3.4
  * **Frontend:** React 18
  * **Desktop:** Electron
  * **Design:** Linear-style Dark Mode UI

-----

**Conflux Project**
*Created by Hoooon22*