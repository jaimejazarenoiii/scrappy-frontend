# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`

**Created**: [DATE]

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

## Purpose _(mandatory — Constitution Principle XXII)_

[Why this feature exists and what business problem it solves]

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - [Brief Title] (Priority: P1)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently - e.g., "Can be fully tested by [specific action] and delivers [specific value]"]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]
2. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 2 - [Brief Title] (Priority: P2)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

### User Story 3 - [Brief Title] (Priority: P3)

[Describe this user journey in plain language]

**Why this priority**: [Explain the value and why it has this priority level]

**Independent Test**: [Describe how this can be tested independently]

**Acceptance Scenarios**:

1. **Given** [initial state], **When** [action], **Then** [expected outcome]

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST [specific capability, e.g., "allow users to create accounts"]
- **FR-002**: System MUST [specific capability, e.g., "validate email addresses"]
- **FR-003**: Users MUST be able to [key interaction, e.g., "reset their password"]
- **FR-004**: System MUST [data requirement, e.g., "persist user preferences"]
- **FR-005**: System MUST [behavior, e.g., "log all security events"]

_Example of marking unclear requirements:_

- **FR-006**: System MUST authenticate users via [NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]

### API Dependencies _(mandatory — Constitution Principle XXII)_

- **[Endpoint/Service]**: [HTTP method, path, purpose, and which user stories depend on it]
- **[OpenAPI reference]**: [Link or schema name if generated from backend contract]

### UI States _(mandatory — Constitution Principle XXII)_

For each primary screen in this feature, define loading, empty, success, and error
states (skeleton loaders preferred per Principle XII):

- **[Screen/Page]**: Loading — [behavior]; Empty — [behavior]; Success — [behavior]; Error — [behavior]

### Responsive Behavior _(mandatory — Constitution Principle XXVII)_

For each primary screen, define behavior at mobile (320px+), tablet (768px+), and
desktop (1280px+) breakpoints:

- **[Screen/Page]**: Navigation — [drawer/sidebar/etc.]; Layout — [grid/stack]; Tables — [scroll/cards/columns]; Forms — [stack/grid]; Modals — [dialog/sheet/full-screen]

### Page Layout _(mandatory — Constitution Principle XXXII)_

Define the standard page structure for each primary screen:

- **[Screen/Page]**: Header — [title, description, breadcrumbs, actions]; Content — [search, filters, stats, main content, pagination]

### Empty State Design _(mandatory — Constitution Principle XXXIV)_

For each list or data view, define the empty state:

- **[Screen/Page]**: Icon/illustration — [description]; Message — [text]; Primary action — [CTA]; Guidance — [help text]

### Production Quality Checklist _(mandatory — Constitution Principle XL)_

Confirm each deliverable meets: responsive, accessible, type-safe, reusable, dark mode
compatible, loading/error/empty states, mobile-friendly, keyboard accessible,
production-ready.

### Validation Rules _(mandatory — Constitution Principle XXII)_

- **[Form/Field]**: [Zod rule summary; reference `*.schema.ts` file when known]
- Server-side validation MUST be assumed; frontend validation is UX-only (Principle XX)

### Error Scenarios _(mandatory — Constitution Principle XXII)_

- **[Scenario]**: [User-facing message]; [Recovery action]; [Logging/telemetry note]
- MUST NOT expose raw backend exception messages (Principle XIII)

### Key Entities _(include if feature involves data)_

- **[Entity 1]**: [What it represents, key attributes without implementation]
- **[Entity 2]**: [What it represents, relationships to other entities]

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: [Measurable metric, e.g., "Users can complete account creation in under 2 minutes"]
- **SC-002**: [Measurable metric, e.g., "System handles 1000 concurrent users without degradation"]
- **SC-003**: [User satisfaction metric, e.g., "90% of users successfully complete primary task on first attempt"]
- **SC-004**: [Business metric, e.g., "Reduce support tickets related to [X] by 50%"]

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- [Assumption about target users, e.g., "Users have stable internet connectivity"]
- [Assumption about scope boundaries, e.g., "Mobile support is out of scope for v1"]
- [Assumption about data/environment, e.g., "Existing authentication system will be reused"]
- [Dependency on existing system/service, e.g., "Requires access to the existing user profile API"]
