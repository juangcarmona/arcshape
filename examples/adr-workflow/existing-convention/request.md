# Request

Record this decision as a proposal: use SQLite for the session store. I am the decision owner, but the proposal still needs review.

# Existing repository convention

- Canonical decision records live in `architecture/decisions/`.
- Records use `DEC-NNNN-kebab-case-title.md` filenames and `DEC-NNNN` identifiers.
- The folder's `README.md` is the decision index.
- Existing metadata uses `id`, `title`, `status`, `date`, and `deciders`.

# Repository evidence

- The CLI runs locally and has no service dependency.
- Sessions need atomic file-backed persistence.
- Existing session state currently lives under `.arcshape/sessions/`.
