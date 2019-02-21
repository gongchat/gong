import * as moment from 'moment';

import IDiscoverRoom from 'src/interfaces/IDiscoverRoom';
import IMessageReceive from 'src/interfaces/IMessageReceive';
import IPresence from 'src/interfaces/IPresence';
import ISubdomain from 'src/interfaces/ISubdomain';
import IUser from 'src/interfaces/IUser';
import IVCard from 'src/interfaces/IVCard';

import ColorUtil from './colorUtil';

export default class XmppJsMapper {
  public static mapToUsers(jsXml: any): IUser[] {
    const users: IUser[] = jsXml.children[0].children.map((item: any) => {
      const newUser: IUser = {
        type: 'chat',
        order: 30,
        jid: item.attrs.jid.split('/')[0],
        username: item.attrs.name,
        name: item.attrs.name, // TODO: get real name
        group: item.children[0].children[0],
        status: 'offline',
        color: ColorUtil.stringToHexColor(item.attrs.name),
        messages: [],
        unreadMessages: 0,
        hasUnreadMentionMe: false,
        connections: [],
        scrollPosition: 0,
        vCard: undefined,
      };
      return newUser;
    });
    return users;
  }

  public static mapToPresence(jsXml: any): IPresence {
    const x: any = jsXml.children.find(
      (child: any) =>
        child.attrs.xmlns === 'http://jabber.org/protocol/muc#user'
    );
    const item: any =
      x === undefined
        ? undefined
        : x.children.find((child: any) => child.name === 'item');
    const itemAttrs: any = item === undefined ? undefined : item.attrs;
    const priority: any = jsXml.children.find(
      (child: any) => child.name === 'priority'
    );
    const presence: IPresence = {
      from: jsXml.attrs.from,
      status: jsXml.attrs.type === undefined ? 'online' : jsXml.attrs.type,
      priority: priority === undefined ? undefined : priority.children[0],
      user: !x
        ? undefined
        : itemAttrs && itemAttrs.jid
        ? itemAttrs.jid
        : jsXml.attrs.from,
      role: itemAttrs && itemAttrs.role,
      affiliation: itemAttrs && itemAttrs.affiliation,
      code: '',
    };
    return presence;
  }

  public static mapToSubdomains(jsXml: any): ISubdomain[] {
    const subdomains: ISubdomain[] = jsXml.children[0].children
      .map((item: any) => ({
        jid: item.attrs.jid,
        name: item.attrs.name,
      }))
      .sort((a: ISubdomain, b: ISubdomain) => a.name.localeCompare(b.name));
    return subdomains;
  }

  public static mapToReply(jsXml: any): IMessageReceive {
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
  }

  public static mapToRooms(jsXml: any): IDiscoverRoom[] {
    const rooms: IDiscoverRoom[] = jsXml.children[0].children
      .map((item: any) => ({
        jid: item.attrs.jid,
        name: item.attrs.name,
      }))
      .sort((a: IDiscoverRoom, b: IDiscoverRoom) =>
        a.name.localeCompare(b.name)
      );
    return rooms;
  }

  public static mapToVCard(jsXml: any): IVCard {
    const jid = jsXml.attrs.from ? jsXml.attrs.from : jsXml.attrs.to;
    const xmlCard = jsXml.children[0];
    const description = xmlCard.children.find((c: any) => c.name === 'DESC');
    const fullName = xmlCard.children.find((c: any) => c.name === 'FN');
    const n = xmlCard.children.find((c: any) => c.name === 'N');
    const firstName = n ? n.children.find((c: any) => c.name === 'GIVEN') : '';
    const middleName = n
      ? n.children.find((c: any) => c.name === 'MIDDLE')
      : '';
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
      fullName: fullName ? fullName.children[0] : '',
      firstName: firstName ? firstName.children[0] : '',
      middleName: middleName ? middleName.children[0] : '',
      lastName: lastName ? lastName.children[0] : '',
      nickname: nickname ? nickname.children[0] : '',
      url: url ? url.children[0] : '',
      birthday: birthday ? birthday.children[0] : '',
      organizationName: organizationName ? organizationName.children[0] : '',
      organizationUnit: organizationUnit ? organizationUnit.children[0] : '',
      title: title ? title.children[0] : '',
      role: role ? role.children[0] : '',
      phoneNumber: phoneNumber
        ? phoneNumber.children.find((c: any) => c.name === 'NUMBER').attrs.xmlns
        : '',
      street: street ? street.children[0] : '',
      streetExtended: streetExtended ? streetExtended.children[0] : '',
      city: city ? city.children[0] : '',
      state: state ? state.children[0] : '',
      zipCode: zip ? zip.children[0] : '',
      country: country ? country.children[0] : '',
      email: email
        ? email.children.find((c: any) => c.name === 'USERID').children[0]
        : '',
      description: description ? description.children[0] : '',
      photoType: photoType ? photoType.children[0] : '',
      photo: photoBase64 ? photoBase64.children[0] : '',
    };
    return vCard;
  }
}
