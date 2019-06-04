import moment from 'moment';

import IDiscoverRoom from '../interfaces/IDiscoverRoom';
import IMessageReceive from '../interfaces/IMessageReceive';
import IPresence from '../interfaces/IPresence';
import ISubdomain from '../interfaces/ISubdomain';
import IUser from '../interfaces/IUser';
import IVCard from '../interfaces/IVCard';

import { stringToHexColor } from './colorUtil';

export const mapToUsers = (jsXml: any): IUser[] => {
  const users: IUser[] = jsXml.children[0].children.map((item: any) => {
    const newUser: IUser = {
      type: 'chat',
      order: 30,
      jid: item.attrs.jid.split('/')[0],
      sessionJid: undefined,
      username: item.attrs.name,
      name: item.attrs.name,
      group: item.children[0].children[0],
      status: 'offline',
      color: stringToHexColor(item.attrs.name),
      inputText: '',
      messages: [],
      unreadMessages: 0,
      hasUnreadMentionMe: false,
      hasNoMoreLogs: undefined,
      connections: [],
      scrollPosition: -1,
      vCard: undefined,
    };
    return newUser;
  });
  return users;
};

export const mapToPresence = (jsXml: any): IPresence => {
  const error: any = jsXml.children.find(
    (child: any) => child.name === 'error'
  );
  const x: any = jsXml.children.find(
    (child: any) => child.attrs.xmlns === 'http://jabber.org/protocol/muc#user'
  );
  const item: any =
    x === undefined
      ? undefined
      : x.children.find((child: any) => child.name === 'item');
  const itemAttrs: any = item === undefined ? undefined : item.attrs;
  const priority: any = jsXml.children.find(
    (child: any) => child.name === 'priority'
  );
  const status: any = jsXml.children.find(
    (child: any) => child.name === 'show'
  );
  const presence: IPresence = {
    from: jsXml.attrs.from,
    status:
      error || jsXml.attrs.type === 'unavailable'
        ? 'offline'
        : status
        ? status.children[0]
        : 'online',
    priority: priority === undefined ? undefined : priority.children[0],
    user: !x
      ? undefined
      : itemAttrs && itemAttrs.jid
      ? itemAttrs.jid
      : jsXml.attrs.from,
    role: itemAttrs && itemAttrs.role,
    affiliation: itemAttrs && itemAttrs.affiliation,
    code: error && error.attrs.code,
  };
  return presence;
};

export const mapToSubdomains = (jsXml: any): ISubdomain[] => {
  const subdomains: ISubdomain[] = jsXml.children[0].children
    .map((item: any) => ({
      jid: item.attrs.jid,
      name: item.attrs.name,
    }))
    .sort((a: ISubdomain, b: ISubdomain) => a.name.localeCompare(b.name));
  return subdomains;
};

export const mapToReply = (jsXml: any): IMessageReceive => {
  let timestamp = moment();
  let isHistory = false;

  if (jsXml.attrs.type === 'groupchat') {
    const delay = jsXml.children.find(
      (child: any) => child.attrs.xmlns === 'urn:xmpp:delay'
    );
    if (delay) {
      timestamp = moment(delay.attrs.stamp);
      isHistory = true;
    }
  }

  const message: IMessageReceive = {
    id: jsXml.attrs.id,
    type: jsXml.attrs.type,
    from: jsXml.attrs.from,
    body: jsXml.children.find((child: any) => child.name === 'body')
      .children[0],
    timestamp,
    isHistory,
  };
  return message;
};

export const mapToRooms = (jsXml: any): IDiscoverRoom[] => {
  const rooms: IDiscoverRoom[] = jsXml.children[0].children
    .map((item: any) => ({
      jid: item.attrs.jid,
      name: item.attrs.name,
    }))
    .sort((a: IDiscoverRoom, b: IDiscoverRoom) => a.name.localeCompare(b.name));
  return rooms;
};

