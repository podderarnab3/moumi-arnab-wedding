# Moumi weds Arnab — wedding invitation

Plain HTML/CSS/JS. No build step. Works on GitHub Pages as-is.

## Put it online (GitHub Pages)
1. Create a new **public** repository on github.com, e.g. `moumi-arnab-wedding`.
2. In this folder run: `./set-url.sh YOUR_GITHUB_USERNAME moumi-arnab-wedding`
   (this fills in the link-preview address inside index.html)
3. Upload everything in this folder to the repository root
   (or: `git init && git add . && git commit -m "Wedding invitation" && git branch -M main && git remote add origin https://github.com/YOUR_GITHUB_USERNAME/moumi-arnab-wedding.git && git push -u origin main`).
4. Repository → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
5. After 1–2 minutes your invitation is live at `https://YOUR_GITHUB_USERNAME.github.io/moumi-arnab-wedding/`

## Things you can change (js/main.js → CONFIG)
- `weddingStart`: countdown target (currently 6:00 PM IST on 26 Nov 2026, since the card says "evening")
- `rsvpWhatsApp`: number that receives RSVP messages on WhatsApp
- `musicVolume`, `weddingHours` (calendar event length)

Text lives in index.html. Music: audio/music.mp3. Photos: images/.
Browsers block autoplay, so music starts when a guest taps "Open invitation".
