# Macro-Tracker App
This is an application for tracking macro-nutrition (protein, carbohydrates, fats, and calories).

![Screenshot of project](macro.png?raw=true "Macro-Tracker App")

Once logged in, user's can log food items that they've eaten each day. The application will aggregate macro-nutrient totals to help the user know if they're on track to meet their dietary goals.

Users can define custom food types to reuse later, or pick foods that have been added to the system by other users.  All data is hosted and managed by the application, so the user can access their data from any internet enabled device.

## Technologies Used
* React
* Material UI
* Docker
* Express
* MySQL

## Setup Instructions
There are some configurations that need to be defined in order to get this project running. 

You can see more detailed explanations for each part in the [Web Client](client/README.md) and [API Server](server/README.md) READMEs, but at a high level, you'll need to do the following:

1. Copy `.env.default` templates to `.env` files and specify the placeholder values.
2. Run `docker compose up --build`

This should set up the Web Client, API Server, and MySQL database running on your local machine. 

Note: this assumes that docker is installed on your machine. If this is not the case, look at the Web Client and API Server READMEs for alternate solutions.