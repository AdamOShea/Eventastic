const ticketmasterMapper = (events) => {
    // Ensure `data` is an array, extract events from `_embedded.events`
    

    return events.map((event) => ({
        eventVenue: event._embedded?.venues?.[0]?.name || 'Unknown Venue',
        eventLocation: event._embedded?.venues?.[0]?.city?.name || 'Unknown City',
        eventSeller: 'Ticketmaster',
        eventDate: event.dates?.start?.localDate || null,
        eventTime: event.dates?.start?.localTime || null,
        eventArtist: event._embedded?.attractions?.[0]?.name || 'Unknown Artist',
        eventType: event.classifications?.[0]?.segment?.name || 'Unknown Type',
        eventGenre: event.classifications?.[0]?.genre?.name || 'Unknown Genre',
        eventPrice: event.priceRanges?.[0]?.min ?? 0,
        eventLink: event.url || 'No Link',
        eventTitle: event.name || 'Untitled Event',
        eventDescription: event.info || event.description || 'No event description found :/',
        eventImages: event.images?.[0]?.url || null,
    }));
};

module.exports = { ticketmasterMapper };
