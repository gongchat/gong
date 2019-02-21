const CryptoJS = require('crypto-js');
const electronStore = require('electron-store');
const keytar = require('keytar');

class IpcMainEvents {
  attachEvents(ipcMain, xmppClient) {
    // XMPP Events
    // these are events dispatched by the react app.

    // this block of functions will be called one after another during startup
    ipcMain.on('xmpp-auto-connect', (event, arg) => {
      xmppClient.autoConnect(event, arg);
    });
    ipcMain.on('xmpp-connect', (event, arg) => {
      xmppClient.connect(event, arg);
    });
    ipcMain.on('xmpp-initial-presence', () => {
      xmppClient.sendInitialPresence();
    });
    ipcMain.on('xmpp-roster', (event) => {
      xmppClient.sendGetRoster(event);
    });
    // end of startup chain

    ipcMain.on('xmpp-discover-top-level-items', (event) => {
      xmppClient.sendDiscoverItems(event);
    });

    ipcMain.on('xmpp-discover-sub-level-items', (event, arg) => {
      xmppClient.sendDiscoverItems(event, arg);
    });

    ipcMain.on('xmpp-send-message', (event, arg) => {
      xmppClient.sendMessage(arg);
    });

    ipcMain.on('xmpp-subscribe-to-room', (event, arg) => {
      xmppClient.sendSubscribe(arg.jid, arg.nickname);
    });

    ipcMain.on('xmpp-unsubscribe-to-room', (event, arg) => {
      xmppClient.sendUnsubscribe(arg.jid, arg.nickname);
    });

    ipcMain.on('xmpp-log-off', () => {
      xmppClient.logOff();
    });

    ipcMain.on('xmpp-my-status', (event, arg) => {
      xmppClient.sendMyStatus(arg);
    });

    ipcMain.on('xmpp-get-vcard', (event, arg) => {
      xmppClient.sendGetVCard(event, arg.from, arg.to);
    });

    ipcMain.on('xmpp-set-vcard', (event, arg) => {
      xmppClient.sendSetVCard(event, arg);
    });
  }
}

module.exports = IpcMainEvents;
