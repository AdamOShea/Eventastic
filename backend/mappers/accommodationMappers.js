// backend/mappers/accommodationMappers.js

const mapAirbnb = (data) =>
    data.map((accom) => ({
      accommId: accom.room_id.toString(),
      accommName: accom.title,
      accommPrice: `${accom.price.total.currency_symbol}${accom.price.total.amount}`,
      accommRating: `⭐ ${accom.rating.value} (${accom.rating.reviewCount} reviews)`,
      accommDetails: accom.category,
      accommFirstImage: accom.images?.[0]?.url || null,
      accommImages: accom.images?.map((img) => img.url) || [],
      accommUrl: `https://www.airbnb.ie/rooms/${accom.room_id}`,
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
  