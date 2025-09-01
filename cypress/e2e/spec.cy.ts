describe("todo", () => {
  beforeEach(() => {
    cy.task("reseed");
  });
  it("should display three todos by default", () => {
    cy.visit("/");
    cy.get("li").should("have.length", 3);
    cy.get("li").first().should("contain.text", "Feed the cat");
    cy.get("li").last().contains("Walk all the cats");
  });

  it("should be able to delete todo", () => {
    cy.visit("/");
    cy.contains("Feed the cat").parents("li").find("button").click();
    cy.get("li").should("have.length", 2);
    cy.contains("Feed the cat").should("not.exist");
  });

  it("should be able to search for a city and display weather", () => {
    cy.intercept("GET", "/weather?city=Stockholm", {
      statusCode: 200,
      body: {
        city: "Stockholm",
        temperature: 7,
        description: "clear sky",
      },
    }).as("getWeather");

    cy.visit("/");
    cy.get("input[placeholder='Ange stad']").type("Stockholm");
    cy.get("button").contains("Sök").click();

    cy.wait("@getWeather");
    cy.contains("Stockholm");
    cy.contains("7°C");
    cy.contains("clear sky");
  });

  it("should show errormessage if you type invalid city", () => {
    cy.intercept("GET", "/weather?city=FakeCity", {
      statusCode: 404,
      body: { error: "City not found" },
    });

    cy.visit("/");
    cy.get("input[placeholder='Ange stad']").type("FakeCity");
    cy.get("button").contains("Sök").click();

    cy.contains("Kunde inte hitta väder för FakeCity");
  });

  it("should show weather for favoritecity via cookie", () => {
    cy.setCookie("favoriteCity", "Göteborg");

    cy.intercept("GET", "/weather?city=Göteborg", {
      statusCode: 200,
      body: {
        city: "Göteborg",
        temperature: 12,
        description: "rainy",
      },
    });

    cy.visit("/");

    cy.contains("Göteborg");
    cy.contains("12°C");
    cy.contains("rainy");
  });

  it("should be able to change favoritecity", () => {
    cy.intercept("GET", "/weather?city=Malmö", {
      statusCode: 200,
      body: {
        city: "Malmö",
        temperature: 15,
        description: "sunny",
      },
    });

    cy.visit("/");
    cy.get("input[placeholder='Ange stad']").type("Malmö");
    cy.get("button").contains("Sök").click();

    cy.get("button").contains("Spara som favorit").click();

    cy.getCookie("favoriteCity").should("have.property", "value", "Malmö");
  });
});
