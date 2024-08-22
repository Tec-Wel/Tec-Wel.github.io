# Authentication

This page covers how the HeroAI website is using Welfie's **user authentication** service. This documentation is derived from the [mobile authentication doc](../mobile/auth.md).

The app is using the following features,

- Log in functionality
- Log out functionality
- React context to pass authentication data

<hr />

The HeroAI website is using [Axios](https://axios-http.com/) to handle HTTP requests. It is recommended to use something like [Postman](https://postman.com/) to test your api calls before running them directly from code.

:::info

The API routes covered in this documentation are derived from Welfie's [auth routes](https://bitbucket.org/welfietech/tenant-repo/src/master/welfie-web/src/controller/auth-controller.ts)

:::

## Signing In

There are a few steps behind signing into Welfie's platform.

1. You must generate a JWT token using a email and password.

```js title="./context/auth-context.js"
import axios from "axios";

//... Other code

const generatedJWT = await axios.post("https://well-welfie-api-backend-aetaloqxpa-uw.a.run.app/auth/loginToken", {
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

```js title="./context/auth-context.js"
const response = await axios.post("https://well-welfie-api-backend-aetaloqxpa-uw.a.run.app/auth/login", {
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

```js title="./context/auth-context.js"
axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
```

4. Finally, to save the user's login activity on multiple app visits, we save the token in an encrypted storage so that the user does not need to sign in again when re-opening the app.

```js title="./context/auth-context.js"
//... previous code

// Store the authenticated user data in encrypted local storage
localStorage.setItem("user", JSON.stringify(user));
```

Here is the full code for signing in,

```js title="./context/auth-context.js"
const login = async (email, password) => {
  if (loading) {
    return { error: "Currently loading" };
  }
  setLoading(true);
  try {
    // Generate JWT token from backend
    const generatedJWT = await axios.post("https://well-welfie-api-backend-aetaloqxpa-uw.a.run.app/auth/loginToken", {
      email,
      password,
    });

    console.log("Generated token:", generatedJWT.data.loginToken);

    // Send login authentication request to backend. The body requires loginToken as the key
    const response = await axios.post("https://well-welfie-api-backend-aetaloqxpa-uw.a.run.app/auth/login", {
      loginToken: generatedJWT.data.loginToken,
    });

    const user = response.data;

    console.log("Attempted authentication result:", user);

    // Token retrieval indicates user is validated
    setUser(user);
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;

    console.log("Set http headers successfully");

    // Store the authenticated user data in encrypted local storage
    localStorage.setItem("user", JSON.stringify(user));
    console.log("Saved token into storage");
    setIsLogged(true);
    setLoading(false);
    return { success: "Successfully logged in" };
  } catch (error) {
    setLoading(false);
    return { error: error.message || "Login failed" };
  }
};
```

## Signing Out

We do the opposite functionality of signing in,

```js title="./context/auth-context.js"
const logout = async () => {
  if (loading) {
    return { error: "Currently loading" };
  }
  setLoading(true);

  try {
    // Send a logout notice to the backend
    axios.post("https://well-welfie-api-backend-aetaloqxpa-uw.a.run.app/auth/logout", {});

    // Delete existing token from storage
    localStorage.removeItem("user");

    // Update HTTP headers
    axios.defaults.headers.common["Authorization"] = "";

    // Reset auth states
    setUser(null);
    setIsLogged(false);
    setLoading(false);

    console.log("User logged out.");

    return { success: "Successfully logged out" };
  } catch (error) {
    setLoading(false);
    return { error: error.message || "Logout failed" };
  }
};
```

## Auth Context

The application is using React's context to provide the authenticated user to the rest of the application.

```jsx title="./App.js"
import React from "react";
import AuthProvider from "./context/auth-context";

export default function RootLayout() {
  return <AuthProvider>{/* children (Routes, Screens, ect.) */}</AuthProvider>;
}
```

We created a context provider that contains the authentication logic from the previous sections,

```jsx title="./context/auth-context.js"
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(undefined);

// Create a context hook so that you can extract authenticated user in other components and hooks
//highlight-next-line
export const AuthContext = (createContext < AuthProps) | (undefined > undefined);

const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
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

  const login = async (email: string, password: string): Promise<{ error: any } | { success: string }> => {
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

We create a hook to use the Auth Context.

```jsx title="./hooks/useAuth.js"
import { AuthContext } from "../context/auth-context";
import { useContext } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

## Using it inside a React component

```jsx
const Welcome = () => {
  // Extract the authenticated status from auth context
  //highlight-next-line
  const { loading, authenticated } = useAuth();
  if (!loading && authenticated) return <Redirect href="/" />;

  return (
    <div>
      <h1>You are not logged in yet!</h1>
    </div>
  );
};

export default Welcome;
```
