import IState from 'src/interfaces/IState';

export const appActions = {
  setApp(payload: any, state: IState): IState {
    return {
      ...state,
      app: { ...state.app, ...payload },
    };
  },
};
