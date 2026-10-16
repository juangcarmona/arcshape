# Process improvements

Record concrete workflow friction here when it is discovered. Each entry names the evidence, impact, and a proposed improvement; link a work item when one exists. Move completed lessons into the post-merge review log rather than silently deleting them.

## Open

### PI-002: Verify approved ProductShape artifact statuses before accepting a baseline

- **Date:** 2026-10-16
- **Evidence:** PR #2 merged the approved `CHG-INITIAL` baseline with all 24 canonical artifacts still marked `status: draft`. ProductShape's greenfield-definition guidance requires approved artifacts to be active before apply.
- **Impact:** The accepted model appeared unapproved, weakening its role as product source of truth and preventing confident PDAC citation.
- **Proposed improvement:** Record `active` artifact status as a required product-approval step; require the Done review and CI model gate (issue #4) to verify no unapproved draft artifacts remain in `docs/product/model`.
- **Status:** Open; issue #3 corrects the baseline and issue #4 establishes the automated guard.

### PI-001: Make greenfield ProductShape definition work without a pre-existing authority rule

- **Date:** 2026-10-16
- **Evidence:** While defining the initial product baseline, `.agents/skills/define-product/SKILL.md` instructed the workflow to run `prodshape inspect BR-CHANGE-001`. The ProductShape model was empty, so the command failed with `Unknown artifact ID 'BR-CHANGE-001'`.
- **Impact:** The prescribed workflow cannot be followed for a genuinely greenfield model and risks encouraging agents to invent or assume a missing artifact.
- **Proposed improvement:** Make the authority-rule inspection conditional on the artifact existing. For an empty model, record that no accepted authority rule exists yet and include the rule in the initial proposed Product Change for human review.
- **Status:** Open; no skill or product decision changed as part of this observation.
