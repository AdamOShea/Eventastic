import gobnb
import json
currency="MXN"
check_in = "2024-11-02"
check_out = "2024-11-10"
ne_lat = -1.03866277790021
ne_long = -77.53091734683608
sw_lat = -1.1225978433925647
sw_long = -77.59713412765507
zoom_value = 2
results = gobnb.Search_all(check_in,check_out,ne_lat,ne_long,sw_lat,sw_long,zoom_value, currency,"")
details_data = []
progress = 1
jsondata = json.dumps(results)
f = open("results.json", "w")
f.write(jsondata)
f.close()
for result in results[:10]:
    data = gobnb.Get_from_room_id(result["room_id"],currency,check_in,check_out,"")
    details_data.append(data)
    print("len results: ",progress, len(results))
    progress=progress+1
    
details_data_json = json.dumps(details_data)
f = open("details_data.json", "w")
f.write(details_data_json)
f.close()