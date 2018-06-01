const {
  app,
  BrowserWindow
} = require('electron')
const path = require('path')
const url = require('url')
const PCSC = require('simple-pcsc')

// Gardez l'objet window dans une constante global, sinon la fenêtre sera fermée
// automatiquement quand l'objet JavaScript sera collecté par le ramasse-miettes.
let win

function createWindow() {
  // Créer le browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600
  })

  // et charge le index.html de l'application.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'dist/yvon-electron/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Ouvre le DevTools.
  win.webContents.openDevTools()

  // Émit lorsque la fenêtre est fermée.
  win.on('closed', () => {
    // Dé-référence l'objet window , normalement, vous stockeriez les fenêtres
    // dans un tableau si votre application supporte le multi-fenêtre. C'est le moment
    // où vous devez supprimer l'élément correspondant.
    win = null
  })
}

// Cette méthode sera appelée quant Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.on('ready', () => {
  createWindow()
  runNFCReader()
})

// Quitte l'application quand toutes les fenêtres sont fermées.
app.on('window-all-closed', () => {
  // Sur macOS, il est commun pour une application et leur barre de menu
  // de rester active tant que l'utilisateur ne quitte pas explicitement avec Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // Sur macOS, il est commun de re-créer une fenêtre de l'application quand
  // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres d'ouvertes.
  if (win === null) {
    createWindow()
  }
})

// Dans ce fichier, vous pouvez inclure le reste de votre code spécifique au processus principal. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.
function runNFCReader() {
  const nfc = new PCSC()
  nfc.on('reader', reader => {

    win.webContents.send('reader', 'DEVICE READY: ' + reader.reader.name)

    reader.on('card', card => {
      win.webContents.send('reader', 'DEVICE READY: ' + reader.reader.name)
      win.webContents.send('card', card.uid)
    })

    reader.on('error', err => {
      win.webContents.send('reader', 'DEVICE READY: ' + reader.reader.name)
      win.webContents.send('error', 'Error: ' + err)
    })

    reader.on('end', () => {
      win.webContents.send('reader', 'DEVICE READY: ' + reader.reader.name)
      win.webContents.send('end', 'DEVICE REMOVED')
    })
  })

  nfc.on('error', err => {
    win.webContents.send('reader', 'DEVICE READY: ' + reader.reader.name)
    win.webContents.send('error', 'An error occured: ' + err)
  })
}
