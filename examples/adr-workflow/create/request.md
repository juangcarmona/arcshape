# Request

Record this decision as a proposal: use SQLite for the local analysis session store. I am the decision owner, but the proposal still needs review.

## Repository evidence

- The CLI runs locally and has no service dependency.
- Sessions need atomic file-backed persistence.
- Existing session state currently lives under `.arcshape/sessions/`.
