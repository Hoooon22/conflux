const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Electron 브라우저 윈도우 생성
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    backgroundColor: '#111',
    title: 'Conflux - Where all streams merge',
    resizable: true,
    minimizable: true,
    maximizable: true,
    icon: path.join(__dirname, 'icon.png'), // 아이콘 파일이 있다면
  });

  // 개발 모드: React 개발 서버 로드
  // 프로덕션 모드: 빌드된 index.html 로드
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // 개발 모드에서 DevTools 자동 열기 (선택사항)
    // mainWindow.webContents.openDevTools();
  } else {
    // 프로덕션: React 빌드 결과물 (build/index.html) 로드
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  // 윈도우가 닫힐 때 참조 제거
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 로딩 완료 시 로그
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('✅ Conflux Desktop App loaded successfully!');
  });

  // 로딩 실패 시 에러 핸들링
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('❌ Failed to load:', errorCode, errorDescription);
    if (isDev) {
      console.log('💡 Hint: Make sure React dev server is running on http://localhost:3000');
    }
  });
}

// Electron 앱이 준비되면 윈도우 생성
app.whenReady().then(() => {
  createWindow();

  // macOS: 모든 윈도우가 닫혀도 앱이 종료되지 않음
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 모든 윈도우가 닫히면 앱 종료 (macOS 제외)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// GPU 가속 비활성화 (선택사항 - 호환성 문제 해결)
// app.disableHardwareAcceleration();

console.log('🚀 Conflux Desktop App starting...');
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
