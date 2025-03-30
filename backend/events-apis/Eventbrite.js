require('dotenv').config();
const axios = require('axios');
const puppeteer = require('puppeteer');
const { insertEvents } = require('../methods/insertEvent');
const { eventbriteMapper } = require('../mappers/eventsMappers');
const { EVENTBRITE_URL_DATA, COOKIE_STRING_DATA, CSRFTOKEN_DATA } = require('../data/eventbriteScraperInputs');

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const EVENTBRITE_URL = EVENTBRITE_URL_DATA;
const COOKIE_STRING = COOKIE_STRING_DATA;
const CSRFTOKEN = CSRFTOKEN_DATA;

const fetchAllPages = async (initialSearchData, headers) => {
    let allEvents = [];
    let searchData = { ...initialSearchData };
    let pageCount = 0;
    const maxPages = 5; // ← Optional: stop after N pages to prevent hammering
  
    while (true) {
      const res = await axios.post(EVENTBRITE_URL, searchData, { headers });
  
      const events = res.data?.events?.results ?? [];
      const continuation = res.data?.events?.pagination?.continuation;
  
      allEvents.push(...events);
      pageCount++;
  
      if (!continuation || pageCount >= maxPages) break;
  
      // Prepare next request
      searchData = {
        ...initialSearchData,
        event_search: {
          ...initialSearchData.event_search,
          continuation
        }
      };
    }
  
    return allEvents;
  };

const Eventbrite = async (values) => {
  const { location, query, date } = values;

  if (!location) {
    throw new Error("Missing 'location' query param");
  }

  try {
    // Step 1: Get Google Place ID
    const autocompleteRes = await axios.post(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        input: location,
        locationBias: {
          circle: {
            center: { latitude: 53.3498, longitude: -6.2603 },
            radius: 50000.0
          }
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY
        }
      }
    );

    const suggestions = autocompleteRes.data.suggestions || [];
    const placePrediction = suggestions.find(s => s.placePrediction)?.placePrediction;
    const google_place_id = placePrediction?.placeId;

    if (!google_place_id) {
      throw new Error("No Google place ID found");
    }

    // Step 2: Scrape Eventbrite place ID using Puppeteer
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ "x-csrftoken": CSRFTOKEN });

    const cookies = COOKIE_STRING.split(";").map(cookie => {
      const [name, ...valParts] = cookie.trim().split("=");
      return {
        name,
        value: valParts.join("="),
        domain: ".eventbrite.com",
        path: "/"
      };
    });

    await page.setCookie(...cookies);
    await page.goto("https://www.eventbrite.com", { waitUntil: "domcontentloaded" });

    const eventbritePlace = await page.evaluate(async (placeId) => {
      const query = new URLSearchParams({
        google_place_id: placeId,
        enable_neighborhoods_and_boroughs: "true"
      }).toString();

      const response = await fetch(`https://www.eventbrite.com/api/v3/geo/place_from_google_place_id/?${query}`, {
        method: "GET",
        headers: { "x-requested-with": "XMLHttpRequest" },
        credentials: "include"
      });

      return await response.json();
    }, google_place_id);

    await browser.close();

    const ebPlaceId = eventbritePlace.place?.id;
    const ebSlug = eventbritePlace.place?.location_slug;

    if (!ebPlaceId) {
      throw new Error("Eventbrite place ID not found");
    }

    let ebDate = '';
    if (date) {
      ebDate = `start_date=${date}&end_date=${date}`;
    }

    // Step 3: Query Eventbrite for events
    const searchData = {
      event_search: {
        q: query,
        date_range: date ? { from: date, to: date } : undefined,
        dates: "current_future",
        dedup: true,
        places: [String(ebPlaceId)],
        page: 1,
        page_size: 20,
        online_events_only: false
      },
      "expand.destination_event": [
        "primary_venue",
        "image",
        "ticket_availability",
        "saves",
        "event_sales_status",
        "primary_organizer",
        "public_collections"
      ],
      debug_experiment_overrides: { search_exp_3: "D" },
      browse_surface: "search"
    };

    if (!date) {
      delete searchData.event_search.date_range;
    }

    const headers = {
      "accept": "*/*",
      "accept-encoding": "gzip, deflate, zstd",
      "accept-language": "en-IE,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json",
      "cookie": COOKIE_STRING,
      "dnt": "1",
      "origin": "https://www.eventbrite.com",
      "priority": "u=1, i",
      "referer": `https://www.eventbrite.com/d/${ebSlug}/${query}/${ebDate}`,
      "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
      "x-csrftoken": CSRFTOKEN,
      "x-requested-with": "XMLHttpRequest"
    };

    const events = await fetchAllPages(searchData, headers);
    if (!events || !Array.isArray(events)) {
      console.warn("No events found in Eventbrite response.");
      return { message: "No events found from Eventbrite." };
    }

    console.log(`Found ${events.length} events. Saving to the database...`);
    insertEvents(events, eventbriteMapper);

    console.log("All events saved successfully.");
    return { message: "Events successfully fetched and saved to the database." };
  } catch (error) {
    const errorDetails = {
      message: error.message || 'Unknown error',
      status: error.response?.status ?? null,
      statusText: error.response?.statusText ?? null,
      responseData: error.response?.data ?? null,
      requestUrl: error.config?.url ?? null,
      requestMethod: error.config?.method ?? null
    };

    console.error("Error fetching or saving events from Eventbrite:", errorDetails);
    throw new Error(JSON.stringify(errorDetails));
  }
};

module.exports = Eventbrite;
