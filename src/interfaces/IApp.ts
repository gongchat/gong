import { Moment } from 'moment';

export default interface IApp {
  version: string;
  operatingSystem: string;
  hasUpdate: boolean | undefined;
  isCheckingForUpdate: boolean;
  isUpdateDownloaded: boolean;
  lastDateTimeUpdatedChecked: Moment | undefined;
}