export const mapToVCard = (jsXml: any): IVCard => {
  const jid = jsXml.attrs.from ? jsXml.attrs.from : jsXml.attrs.to;
  const xmlCard = jsXml.children[0];
  const description = xmlCard.children.find((c: any) => c.name === 'DESC');
  const fullName = xmlCard.children.find((c: any) => c.name === 'FN');
  const n = xmlCard.children.find((c: any) => c.name === 'N');
  const firstName = n ? n.children.find((c: any) => c.name === 'GIVEN') : '';
  const middleName = n ? n.children.find((c: any) => c.name === 'MIDDLE') : '';
  const lastName = n ? n.children.find((c: any) => c.name === 'FAMILY') : '';
  const nickname = xmlCard.children.find((c: any) => c.name === 'NICKNAME');
  const url = xmlCard.children.find((c: any) => c.name === 'URL');
  const address = xmlCard.children.find((c: any) => c.name === 'ADR');
  const street = address
    ? address.children.find((c: any) => c.name === 'STREET')
    : '';
  const streetExtended = address
    ? address.children.find((c: any) => c.name === 'EXTADD')
    : '';
  const city = address
    ? address.children.find((c: any) => c.name === 'LOCALITY')
    : '';
  const state = address
    ? address.children.find((c: any) => c.name === 'REGION')
    : '';
  const zip = address
    ? address.children.find((c: any) => c.name === 'PCODE')
    : '';
  const country = address
    ? address.children.find((c: any) => c.name === 'CTRY')
    : '';
  const phoneNumber = xmlCard.children.find((c: any) => c.name === 'TEL');
  const email = xmlCard.children.find((c: any) => c.name === 'EMAIL');
  const organization = xmlCard.children.find((c: any) => c.name === 'ORG');
  const organizationName = organization
    ? organization.children.find((c: any) => c.name === 'ORGNAME')
    : '';
  const organizationUnit = organization
    ? organization.children.find((c: any) => c.name === 'ORGUNIT')
    : '';
  const title = xmlCard.children.find((c: any) => c.name === 'TITLE');
  const role = xmlCard.children.find((c: any) => c.name === 'ROLE');
  const birthday = xmlCard.children.find((c: any) => c.name === 'BDAY');
  const photo = xmlCard.children.find((c: any) => c.name === 'PHOTO');
  const photoType = photo
    ? photo.children.find((c: any) => c.name === 'TYPE')
    : '';
  const photoBase64 = photo
    ? photo.children.find((c: any) => c.name === 'BINVAL')
    : '';

  const vCard: IVCard = {
    jid,
    fullName:
      fullName && fullName.children.length >= 0 ? fullName.children[0] : '',
    firstName:
      firstName && firstName.children.length >= 0 ? firstName.children[0] : '',
    middleName:
      middleName && middleName.children.length >= 0
        ? middleName.children[0]
        : '',
    lastName:
      lastName && lastName.children.length >= 0 ? lastName.children[0] : '',
    nickname:
      nickname && nickname.children.length >= 0 ? nickname.children[0] : '',
    url: url && url.children.length >= 0 ? url.children[0] : '',
    birthday:
      birthday && birthday.children.length >= 0 ? birthday.children[0] : '',
    organizationName:
      organizationName && organizationName.children.length >= 0
        ? organizationName.children[0]
        : '',
    organizationUnit:
      organizationUnit && organizationUnit.children.length >= 0
        ? organizationUnit.children[0]
        : '',
    title: title && title.children.length >= 0 ? title.children[0] : '',
    role: role && role.children.length >= 0 ? role.children[0] : '',
    phoneNumber: phoneNumber
      ? phoneNumber.children.find((c: any) => c.name === 'NUMBER').attrs.xmlns
      : '',
    street: street && street.children.length >= 0 ? street.children[0] : '',
    streetExtended:
      streetExtended && streetExtended.children.length >= 0
        ? streetExtended.children[0]
        : '',
    city: city && city.children.length >= 0 ? city.children[0] : '',
    state: state && state.children.length >= 0 ? state.children[0] : '',
    zipCode: zip && zip.children.length >= 0 ? zip.children[0] : '',
    country: country && country.children.length >= 0 ? country.children[0] : '',
    email: email
      ? email.children.find((c: any) => c.name === 'USERID').children[0]
      : '',
    description:
      description && description.children.length >= 0
        ? description.children[0]
        : '',
    photoType:
      photoType && photoType.children.length >= 0 ? photoType.children[0] : '',
    photo:
      photoBase64 && photoBase64.children.length >= 0
        ? photoBase64.children[0]
        : '',
  };

  return vCard;
};
