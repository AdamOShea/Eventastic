// backend/mappers/accommodationMappers.js

const mapAirbnb = (data) =>
    data.map((accom) => ({
      id: accom.room_id.toString(),
      name: accom.title,
      price: `${accom.price.total.currency_symbol}${accom.price.total.amount}`,
      rating: `⭐ ${accom.rating.value} (${accom.rating.reviewCount} reviews)`,
      details: accom.category,
      imageUrl: accom.images?.[0]?.url || null,
      images: accom.images?.map((img) => img.url) || [],
      roomUrl: `https://www.airbnb.ie/rooms/${accom.room_id}`,
    }));
  
  const mapBooking = (data) =>
    data.map((accom) => ({
      id: accom.hotel_id.toString(),
      name: accom.hotel_name,
      price: `${accom.currency}${accom.price_per_night}`,
      rating: `⭐ ${accom.rating.score} (${accom.rating.reviews} reviews)`,
      details: accom.type,
      imageUrl: accom.images?.[0] || null,
      images: accom.images || [],
      roomUrl: accom.url,
    }));
  
  const mapExpedia = (data) =>
    data.map((accom) => ({
      id: accom.id.toString(),
      name: accom.property_name,
      price: `${accom.currency}${accom.price}`,
      rating: `⭐ ${accom.review_score} (${accom.reviews_count} reviews)`,
      details: accom.room_type,
      imageUrl: accom.photos?.[0]?.image_url || null,
      images: accom.photos?.map((photo) => photo.image_url) || [],
      roomUrl: accom.link,
    }));
  
  module.exports = { mapAirbnb, mapBooking, mapExpedia };
  