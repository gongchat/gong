# Gong &middot; [![Build Status](https://travis-ci.org/gongchat/gong.svg?branch=master)](https://travis-ci.org/gongchat/gong) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

Gong is a Electron + React XMPP Client. Currently under development and is in alpha.

## Running the Application

### XMPP Server

If you do not have an XMPP server [Openfire](https://www.igniterealtime.org/projects/openfire/) is a good option.

### Node

1.  `xmpp.js@0.7.0` requires node 10.13.0+. I have tried versions 10.0.0 and 11.5.0 and was unable to run the project.

### Keytar

This application uses Keytar to encrypt and decrypt your password. A key is generated and saved to your operating systems password manager. The encrypted
password is saved along with your settings in the `config.json` file.

If you are on linux you and do not already have `libsecret` installed run `sudo apt-get install libsecret-1-dev` before running `npm install`.

## Starting up the Application

Run `npm start` to start the application

## Building the Application

Run `npm run dist` to build the application. Build files will be outputted to the `/dist` folder.

## Updating Your Application

The app will update based off of GitHub releases. If you find that your application is behaving strange deleting the `config.json` file may fix any issues. This will reset any user credentials, custom theme settings, and saved rooms.

The location of the `config.json` file is different depending on your operating system. Typical locations are below.

- Windows: `C:\Users\<username>\AppData\Roaming\gong\config.json`
- Linux: `~/.config/gong/config.json`
- Mac: `~/Library/Application Support/gong/config.json`

## Troubleshooting

- If you run into `Error: ENOSPC: System limit for number of file watchers reached, watch` run `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`
- If you get a `Error: Chunk.entrypoints: Use Chunks.addGroup instead` you may have to run `npm install -D extract-text-webpack-plugin@next`. See this github [issue](https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/701#issuecomment-398103246) for more info.
- If you get a `...\app.asar: The process cannot access the file because it is being used by another process.` Close any IDEs that have this project open and run the command from terminal. See this github [issue](https://github.com/electron-userland/electron-builder/issues/3666) for more info.
- If you are having issues with Keytar and seeing errors like the code below run the commands below it. See this github [issue](https://github.com/atom/node-keytar/issues/51) for more info.

    ```console
    events.js:174
            throw er; // Unhandled 'error' event
            ^
    Error: spawn /<project directory>/gong/node_modules/electron/dist EACCES
        at Process.ChildProcess._handle.onexit (internal/child_process.js:240:19)
        at onErrorNT (internal/child_process.js:415:16)
        at process._tickCallback (internal/process/next_tick.js:63:19)
        at Function.Module.runMain (internal/modules/cjs/loader.js:757:11)
        at startup (internal/bootstrap/node.js:283:19)
        at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3)
    Emitted 'error' event at:
        at Process.ChildProcess._handle.onexit (internal/child_process.js:246:12)
        at onErrorNT (internal/child_process.js:415:16)
        [... lines matching original stack trace ...]
        at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3)
    ```

  - For Windows run `.\node_modules\.bin\electron-rebuild`
  - For Linux run `./node_modules/.bin/electron-rebuild`