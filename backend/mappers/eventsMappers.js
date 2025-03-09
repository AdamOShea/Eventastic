const ticketmasterMapper = (data) =>
    data.map((event) => ({
       venue : event._embedded?.venues?.[0]?.name || 'Unknown Venue',
       eventLocation : event._embedded?.venues?.[0]?.city?.name || 'Unknown City',
       seller : 'Ticketmaster',
       date : event.dates?.start?.localDate || null,
       time : event.dates?.start?.localTime || null,
       artist : event._embedded?.attractions?.[0]?.name || 'Unknown Artist',
       eventType : event.classifications?.[0]?.segment?.name || 'Unknown Type',
       genre : event.classifications?.[0]?.genre?.name || 'Unknown Genre',
       price : event.priceRanges?.[0]?.min ?? 0,
       eventLink : event.url || 'No Link',
       title : event.name || 'Untitled Event',
       description : event.info || event.description || 'No event description found :/',
       image : event.images?.[0]?.url || null,
    }));

    module.exports = { ticketmasterMapper };