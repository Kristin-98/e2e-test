
// Tests for Activity feature
describe("Favorites interaction", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/weather*Stockholm", {
      statusCode: 200,
      body: {
        city: "Stockholm",
        temperature: 22,
        description: "Soligt",
        icon: "01d",
      },
    }).as("getStockholmWeather");

    cy.visit("/");
  });

  it("should click on Stockholm favorite, verify weather, and select an activity", () => {
    cy.get('[data-testid="favorite-Stockholm"]').should("exist");

    cy.get('[data-testid="favorite-Stockholm"]').within(() => {
      cy.contains("Stockholm").should("exist");
      cy.contains("Soligt").should("exist");
      cy.contains("22°C").should("exist");
    });

    cy.get('[data-testid="favorite-Stockholm"]').click();
    cy.wait("@getStockholmWeather");

    cy.get("h2").contains("Stockholm").should("exist");
    cy.contains("Soligt").should("exist");
    cy.contains("22°C").should("exist");

    cy.contains("Välj aktivitet >").click();
    cy.contains("Löpning").click();
    cy.contains("30 minuter").click();
    cy.contains("Löpning - 30 min").should("exist");
  });

  it("should select activity and duration correctly", () => {
    cy.get('[data-testid="favorite-Stockholm"]').click();
    cy.contains("Välj aktivitet >").click();
    cy.contains("Löpning").click();
    cy.contains("15 minuter").click();
    cy.contains("Löpning - 15 min").should("exist");
  });

  it("should reset selection when Avbryt is clicked", () => {
    cy.get('[data-testid="favorite-Stockholm"]').click();
    cy.contains("Välj aktivitet >").click();
    cy.contains("Löpning").click();
    cy.contains("Avbryt").click();
    cy.contains("Välj aktivitet >").should("exist");
  });

  it("should show activities filtered by Soligt weather", () => {
    cy.get('[data-testid="favorite-Stockholm"]').click();
    cy.contains("Välj aktivitet >").click();
    cy.contains("Löpning").should("exist");
    cy.contains("Cykling").should("exist");
    cy.contains("Gym").should("not.exist");
    cy.contains("Simning").should("not.exist");
  });
});

describe("Favorites interaction - Göteborg", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/weather*G%C3%B6teborg*", {
      statusCode: 200,
      body: {
        city: "Göteborg",
        temperature: 18,
        description: "Molnigt",
        icon: "09d",
      },
    }).as("getGoteborgWeather");

    cy.visit("/");
  });

  it("should click on Göteborg favorite, verify weather, and select an activity", () => {
    cy.get('[data-testid="favorite-Göteborg"]').should("exist");

    cy.get('[data-testid="favorite-Göteborg"]').within(() => {
      cy.contains("Göteborg").should("exist");
      cy.contains("Molnigt").should("exist");
      cy.contains("18°C").should("exist");
    });

    cy.get('[data-testid="favorite-Göteborg"]').click();
    cy.wait("@getGoteborgWeather");

    cy.get("h2").contains("Göteborg").should("exist");
    cy.contains("Molnigt").should("exist");
    cy.contains("18°C").should("exist");

    cy.contains("Välj aktivitet >").click();
    cy.contains("Gym").click();
    cy.contains("45 minuter").click();
    cy.contains("Gym - 45 min").should("exist");
  });
})