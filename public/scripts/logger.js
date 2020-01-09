const ElectronStore = require('electron-store');

class Logger {
  set(arg) {
    const { user, date, channel, message } = arg;

    const logsElectronStore = new ElectronStore({
      cwd: `logs/${user.split('/')[0]}/${message.channelName}`,
      name: 'index',
    });
    const messagesElectronStore = new ElectronStore({
      cwd: `logs/${user.split('/')[0]}/${message.channelName}`,
      name: date,
    });
    const logs = logsElectronStore.get('logs');
    const messages = messagesElectronStore.get('messages');
    if (
      channel.type === 'chat' ||
      (channel.type === 'groupchat' &&
        message.id !== undefined &&
        (!message.isHistory ||
          !messages ||
          messages.find(m => m.id !== undefined && m.id === message.id) ===
            undefined))
    ) {
      if (!logs) {
        logsElectronStore.set('logs', [date]);
      } else if (logs.find(l => l === date) === undefined) {
        logsElectronStore.set('logs', [...logs, date]);
      }
      if (messages) {
        messagesElectronStore.set('messages', [...messages, message]);
      } else {
        messagesElectronStore.set('messages', [message]);
      }
    }
  }

  get(event, arg) {
    const { user, date, channel } = arg;
    const maxNumberOfMessages = 25;

    let messages = [];
    let hasNoMoreLogs = false;
    const logsElectronStore = new ElectronStore({
      cwd: `logs/${user.split('/')[0]}/${channel.jid}`,
      name: 'index',
    });
    const logs = logsElectronStore.get('logs');
    if (logs) {
      const currentLogIndex = date ? logs.indexOf(date) : logs.length - 1;
      if (currentLogIndex >= 0) {
        // this should be the first log, need to get any items for that day
        const currentMessagesElectronStore = new ElectronStore({
          cwd: `logs/${user.split('/')[0]}/${channel.jid}`,
          name: logs[currentLogIndex],
        });
        const currentSavedMessages = currentMessagesElectronStore.get(
          'messages'
        );
        if (currentSavedMessages && currentSavedMessages.length > 0) {
          messages = currentSavedMessages.filter(
            message =>
              channel.messages.find(m => m.id === message.id) === undefined
          );
          if (messages.length > maxNumberOfMessages) {
            messages = messages.slice(
              messages.length - maxNumberOfMessages,
              messages.length
            );
          }
        }
        // get the next full set of logs
        let indexOffset = 1;
        let getMoreLogs = messages.length < maxNumberOfMessages;
        while (getMoreLogs) {
          if (currentLogIndex - indexOffset < 0) {
            hasNoMoreLogs = true;
            getMoreLogs = false;
          } else {
            const nextMessagesElectronStore = new ElectronStore({
              cwd: `logs/${user.split('/')[0]}/${channel.jid}`,
              name: logs[currentLogIndex - indexOffset],
            });
            const nextSavedMessages = nextMessagesElectronStore.get('messages');
            if (nextSavedMessages && nextSavedMessages.length > 0) {
              messages = [...nextSavedMessages, ...messages];
              if (messages.length > maxNumberOfMessages) {
                messages = messages.slice(
                  messages.length - maxNumberOfMessages,
                  messages.length
                );
              }
              getMoreLogs = messages.length < maxNumberOfMessages;
            }
            indexOffset++;
          }
        }
      } else {
        hasNoMoreLogs = true;
      }
    } else {
      hasNoMoreLogs = true;
    }
    event.sender.send('get-log', {
      channelJid: channel.jid,
      hasNoMoreLogs,
      messages,
    });
  }

  search(event, arg) {
    const { user, jid, order, text } = arg;
    const matchedMessages = [];
    const logsElectronStore = new ElectronStore({
      cwd: `logs/${user.split('/')[0]}/${jid}`,
      name: 'index',
    });
    const logs = logsElectronStore.get('logs');
    if (logs) {
      let orderedLogs;
      if (order === 'oldest') {
        orderedLogs = logs;
      } else {
        orderedLogs = logs.reverse();
      }
      orderedLogs.forEach((log, index) => {
        const messagesElectronStore = new ElectronStore({
          cwd: `logs/${user.split('/')[0]}/${jid}`,
          name: logs[index],
        });
        const messages = messagesElectronStore.get('messages');
        let orderedMessages;
        if (order === 'oldest') {
          orderedMessages = messages;
        } else {
          orderedMessages = messages.reverse();
        }
        orderedMessages.forEach(message => {
          if (message.body.toLowerCase().includes(text.toLowerCase())) {
            matchedMessages.push(message);
          }
        });
      });
    }
    event.sender.send('search-log', {
      jid: arg.jid,
      messages: matchedMessages,
    });
  }
}

const logger = new Logger();

module.exports = logger;
