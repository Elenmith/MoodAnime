# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# AnimeMood

## AnimeMood is a web application that suggests anime series to watch based on the user's selected mood. Its goal is to make discovering new content tailored to your emotional state easier.

### Features

- Mood Selection – Users can select their mood, e.g., "happy," "nostalgic," "serious."

- Anime Suggestions – The app uses an anime database to recommend series tagged with appropriate moods.

- User-Friendly Interface – A simple and intuitive design inspired by agoodmovietowatch.com/mood/.

- Anime Database – Centralized database of anime using MongoDB Atlas.

### Technologies

The application is built using the following technologies:

#### Frontend:

- React.js – Dynamic and responsive user interface components.

- CSS – Styling for the application.

#### Backend:

- Node.js – Main engine for the backend server.

- Express.js – Framework for building RESTful APIs.

#### Database:

- MongoDB Atlas – Storing data about anime and mood tags.

### Installation

#### Clone the repository:

```
git clone https://github.com/Elenmith/AnimeMood.git
```

#### Navigate to the project directory:

```
cd AnimeMood
```

#### Install frontend dependencies:

```
cd client
npm install
```

#### Install backend dependencies:

```
cd ../server
npm install
```

#### Create a .env file in the server directory and configure environment variables:

```
MONGO_URI=your-mongodb-atlas-uri
PORT=5000
```

### Start the application:

#### In one terminal, start the backend

```
cd server
npm start
```

#### In another terminal, start the frontend

```
cd client
npm start
```

#### Open the application in your browser at http://localhost:3000.

### Future Plans

- Deployment on Heroku – Once the application is complete.

- Expanding the Database – Adding more titles and detailed tags.

- Advanced Filtering – Options for genres and user ratings.

- API Integration – Fetching data from external anime sources.

### Author

AnimeMood was created by Elenmith. Feel free to report issues or suggest enhancements through GitHub Issues.
