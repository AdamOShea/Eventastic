
export const estimateTotal = (trip) => {
    const getNumericPrice = (price) => {
      if (!price) return 0;
      const parsed = parseFloat(String(price).replace(/[^0-9.]/g, ""));
      return isNaN(parsed) ? 0 : parsed;
    };
  
    const event = getNumericPrice(trip.eventPrice);
    const accomm = getNumericPrice(trip.accommPrice);
    const outFlight = getNumericPrice(trip.outFlightPrice);
    const returnFlight = getNumericPrice(trip.returnFlightPrice);
  
    return event + accomm + outFlight + returnFlight;
  };