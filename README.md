# Wordle Wizard 🔮

![Expo SDK](https://img.shields.io/badge/Expo_SDK-54-000020?logo=expo&logoColor=white)
![Platforms](https://img.shields.io/badge/Platforms-iOS%20%7C%20Android%20%7C%20Web-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)

A React Native multiplatform helper app for solving Wordle puzzles faster! Built with Expo, this app analyzes your guesses and provides real-time word suggestions.

---

## ✨ Features

- **Interactive Virtual Keyboard**: Tap letters and assign status colors (green/yellow/gray)
- **Smart Word Filtering**: Real-time suggestions based on your guess history
- **Wordle-Style Interface**: 6 guess rows with 5 letter tiles each
- **Smooth Animations**: Color transitions and scale effects using Reanimated
- **Haptic Feedback**: Tactile responses for better user experience
- **Hard Mode Support**: Enforces use of revealed hints in subsequent guesses
- **Dark Mode**: Automatic system theme detection
- **Multiplatform**: Works on iOS, Android, and Web

---

## 📲 Try It Now

### Expo Go (Quickest Way)
1. Install [Expo Go](https://expo.dev/go) on your iOS or Android device
2. Scan the QR code below (available after first EAS build is published)

> 🔲 _QR code will appear here after the first production build is published to Expo._

---

## 🎮 How to Use

1. **Tap a letter** from the virtual keyboard
2. **Select the status** of that letter:
   - ✓ **Green (Correct)**: Letter is in the word and in the correct position
   - ? **Yellow (Wrong Spot)**: Letter is in the word but in the wrong position
   - ✗ **Gray (Not In Word)**: Letter is not in the word at all
3. **Continue entering letters** until you fill a row
4. **View suggestions** - The app shows up to 20 possible words that match your clues
5. **Tap any filled tile** to cycle through status colors
6. **Reset** to start a new puzzle

---

## 🚀 Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app:
   ```bash
   npx expo start
   ```

3. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with **Expo Go** app

---

## 🏗️ Building & Deploying with EAS

This project uses [EAS Build](https://docs.expo.dev/build/introduction/) for production builds and [EAS Update](https://docs.expo.dev/eas-update/introduction/) for OTA updates.

### Prerequisites

```bash
npm install -g eas-cli
eas login
```

### Build Profiles

| Profile | Purpose | Distribution |
|---------|---------|-------------|
| `development` | Local dev client (iOS Simulator) | Internal |
| `preview` | Shareable test build (.apk) | Internal |
| `production` | App Store / Play Store build | Store |

### Running Builds

```bash
# Build for both platforms (production)
npm run build:all

# Build for a specific platform
npm run build:ios
npm run build:android

# Build development client
eas build --profile development --platform ios
```

### Submitting to App Stores

Before submitting, fill in the credentials in `eas.json`:
- **iOS**: `appleId`, `ascAppId`, `appleTeamId`
- **Android**: path to your `google-services-key.json`

```bash
npm run submit:ios
npm run submit:android
```

### OTA Updates (EAS Update)

Push a JavaScript update to users without a full build:

```bash
npm run update
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Expo SDK 54](https://docs.expo.dev/) | React Native framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Expo Router](https://docs.expo.dev/router/introduction/) | File-based navigation |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) | 60fps animations |
| [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) | Tactile feedback |
| [Async Storage](https://react-native-async-storage.github.io/async-storage/) | Persistent settings |
| [EAS Build](https://docs.expo.dev/build/introduction/) | Cloud builds & deployment |

---

## 📱 Project Structure

```
WordleWizard/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root navigation layout
│   ├── modal.tsx                 # Modal screen
│   └── (tabs)/
│       ├── _layout.tsx           # Tab bar configuration
│       ├── index.tsx             # 🏠 Main game screen
│       ├── explore.tsx           # ℹ️  Instructions screen
│       └── settings.tsx          # ⚙️  Settings (theme, hard mode)
├── src/
│   ├── components/
│   │   ├── LetterTile.tsx        # Animated letter tile
│   │   ├── GuessRow.tsx          # Row of 5 letter tiles
│   │   ├── VirtualKeyboard.tsx   # QWERTY keyboard with status selector
│   │   └── WordSuggestionsList.tsx # Scrollable word suggestions
│   ├── types/
│   │   └── wordle.ts             # TypeScript interfaces
│   ├── utils/
│   │   ├── wordFilter.ts         # Word filtering algorithm
│   │   └── hardModeValidator.ts  # Hard mode validation logic
│   └── data/
│       └── wordList.ts           # 2300+ valid Wordle words
├── assets/                       # Images, icons, fonts
├── app.json                      # Expo configuration
├── eas.json                      # EAS Build & Submit configuration
└── package.json                  # Dependencies & scripts
```

---

## 🎨 Color Scheme

| Color | Hex | Meaning |
|-------|-----|---------|
| 🟩 Green | `#6aaa64` | Correct position |
| 🟨 Yellow | `#c9b458` | Wrong position |
| ⬛ Gray | `#787c7e` | Not in word |
| ⬜ Light Gray | `#d3d6da` | Empty / unused |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** this repository
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** and ensure the app runs correctly
4. **Lint your code**: `npm run lint`
5. **Commit**: `git commit -m "Add your feature"`
6. **Push**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

Please keep PRs focused on a single feature or fix.

---

## 📄 License

This project is open source and available for personal use.

