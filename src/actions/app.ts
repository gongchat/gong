import IState from '../interfaces/IState';

export const appActions: any = {
  setApp(payload: any) {
    return (): IState => ({
      ...this.state,
      app: { ...this.state.app, ...payload },
    });
  },
};
