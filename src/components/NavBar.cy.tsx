import React from "react";
import { interpret } from "xstate";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";
import NavBar from "./NavBar";
import { dataMachine } from "../machines/dataMachine";

describe("NavBar Responsive Behavior", () => {
  let notificationsService;

  beforeEach(() => {
    notificationsService = interpret(
      dataMachine("notifications").withConfig({
        services: {
          fetchData: () => Promise.resolve({ results: [{ id: 1 }, { id: 2 }], pageData: {} }),
        },
      })
    );
    notificationsService.start();
    notificationsService.send("FETCH");
  });

  afterEach(() => {
    notificationsService.stop();
  });

  it("should display RWALogo on desktop viewport (sm and up)", () => {
    const mockToggleDrawer = cy.stub();
    const desktopTheme = createTheme({
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 900,
          lg: 1200,
          xl: 1536,
        },
      },
    });

    cy.viewport(1200, 800);
    cy.mount(
      <MemoryRouter>
        <ThemeProvider theme={desktopTheme}>
          <NavBar
            drawerOpen={false}
            toggleDrawer={mockToggleDrawer}
            notificationsService={notificationsService}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    cy.get("[data-test=app-name-logo]").should("exist");
    cy.get("[data-test=app-name-logo] svg").should("have.attr", "width", "235px");
  });

  it("should display RWALogoIcon on mobile viewport (xs only)", () => {
    const mockToggleDrawer = cy.stub();
    const mobileTheme = createTheme({
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 900,
          lg: 1200,
          xl: 1536,
        },
      },
    });

    cy.viewport(400, 800);
    cy.mount(
      <MemoryRouter>
        <ThemeProvider theme={mobileTheme}>
          <NavBar
            drawerOpen={false}
            toggleDrawer={mockToggleDrawer}
            notificationsService={notificationsService}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    cy.get("[data-test=app-name-logo]").should("exist");
    cy.get("[data-test=app-name-logo] svg").should("have.attr", "width", "47px");
  });

  it("should display notification badge with correct count", () => {
    const mockToggleDrawer = cy.stub();
    cy.viewport(1200, 800);
    cy.mount(
      <MemoryRouter>
        <ThemeProvider theme={createTheme()}>
          <NavBar
            drawerOpen={false}
            toggleDrawer={mockToggleDrawer}
            notificationsService={notificationsService}
          />
        </ThemeProvider>
      </MemoryRouter>
    );

    cy.get("[data-test=nav-top-notifications-count]").should("contain", "2");
    cy.get("[data-test=nav-top-notifications-link]").should("exist");
  });
});
