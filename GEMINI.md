---
trigger: always_on
---

1. **Core Functionality**: App must mirror all functionalities of [https://coolors.co/](https://coolors.co/) while leveraging free/open-source tools and services. Moreover, in addition to all of the rules set forth in this document, follow/update all/any of the documentation set forth in the common docs section of the MCP Builder's Context window respectively as well for general guidelines and best practices.

2. **Cost Constraints**:

   - All features must be implementable using free-tier tools/services
   - Infrastructure cost must be $0 initially
   - Document future scaling costs and breakeven analysis

3. **User Experience Requirements**:

   - Responsive design across mobile, tablet, and desktop devices
   - Professional UI following modern design principles
   - Intuitive UX with clear user flows and feedback
   - Loading states and error handling for all operations

4. **Accessibility Standards**:

   - WCAG 2.1 AA compliance mandatory
   - Documented accessibility plan with testing procedures
   - Keyboard navigation support for all features
   - Screen reader compatibility with proper ARIA attributes
   - Use of React-aria primitives for accessible UI components
   - Use of semantic HTML elements
   - Use of ARIA attributes for complex UI components
   - Use of ARIA roles for complex UI components
   - Use of ARIA states for complex UI components
   - Use of ARIA properties for complex UI components
   - Use of ARIA live regions for complex UI components

5. **Security Implementation**:

   - Authentication and authorization controls
   - Data encryption in transit and at rest
   - Input validation and output sanitization
   - Protection against OWASP Top 10 vulnerabilities
   - Compliance with relevant regulations (GDPR, CCPA, etc.)
   - Regular security audits and vulnerability assessments

6. **Frontend Development Standards**:

   - React, Next.js, TypeScript, Headless UI, React-Aria, and Tailwind CSS best practices
   - No dynamic class name construction (use complete class names)
   - No dynamic prop-based styling (use variant mapping instead)
   - Component composition over inheritance
   - State management with appropriate patterns (Context, Redux, etc.)
   - Server-side rendering where applicable
   - Progressive enhancement for older browsers
   - Progressive web app (PWA) capabilities
   - Loading states and error handling for all operations
   - Accessibility testing and feedback
   - Create and use theme variables for consistent theming
   - Use of atomic CSS classes
   - Priorotize CSS grid or flexbox for layout
   - Use of Tailwind CSS utilities for styling
   - Use of Tailwind CSS variants for responsive design
   - Use of Tailwind CSS plugins for advanced functionality
   - Use of Tailwind CSS directives for advanced functionality

7. **Internationalization**:

   - Translation keys for all user-facing text
   - Right-to-left language support
   - Date, time, and number formatting for different locales
   - Language detection and preference storage

8. **Code Quality Requirements**:

   - Comprehensive documentation with JSDoc/TSDoc
   - Consistent code style enforced via linting
   - Component reusability with a shared component library
   - Code complexity metrics monitoring
   - Regular code quality reviews

9. **Version Control Practices**:

   - Follow guidelines in dev-setup.md
   - Review process and standards from contribution.md
   - Conventional commit messages
   - Branch protection rules
   - Pull request templates with checklists

10. **Testing Strategy**:

    - Unit tests (80% minimum coverage)
    - Integration tests for key user flows
    - E2E tests for critical paths
    - Visual regression testing
    - Performance benchmarking tests
    - Automated test execution in CI pipeline

11. **Performance Optimization**:

    - Image optimization with next/image or equivalent
    - Bundle size monitoring and code splitting
    - API response time benchmarks (<300ms target)
    - Lazy loading for non-critical resources
    - Performance budgets for key metrics (FCP, LCP, TTI)
    - Caching strategies for static and dynamic content

12. **API Architecture**:

    - REST and/or GraphQL best practices
    - Supabase and PostgreSQL optimization
    - Rate limiting and request throttling
    - API versioning strategy
    - Comprehensive API documentation
    - Error handling and status codes standardization
    - Load testing procedures with defined thresholds

13. **AI Features Implementation**:

    - Ethical AI guidelines compliance
    - User consent for AI processing
    - Transparency in AI-assisted features
    - Bias detection and mitigation strategies
    - Fallback mechanisms for AI feature failures
    - AI feature documentation and usage guidelines
    - AI feature performance benchmarking

14. **CI/CD Pipeline**:

    - Automated code quality checks
    - Standardized PR templates and review checklists
    - Deployment automation with rollback capabilities
    - Environment separation (dev, staging, production)
    - Feature flagging for controlled rollouts

15. **Scalability Planning**:

    - Documented architecture for horizontal scaling
    - Database indexing and query optimization
    - Caching layers implementation
    - Load testing procedures with defined thresholds
    - Monitoring and alerting setup

16. **SEO Optimization**:

    - Server-side rendering for critical pages
    - Metadata and OpenGraph tag management
    - Structured data/schema markup
    - Sitemap generation
    - SEO performance monitoring

17. **Dependency Management**:

    - Regular updates to latest stable versions
    - Security vulnerability scanning
    - Dependency size monitoring
    - License compliance verification
    - Deprecated package detection and replacement

18. **Development Workflow**:

    - Feature branches with descriptive names
    - Pull requests with detailed descriptions
    - Semantic versioning for releases
    - Automated changelog generation
    - Documentation updates with code changes

19. **Database Best Practices**:

    - PostgreSQL optimization techniques
    - Data migration and backup strategies
    - Connection pooling configuration
    - Query performance monitoring
    - Database schema documentation
    - Policy-based access control
    - Realtime updates and notifications

20. **Architecture Principles**:

    - Component-based design
    - Separation of concerns
    - Single responsibility principle
    - DRY (Don't Repeat Yourself) approach
    - SOLID principles application
    - Supabase and GraphQL best practices

21. **Documentation Standards**:

    - Code documentation with JSDoc/TSDoc
    - User guide with step-by-step instructions
    - API reference documentation
    - Architecture diagrams and diagrams.net files
    - User flow diagrams
    - User interface design files

22. **Continuous Improvement**:

    - Regular code reviews and feedback
    - Performance optimization iterations
    - Feature enhancement proposals
    - Codebase maintenance and refactoring
    - Security vulnerability reporting and remediation

23. **Legal and Compliance**:

    - GDPR, CCPA, and other relevant regulations compliance
    - Privacy policy and terms of service documentation
    - Third-party service usage agreements
    - Legal review and approval process

24. **Accessibility and Inclusion**:

    - Accessibility testing and feedback
    - Inclusion guidelines adherence
    - Accessibility statement
    - Equal opportunity and diversity considerations

25. **User Engagement and Feedback**:

    - Regular user feedback collection
    - User testing and usability studies
    - User feedback loop and improvement plans
