const ticketmasterMapper = (events) => {
    return events.map((event) => {
      const imageUrls = Array.isArray(event.images)
        ? event.images.map((img) => img.url).filter(Boolean)
        : [];
  
      return {
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
        eventImages: imageUrls, // ✅ all image URLs as array
      };
    });
  };
  
  module.exports = { ticketmasterMapper };
  