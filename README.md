# Gong

Gong is a Electron + React XMPP Client. Currently under development and is in pre-alpha.

## Running the Application

### Node

1.  `xmpp.js@0.6.1` requires node 10.13.0+. I have tried versions 10.0.0 and 11.5.0 and was unable to run the project.

### Keytar

This application uses Keytar to encrypt and decrypt your password. A key is generated and saved to your operating systems password manager. The encrypted
password is saved along with your settings in the `config.json` file.

If you are having issues with Keytar follow the steps below. See this github [issue](https://github.com/atom/node-keytar/issues/51) for more info.
_I am using electron 3, node 10.13.0, and Windows 10_

1. run `npm install`
2. run `.\node_modules\.bin\electron-rebuild`
3. run `npm start`

## Building the Application

1. Run `npm run build`
2. Run `npm run dist`
   1. If you get a `Error: Chunk.entrypoints: Use Chunks.addGroup instead` you may have to run `npm install -D extract-text-webpack-plugin@next`. See this github [issue](https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/701#issuecomment-398103246) for more info.
   2. If you get a `...\app.asar: The process cannot access the file because it is being used by another process.` Close any IDEs that have this project open and run the command from terminal. See this github [issue](https://github.com/electron-userland/electron-builder/issues/3666) for more info.

After `npm run dist` finishes you can find the installation file in `/dist`.