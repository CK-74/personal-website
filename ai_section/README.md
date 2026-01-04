AI Section — local notes

This folder contains the AI-themed showcase pages and assets.

Quick local preview

- From the repository root (Personal Website), run a simple HTTP server and open the AI index:

```powershell
# Windows (PowerShell)
python -m http.server 8000
# then open http://localhost:8000/ai_section/index_ai.html
```

Notes

- The pages rely on `fetch('./data.json')`, which requires serving over HTTP (not file://).
- A custom cursor and particle trail are implemented; if you see no cursor, open DevTools and confirm `#custom-cursor` exists in the DOM.
- If fetch fails, the JS has a fallback dataset so the page still renders content.

If you want, I can run a small smoke checklist of interactions for you to test locally and provide commands to run a simple static server with Node or Python.