import { useGovernor } from '@techempower/react-governor';
import { useEffect, useMemo, useRef } from 'react';
import IState from '../interfaces/IState';

const instanceID = new Date().getTime();
const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
const setStateAction = {
  ___set_state(state: IState) {
    return () => state;
  },
};

export const useContextDevTools = (initialState: IState, contract: any) => {
  const [state, actions] = useGovernor(
    initialState,
    Object.assign({}, contract, setStateAction)
  );

  const currentActions = useRef<string[]>([]);

  const newActions = useMemo(() => {
    const _newActions = {};
    Object.keys(actions).forEach(actionKey => {
      _newActions[actionKey] = (...args: any) => {
        actions[actionKey](...args);
        currentActions.current = [...currentActions.current, actionKey];
      };
    });
    return _newActions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const devTools = useMemo(() => {
    if (reduxDevTools) {
      const name = `react-governor - ${instanceID}`;
      const features = {
        jump: true,
      };
      const _devTools = reduxDevTools.connect({ name, features });
      _devTools.subscribe((data: any) => {
        switch (data.type) {
          case 'START':
            _devTools.init(initialState);
            break;
          case 'RESET':
            actions.___set_state(initialState);
            break;
          case 'DISPATCH':
            switch (data.payload.type) {
              case 'JUMP_TO_STATE':
              case 'JUMP_TO_ACTION': {
                actions.___set_state(JSON.parse(data.state));
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
      return _devTools;
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // ignore update from initialState and devTools dispatched actions
    if (initialState !== state && currentActions.current.length > 0) {
      devTools.send(
        { type: currentActions.current.shift() },
        state,
        {},
        instanceID
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return [state, newActions];
};
