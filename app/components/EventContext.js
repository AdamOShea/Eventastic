// React Context provider for managing global state related to selected events, accommodations, flights, and clearing state.

import React, { createContext, useState, useContext } from 'react';

// Create Context
const EventContext = createContext();

// Custom Hook for easy access
export const useEvent = () => useContext(EventContext);

// Context Provider Component
export const EventProvider = ({ children }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);

// Clears the selected event details and resets the context state to initial values.
  const clearEventDetails = () => {
    setSelectedEvent(null);
    setSelectedAccommodation(null);
    setSelectedOutboundFlight(null);
    setSelectedReturnFlight(null);
  };

  return (
    <EventContext.Provider
      value={{
        selectedEvent, 
        setSelectedEvent,
        selectedAccommodation,
        setSelectedAccommodation,
        selectedOutboundFlight,
        setSelectedOutboundFlight,
        selectedReturnFlight,
        setSelectedReturnFlight,
        clearEventDetails,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
