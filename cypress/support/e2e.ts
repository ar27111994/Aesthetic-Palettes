// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Import commands.js using ES2015 syntax:
import './commands';
import '@testing-library/cypress/add-commands';
import 'cypress-axe';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add testing library commands
import '@testing-library/cypress/add-commands';

// Add cypress-axe commands
import 'cypress-axe';

// Add custom commands here
// Example:
// Cypress.Commands.add('login', (email, password) => { ... })
