# Authentication

This page covers how the mobile application is using Welfie's **user authencation** service.

The app is using the following features,

- Log in functionality
- Log out functionality
- React context to pass authentication data

<hr />

The mobile application is using [Axios](https://axios-http.com/) to handle HTTP requests. It is recommended to use something like [Postman](https://postman.com/) to test your api calls before running them directly from code.

:::info

The API routes covered in this documentation are derived from Welfie's [auth routes](https://bitbucket.org/welfietech/tenant-repo/src/master/welfie-web/src/controller/auth-controller.ts)

:::

## Signing In

There are a few steps behind signing into Welfie's platform.

1. You must generate a JWT token using a email and password.

```ts title="./context/auth-context.tsx"
import axios from "axios";

//... Other code

const generatedJWT = await axios.post(`${AppConfig.apiURL}/auth/loginToken`, {
  email,
  password,
});
```

You will recieve the following payload,

```tsx
{
  loginToken: string;
}
```

:::warning

Do not publicly share or spread the token as it contains sensitive information about the user. In addition, JWT tokens should not be used on the client side without encryption.

:::

2. Once you have the token, you can use it to log into the platform. The body requires loginToken as the key.

```ts title="./context/auth-context.tsx"
const response = await axios.post(`${AppConfig.apiURL}/auth/login`, {
  loginToken: generatedJWT.data.loginToken,
});
const user = response.data;
console.log("Attempted authentication result:", user);
```

Afterwards you will receieve the following payload afterwards,

```tsx
{
  hasProfile: boolean;
  isEmailVerified: boolean;
  isInvited: boolean;
  lastActivity: Date;
  token: string;
}
```

:::info

We use an AppConfig for our API urls as the envrionment of the codebase can change.

:::

3. Every API call involving data related to the user requires authentication using a bearer token. We use Axios' automatic header functionality to automatically set the bearer token with every API call.

```ts title="./context/auth-context.tsx"
axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
```

4. Finally, to save the user's login activity on multiple app visits, we save the token in an encrypted storage so that the user does not need to sign in again when re-opening the app.

```ts title="./context/auth-context.tsx"
import * as SecureStore from "expo-secure-store";

//... previous code

// Store the authenticated user data in encrypted local storage
await SecureStore.setItemAsync("user", JSON.stringify(user));
```

Here is the full code for signing in,

```ts title="./context/auth-context.tsx"
const login = async (
  email: string,
  password: string
): Promise<{ error: any } | { success: string }> => {
  if (loading) {
    return { error: "Currently loading" };
  }
  setLoading(true);
  try {
    // Generate JWT token from backend
    const generatedJWT = await axios.post(
      `${AppConfig.apiURL}/auth/loginToken`,
      { email, password }
    );

    console.log("Generated token:", generatedJWT.data.loginToken);

    // Send login authentication request to backend. The body requires loginToken as the key
    const response = await axios.post(`${AppConfig.apiURL}/auth/login`, {
      loginToken: generatedJWT.data.loginToken,
    });

    const user: AuthenticatedUser = response.data;

    console.log("Attempted authentication result:", user);

    // Token retrieval indicates user is validated
    setUser(user);
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;

    console.log("Set http headers successfully");

    // Store the authenticated user data in encrypted local storage
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    console.log("Saved token into storage");
    setLoading(false);
    return { success: "Successfully logged in" };
  } catch (error) {
    setLoading(false);
    return { error: (error as any).message || "Login failed" };
  }
};
```

## Signing Out

We do the opposite functionality of signing in,

```ts title="./context/auth-context.tsx"
const logout = async () => {
  try {
    //highlight-start
    // Send a logout notice to the backend
    axios.post(`${AppConfig.apiURL}/auth/logout`, {});

    // Delete existing token from storage
    await SecureStore.deleteItemAsync("user");

    // Update HTTP headers
    axios.defaults.headers.common["Authorization"] = "";
    //highlight-end

    console.log("User logged out.");

    return { success: "Successfully logged out" };
  } catch (error) {
    setLoading(false);
    return { error: (error as any).message || "Logout failed" };
  }
};
```

## Auth Context

The application is using React's context to provide the authenticated user to the rest of the application.

```tsx title="./app/_layout.tsx"
import { Stack } from "expo-router";
import AuthProvider from "@/context/auth-context";
import React from "react";

export default function RootLayout() {
  return (
    //highlight-next-line
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack>{/* Screens */}</Stack>
      </ThemeProvider>
      //highlight-next-line
    </AuthProvider>
  );
}
```

We created a context provider that contains the authentication logic from the previous sections,

```tsx title="./context/auth-context.tsx"
import React, { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import AppConfig from "@/constants/app-config";
import axios from "axios";
import { AuthenticatedUser, AuthProps } from "@/types/auth";

// Create a context hook so that you can extract authenticated user in other components and hooks
//highlight-next-line
export const AuthContext = createContext<AuthProps | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // At the start of the application, immediately check if there is an existing user if they logged in before
    const loadToken = async () => {
      const userJSON = await SecureStore.getItemAsync("user");

      if (userJSON) {
        const user: AuthenticatedUser = JSON.parse(userJSON);
        axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
        setUser(user);
        setIsLogged(true);
      } else {
        setUser(null);
        setIsLogged(false);
      }
    };
    loadToken();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ error: any } | { success: string }> => {
    // Login logic from previous section
  };

  const logout = async () => {
    // Logout logic from previous section
  };

  const value: AuthProps = {
    authenticated: isLogged,
    currentUser: user,
    loading,
    login,
    logout,
  };

  // Return the context provider along with the React children
  //highlight-next-line
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
```

### Using it inside a React component

```tsx
const Welcome = () => {
  // Extract the authenticated status from auth context
  //highlight-next-line
  const { loading, authenticated } = useAuth();
  if (!loading && authenticated) return <Redirect href="/home" />;

  return -(
    <View>
      <Text> You are not logged in yet! </Text>-{" "}
    </View>
  );
};

export default Welcome;
```
