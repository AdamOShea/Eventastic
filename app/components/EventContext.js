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

  // Function to reset everything when event is saved
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
