const electron = require('electron')
const {remote} = require('electron');
const {Menu, MenuItem} = remote;
const {app} = remote.app

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);
  var name = "Hordes";
  var template = [
      {
        label: name,
        submenu: [
          {
            label: 'About ' + name,
            role: 'about'
          },
          {
            label: 'Settings',
            accelerator: 'CmdOrCtrl+,',
            click: function(item, focusedWindow) {
              if (focusedWindow){
                $('#myModal .modal-title').html("Settings");
                $('#myModal .modal-body').load("./settings.html");
                $('#myModal').modal();
              }
                //remote.app.showSettings()
                //focusedWindow.reload();
            }
          },
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: function(item, focusedWindow) {
              if (focusedWindow)
                focusedWindow.reload();
            }
          },
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
          },
          {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: function(item, focusedWindow) {
              if (focusedWindow)
                remote.app.quit();
            }
          },
          {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            click: function(item, focusedWindow) {
              if (focusedWindow)
                remote.app.quit();
            }
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: (function() {
              if (process.platform == 'darwin')
                return 'Alt+Command+I';
              else
                return 'Ctrl+Shift+I';
            })(),
            click: function(item, focusedWindow) {
              if (focusedWindow) focusedWindow.toggleDevTools();
            }
          },
        ]
      }
    ];

    if (process.platform == 'darwin') {

    }

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
