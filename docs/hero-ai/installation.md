# Installation

This is a [React](https://react.dev/) project created with [`create-react-app`](https://www.npmjs.com/package/create-react-app). The app primarily uses [MUI](https://mui.com/) for the frontend and uses the existing Welfie backend routes (such as authentication, communication creation, etc) on BitBucket. This project also uses [Node.js](https://nodejs.org/en) for the backend which contains the API endpoint for retrieving recommendation data.

## Get Started: Frontend

1. Install dependencies

   ```bash
   cd ui
   npm install
   ```

2. Start the app

   ```bash
    npm run start
   ```

## Get Started: Backend

For the backend we use [Node.js](https://nodejs.org/en), [Express](https://expressjs.com/), [pm2](https://pm2.keymetrics.io/), and [Python](https://www.python.org/).

1. Install [Node.js](https://nodejs.org/en/download/package-manager)

2. Install pm2 globally

   ```bash
   npm install pm2@latest -g
   ```

3. The backend route runs a python script to generate the recommendation data so you will need to have Python on your system. There are many guides for downloading Python on your operating system.

   For example, https://macpaw.com/how-to/install-python-mac for Mac and https://www.geeksforgeeks.orghow-to-install-python-on-windows for Windows.

4. Install dependencies

   ```bash
   cd server
   npm install
   ```

5. Start the app locally

   ```bash
    pm2 start index.js --no-daemon -i 1 --name yournameapp --watch
   ```

   This command does the following:

   - pm2 start index.js: Starts your index.js file.

   - --no-daemon: Runs pm2 in the foreground (not as a daemon). This prevents the terminal prompts from showing on your screen when running the app.

   - -i 1: Specifies the number of instances to start (1 in this case).

   - --name yournameapp: Assigns a name (yournameapp) to the application.

   - --watch: Adds a watch flag so pm2 will restart the app if any files in the directory are changed.

6. Your server will be running on

   ```
   http://localhost:3001
   ```
