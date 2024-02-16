import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const Context = createContext("");

const ContextProvider = ({ children }) => {
  const [rawTickets, setTickets] = useState([]);
  const [hasData, setHasData] = useState(false);
  const [useDemo, setUseDemo] = useState(false);

  const context = {
    rawTickets,
    setTickets,
    hasData,
    setHasData,
    useDemo,
    setUseDemo,
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
