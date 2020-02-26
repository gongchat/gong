const log = require('electron-log');
const ElectronStore = require('electron-store');
const CryptoJS = require('crypto-js');
const keytar = require('keytar');
const isDev = require('electron-is-dev');

const { client, xml } = require('@xmpp/client');
const debug = require('@xmpp/debug');

const appSettings = require('./settings');

// TODO: find less hacky solution, https://stackoverflow.com/questions/35633829/node-js-error-process-env-node-tls-reject-unauthorized-what-does-this-mean
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const electronStore = new ElectronStore();

class XmppJsClient {
  constructor() {
    this.xmpp = null;
    this.credentials = null;
    this.pingInterval = null;
  }

  //
  // Connection
  //
  async killConnection() {
    if (this.xmpp) {
      log.info('Killing XMPP connection');
      await this.xmpp.stop();
      this.xmpp.removeAllListeners();
      this.xmpp = null;
    }
  }

  autoConnect(event, arg) {
    this.credentials = { username: arg.credentials.username };
    keytar.getPassword('gong', arg.credentials.username).then(key => {
      arg.credentials.password = key
        ? CryptoJS.AES.decrypt(arg.credentials.password, key).toString(
            CryptoJS.enc.Utf8
          )
        : arg.credentials.password;
      this.connect(event, arg.credentials, key, {
        minimizeToTrayOnClose: arg.minimizeToTrayOnClose,
      });
    });
  }

  async connect(event, credentials, key, settings) {
    this.credentials = { username: credentials.username };
    if (this.xmpp && this.xmpp.status === 'online') {
      await this.killConnection();
      this.createConnection(event, credentials, key, settings);
    } else if (!this.xmpp) {
      this.createConnection(event, credentials, key, settings);
    }
  }

  async createConnection(event, credentials, key, settings) {
    log.info(`XMPP is attempting to connect to ${credentials.domain}`);

    this.xmpp = client({
      service: `xmpp://${credentials.domain}:${credentials.port}`,
      domain: credentials.domain,
      username: credentials.username,
      resource: credentials.resource,
      password: credentials.password,
    });

    if (isDev) {
      debug(this.xmpp, true);
    }

    this.attachEvents(event, credentials, key, settings);

    await this.xmpp.start().catch(console.error);
  }

  attachEvents(event, credentials, key, settings) {
    this.xmpp.on('error', async err => {
      log.info(`XMPP error: ${err}`);

      let stopClient = false;

      if (!err.code) {
        if (err.name === 'SASLError' && err.condition === 'not-authorized') {
          console.log('ERROR: SASLError, not-authorized');
          event.sender.send('xmpp-connection-failed', {
            error: 'Cannot authorize your credentials',
          });
        }
      } else {
        switch (err.code) {
          case 'ENOTFOUND':
            console.log('ERROR: ENOTFOUND; stopping client');
            event.sender.send('xmpp-connection-failed', {
              error: 'Cannot find your server',
            });
            stopClient = true;
            break;
          case 'ECONNRESET':
            console.log('ERROR: ECONNRESET; stopping client; error unknown;');
            event.sender.send('xmpp-connection-failed', {
              error: 'Connection to server failed',
            });
            stopClient = true;
            break;
          case 'ECONNREFUSED':
            console.log('ERROR: ECONNREFUSED; stopping client');
            event.sender.send('xmpp-connection-failed', {
              error: 'Cannot connect to server',
            });
            stopClient = true;
            break;
          case 'ECONNABORTED':
            console.log('ERROR: ECONNABORTED');
            event.sender.send('xmpp-connection-failed', {
              error: 'Connection has been aborted',
            });
            stopClient = true;
            break;
          case 'EPIPE':
          case 'ERR_STREAM_WRITE_AFTER_END':
            console.log('ERROR: Writing to an old stream');
            break;
          default:
            console.log('ERROR: ', err);
            break;
        }
      }

      if (this.xmpp && stopClient) {
        await this.killConnection();
      }
    });

    this.xmpp.on('online', jid => {
      log.info(`XMPP has connected to ${jid}`);
      console.log('ONLINE:', jid.toString());

      this.sendGetInfo(event, credentials.domain);

      if (settings) {
        appSettings.set(settings);
      }
      this.credentials = { ...credentials, jid: jid.toString() };

      if (!key) {
        key = CryptoJS.PBKDF2(credentials.password, '', {
          keySize: 512 / 32,
          iterations: 1000,
        }).toString();
        keytar.setPassword('gong', credentials.username, key);
      }

      credentials.password = CryptoJS.AES.encrypt(
        credentials.password,
        key
      ).toString();

      event.sender.send('xmpp-connected', {
        jid: jid.toString(),
        domain: credentials.domain,
        username: credentials.username,
        resource: credentials.resource,
        port: credentials.port,
        password: credentials.password,
      });

      // ping it
      clearInterval(this.pingInterval);
      this.pingInterval = setInterval(() => {
        if (this.xmpp && this.xmpp.status === 'online') {
          this.sendPing(this.credentials.domain);
        }
      }, 10000);
    });

    this.xmpp.on('offline', () => {
      log.info('XMPP is offline');
    });

    this.xmpp.on('stanza', stanzaXml => {
      const stanza = stanzaXml.toJSON();
      if (stanza) {
        this.handleStanza(event, stanza);
      }
    });
  }

