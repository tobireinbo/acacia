describe("log in and out", () => {
  it("passes", () => {
    cy.visit("/");
    cy.url().should("include", "/auth/login");
    cy.get(`input[name="email"]`).type("test@acacia.app");
    cy.get('input[name="password"]').type("password");
    cy.get("button").click();

    cy.url().should("eq", "http://localhost:3000/");
    cy.getCookie("token").should("exist");

    cy.visit("/settings");
    cy.url().should("include", "/settings");
    cy.get("button").contains("Logout").click();

    cy.url().should("include", "/auth/login");
    cy.getCookie("token").should("not.exist");
  });
});

export {};
