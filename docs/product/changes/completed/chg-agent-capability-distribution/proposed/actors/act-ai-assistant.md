---
id: ACT-AI-ASSISTANT
type: actor
title: AI Assistant
status: active
actor-kind: external-system
---

## Purpose

Provides an AI-assisted interaction through which a repository maintainer can create or maintain architecture documentation.

## Goals

- Help interpret repository evidence in support of architecture-documentation work.
- Make proposed information available to the maintainer for evaluation.
- Discover and use ArcShape capabilities through the supported provider interface.

## Responsibilities

- Participates in documentation workflows when invoked through a supported assistant environment.
- Returns proposed information to the maintainer for review.
- Loads ArcShape skills and provider adapters according to the selected agent's documented discovery behavior.

## Boundaries

The assistant is not the authority for product intent or architecture decisions. ArcShape provides capabilities for Codex, Claude Code, Cursor, Windsurf/Cascade, Gemini CLI, OpenCode, and GitHub Copilot, while each assistant retains its own command, rule, permission, and runtime behavior.
