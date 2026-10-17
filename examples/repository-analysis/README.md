# Repository analysis fixtures

These fixtures show two evidence situations without defining language support levels. One repository has established Markdown architecture documentation and mixed implementation/configuration evidence; the other is a sparse Rust repository with no architecture docs. The CLI inventories the files it finds in both, and the assistant workflow must adjust its questions and confidence to the available evidence.

The session tests start an analysis in each fixture and check that documentation maturity and implementation language do not change the inventory contract.
