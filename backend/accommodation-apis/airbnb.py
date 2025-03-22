import pyairbnb
import json
import sys
from math import radians, cos

def get_bounding_box(latitude, longitude, distance_km=5):
    lat_offset = distance_km / 111  
    lon_offset = distance_km / (111 * cos(radians(latitude)))  

    return {
        "ne_lat": latitude + lat_offset,
        "ne_long": longitude + lon_offset,
        "sw_lat": latitude - lat_offset,
        "sw_long": longitude - lon_offset,
    }

# 🛑 Ensure correct usage
if len(sys.argv) < 5:
    print(json.dumps({"error": "Latitude and longitude required"}))
    sys.exit(1)

# 🌍 Read Latitude & Longitude from CLI arguments
latitude = float(sys.argv[1])
longitude = float(sys.argv[2])
check_in = sys.argv[3]
check_out = sys.argv[4]

bounding_box = get_bounding_box(latitude, longitude, distance_km=5)

# Assign to search variables
ne_lat, ne_long = bounding_box["ne_lat"], bounding_box["ne_long"]
sw_lat, sw_long = bounding_box["sw_lat"], bounding_box["sw_long"]

# Define search parameters
currency = "EUR"
zoom_value = 2

# Search Airbnb listings
search_results = pyairbnb.search_all(check_in, check_out, ne_lat, ne_long, sw_lat, sw_long, zoom_value, currency, "")

# 📝 Return JSON output
print(json.dumps(search_results))
