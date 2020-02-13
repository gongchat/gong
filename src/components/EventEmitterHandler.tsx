import { FC, useEffect } from 'react';
import { useContext } from '../context';
import EventEmitter from '../utils/eventEmitter';

const EventEmitterHandler: FC = () => {
  const actions = useContext()[1];

  useEffect(() => {
    // Do not call multiple actions inside an EventEmitter subscribe

    EventEmitter.subscribe('selectChannel', (data: any) =>
      actions.selectChannel(data)
    );
  }, [actions]);

  return null;
};

export default EventEmitterHandler;
