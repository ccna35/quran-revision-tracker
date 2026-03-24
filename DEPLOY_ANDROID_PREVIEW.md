# Android Preview Deployment (No Play Store)

This app is configured for EAS preview APK builds so you can install directly on your phone.

## One-time setup

1. Install EAS CLI:

```bash
npm install -g eas-cli
```

2. Log in to Expo:

```bash
eas login
```

3. (If prompted) link or create an Expo project:

```bash
eas init
```

## Build installable APK

Run from project root:

```bash
npm run build:preview:android
```

When the build finishes, EAS outputs a URL/QR. Open it on your Android phone and download/install the APK.

If Android blocks install:

- Enable "Install unknown apps" for the browser/file manager you used.
- Re-open the downloaded APK and install.

## Splash screen notes

Splash is configured in `app.json` and uses:

- `./assets/images/splash-icon.png`
- Light background: `#f7f9fb`
- Dark background: `#0b1113`

For best quality, replace `assets/images/splash-icon.png` with a high-resolution transparent PNG logo centered with generous padding.

## Optional local dev install (Expo Go)

If you only want quick local testing:

```bash
npm run start
```

Then scan QR with Expo Go app. This mode requires your computer to keep running.
