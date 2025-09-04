describe("Weather card", () => {
  beforeEach(() => {
    cy.task("reseed");
    cy.clearCookies();
    cy.intercept("GET", "/api/weather*").as("getWeather");
    cy.visit("/");
  });

  it("should display weather when a valid city is searched", () => {
    cy.intercept("GET", "api/weather?city=Stockholm*", {
      statusCode: 200,
      body: {
        city: "Stockholm",
        temperature: 7,
        description: "clear sky",
        icon: "01d",
      },
    }).as("getWeatherStockholm");

    cy.get("input[placeholder='Ange stad']").type("Stockholm");
    cy.get("button").contains("Sök").click();

    cy.wait("@getWeatherStockholm");
    cy.contains("Stockholm");
    cy.contains("7°C");
    cy.contains("clear sky");
  });

  it("should show error message for invalid city", () => {
    cy.intercept("GET", "api/weather?city=FakeCity*", {
      statusCode: 404,
      body: { error: "City not found" },
    }).as("getWeatherFakeCity");

    cy.get("input[placeholder='Ange stad']").type("FakeCity");
    cy.get("button").contains("Sök").click();

    cy.wait("@getWeatherFakeCity");
    cy.contains("Kunde inte hitta väder för FakeCity");
  });

  // Tests for Favorite feature
  it("should show weather for favorite city from the database", () => {
    cy.intercept("GET", "/api/favorites", {
      statusCode: 200,
      body: [
        {
          city: "Göteborg",
          temperature: 18,
          description: "Molnigt",
          icon: "09d",
        },
      ],
    }).as("getFavorites");

    cy.visit("/");
    cy.wait("@getFavorites");
    cy.get("[data-testid='favorite-Göteborg']").within(() => {
      cy.contains("Göteborg");
      cy.contains("18°C");
      cy.contains("Molnigt");
    });
  });

  it("should add a new favorite city", () => {
    cy.intercept("GET", "api/weather?city=Malm*", {
      statusCode: 200,
      body: {
        city: "Malmö",
        temperature: 15,
        description: "Sunny",
        icon: "01d",
      },
    }).as("getWeatherMalmo");

    cy.intercept("POST", "/api/favorites", {
      statusCode: 200,
      body: {
        city: "Malmö",
        temperature: 15,
        description: "Sunny",
        icon: "01d",
      },
    }).as("postFavorite");

    cy.get("input[placeholder='Ange stad']").type("Malmö");
    cy.get("button").contains("Sök").click();
    cy.wait("@getWeatherMalmo");
    cy.get("button").contains("Spara som favorit").click();
    cy.wait("@postFavorite");
    cy.get("[data-testid='favorite-Malmö']").should("exist");
  });
});
