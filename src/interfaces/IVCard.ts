export default interface IVCard {
  jid: string;
  fullName: string;
  firstName: string;
  lastName: string;
  middleName: string;
  nickname: string;
  url: string;
  birthday: string;
  organizationName: string;
  organizationUnit: string;
  title: string;
  role: string;
  phoneNumber: string;
  street: string;
  streetExtended: string; // apt, suite, etc
  city: string; // locality
  state: string; // region
  zipCode: string;
  country: string;
  email: string;
  description: string;
  photoType: string;
  photo: string;
}
