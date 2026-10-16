# Process improvements

Record concrete workflow friction here when it is discovered. Each entry names the evidence, impact, and a proposed improvement; link a work item when one exists. Move completed lessons into the post-merge review log rather than silently deleting them.

## Open

### PI-001: Make greenfield ProductShape definition work without a pre-existing authority rule

- **Date:** 2026-10-16
- **Evidence:** While defining the initial product baseline, `.agents/skills/define-product/SKILL.md` instructed the workflow to run `prodshape inspect BR-CHANGE-001`. The ProductShape model was empty, so the command failed with `Unknown artifact ID 'BR-CHANGE-001'`.
- **Impact:** The prescribed workflow cannot be followed for a genuinely greenfield model and risks encouraging agents to invent or assume a missing artifact.
- **Proposed improvement:** Make the authority-rule inspection conditional on the artifact existing. For an empty model, record that no accepted authority rule exists yet and include the rule in the initial proposed Product Change for human review.
- **Status:** Open; no skill or product decision changed as part of this observation.
