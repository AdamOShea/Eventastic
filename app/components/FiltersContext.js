// Context provider for managing filter states like selected APIs, date options, custom dates, price ranges, and sorting criteria.

import React, { createContext, useContext, useState } from 'react';

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    selectedAPIs: [],
    selectedDateOption: 'any',
    customDate: null,
    priceRange: { min: '', max: '' },
    sortBy: 'date', // default

  });

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => useContext(FiltersContext);
