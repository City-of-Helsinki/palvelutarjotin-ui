# palvelutarjotin-ui

Teachers' user interface for Palvelutarjotin

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Environments

Production environment:

- https://kultus.fi/
- Triggered by creation of release-\* tag, e.g. `release-v0.1.0`
  - Needs to be manually approved in pipeline to be deployed

Staging environment:

- https://kultus-ui.stage.hel.ninja/
- Automatically deployed by creation of release-\* tag, e.g. `release-v0.1.0`

Testing environment:

- https://kultus-ui.test.hel.ninja/
- Automatically deployed by any change to master branch

## Requirements

- Node 20.x
- Yarn
- Git
- Docker

## Steps to set up locally:

1. Set up palvelutarjotin API locally, see [palvelutarjotin README](https://github.com/City-of-Helsinki/palvelutarjotin/blob/master/README.md)
2. Copy `.env.local.example` to `.env.local` and fill/update the required values
3. Run `yarn` to install dependencies
4. Run `yarn dev` to start the development server

## Credentials

### Google reCAPTCHA

Palvelutarjotin-ui uses googles reCAPTCHA v3:

- [About reCAPTCHA](https://www.google.com/recaptcha/about/)
- [reCAPTCHA documentation](https://developers.google.com/recaptcha/docs/v3)
- [Google reCAPTCHA admin account login information](https://vault.kuva.hel.ninja/ui/vault/secrets/share/show/palvelutarjotin-google-recaptcha)

**NOTE**:

- `NEXT_PUBLIC_CAPTCHA_KEY` is required to be set correctly for the application to work.
  - Site key `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` from
    [reCAPTCHA FAQ](https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do)
    works fine for local development even though the key is for reCAPTCHA v2.

## Available Scripts

In the project directory, you can run:

### `yarn dev`

Runs the app in the development mode.<br />
Open http://localhost:3000/ to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.

### `yarn start`

Runs the built app in the production mode.<br />
Open http://localhost:3000/ to view it in the browser.

### `yarn codegen`

Codegen settings in <b>codegen.yml</b>

Generate static types for GraphQL queries by using the schema from the backend server.

#### in .env file

- Kultus API URL to can be defined to `NEXT_PUBLIC_API_BASE_URL` variable
- Headless CMS API URL to `NEXT_PUBLIC_CMS_BASE_URL`
- Unified search API URL to `NEXT_PUBLIC_UNIFIED_SEARCH_BASE_URL`
- Newsletter API URL to `NEWSLETTER_BASE_URL`
- Newsletter APIKEY to `NEWSLETTER_APIKEY`

### `yarn lint`

Run linter to all the files in app

### `yarn format:code`

Fix all the linter errors

### `yarn test`

Launches the test runner in the interactive watch mode.

### `yarn test:changed`

Run relevant test based on changes sinces last commit, used in husky git commit hook

### `yarn test:coverage`

Run tests and generate coverage report

### `yarn test:debug`

Debug tests

### `yarn browser-test`

Running browser tests against test environment

Browser tests are written in TypeScript with [TestCafe](https://devexpress.github.io/testcafe/) framework.

### `yarn browser-test:local`

Running browser tests against local environment

Browser tests are written in TypeScript with [TestCafe](https://devexpress.github.io/testcafe/) framework.

### `yarn test:coverage`

Run tests and generate coverage report

### `yarn storybook` DELETED

Note: if storybook is needed, find the deleted files from git log.

(Runs storybook in development mode<br />
Open http://localhost:9009/ to view it in browser)

### `yarn build-storybook` DELETED

Note: if storybook is needed, find the deleted files from git log.

(Exports storybook as a static app)

### `yarn deploy-storybook` DELETED

Note: if storybook is needed, find the deleted files from git log.

(Deploys a new version of Storybook. Storybook is used for development and there's no CI/CD pipeline set up.

To verify deployment,
open [https://city-of-helsinki.github.io/palvelutarjotin-ui/](https://city-of-helsinki.github.io/palvelutarjotin-ui/)
and check that everything is looking ok.)

## Versioning

This project uses [Release Please](https://github.com/googleapis/release-please)
with [Conventional Commits](https://www.conventionalcommits.org/) and
[Semantic Versioning](https://semver.org/).

To create a new release, merge changes through a pull request to the master branch
with commit title starting with:

- "feat" (raises minor version in major.minor.patch version number)
- "fix" (raises patch version in major.minor.patch version number)
- "feat!" (raises major version in major.minor.patch version number)
- "fix!" (raises major version in major.minor.patch version number)

And then merge the release-please pull request that should've been created
by the release-please action having been run in GitHub.

## Browser tests

Browser tests are written in TypeScript with [TestCafe](https://devexpress.github.io/testcafe/) framework.

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