  async logOff() {
    if (this.credentials.username) {
      keytar.deletePassword('gong', this.credentials.username);
    }
    electronStore.clear();
    this.credentials = undefined;
    await this.killConnection();
  }

  //
  // Stanzas
  //

  handleStanza(event, stanza) {
    if (stanza) {
      switch (stanza.name) {
        case 'message':
          this.handleStanzaMessage(event, stanza);
          break;
        case 'presence':
          this.handleStanzaPresence(event, stanza);
          break;
        case 'iq':
          this.handleStanzaIq(event, stanza);
          break;
        default:
          break;
      }
    }
  }

  handleStanzaIq(event, stanza) {
    if (
      stanza.children &&
      stanza.children.length > 0 &&
      stanza.children[0].attrs.xmlns === 'urn:xmpp:ping' &&
      stanza.attrs.type === 'error'
    ) {
      event.sender.send('xmpp-ping-error', stanza);
    }
  }

  handleStanzaMessage(event, stanza) {
    if (stanza.children && stanza.children.length > 0) {
      if (stanza.children[0].attrs.name === 'composing') {
        // user is typing
      } else if (
        (stanza.children[0] && stanza.children[0].name === 'body') ||
        (stanza.children[1] && stanza.children[1].name === 'body')
      ) {
        // message
        event.sender.send('xmpp-reply', stanza);
      } else if (stanza.children[1]) {
        // TODO: not sure if this is only when user is done typing?
      }
    }
  }

  handleStanzaPresence(event, stanza) {
    event.sender.send('xmpp-presence', stanza);
  }

  //
  // iq
  //

  async sendGetInfo(event, domain) {
    if (this.xmpp && this.xmpp.status === 'online') {
      await this.xmpp.iqCaller
        .request(
          xml(
            'iq',
            {
              to: `${domain}`,
              type: 'get',
              id: makeId(7),
            },
            xml('query', {
              xmlns: 'http://jabber.org/protocol/disco#info',
            })
          )
        )
        .catch();
      // currently do not care about what features are supported
    }
  }

  async sendGetRoster(event) {
    if (this.xmpp && this.xmpp.status === 'online') {
      const response = await this.xmpp.iqCaller
        .request(
          xml(
            'iq',
            {
              type: 'get',
              id: makeId(7),
            },
            xml('query', {
              xmlns: 'jabber:iq:roster',
            })
          )
        )
        .catch();
      event.sender.send('xmpp-roster', response);
    }
  }

  async sendDiscoverItems(event, subdomain) {
    if (this.xmpp && this.xmpp.status === 'online') {
      const response = await this.xmpp.iqCaller
        .request(
          xml(
            'iq',
            {
              to:
                (subdomain ? `${subdomain}.` : '') +
                `${this.credentials.domain}`,
              type: 'get',
              id: makeId(7),
            },
            xml('query', {
              xmlns: 'http://jabber.org/protocol/disco#items',
            })
          )
        )
        .catch();

      if (response.attrs.from === this.credentials.domain) {
        event.sender.send('xmpp-discover-top-level-items', response);
      } else {
        event.sender.send('xmpp-discover-sub-level-items', response);
      }
    }
  }

  async sendPing(to) {
    if (this.xmpp && this.xmpp.status === 'online') {
      return await this.xmpp.iqCaller.request(
        xml(
          'iq',
          {
            from: this.credentials.jid,
            to: to,
            id: makeId(7),
            type: 'get',
          },
          xml('ping', { xmlns: 'urn:xmpp:ping' })
        )
      );
    }
  }

  // TODO: this will be handled by xmpp.js, see: https://github.com/xmppjs/xmpp.js/issues/629
  async sendPong(domain, id) {
    if (this.xmpp && this.xmpp.status === 'online') {
      return await this.xmpp.iqCaller
        .request(
          xml('iq', {
            id: id,
            from: this.credentials.jid,
            to: domain,
            type: 'result',
          })
        )
        .catch();
    }
  }

  async sendGetVCard(event, from, to) {
    if (this.xmpp && this.xmpp.status === 'online') {
      const iqAttrs = {
        from: from,
        id: makeId(7),
        type: 'get',
      };

      if (to && to !== '') {
        iqAttrs.to = to;
      }

      const response = await this.xmpp.iqCaller
        .request(xml('iq', iqAttrs, xml('vCard', { xmlns: 'vcard-temp' })))
        .catch();

      event.sender.send('xmpp-vcard', response);
    }
  }

