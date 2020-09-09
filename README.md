# palvelutarjotin-ui

User interface for Palvelutarjotin

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Deployments

Production environment:
[TODO: Add url when deployed]
Project is automatically deployed to production when adding new relase tag, e.g. release-v0.1.0, to repo

Testing environment: [https://palvelutarjotin.test.kuva.hel.ninja](https://palvelutarjotin-admin.test.kuva.hel.ninja)
Project is automatically deployed to testing environment when pushing to develop brach

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.

### `yarn start`

Runs the built app in the production mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn codegen`

Generate static types for GraphQL queries by using the schema from the backend server. Url to can be defined to NEXT_PUBLIC_API_BASE_URL variable in .env file

### `yarn lint`

Run linter to all the files in app

### `yarn format:code`

Fix all the linter errors

### `yarn test`

Launches the test runner in the interactive watch mode.

### `yarn test:coverage`

Run tests and generate coverage report

### `yarn storybook`

Runs storybook in development mode
Open [http://localhost:9009](http://localhost:9009) to view it in browser

### `yarn build-storybook`

Exports storybook as a static app

### `yarn deploy-storybook`

Deploys a new version of Storybook. Storybook is used for development and there's no CI/CD pipeline set up.

To verify deployment, open [https://city-of-helsinki.github.io/palvelutarjotin-ui/](https://city-of-helsinki.github.io/palvelutarjotin-ui/) and check that everything is looking ok.

## Debugging

### Debugging project in VS Code

To debug in VS Code:

1. Install the "Debugger for Chrome" extension to VS Code
2. Run `yarn dev`
3. Set a breakpoint
4. Run "Chrome" debug configuration in VS Code
5. Reload the project in your browser

### Debugging Tests in VS Code

No plugin is needed.

1. Set a breakpoint
2. Run the "Run tests" debugger configuration

### Debugging Tests in Chrome

We recommend using VS Code's debugger.

1. Place a `debugger;` statement in any test
2. Run yarn `test:debug`
3. Open `about:inspect` in Chrome
4. Select `inspect` on you process, press Play and you're good to go.

See more detailed instructions here:
https://create-react-app.dev/docs/debugging-tests#debugging-tests-in-chrome

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
