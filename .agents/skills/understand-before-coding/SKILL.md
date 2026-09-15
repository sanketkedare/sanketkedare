---
name: understand-before-coding
description: Critical workflow requirement: Whenever receiving any task, first thoroughly understand it, think through architecture and implications, and never jump directly into coding.
---

# 🧠 Think & Understand Before Coding

This skill enforces a mandatory mental pause, deep analysis, and deliberate architectural reasoning before writing or modifying any code.

## ⛔ Absolute Rules

1. **UNDERSTAND THE TRUE INTENT FIRST**:
   - Carefully deconstruct the user prompt to identify what is actually being asked and why.
   - Do NOT take superficial shortcuts (e.g. hardcoding values into environment variables or code when dynamic persistence or real database storage is needed).
   - If anything is ambiguous or has multiple architectural implications, clarify or think through the right approach first.

2. **THINK BEFORE WRITING ANY CODE**:
   - Formulate the full data flow: where the data originates, where it is stored (e.g. MongoDB), how it is updated, and how clients consume it.
   - Consider system design, scalability, security, clean separation of concerns, and existing codebase patterns.
   - Do NOT rush to edit files or run commands immediately. Deliberate planning prevents rework.

3. **NEVER DIRECTLY CODE ON RAW ASSUMPTIONS**:
   - Inspect existing architecture, models, and dependencies first to confirm what already exists.
   - Ensure changes solve the root problem cleanly without creating technical debt or fragile workarounds.

## 🎯 Operational Principle
**Think deeply first → Plan the architecture → Implement cleanly.**
Never jump directly into coding without thoroughly understanding the user's intent.
