const promiseIpc = require('electron-promise-ipc');

const xmppJsClient = require('./xmppJsClient');

const xmppController = () => {
  // this block of functions will be called one after another during startup
  promiseIpc.on('/xmpp/auto-connect', (arg, event) => {
    return xmppJsClient.autoConnect(arg, event);
  });
  promiseIpc.on('/xmpp/connect', (arg, event) => {
    return xmppJsClient.connect(event, arg);
  });
  promiseIpc.on('/xmpp/roster', () => {
    return xmppJsClient.sendGetRoster();
  });
  // end of startup chain

  promiseIpc.on('/xmpp/log-off', () => {
    return xmppJsClient.logOff();
  });

  promiseIpc.on('/xmpp/discover/top-level-items', (arg, event) => {
    return xmppJsClient.sendDiscoverItems(event);
  });

  promiseIpc.on('/xmpp/discover/sub-level-items', (arg, event) => {
    return xmppJsClient.sendDiscoverItems(event, arg);
  });

  promiseIpc.on('/xmpp/room/nickname/set', arg => {
    return xmppJsClient.sendRoomNickname(arg.jid, arg.nickname);
  });

  promiseIpc.on('/xmpp/room/subscribe', arg => {
    return xmppJsClient.sendSubscribe(arg.jid, arg.nickname, arg.password);
  });

  promiseIpc.on('/xmpp/room/unsubscribe', arg => {
    return xmppJsClient.sendUnsubscribe(arg.jid, arg.nickname);
  });

  promiseIpc.on('/xmpp/send/message', arg => {
    return xmppJsClient.sendMessage(arg);
  });

  promiseIpc.on('/xmpp/send/ping', arg => {
    return xmppJsClient.sendPing(arg);
  });

  promiseIpc.on('/xmpp/status/set', arg => {
    return xmppJsClient.sendMyStatus(arg);
  });

  promiseIpc.on('/xmpp/vcard/get', (arg, event) => {
    return xmppJsClient.sendGetVCard(event, arg.from, arg.to);
  });

  promiseIpc.on('/xmpp/vcard/set', (arg, event) => {
    return xmppJsClient.sendSetVCard(event, arg);
  });
};

module.exports = xmppController;
