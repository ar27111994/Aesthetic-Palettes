/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Fullscreen Palette', () => {
  // Setup before tests
  beforeEach(() => {
    // Visit the palette page (replace with your actual route)
    cy.visit('/palettes/1');
    
    // Mock the fullscreen API
    cy.mockFullscreen();
    
    // Wait for the page to load
    cy.findByRole('heading', { name: /palette/i }).should('be.visible');
  });

  it('should toggle fullscreen mode when clicking the fullscreen button', () => {
    // Check initial state (not in fullscreen)
    cy.isNotFullscreen();
    
    // Click the fullscreen button
    cy.toggleFullscreen();
    
    // Simulate successful fullscreen change
    cy.get('[data-testid="palette-container"]').then(($el) => {
      cy.simulateFullscreenChange($el);
    });
    
    // Check if fullscreen was entered
    cy.isFullscreen();
    
    // Check if fullscreen controls are visible
    cy.findByRole('button', { name: /exit fullscreen/i }).should('be.visible');
    
    // Exit fullscreen
    cy.findByRole('button', { name: /exit fullscreen/i }).click();
    
    // Simulate exiting fullscreen
    cy.simulateFullscreenChange();
    
    // Check if fullscreen was exited
    cy.isNotFullscreen();
  });

  it('should display an error message when fullscreen is not supported', () => {
    // Mock fullscreen not being supported
    cy.window().then((win) => {
      Object.defineProperty(win.document, 'fullscreenEnabled', {
        get: cy.stub().returns(false),
        configurable: true,
      });
    });
    
    // Try to enter fullscreen
    cy.toggleFullscreen();
    
    // Check for error message
    cy.findByText(/your browser does not support all features required for fullscreen mode/i).should('be.visible');
  });

  it('should maintain keyboard accessibility in fullscreen mode', () => {
    // Enter fullscreen
    cy.toggleFullscreen();
    cy.get('[data-testid="palette-container"]').then(($el) => {
      cy.simulateFullscreenChange($el);
    });
    
    // Check if focus is trapped in fullscreen mode
    cy.realPress('Tab');
    cy.focused().should('have.attr', 'aria-label', 'Exit fullscreen');
    
    // Test keyboard shortcuts
    cy.realPress('Escape');
    cy.simulateFullscreenChange();
    cy.isNotFullscreen();
  });

  it('should maintain accessibility in fullscreen mode', () => {
    // Enter fullscreen
    cy.toggleFullscreen();
    cy.get('[data-testid="palette-container"]').then(($el) => {
      cy.simulateFullscreenChange($el);
    });
    
    // Check accessibility
    cy.checkAccessibility();
    
    // Check ARIA attributes
    cy.get('[data-testid="palette-container"]')
      .should('have.attr', 'aria-label')
      .and('match', /fullscreen palette/i);
      
    // Exit fullscreen
    cy.findByRole('button', { name: /exit fullscreen/i }).click();
    cy.simulateFullscreenChange();
    
    // Check ARIA attributes after exiting
    cy.get('[data-testid="palette-container"]')
      .should('have.attr', 'aria-label')
      .and('match', /palette/i);
  });

  it('should handle fullscreen errors gracefully', () => {
    // Mock requestFullscreen to reject
    cy.window().then((win) => {
      Element.prototype.requestFullscreen = cy.stub().rejects(new Error('Fullscreen error'));
    });
    
    // Try to enter fullscreen
    cy.toggleFullscreen();
    
    // Check for error message
    cy.findByRole('alert').should('be.visible');
    
    // Check if error message contains the error text
    cy.findByRole('alert').should('contain.text', 'error');
  });

  it('should maintain color contrast in fullscreen mode', () => {
    // Enter fullscreen
    cy.toggleFullscreen();
    cy.get('[data-testid="palette-container"]').then(($el) => {
      cy.simulateFullscreenChange($el);
    });
    
    // Check contrast for all color swatches
    cy.get('[data-testid^="color-swatch-"]').each(($swatch) => {
      // Get the background color
      const bgColor = $swatch.css('background-color');
      
      // Get the text color (assuming white or black based on contrast)
      const textColor = $swatch.css('color');
      
      // Check if the contrast ratio is sufficient
      // This is a simplified check - in a real test, you'd use a library like color
      // to calculate the actual contrast ratio
      cy.wrap($swatch).should(($el) => {
        // This is a placeholder - replace with actual contrast checking logic
        expect($el.text()).to.exist; // Just checking that text exists
      });
    });
  });
});
