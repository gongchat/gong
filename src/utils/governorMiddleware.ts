import IState from '../interfaces/IState';

const instanceID = new Date().getTime();

export default (initialState: IState, dispatch: any) => {
  let devTools: any = null;

  const initDevTools = () => {
    const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
    if (reduxDevTools) {
      const name = `react-governor - ${instanceID}`;
      const features = { jump: true };

      devTools = reduxDevTools.connect({ name, features });
      if (devTools) {
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
      }
    }
  };

  initDevTools();

  return (actionKey: string, state: IState) => {
    // to get dev tools working in production
    if (!devTools) {
      initDevTools();
    }

    devTools.send({ type: actionKey }, state, {}, instanceID);
    return state;
  };
};
