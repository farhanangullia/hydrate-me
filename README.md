# Hydrate Me 💧

A cross-platform hydration reminder app built with React Native and Expo that helps you stay hydrated throughout the day with customizable push notifications.

## 🌐 Live Demo

**Try the app online:** [https://hydrate-me.expo.app/](https://hydrate-me.expo.app/)

## Features

### 🌊 Hydration Tracking

- **Daily Progress Bar**: Visual progress indicator showing your daily water intake
- **Quick Add Buttons**: Customizable buttons for common water amounts (250ml, 500ml, 1L, etc.)
- **Daily Goal Setting**: Set your personal daily hydration goal (1.5L, 2L, 2.5L, 3L)
- **Reset Functionality**: Reset your daily intake to start fresh

### ⏰ Smart Reminders

- **Configurable Intervals**: Set reminder intervals from 30 minutes to 2 hours
- **Push Notifications**: Receive notifications on iOS, Android, and web
- **Next Reminder Display**: See when your next reminder is scheduled
- **Toggle On/Off**: Enable or disable reminders as needed

### ⚙️ Customizable Settings

- **Daily Goals**: Choose from preset daily hydration goals
- **Reminder Timing**: Configure how often you want to be reminded
- **Custom Amounts**: Add, remove, and customize quick-add water amounts
- **Notification Preferences**: Control reminder notifications

### 📱 Cross-Platform Support

- **iOS**: Native iOS app with push notifications
- **Android**: Native Android app with push notifications  
- **Web**: Progressive web app with browser notifications

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hydrate-me
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**

   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## Usage

### First Time Setup

1. Open the app and grant notification permissions when prompted
2. Go to Settings to configure your preferences:
   - Set your daily hydration goal
   - Choose your reminder interval
   - Customize quick-add amounts
   - Enable/disable reminders

### Daily Use

1. **Track Water Intake**: Use the quick-add buttons to log your water consumption
2. **Monitor Progress**: Watch the progress bar fill up as you reach your daily goal
3. **Receive Reminders**: Get notified at your chosen intervals to drink water
4. **Reset Daily**: Start fresh each day by resetting your intake

### Settings Configuration

- **Daily Goal**: Choose from 1.5L, 2L, 2.5L, or 3L
- **Reminder Interval**: Set reminders every 30 minutes, 1 hour, 1.5 hours, or 2 hours
- **Custom Amounts**: Add up to 5 custom quick-add amounts (250ml, 500ml, 1000ml, etc.)
- **Notifications**: Toggle reminder notifications on/off

## Technical Details

### Built With

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type-safe JavaScript
- **AsyncStorage**: Local data persistence
- **Expo Notifications**: Push notification system

### Project Structure

```
hydrate-me/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Main hydration screen
│   │   └── explore.tsx    # Settings screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
│   └── useHydration.ts    # Hydration state management
├── constants/             # App constants and colors
└── assets/               # Images and fonts
```

### Key Components

- **useHydration Hook**: Centralized state management for hydration data and settings
- **HomeScreen**: Main interface for tracking water intake and viewing progress
- **SettingsScreen**: Configuration interface for app preferences
- **Themed Components**: Light/dark mode compatible UI components

## Data Storage

The app uses AsyncStorage to persist:

- **Hydration Data**: Daily intake, last drink time, goals, and reminder settings
- **User Settings**: Custom amounts, notification preferences, and app configuration

All data is stored locally on the device and syncs between the main screen and settings.

## Notifications

### Platform Support

- **iOS**: Native push notifications with sound and alerts
- **Android**: Native push notifications with sound and alerts
- **Web**: Browser notifications (requires user permission)

### Notification Features

- **Customizable Timing**: Set intervals from 30 minutes to 2 hours
- **Repeating Reminders**: Notifications repeat at your chosen interval
- **Permission Handling**: Automatic permission requests with fallback alerts
- **Toggle Control**: Enable/disable notifications in settings

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Deployments

#### EAS

Install EAS CLI:
`npm install -g @expo/eas-cli`

Login:

```
eas login
eas build:configure
```

##### Web

Build:

```
npx expo export --platform web
```

Deploy dev:

```
eas deploy
```

Deploy prod:

```
eas deploy --prod
```

##### IOS

Build for test:

```
eas build --platform ios --profile preview
```

Submit testflight:

```
eas submit --platform ios --latest
```

Build for iOS:

```
eas build --platform ios
```

Submit to App Store:

```
eas submit --platform ios
```

OTA updates:

```
eas update --channel preview
```

```
eas update --channel production
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Stay hydrated and healthy! 💧**
