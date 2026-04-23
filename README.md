# pack-go

Pack&Go — web (Vite/React) + desktop scaffold (Tauri) for moving: boxes, rooms, logistics, carriers, profile.

## Run (web)

```bash
npm install
npm run dev
```

Open `http://localhost:5173/`.

## Build (production)

```bash
npm run build
npm run preview
```

Preview will print a local URL (usually `http://127.0.0.1:4173/`).

## MySQL setup (Tauri)

Desktop mode stores boxes in MySQL. Set `MYSQL_URL` before running Tauri:

```bash
set MYSQL_URL=mysql://root:root@127.0.0.1:3306/packgo
```

The app will create the `boxes` table automatically at startup.
