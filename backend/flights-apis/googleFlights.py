import json
from fast_flights import FlightData, Passengers, Result, get_flights, search_airport
import fast_flights.core
import sys
from primp import Client  # Now it should resolve

# Custom fetch function (your version)
def custom_fetch(params: dict) -> Result:
      # Replace with actual import path
    
    client = Client(impersonate="chrome_133", verify=False)

    cookies = {
        "OTZ": "7988884_56_56_123900_52_436380",
        "AEC": "AVcja2dUwdQQLhhFsfGjnMJuycioOesAPpyr2uXZNpOm751HKJYM7VydrQI",
        "SOCS": "CAISOAgjEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjUwMzA5LjA5X3AwGgVlbi1VUyACGgYIgNe4vgY",
        "NID": "522=NV8ZVXzUyiWaMu7OrIdUdyvPcWKhsXSAxk8VMNW6H9yZvD_33vWjTwV7cAFRzY0Z18gasqeQXQ3bwXZPPE-UFcdAKgTUgufEw_HqIgjCQfCTr1Ssb3HCLgds6i8TCcWhGPNt0wH0Kg-kY4lbYSpFF1OOKciTMbrdYTL7ivNs4qtP21lgSYeIZLmcDOgeGCUvsHoY38WHH32DgEbDXJ5A1uee81OXtRK_tOTlcffvMLrG7d5wb22qpFELS425BnS3WI0pzqw33NeZHND9A0Ky9LuJdLT1Wbj7BxhvisFBYXM8GT0"
    }

    res = client.get("https://www.google.com/travel/flights", params=params, cookies=cookies)
    assert res.status_code == 200, f"{res.status_code} Result: {res.text_markdown}"
    
    return res  # Ensure this returns the correct response type for fast_flights

# Monkey patch the fetch function in fast_flights
fast_flights.core.fetch = custom_fetch

if len(sys.argv) < 5:
    print(json.dumps({"error": "dates and airports required"}))
    sys.exit(1)

departureDate = sys.argv[1] 
departureAirports = search_airport(sys.argv[2])
arrivalAirports = search_airport(sys.argv[3])


for departureAirport in departureAirports:
    for arrivalAirport in arrivalAirports:
        try:    
            result: Result = get_flights(
                flight_data=[FlightData(date=departureDate, from_airport=departureAirport, to_airport=arrivalAirport)],
                trip="one-way",
                seat="economy",
                passengers=Passengers(adults=1, children=0, infants_in_seat=0, infants_on_lap=0),
                fetch_mode="common",
                max_stops=0
            )

        except Exception as e:
            error_message = str(e)
            if "No flights found" in error_message:
                continue  # Ignore errors related to no flights
            print(f"Error fetching flight: {error_message[:200]}...")  # Truncate error message

# Print only successful flight results
if result:
    print(json.dumps(result, indent=2, ensure_ascii=False))
else:
    print("No flights available for the given routes.")
    
