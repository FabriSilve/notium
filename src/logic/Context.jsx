import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const Context = createContext("");

const ContextProvider = ({ children }) => {
  const [rawTickets, setTickets] = useState([]);
  const [hasData, setHasData] = useState(false);

  const context = {
    rawTickets,
    setTickets,
    hasData,
    setHasData,
  }

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContextProvider;
