const API = "http://localhost:8080";
const MOCK_TOKEN = "fake-jwt-token";

const MOCK_USER = {
  user_id: "test-user-id-123",
  user_email: "test@example.com",
  user_firstname: "Test",
  user_lastname: "Bruger",
  user_phone: "12345678",
  user_created_at: "2024-01-01T00:00:00Z",
  user_updated_at: "2024-01-01T00:00:00Z",
  user_deleted_at: null,
  user_verified_at: "2024-01-01T00:00:00Z",
};

// Two locations clearly inside Denmark (lng: 7–16, lat: 54–58)
const MOCK_LOCATIONS = {
  locations: [
    {
      location_id: "loc-1",
      location_name: "Brøndby Vaskehal",
      location_address: "Brøndby Strand 10",
      location_zipcode: "2660",
      location_coordinate_x: 12.43, // lng – near mock user
      location_coordinate_y: 55.63, // lat
      location_open_hours: "7-22",
    },
    {
      location_id: "loc-2",
      location_name: "Aarhus Vaskehal",
      location_address: "Åboulevarden 5",
      location_zipcode: "8000",
      location_coordinate_x: 10.21, // lng – far from mock user
      location_coordinate_y: 56.16, // lat
      location_open_hours: "8-20",
    },
  ],
};

// Mock user is near Brøndby, so loc-1 should rank first by distance
const USER_LAT = 55.65;
const USER_LNG = 12.45;

const grantGeo = (success: any) => {
  success({
    coords: { latitude: USER_LAT, longitude: USER_LNG, accuracy: 100 },
    timestamp: Date.now(),
  });
};

const denyGeo = (_success: any, error: any) => {
  error({ code: 1, message: "Permission denied" });
};

// Visits /locations/list with auth state and a geolocation stub already in place.
// cy.setCookie sets the token the Next.js middleware reads (server-side).
// onBeforeLoad sets localStorage that AuthContext reads (client-side).
function visitList(geoFn: any) {
  cy.setCookie("token", MOCK_TOKEN);
  cy.visit("/locations/list", {
    onBeforeLoad(win) {
      win.localStorage.setItem("token", MOCK_TOKEN);
      win.localStorage.setItem("auth_user", JSON.stringify(MOCK_USER));
      cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake(geoFn);
    },
  });
}

describe("Nearest location – list view", () => {
  beforeEach(() => {
    cy.intercept("GET", `${API}/api/users/**`, {
      statusCode: 200,
      body: MOCK_USER,
    });
    cy.intercept("GET", `${API}/api/locations`, {
      statusCode: 200,
      body: MOCK_LOCATIONS,
    }).as("getLocations");
  });

  // ------------------------------------------------------------------ page load
  it("shows page title and all location cards", () => {
    visitList(grantGeo);
    cy.wait("@getLocations");

    cy.contains("Vaskehaller").should("be.visible");
    cy.get(".washworld-popup-card").should("have.length", 2);
  });

  it("shows loading indicator while fetching", () => {
    cy.intercept("GET", `${API}/api/locations`, (req) => {
      req.reply({ delay: 2000, statusCode: 200, body: MOCK_LOCATIONS });
    }).as("slowLocations");

    visitList(grantGeo);
    cy.contains("Henter lokationer").should("be.visible");
    cy.wait("@slowLocations");
  });

  it("shows an error message when the API fails", () => {
    cy.intercept("GET", `${API}/api/locations`, {
      statusCode: 500,
      body: { error: "Server fejl" },
    }).as("failedLocations");

    visitList(grantGeo);
    cy.wait("@failedLocations");
    cy.contains("Kunne ikke").should("be.visible");
  });

  // ------------------------------------------------------------------ geolocation granted
  it("shows 'Sorteret efter afstand' when geolocation is granted", () => {
    visitList(grantGeo);
    cy.wait("@getLocations");

    cy.contains("Sorteret efter afstand").should("be.visible");
  });

  it("puts the nearest location first when geolocation is granted", () => {
    visitList(grantGeo);
    cy.wait("@getLocations");

    // Brøndby is closest to the mock user position
    cy.get(".washworld-popup-card").first().should("contain.text", "Brøndby");
    cy.get(".washworld-popup-card").last().should("contain.text", "Aarhus");
  });

  it("shows a distance label in km on each card", () => {
    visitList(grantGeo);
    cy.wait("@getLocations");

    cy.get(".washworld-popup-card")
      .first()
      .find(".washworld-popup-distance")
      .should("contain.text", "km");
  });

  // ------------------------------------------------------------------ geolocation denied
  it("shows 'Tillad placering' when geolocation is denied", () => {
    visitList(denyGeo);
    cy.wait("@getLocations");

    cy.contains("Tillad placering").should("be.visible");
  });

  it("sorts alphabetically when geolocation is denied", () => {
    visitList(denyGeo);
    cy.wait("@getLocations");

    // Without distance, sorted by name — 'Aarhus' < 'Brøndby'
    cy.get(".washworld-popup-card").first().should("contain.text", "Aarhus");
    cy.get(".washworld-popup-card").last().should("contain.text", "Brøndby");
  });

  it("shows '— km' as the distance placeholder when geolocation is denied", () => {
    visitList(denyGeo);
    cy.wait("@getLocations");

    cy.get(".washworld-popup-card")
      .first()
      .find(".washworld-popup-distance")
      .should("contain.text", "—");
  });

  // ------------------------------------------------------------------ card content
  it("shows address, open hours and 'Se mere' link on each card", () => {
    visitList(grantGeo);
    cy.wait("@getLocations");

    cy.get(".washworld-popup-card").first().within(() => {
      cy.get(".washworld-popup-address").should("contain.text", "2660");
      cy.get(".washworld-popup-hours").should("contain.text", "Åben");
      cy.get(".washworld-popup-more").should("contain.text", "Se mere");
    });
  });

  // ------------------------------------------------------------------ navigation
  it("navigates to the details page when 'Se mere' is clicked", () => {
    visitList(grantGeo);
    cy.wait("@getLocations");

    cy.get(".washworld-popup-card").first().contains("Se mere").click();
    cy.url().should("include", "/details");
    cy.url().should("include", "id=");
  });
});
