import { FC, useEffect, useRef } from 'react';
import { useContext } from '../context';

const Ping: FC = () => {
  const { sendRoomPings } = useContext()[1];
  const interval = useRef<any>();

  useEffect(() => {
    clearInterval(interval.current);
    interval.current = setInterval(() => {
      sendRoomPings();
    }, 10_000);
    return () => {
      clearInterval(interval.current);
    };
  }, [sendRoomPings]);

  return null;
};

export default Ping;
