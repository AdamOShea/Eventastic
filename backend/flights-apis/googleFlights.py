import json
from fast_flights import FlightData, Passengers, Result, get_flights, search_airport
import fast_flights.core
import sys
from primp import Client
from datetime import datetime

def custom_fetch(params: dict) -> Result:
    client = Client(impersonate="chrome_133", verify=False)
    cookies = {
        "OTZ": "7988884_56_56_123900_52_436380",
        "AEC": "AVcja2dUwdQQLhhFsfGjnMJuycioOesAPpyr2uXZNpOm751HKJYM7VydrQI",
        "SOCS": "CAISOAgjEitib3FfaWRlbnRpdGh5cm9udGVuZHVpc2VydmVyXzIwMjUwMzA5LjA5X3AwGgVlbi1VUyACGgYIgNe4vgY",
        "NID": "522=NV8ZVXzUyiWaMu7OrIdUdyvPcWKhsXSAxk8VMNW6H9yZvD_33vWjTwV7cAFRzY0Z18gasqeQXQ3bwXZPPE-UFcdAKgTUgufEw_HqIgjCQfCTr1Ssb3HCLgds6i8TCcWhGPNt0wH0Kg-kY4lbYSpFF1OOKciTMbrdYTL7ivNs4qtP21lgSYeIZLmcDOgeGCUvsHoY38WHH32DgEbDXJ5A1uee81OXtRK_tOTlcffvMLrG7d5wb22qpFELS425BnS3WI0pzqw33NeZHND9A0Ky9LuJdLT1Wbj7BxhvisFBYXM8GT0"
    }

    res = client.get("https://www.google.com/travel/flights", params=params, cookies=cookies)
    assert res.status_code == 200, f"{res.status_code} Result: {res.text_markdown}"
    return res

def format_flight_date(date_string):
    date_part = date_string.split(" on ")[-1]
    dt = datetime.strptime(date_part, "%a, %b %d")
    dt = dt.replace(year=2025)
    return dt.strftime("%Y-%m-%d")

def result_to_dict(result, dep_airport, arr_airport):
    return {
        "current_price": result.current_price,
        "flights": [
            {
                "airline": flight.name,
                "depAirport": dep_airport.name,
                "depAirportCode": dep_airport.value,
                "arrAirport": arr_airport.name,
                "arrAirportCode": arr_airport.value,
                "departure": flight.departure,
                "arrival": flight.arrival,
                "duration": flight.duration,
                "stops": flight.stops,
                "price": flight.price.encode("utf-8").decode("utf-8"),
                "best_option": flight.is_best,
                "url": "https://www.google.com/travel/flights?q=" + dep_airport.value + "-to-" + arr_airport.value + "-" + format_flight_date(flight.departure)
            }
            for flight in result.flights
        ] if hasattr(result, "flights") else []
    }

# Apply the custom fetch logic
fast_flights.core.fetch = custom_fetch

if len(sys.argv) < 5:
    print(json.dumps({"error": "dates and airports and direct param required"}))
    sys.exit(1)

departureDate = sys.argv[1]
departureInput = sys.argv[2].strip()
arrivalInput = sys.argv[3].strip()
direct_arg = sys.argv[4].strip().lower()
direct = direct_arg == "true"
max_stops = 0 if direct else 2

# Check if input is exactly 3 characters (likely IATA code), otherwise search
if len(departureInput) == 3:
    from fast_flights import Airport
    departureAirports = [Airport.from_str(departureInput)]
else:
    departureAirports = search_airport(departureInput)

if len(arrivalInput) == 3:
    from fast_flights import Airport
    arrivalAirports = [Airport.from_str(arrivalInput)]
else:
    arrivalAirports = search_airport(arrivalInput)

print(f"🔍 Python received: Date={departureDate}, From={departureAirports}, To={arrivalAirports}, Direct={direct}, MaxStops={max_stops}", file=sys.stderr)

all_results = []

for departureAirport in departureAirports:
    for arrivalAirport in arrivalAirports:
        try:
            result: Result = get_flights(
                flight_data=[FlightData(date=departureDate, from_airport=departureAirport, to_airport=arrivalAirport)],
                trip="one-way",
                seat="economy",
                passengers=Passengers(adults=1, children=0, infants_in_seat=0, infants_on_lap=0),
                fetch_mode="common",
                max_stops=max_stops
            )

            print(f" Flights Found: {len(result.flights) if hasattr(result, 'flights') else 'None'}", file=sys.stderr)
            all_results.append(result_to_dict(result, departureAirport, arrivalAirport))

        except Exception as e:
            error_message = str(e)
            if "No flights found" in error_message:
                continue
            print(f"Error fetching flight: {error_message[:200]}...", file=sys.stderr)

sys.stdout.reconfigure(encoding='utf-8')
print(json.dumps({"results": all_results}, indent=2, ensure_ascii=False))