  async sendSetVCard(event, vCard) {
    // https://xmpp.org/extensions/xep-0054.html
    if (this.xmpp && this.xmpp.status === 'online') {
      const response = await this.xmpp.iqCaller
        .request(
          xml(
            'iq',
            {
              id: makeId(3),
              type: 'set',
            },
            xml(
              'vCard',
              { xmlns: 'vcard-temp' },
              xml('JABBERID', {}, vCard.jid.split('/')[0]),
              xml('DESC', {}, vCard.description),
              xml('FN', {}, vCard.fullName),
              xml(
                'N',
                {},
                xml('GIVEN', {}, vCard.firstName),
                xml('MIDDLE', {}, vCard.middleName),
                xml('FAMILY', {}, vCard.lastName)
              ),
              xml('NICKNAME', {}, vCard.nickname),
              xml('URL', {}, vCard.url),
              xml('BDAY', {}, vCard.birthday),
              xml(
                'ORG',
                {},
                xml('ORGNAME', {}, vCard.organizationName),
                xml('ORGUNIT', {}, vCard.organizationUnit)
              ),
              xml('TITLE', {}, vCard.title),
              xml('ROLE', {}, vCard.role),
              xml(
                'TEL',
                {},
                xml('WORK', {}),
                xml('VOICE', {}),
                xml('NUMBER', vCard.phoneNumber)
              ),
              xml(
                'TEL',
                {},
                xml('WORK', {}),
                xml('FAX', {}),
                xml('NUMBER', {})
              ),
              xml(
                'TEL',
                {},
                xml('WORK', {}),
                xml('MSG', {}),
                xml('NUMBER', {})
              ),
              xml(
                'ADR',
                {},
                xml('WORK', {}),
                xml('STREET', {}, vCard.street),
                xml('EXTADD', {}, vCard.streetExtended),
                xml('LOCALITY', {}, vCard.city),
                xml('REGION', {}, vCard.state),
                xml('PCODE', {}, vCard.zipCode),
                xml('CTRY', {}, vCard.country)
              ),
              xml(
                'EMAIL',
                {},
                xml('INTERNET', {}),
                xml('PREF', {}),
                xml('USERID', {}, vCard.email)
              ),
              xml(
                'PHOTO',
                {},
                xml('TYPE', {}, vCard.photoType),
                xml('BINVAL', {}, vCard.photo)
              )
            )
          )
        )
        .catch();

      // TODO: send confirmation of successful update
      // event.sender.send('xmpp-set-vcard-confirmation', response);
    }
  }

  //
  // Sending
  //
  async sendSubscribe(jid, nickname, password) {
    if (this.xmpp && this.xmpp.status === 'online') {
      log.info(`XMPP is sending a subscribe request to ${jid}`);

      if (password) {
        await this.xmpp.send(
          xml(
            'presence',
            {
              id: makeId(7),
              to: `${jid}/${nickname}`,
              from: jid,
            },
            xml('priority', {}, 1),
            xml(
              'x',
              {
                xmlns: 'http://jabber.org/protocol/muc',
              },
              xml('password', {}, password)
            )
          )
        );
      } else {
        await this.xmpp.send(
          xml(
            'presence',
            {
              id: makeId(7),
              to: `${jid}/${nickname}`,
              from: jid,
            },
            xml('priority', {}, 1)
          )
        );
      }
    } else {
      log.error(`XMPP is offline, but tried to subscribe to ${jid}`);
    }
  }

  async sendUnsubscribe(jid, nickname) {
    if (this.xmpp && this.xmpp.status === 'online') {
      await this.xmpp.send(
        xml('presence', {
          id: makeId(7),
          to: `${jid}/${nickname}`,
          from: jid,
          type: 'unavailable',
        })
      );
    }
  }

  async sendMyStatus(status) {
    if (this.xmpp && this.xmpp.status === 'online') {
      if (status.status === 'online') {
        await this.xmpp.send(
          xml(
            'presence',
            {},
            xml('status', {}, status.statusText),
            xml('priority', {}, 1)
          )
        );
      } else {
        await this.xmpp.send(
          xml(
            'presence',
            {},
            xml('show', {}, status.status),
            xml('status', {}, status.statusText),
            xml('priority', {}, 1)
          )
        );
      }
    }
  }

  async sendRoomNickname(jid, nickname) {
    if (this.xmpp && this.xmpp.status === 'online') {
      await this.xmpp.send(xml('presence', { to: `${jid}/${nickname}` }));
    }
  }

  sendMessage(message) {
    // for some reason without setTimeout for a set period after sending a message
    // subsequent messages will have a delay before being sent
    setTimeout(async () => {
      if (this.xmpp && this.xmpp.status === 'online') {
        await this.xmpp.send(
          xml(
            'message',
            {
              id: message.id,
              type: message.type,
              to: message.to,
              from: message.from,
            },
            xml('body', {}, message.body)
          )
        );
      }
    });
  }
}

function makeId(length) {
  var text = '';
  var possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

const xmppJsClient = new XmppJsClient();

module.exports = xmppJsClient;
