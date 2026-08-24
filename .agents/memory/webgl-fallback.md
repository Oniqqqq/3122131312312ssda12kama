---
name: WebGL fallback pattern
description: A durable rendering rule for Three.js scenes in constrained preview environments.
---

Detect WebGL capability before constructing a Three.js renderer. If the browser cannot provide a context, use a local visual fallback and avoid logging expected capability failures.

**Why:** The Replit preview browser may lack a usable WebGL context; Three.js can otherwise emit repeated renderer errors even when the page itself remains usable.

**How to apply:** Keep the true WebGL path for capable browsers, but probe first and render a lightweight canvas or CSS fallback when unavailable. Treat missing WebGL as an expected environment condition, not an application error.