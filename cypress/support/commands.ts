// ***********************************************
// Custom Commands
// ***********************************************

// Custom command to check accessibility with cypress-axe
Cypress.Commands.add('checkAccessibility', (options = {}) => {
  cy.injectAxe();
  cy.checkA11y(null, {
    includedImpacts: ['critical', 'serious'],
    rules: {
      'color-contrast': { enabled: false }, // Disable color contrast checking
      'landmark-one-main': { enabled: false }, // Disable for single page apps
      'page-has-heading-one': { enabled: false }, // Disable for dynamic content
      'region': { enabled: false }, // Disable for dynamic content
      ...options.rules,
    },
    ...options,
  });
});

// Command to toggle fullscreen mode
Cypress.Commands.add('toggleFullscreen', () => {
  cy.get('[data-testid="view-options-toggle"]').click();
  cy.get('[data-testid="fullscreen-toggle"]').click();
});

// Command to check if an element is in fullscreen
Cypress.Commands.add('isFullscreen', { prevSubject: 'optional' }, (subject) => {
  const element = subject ? cy.wrap(subject) : cy.document();
  element.should(($el) => {
    const doc = $el[0].ownerDocument || $el[0];
    const fullscreenElement = 
      doc.fullscreenElement || 
      doc.webkitFullscreenElement || 
      doc.mozFullScreenElement || 
      doc.msFullscreenElement;
    
    expect(!!fullscreenElement).to.be.true;
  });
  return subject;
});

// Command to check if an element is not in fullscreen
Cypress.Commands.add('isNotFullscreen', { prevSubject: 'optional' }, (subject) => {
  const element = subject ? cy.wrap(subject) : cy.document();
  element.should(($el) => {
    const doc = $el[0].ownerDocument || $el[0];
    const fullscreenElement = 
      doc.fullscreenElement || 
      doc.webkitFullscreenElement || 
      doc.mozFullScreenElement || 
      doc.msFullscreenElement;
    
    expect(!!fullscreenElement).to.be.false;
  });
  return subject;
});

// Command to mock the fullscreen API
Cypress.Commands.add('mockFullscreen', () => {
  cy.window().then((win) => {
    // Mock requestFullscreen
    Element.prototype.requestFullscreen = cy.stub().resolves();
    
    // Mock exitFullscreen
    Object.defineProperty(win.document, 'exitFullscreen', {
      value: cy.stub().resolves(),
      writable: true,
    });
    
    // Mock fullscreenElement
    Object.defineProperty(win.document, 'fullscreenElement', {
      get: cy.stub().returns(null),
      configurable: true,
    });
    
    // Mock fullscreenEnabled
    Object.defineProperty(win.document, 'fullscreenEnabled', {
      get: cy.stub().returns(true),
      configurable: true,
    });
    
    // Mock vendor prefixed versions
    const vendors = ['webkit', 'moz', 'ms'];
    vendors.forEach((vendor) => {
      const prefix = vendor === 'ms' ? 'MS' : vendor;
      
      // Mock requestFullscreen
      Element.prototype[`${vendor}RequestFullscreen`] = 
        Element.prototype[`${prefix}RequestFullscreen`] = 
        cy.stub().resolves();
      
      // Mock exitFullscreen
      win.document[`${vendor}ExitFullscreen`] = 
      win.document[`${prefix}ExitFullscreen`] = 
        cy.stub().resolves();
      
      // Mock fullscreenElement
      Object.defineProperty(win.document, `${vendor}FullscreenElement`, {
        get: cy.stub().returns(null),
        configurable: true,
      });
      
      // Mock fullscreenEnabled
      Object.defineProperty(win.document, `${vendor}FullscreenEnabled`, {
        get: cy.stub().returns(true),
        configurable: true,
      });
    });
  });
});

// Command to simulate fullscreen change event
Cypress.Commands.add('simulateFullscreenChange', (element) => {
  cy.window().then((win) => {
    // Set the fullscreen element
    Object.defineProperty(win.document, 'fullscreenElement', {
      get: cy.stub().returns(element ? element[0] : null),
      configurable: true,
    });
    
    // Dispatch fullscreen change event
    const event = new Event('fullscreenchange');
    win.document.dispatchEvent(event);
    
    // Also dispatch vendor-prefixed events
    ['webkit', 'moz', 'ms'].forEach((vendor) => {
      const eventName = `${vendor}fullscreenchange`;
      const event = new Event(eventName);
      win.document.dispatchEvent(event);
    });
  });
});

// Add TypeScript type definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      checkAccessibility(options?: any): Chainable<void>;
      toggleFullscreen(): Chainable<void>;
      isFullscreen(): Chainable<JQuery<HTMLElement>>;
      isNotFullscreen(): Chainable<JQuery<HTMLElement>>;
      mockFullscreen(): Chainable<void>;
      simulateFullscreenChange(element?: JQuery<HTMLElement>): Chainable<void>;
    }
  }
}
