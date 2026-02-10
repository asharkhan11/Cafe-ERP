const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  return;
}

let mainWindow;
let backendProcess;

/* ---------------- BACKEND START ---------------- */

function startBackend() {
  if (backendProcess) return;

  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, 'backend', 'server.js')
    : path.join(__dirname, '../backend/server.js');

  backendProcess = spawn(process.execPath, [backendPath], {
    stdio: 'ignore',
    windowsHide: true
  });
}

/* ---------------- WAIT FOR API ---------------- */

function waitForBackend(retries = 30) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      http.get('http://127.0.0.1:3001/products', () => resolve())
        .on('error', () => {
          if (retries-- === 0) reject();
          else setTimeout(attempt, 300);
        });
    };
    attempt();
  });
}

/* ---------------- WINDOW ---------------- */

function createWindow() {
  if (mainWindow) return;

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      contextIsolation: true
    }
  });

  const indexPath = app.isPackaged
    ? path.join(process.resourcesPath, 'frontend', 'dist', 'index.html')
    : path.join(__dirname, '../frontend/dist/index.html');

  mainWindow.loadFile(indexPath);

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.on('closed', () => (mainWindow = null));
}

/* ---------------- SINGLE INSTANCE ---------------- */

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

/* ---------------- APP FLOW ---------------- */

app.whenReady().then(async () => {
  startBackend();
  await waitForBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
