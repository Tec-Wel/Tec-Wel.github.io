# Installation

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). It is bootsrapped with NativeWind V2 (using tailwind v3.3.2) and uses the existing Welfie backend routes (such as authentication, communication creation, etc) on BitBucket.

## Get Started

1. Install dependencies

   ```bash
   npm install
   npx install-expo-modules@latest
   ```

2. [Install Android Studio](https://developer.android.com/studio)

3. Create and open a virtual device on Android Studio

4. Start the app

   ```bash
    npm run start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Expo GO
This is the easiest method. You can develop using the [Expo Go](https://expo.dev/go) app, which is available on both IOS and Android, as well as the web.

:::info

You may experience crashes when opening the mobile app from the website. Solve this by entering the URL inside the terminal directly into the Expo Go App.

:::

## Development Builds (Recommended for development)
Check out the full [documentation](https://docs.expo.dev/develop/development-builds/create-a-build/) for building on Android and IOS

1. Install EAS client (expo-dev-client)
   ```bash
   npx expo install expo-dev-client
   ```

2. Run the build command, the configuration on expo.dev is already set.

   Building on Android
   ```bash
   eas build --profile development --platform android
   ```

:::warning
   Building on IOS requires an Apple Developer Membership ($99/yr) to run locally on devices.
:::
   ```bash
   eas device:create
   eas build --profile development --platform ios
   ```

   However, this isn't required if you are running an IOS simulator on a MacOS machine.
   ```
   eas build --profile development --platform ios
   ```
   4. Run the build file. On Android, you will recieve an APK file, simply open it on an Android emulator or device.

## A few things to know before getting started

1. The project is using TypeScript to enhance typing throughout the application.

:::important

Please do not use "any" as a type unless you absolutely have to

:::

2. Icons in the application such as hearts, chat bubbles, people, are not in the assets folder but instead part of [Expo Icons](https://docs.expo.dev/guides/icons/). You can import an icon like the following,

```tsx
import { Ionicons } from "@expo/vector-icons";

<Ionicons name="person-sharp" size={20} color="#ffffff" />;
```

## Learn more

To learn more about Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
