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
        eventImages: JSON.stringify(imageUrls), //  all image URLs as array
      };
    });
  };
  
const eventbriteMapper = (events) => {
    return events.map((event) => {
      const imageUrls = event.image?.url ? [event.image.url] : [];
  
      const tags = event.tags?.map(tag => tag.display_name).filter(Boolean) || [];
  
      return {
        eventVenue: event.primary_venue?.name || 'Unknown Venue',
        eventLocation: event.primary_venue?.address?.localized_area_display || 'Unknown City',
        eventSeller: 'Eventbrite',
        eventDate: event.start_date || null,
        eventTime: event.start_time || null,
        eventArtist: event.primary_organizer?.name || 'Unknown Organizer',
        eventType: tags.find(tag => tag.includes('Concert')) || 'Unknown Type',
        eventGenre: tags.find(tag => tag !== 'Concert' && tag !== 'Event') || 'Unknown Genre',
        eventPrice: event.ticket_availability?.minimum_ticket_price?.major_value
          ? parseFloat(event.ticket_availability.minimum_ticket_price.major_value)
          : 0,
        eventLink: event.url || 'No Link',
        eventTitle: event.name || 'Untitled Event',
        eventDescription: event.summary || 'No event description found :/',
        eventImages: JSON.stringify(imageUrls), // match Ticketmaster format
      };
    });
};
  

  module.exports = { ticketmasterMapper, eventbriteMapper };
  