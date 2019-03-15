import IState from 'src/interfaces/IState';

export default class App {
  public static set = (state: IState, payload: any): IState => {
    return {
      ...state,
      app: { ...state.app, ...payload },
    };
  };
}
