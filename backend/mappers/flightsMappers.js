const mapGoogleFlights = (result, dctn) => {
    console.log("🔍 Received in mapGoogleFlights:", JSON.stringify(result, null, 2));
    if (!result || !result.flights) return [];
    
    return result.flights.map((flight) => ({
        direction: dctn,
        departure: flight.departure, // Use .name to get enum name
        arrival: flight.arrival,
        airline: flight.name, // Extract airline name
        departure_time: flight.departure, // Extract departure time
        arrival_time: flight.arrival, // Extract arrival time
        duration: flight.duration, // Extract flight duration
        stops: flight.stops, // Extract number of stops
        price: flight.price, // Extract flight price
        best_option: flight.is_best, // Extract if it's marked as the best option
    }));
};

module.exports = {mapGoogleFlights};