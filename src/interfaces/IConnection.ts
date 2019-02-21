export default interface IConnection {
  isConnecting: boolean;
  isConnected: boolean;
  isAuthenticated: boolean;
  hasSavedCredentials: boolean | undefined;
  connectionError: string;
}
