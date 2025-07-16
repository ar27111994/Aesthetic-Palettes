// Import Cypress types for augmentation
import { Chainable } from 'cypress';

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Custom command to check accessibility with cypress-axe
       * @example cy.checkAccessibility()
       */
      checkAccessibility(options?: any): Chainable<void>;

      /**
       * Toggle fullscreen mode
       * @example cy.toggleFullscreen()
       */
      toggleFullscreen(): Chainable<void>;

      /**
       * Check if an element is in fullscreen
       * @example cy.get('#element').isFullscreen()
       */
      isFullscreen(): Chainable<JQuery<HTMLElement>>;

      /**
       * Check if an element is not in fullscreen
       * @example cy.get('#element').isNotFullscreen()
       */
      isNotFullscreen(): Chainable<JQuery<HTMLElement>>;

      /**
       * Mock the fullscreen API for testing
       * @example cy.mockFullscreen()
       */
      mockFullscreen(): Chainable<void>;

      /**
       * Simulate a fullscreen change event
       * @example cy.simulateFullscreenChange()
       */
      simulateFullscreenChange(element?: JQuery<HTMLElement>): Chainable<void>;
    }
  }
}
