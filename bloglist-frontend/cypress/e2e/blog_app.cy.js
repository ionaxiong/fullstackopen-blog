describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "root",
      username: "root",
      password: "root",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    cy.visit("http://localhost:3000");
  });

  it("login form is shown", function () {
    cy.contains("Blogs");
  });

  it("login form can be opened", function () {
    cy.contains("login").click();
  });

  describe("login", function () {
    beforeEach(function () {
      cy.contains("login").click();
    });

    it("succeeds with correct credentials", function () {
      cy.get("#username").type("root");
      cy.get("#password").type("root");
      cy.get("#login-button").click();
      cy.contains("root logged-in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("root");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();
      cy.get(".error")
        .should("contain", "wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");
    });
  });

  describe("blog app", function () {
    describe("when logged in", function () {
      beforeEach(function () {
        cy.login({ username: "root", password: "root" });
      });

      it("a blog can be created", function () {
        cy.createBlog({
          title: "test title",
          author: "test author",
          url: "test url",
        });
        cy.contains("test title");
        cy.contains("test author");
        cy.contains("test url");
      });

      it("user can like a blog", function () {
        cy.createBlog({
          title: "test title",
          author: "test author",
          url: "test url",
        });

        cy.contains("test title test author")
          .parent()
          .find("button.viewButton")
          .click();

        cy.contains("likes")
          .parent()
          .find("button.likeButton")
          .as("likeButton")
          .click();

        cy.get("@likeButton").parent().contains("likes 1");
      });

      it("user who created a blog can delete it", function () {
        cy.createBlog({
          title: "test title",
          author: "test author",
          url: "test url",
        });

        cy.contains("test title test author")
          .parent()
          .find("button.viewButton")
          .click();
        cy.contains("remove").click();
        cy.get("html").should("contain", "root logged-in");
        cy.get("html").should("not.contain", "view");
        cy.get("html").should("contain", "Remove blog test title");
      });
    });
  });

  describe("only creator can see the blog remove button", function () {
    beforeEach(function () {
      cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
      const rootUser = {
        name: "root",
        username: "root",
        password: "root",
      };
      const adminUser = {
        name: "admin",
        username: "admin",
        password: "admin",
      };
      cy.request("POST", `${Cypress.env("BACKEND")}/users`, rootUser);
      cy.request("POST", `${Cypress.env("BACKEND")}/users`, adminUser);
      cy.visit("http://localhost:3000");
    });

    describe("blog app", function () {
      describe("when root user logged in", function () {
        beforeEach(function () {
          cy.login({ username: "root", password: "root" });
        });

        it("root user who created a blog can delete it", function () {
          cy.get("html").should("contain", "root logged-in");
          cy.get("html").should("not.contain", "admin logged-in");

          cy.createBlog({
            title: "test title",
            author: "test author",
            url: "test url",
          });

          cy.contains("test title test author")
            .parent()
            .find("button.viewButton")
            .click();
          cy.contains("remove").click();
          cy.get("html").should("not.contain", "view");
          cy.get("html").should("contain", "Remove blog test title");
        });
      });
      describe("when admin user logged in", function () {
        beforeEach(function () {
          cy.login({ username: "admin", password: "admin" });
        });

        it("admin user cannot delete root user's blog", function () {
          cy.get("html").should("contain", "admin logged-in");
          cy.get("html").should("not.contain", "root logged-in");

          cy.get("html").should("not.contain", "view");
        });
      });
    });
  });

  describe("the blogs are ordered according to likes with the blog with the most likes being first", function () {
    beforeEach(function () {
      cy.login({ username: "root", password: "root" });
      cy.createBlog({
        title: "test title 1",
        author: "test author 1",
        url: "test url 1",
      });
      cy.createBlog({
        title: "test title 2",
        author: "test author 2",
        url: "test url 2",
      });
    });

    it("the blog with the most likes is first", function () {
      cy.contains("test title 1 test author 1")
        .parent()
        .find("button.viewButton")
        .click();
      cy.contains("likes").parent().find("button.likeButton").click();
      cy.get(".blog").eq(0).contains("The title with the most likes");
      cy.get(".blog").eq(1).contains("The title with the second most likes");
    });
  });
});
