import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const WebsocketContext = createContext(null);

export const WebsocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://your-websocket-url');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebsocketContext.Provider value={socket}>
      {children}
    </WebsocketContext.Provider>
  );
};

WebsocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
