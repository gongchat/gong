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
    this.client = undefined;
    this.credentials = undefined;
  }

  //
  // Connection
  //
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

  connect(event, credentials, key, settings) {
    this.credentials = { username: credentials.username };
    if (this.client) {
      this.client.stop().then(() => {
        this.createConnection(event, credentials, key, settings);
      });
    } else {
      this.createConnection(event, credentials, key, settings);
    }
  }

  createConnection(event, credentials, key, settings) {
    this.client = new client({
      service: `xmpp://${credentials.domain}:${credentials.port}`,
      domain: credentials.domain,
      username: credentials.username,
      resource: credentials.resource,
      password: credentials.password,
    });

    if (isDev) {
      debug(this.client, true);
    }

    this.attachEvents(event, credentials, key, settings);

    this.client.start().catch(console.error);
  }

  attachEvents(event, credentials, key, settings) {
    this.client.on('error', err => {
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
          default:
            console.log('ERROR:', err);
            break;
        }
      }

      if (this.client && stopClient) {
        this.client.stop();
      }
    });

    // this.client.on('status', status => console.log('STATUS:', status));
    // this.client.on('input', input => console.log('INPUT:', input));
    // this.client.on('output', output => console.log('OUTPUT:', output));

    this.client.on('online', jid => {
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
    });

    this.client.on('stanza', stanzaXml => {
      const stanza = stanzaXml.toJSON();
      if (stanza) {
        this.handleStanza(event, stanza);
      }
    });
  }

  logOff() {
    if (this.credentials.username) {
      keytar.deletePassword('gong', this.credentials.username);
    }
    electronStore.clear();
    this.credentials = undefined;
    this.client.stop();
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
      stanza.children[0].attrs.xmlns === 'urn:xmpp:ping'
    ) {
      this.sendPong(this.credentials.domain, stanza.attrs.id);
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
        const body = stanza.children.find(child => child.name === 'body');
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
    await this.client.iqCaller.request(
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
    );
    // currently do not care about what features are supported
  }

  async sendGetRoster(event) {
    const response = await this.client.iqCaller.request(
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
    );
    event.sender.send('xmpp-roster', response);
  }

  async sendDiscoverItems(event, subdomain) {
    const response = await this.client.iqCaller.request(
      xml(
        'iq',
        {
          to: (subdomain ? `${subdomain}.` : '') + `${this.credentials.domain}`,
          type: 'get',
          id: makeId(7),
        },
        xml('query', {
          xmlns: 'http://jabber.org/protocol/disco#items',
        })
      )
    );

    if (response.attrs.from === this.credentials.domain) {
      event.sender.send('xmpp-discover-top-level-items', response);
    } else {
      event.sender.send('xmpp-discover-sub-level-items', response);
    }
  }

  async sendPong(domain, id) {
    return await this.client.iqCaller
      .request(
        xml('iq', {
          id: id,
          from: this.credentials.jid,
          to: domain,
          type: 'result',
        })
      )
      // TODO: This is not working, will always return an error. Possibly due to xmpp.js
      .catch(e => {
        /* console.log(e) */
      });
  }

  async sendGetVCard(event, from, to) {
    const iqAttrs = {
      from: from,
      id: makeId(7),
      type: 'get',
    };

    if (to && to !== '') {
      iqAttrs.to = to;
    }

    const response = await this.client.iqCaller.request(
      xml('iq', iqAttrs, xml('vCard', { xmlns: 'vcard-temp' }))
    );

    event.sender.send('xmpp-vcard', response);
  }

  async sendSetVCard(event, vCard) {
    // https://xmpp.org/extensions/xep-0054.html
    const response = await this.client.iqCaller.request(
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
          xml('TEL', {}, xml('WORK', {}), xml('FAX', {}), xml('NUMBER', {})),
          xml('TEL', {}, xml('WORK', {}), xml('MSG', {}), xml('NUMBER', {})),
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
    );

    // TODO: send confirmation of successful update
    // event.sender.send('xmpp-set-vcard-confirmation', response);
  }

  //
  // Sending
  //
  sendSubscribe(jid, nickname, password) {
    if (password) {
      this.client.send(
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
      this.client.send(
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
  }

  sendUnsubscribe(jid, nickname) {
    this.client.send(
      xml('presence', {
        id: makeId(7),
        to: `${jid}/${nickname}`,
        from: jid,
        type: 'unavailable',
      })
    );
  }

  sendMyStatus(status) {
    if (status === 'online') {
      this.client.send(xml('presence', {}, xml('priority', {}, 1)));
    } else {
      this.client.send(
        xml('presence', {}, xml('show', {}, status), xml('priority', {}, 1))
      );
    }
  }

  sendRoomNickname(jid, nickname) {
    this.client.send(xml('presence', { to: `${jid}/${nickname}` }));
  }

  sendMessage(message) {
    // for some reason without setTimeout for a set period after sending a message
    // subsequent messages will have a delay before being sent
    setTimeout(() => {
      this.client.send(
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
