# Build Instructions

## Building the Card

After making changes to the TypeScript files, you need to build the JavaScript files:

```bash
npm install
npm run build
```

This will create:
- `timer-24h-card.js`
- `timer-24h-card-editor.js`

## Copying to Integration

After building, copy the files to the integration's dist folder:

```bash
# Windows PowerShell
New-Item -ItemType Directory -Force -Path "custom_components\timer_24h\dist"
Copy-Item "timer-24h-card.js" "custom_components\timer_24h\dist\"
Copy-Item "timer-24h-card-editor.js" "custom_components\timer_24h\dist\"
```

```bash
# Linux/Mac
mkdir -p custom_components/timer_24h/dist
cp timer-24h-card.js custom_components/timer_24h/dist/
cp timer-24h-card-editor.js custom_components/timer_24h/dist/
```

## Testing

After building and copying:

1. Restart Home Assistant
2. The integration will automatically install the card to `/config/www/timer-24h-card/`
3. Add a new card and search for "Timer 24H Card"

