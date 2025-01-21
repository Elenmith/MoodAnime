# AnimeMood

## AnimeMood is a web application that suggests anime series to watch based on the user's selected mood. Its goal is to make discovering new content tailored to your emotional state easier.

### Features

* Mood Selection – Users can select their mood, e.g., "happy," "nostalgic," "serious."

* Anime Suggestions – The app uses an anime database to recommend series tagged with appropriate moods.

* User-Friendly Interface – A simple and intuitive design inspired by agoodmovietowatch.com/mood/.

* Anime Database – Centralized database of anime using MongoDB Atlas.

### Technologies

The application is built using the following technologies:

#### Frontend:

* React.js – Dynamic and responsive user interface components.

* CSS – Styling for the application.

#### Backend:

* Node.js – Main engine for the backend server.

* Express.js – Framework for building RESTful APIs.

#### Database:

* MongoDB Atlas – Storing data about anime and mood tags.

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

* Deployment on Heroku – Once the application is complete.

* Expanding the Database – Adding more titles and detailed tags.

* Advanced Filtering – Options for genres and user ratings.

* API Integration – Fetching data from external anime sources.


### Author

AnimeMood was created by Elenmith. Feel free to report issues or suggest enhancements through GitHub Issues.

