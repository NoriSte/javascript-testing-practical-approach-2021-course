/// <reference types="Cypress" />

import { paths } from "../../../realworld/frontend/src/components/App";
import { noArticles } from "../../../realworld/frontend/src/components/ArticleList";

Cypress.Commands.add("signupV2", ({ email, username, password } = {}) => {
  const random = Math.floor(Math.random() * 100000);
  const user = {
    username: username || `Tester${random}`,
    email: email || `user+${random}@realworld.io`,
    password: password || "mysupersecretpassword"
  };

  // set up AJAX call interception
  cy.intercept("POST", "**/api/users").as("signup-request");

  cy.visit(paths.register);

  cy.window()
    .its("appActions")
    .invoke("signup", user);

  // ... and AJAX call waiting
  cy.wait("@signup-request").should(interception => {
    expect(interception.request.body).deep.equal({
      user: {
        username: user.username,
        email: user.email,
        password: user.password
      }
    });

    expect(interception.response.statusCode).to.equal(200);

    cy.wrap(interception.response.body)
      .should("have.property", "user")
      .and(
        user =>
          expect(user)
            .to.have.property("token")
            .and.to.be.a("string").and.not.to.be.empty
      )
      .and("deep.include", {
        username: user.username.toLowerCase(),
        email: user.email
      });
  });

  // end of the flow
  cy.findByText(noArticles).should("be.visible");

  cy.then(() => user);
});
