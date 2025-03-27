const mapGoogleFlights = (result, dctn) => {
    //console.log(`🔍 Mapping Google Flights Data:`, JSON.stringify(result, null, 2)); //  Debug
  
    if (!result || !result.results || result.results.length === 0) {
      console.warn("⚠️ No flights found in result");
      return [];
    }
  
    return result.results.flatMap((item) =>
      item.flights.map((flight) => ({
        direction: dctn,
        flightDepartureAirport: flight.depAirport,
        flightDepartureCode: flight.depAirportCode,
        flightArrivalAirport: flight.arrAirport,
        flightArrivalCode: flight.arrAirportCode,
        flightAirline: flight.airline,
        flightDepartureTime: flight.departure,
        flightArrivalTime: flight.arrival,
        flightDuration: flight.duration,
        flightStops: flight.stops,
        flightPrice: flight.price,
        flightBestOption: flight.best_option,
        flightUrl: flight.url
      }))
    );
  };
  
  module.exports = { mapGoogleFlights };
  