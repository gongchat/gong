import IState from '../interfaces/IState';

const instanceID = new Date().getTime();
const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

let devTools: any = null;

export default (initialState: IState, dispatch: any) => {
  const initDevTools = () => {
    if (reduxDevTools) {
      const name = `react-governor - ${instanceID}`;
      const features = { jump: true };

      if (!devTools) {
        devTools = reduxDevTools.connect({ name, features });
      } else {
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
    if (reduxDevTools) {
      // to get dev tools working in production
      if (!devTools) {
        initDevTools();
      }
      devTools.send({ type: actionKey }, state, {}, instanceID);
    }
    return state;
  };
};
