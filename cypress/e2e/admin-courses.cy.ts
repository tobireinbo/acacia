describe("create and delete a course", () => {
  it("passes", () => {
    cy.visit("/");
    cy.url().should("include", "/auth/login");
    cy.get(`input[name="email"]`).type("test@acacia.app");
    cy.get('input[name="password"]').type("password");
    cy.get("button").click();
    cy.url().should("eq", "http://localhost:3000/");

    cy.visit("/admin/courses");
    cy.url().should("include", "/admin/courses");
    cy.get("button").contains("Add Course").click();

    cy.url().should("include", "/admin/courses/edit");

    cy.get('input[name="title"]').type("test_cypress");
    cy.get("div").contains("Description").click();
    cy.get('textarea[spellcheck="false"]').type("# Cypress");
    cy.get("body").click(0, 0);

    cy.get("select").select("Test User");

    cy.get("button").contains("Save").click();

    cy.url().should("eq", "http://localhost:3000/admin/courses");

    cy.wait(1000);
    cy.get("h3").contains("test_cypress").click();

    cy.url().should("include", "/admin/courses/edit?courseId=");
    cy.get("button").contains("Delete Course").click();
    cy.get("button").contains("Confirm").click();
    cy.url().should("include", "/admin/courses");
  });
});

export {};
