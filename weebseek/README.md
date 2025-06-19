# Set up the environment:
Create a .env file under the backend directory.
.env:
    DB_USER=your_username
    DB_PASSWORD=your_password  
Don't push your .env file, it is how you can connect to your local host.

### test DB connection during setup:
python3 test_db.py

### run the Flask app under backend directory:
    python3 app.py
If you want to run in the debug mode:
    FLASK_ENV=development python3 app.py
If you see "error loading data: 3948 (42000): Loading local data is disabled; this must be enabled on both the client and server sides", please refer to AnimeRating/README.md to turn on the permission of loading the CSV file. Then rerun the app.

## When you work with weebseek, follow the folder structure below:
weebseek/
├── backend/                     # Python Flask backend
│   ├── app.py                   # Main Flask app, entry point for Flask app
│   ├── db/                      # Database-related logic
│   │   └── connection.py        # MySQL connection setup
│   ├── routes/                  # API route handlers
│   │   └── anime_routes.py      # Anime-related API endpoints
|   └── .env                     # Local DB credentials (Not Tracked)
│
├── frontend/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   ├── pages/               # Main screens like Home, AnimeDetail
│   │   ├── types/               # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── .gitignore
├── README.md


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

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

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
