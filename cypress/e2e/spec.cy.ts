describe("todo", () => {
  beforeEach(() => {
    cy.task("reseed");
    cy.clearCookies();
    cy.intercept("GET", "/api/weather*").as("getWeather");
    cy.visit("/");
  });
  // it("should display three todos by default", () => {
  //   cy.visit("/");
  //   cy.get("li").should("have.length", 3);
  //   cy.get("li").first().should("contain.text", "Feed the cat");
  //   cy.get("li").last().contains("Walk all the cats");
  // });

  // it("should be able to delete todo", () => {
  //   cy.visit("/");
  //   cy.contains("Feed the cat").parents("li").find("button").click();
  //   cy.get("li").should("have.length", 2);
  //   cy.contains("Feed the cat").should("not.exist");
  // });

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
          temperature: 12,
          description: "rainy",
          icon: "09d",
        },
      ],
    }).as("getFavorites");

    cy.visit("/");
    cy.wait("@getFavorites");
    cy.get("[data-testid='favorite-Göteborg']").within(() => {
      cy.contains("Göteborg");
      cy.contains("12°C");
      cy.contains("rainy");
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

  it("should remove a favorite city", () => {
    cy.get("[data-testid='favorite-Göteborg']")
      .find("button")
      .contains("x")
      .click();

    cy.get("[data-testid='favorite-Göteborg']").should("not.exist");
    cy.get("[data-testid='favorite-Stockholm']").should("exist");
  });

  // Tests for Activity feature
  


  it("opens and closes dropdown when button is clicked", () => {
    cy.contains("Välj aktivitet >").click();
    cy.contains("Löpning").should("exist");
    cy.contains("Välj aktivitet >").click();
    cy.contains("Löpning").should("not.exist");
  });

  it("resets selection when Avbryt is clicked", () => {
    cy.contains("Välj aktivitet >").click();
    cy.contains("Löpning").click();
    cy.contains("Avbryt").click();

    cy.contains("Välj aktivitet >").should("contain.text", "Välj aktivitet >");
  });
});
