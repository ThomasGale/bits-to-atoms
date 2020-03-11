# bits-to-atoms
🏭📈 Nimble, market-driven, micro-factories. 🚧 Pre-alpha!

## Vision 1.0 (Virtual)
- Highly modular micro-markets for each service provider in a micro-factory.
- Markets drive efficiency
- Every component in the micro-factory is either *material* or a *service provider*. 
- Current service providers types:
    - Storage (e.g. shop floor)
    - Transportation (e.g. human, conveyer, robot)
    - Transmutation (e.g. FFF printer, laser cutter, milling tool)
- The whole system simulated in a *Game* like environment

## Vision 2.0+ (Real)
- Cryptographically sign a *runner* or *build request identity* throughout the process building a history
- Services providers could become financially autonomous competitive *objective maximising* entities
- Desired emergent behaviour: trustless, competitive and nimble micro-transactions in the micro-markets of the micro-factory!
- Can we interface with:
	- Payments API (fiat / crypto)
	- Autonomous organisation systems (Aragon)
	- Factory 'boundary services':
		- Delivery services (DHL/UPS API etc.)
		- Energy providers

## Vision Todo: Add a nice infographic

# Development
[![master CI](https://github.com/ThomasGale/bits-to-atoms/workflows/CI/badge.svg?branch=master "master")](https://github.com/ThomasGale/bits-to-atoms/actions?query=workflow%3ACI)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ThomasGale_bits-to-atoms&metric=alert_status)](https://sonarcloud.io/dashboard?id=ThomasGale_bits-to-atoms)

## Licence 
[![license](https://img.shields.io/github/license/thomasgale/bits-to-atoms)](https://github.com/ThomasGale/bits-to-atoms/blob/master/LICENSE)

## Tech Stack
- Typescript
- React (react-spring)
- Redux (redux-saga, reselect, redux-form)
- Three (react-three-fiber)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
