import IState from '../interfaces/IState';

const instanceID = new Date().getTime();

export default (initialState: IState, dispatch: any) => {
  const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

  if (reduxDevTools) {
    const name = `react-governor - ${instanceID}`;
    const features = {
      jump: true,
    };

    const devTools = reduxDevTools.connect({ name, features });

    devTools.subscribe((data: any) => {
      switch (data.type) {
        case 'START':
          devTools.init(initialState);
          break;
        case 'RESET':
          dispatch({ newState: initialState });
          break;
        case 'DISPATCH':
          switch (data.payload.type) {
            case 'JUMP_TO_STATE':
            case 'JUMP_TO_ACTION': {
              dispatch({
                newState: JSON.parse(data.state),
              });
              break;
            }
            default:
              break;
          }
          break;
        default:
          break;
      }
    });

    return (actionKey: string, state: IState) => {
      devTools.send({ type: actionKey }, state, {}, instanceID);
      return state;
    };
  }
};
