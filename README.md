# N.Blog
N.Blog was conceived as an base, extendable application that developers can take and modify to suit their needs.

# Requirements

- Node.JS 4+
- MongoDB 3.4+

# Installation

There are two download options:

### 1. Production
This is an ideal option that you want to use the stock code as is.

Steps:
1. Clone repository.
2. Ensure the mongoDB instance is running.
3. Navigate to the repository in a console window.
4. Navigate to the api subdirectory and run "npm install".
5. Modify the defaults.json file to contain the user information you want to use.
7. Configure the config.json file to match your MongoDB settings.
6. While still in the api directory run "node defaults.js".
7. Copy the api directory to the production folder and run npm start.
8. Navigate to the client subdirectory and run "npm install".
7. Configure the config.json file to match your settings from the back-end.
9. While still in the client subdirectory run "npm run build".
10. Copy the client/build directory to the production folder.


### 2. Source Code
This is the developer option. This is for debugging and modifying the source.

Steps:
  1. Clone repository.
  2. Navigate to the repository in a console window.
  4. Navigate to the api subdirectory and run "npm install".
  5. Modify the defaults.json file to contain the user information you want to use.
  7. Configure the config.json file to match your MongoDB settings.
  6. While still in the api directory run "node defaults.js".
  7. Navigate to the client subdirectory and run "npm install".
  7. Configure the config.json file to match your settings from the back-end.
  8. Ensure the mongoDB binary is in you PATH.
  9. Run the start-debug.bat file in root of the repository.
