import IState from '../interfaces/IState';

export const appActions: any = {
  setApp(payload: any) {
    return (state: IState): IState => ({
      ...state,
      app: { ...state.app, ...payload },
    });
  },
};
