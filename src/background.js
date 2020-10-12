'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1300,
    height: 600,
    minWidth: 1300,
    minHeight: 600,
    resizable: true,
    webPreferences: {
      nodeIntegration: true
    }
  })
  console.log(process.env.WEBPACK_DEV_SERVER_URL)
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    // autoUpdater.checkForUpdatesAndNotify()
  }

  win.on('closed', () => {
    win = null
  })

  //处理更新操作
  function handleUpdate () {
    const returnData = {
      error: { status: -1, msg: '检测更新查询异常' },
      checking: { status: 0, msg: '正在检查应用程序更新' },
      updateAva: { status: 1, msg: '检测到新版本，正在下载,请稍后' },
      updateNotAva: { status: -1, msg: '您现在使用的版本为最新版本,无需更新!' }
    }

    //和之前package.json配置的一样
    autoUpdater.setFeedURL(
      'https://gzcsfwq-ms.sf-express.com/knowledge/download/'
    )

    //更新错误
    autoUpdater.on('error', function (error) {
      sendUpdateMessage(returnData.error)
    })

    //检查中
    autoUpdater.on('checking-for-update', function () {
      sendUpdateMessage(returnData.checking)
    })

    //发现新版本
    autoUpdater.on('update-available', function (info) {
      sendUpdateMessage(returnData.updateAva)
    })

    //当前版本为最新版本
    autoUpdater.on('update-not-available', function (info) {
      setTimeout(function () {
        sendUpdateMessage(returnData.updateNotAva)
      }, 1000)
    })

    // 更新下载进度事件
    autoUpdater.on('download-progress', function (progressObj) {
      win.webContents.send('downloadProgress', progressObj)
    })

    autoUpdater.on('update-downloaded', function (
      event,
      releaseNotes,
      releaseName,
      releaseDate,
      updateUrl,
      quitAndUpdate
    ) {
      ipcMain.on('isUpdateNow', (e, arg) => {
        //some code here to handle event
        autoUpdater.quitAndInstall()
      })
      // win.webContents.send('isUpdateNow')
    })

    //执行自动更新检查
    autoUpdater.checkForUpdates()
  }

  // handleUpdate()

  // 通过main进程发送事件给renderer进程，提示更新信息
  function sendUpdateMessage (text) {
    win.webContents.send('message', text)
  }

  ipcMain.on('checkForUpdate', (event, data) => {
    console.log('执行自动更新检查!!!')
    // event.sender.send('reply', 'hi lee my name is yuan, age is 17');
    autoUpdater.checkForUpdates()
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

app.commandLine.appendSwitch('--ignore-certificate-errors', 'true')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
