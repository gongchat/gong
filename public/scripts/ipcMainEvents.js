const { ipcMain } = require('electron');

const logger = require('./logger');
const settings = require('./settings');

class IpcMainEvents {
  attachEvents(app, xmppJsClient, autoUpdater) {
    // this block of functions will be called one after another during startup
    ipcMain.on('xmpp-auto-connect', (event, arg) => {
      xmppJsClient.autoConnect(event, arg);
    });
    ipcMain.on('xmpp-connect', (event, arg) => {
      xmppJsClient.connect(event, arg);
    });
    ipcMain.on('xmpp-roster', event => {
      xmppJsClient.sendGetRoster(event);
    });
    // end of startup chain

    ipcMain.on('xmpp-discover-top-level-items', event => {
      xmppJsClient.sendDiscoverItems(event);
    });

    ipcMain.on('xmpp-discover-sub-level-items', (event, arg) => {
      xmppJsClient.sendDiscoverItems(event, arg);
    });

    ipcMain.on('xmpp-send-message', (event, arg) => {
      xmppJsClient.sendMessage(arg);
    });

    ipcMain.on('xmpp-subscribe-to-room', (event, arg) => {
      xmppJsClient.sendSubscribe(arg.jid, arg.nickname, arg.password);
    });

    ipcMain.on('xmpp-unsubscribe-to-room', (event, arg) => {
      xmppJsClient.sendUnsubscribe(arg.jid, arg.nickname);
    });

    ipcMain.on('xmpp-log-off', () => {
      xmppJsClient.logOff();
    });

    ipcMain.on('xmpp-my-status', (event, arg) => {
      xmppJsClient.sendMyStatus(arg);
    });

    ipcMain.on('xmpp-get-vcard', (event, arg) => {
      xmppJsClient.sendGetVCard(event, arg.from, arg.to);
    });

    ipcMain.on('xmpp-set-vcard', (event, arg) => {
      xmppJsClient.sendSetVCard(event, arg);
    });

    ipcMain.on('xmpp-set-room-nickname', (event, arg) => {
      xmppJsClient.sendRoomNickname(arg.jid, arg.nickname);
    });

    // Settings

    ipcMain.on('set-settings', (event, arg) => {
      settings.set(arg);
    });

    ipcMain.on('set-flash-frame', (event, arg) => {
      settings.set(arg);
    });

    // Log Events

    ipcMain.on('set-log', (event, arg) => {
      logger.set(arg);
    });

    ipcMain.on('get-log', (event, arg) => {
      logger.get(event, arg);
    });

    ipcMain.on('search-log', (event, arg) => {
      logger.search(event, arg);
    });

    // App Events

    ipcMain.on('app-check-for-updates', () => {
      autoUpdater.checkForUpdates();
    });

    ipcMain.on('app-update', (event, arg) => {
      autoUpdater.quitAndInstall();
    });

    ipcMain.on('app-get-info', event => {
      event.sender.send('app-set', {
        version: app.getVersion(),
        operatingSystem: process.platform,
      });
    });
  }
}

const ipcMainEvents = new IpcMainEvents();

module.exports = ipcMainEvents;
