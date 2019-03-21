export default interface IApp {
  version: string;
  hasUpdate: boolean | undefined;
  isUpdateDownloaded: boolean;
  operatingSystem: string;
}
