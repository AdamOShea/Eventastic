const mapGoogleFlights = (result, dctn) => {
    //console.log(`🔍 Mapping Google Flights Data:`, JSON.stringify(result, null, 2)); // ✅ Debug
  
    if (!result || !result.results || result.results.length === 0) {
      console.warn("⚠️ No flights found in result");
      return [];
    }
  
    return result.results.flatMap((item) =>
      item.flights.map((flight) => ({
        direction: dctn,
        departure: flight.depAirport,
        departureCode: flight.depAirportCode,
        arrival: flight.arrAirport,
        arrivalCode: flight.arrAirportCode,
        airline: flight.airline,
        departure_time: flight.departure,
        arrival_time: flight.arrival,
        duration: flight.duration,
        stops: flight.stops,
        price: flight.price,
        best_option: flight.best_option,
        url: flight.url
      }))
    );
  };
  
  module.exports = { mapGoogleFlights };
  