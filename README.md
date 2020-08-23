# reddit_clone

A fully-fledged reddit clone built using the MVC (Model View Controller) design pattern templated with mustache. Used Express as a server and Gulp as a pipeline to minify files.

## Features
- Contains multiple rooms that you can subscribe to
- You can create posts that you can make in specific rooms
- You can make comments & reply to other comments to make nested comments
- User Authentication
- You can edit your profile
- Contains a todo task app
- Contains real-time live messaging

## Instructions
After cloning into repo, cd to project root directory and create a .env file. This file requires a MONGO_URI and SESSION_SECRET and optionally a PORT:

```
SESSION_SECRET=YOUR_SESSION_SECRET (can be anything)
PORT=3000
MONGO_URI=your mongo uri
```

Then run npm install from the root directory:

```
$ npm install
```

To start the server, run

```
$ npm start
```

To build files (to obtain css & js files), run build:

```
$ npm run build
```

## If you are developing new features

To update the dist file containing the css, fonts and js, install gulp CLI globally first

```
$ sudo npm install gulp-cli -g
```

Then run the command to minify all files
```
$ gulp
```
