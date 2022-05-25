# Qlik Messages API

## Table of Contents

-   [Introduction](#Introduction)
-   [Prerequisites](#Prerequisites)
-   [Usage](#Usage)

## Introduction

This document is meant to give an overview about the Qlik Messages API application.

The appllication currently based on Express Framework, MongoDB and support the following operations:

-   Create, retrieve, update, and delete a message
-   List messages
-   Provides details about those messages, specifically whether or not a message is a palindrome

## Prerequisites

1. Install latest node.js version

2. Install docker

## Usage

1.  Clone the repository.

        git clone https://github.com/royzluf/qlik-messages-api.git

2.  Install dependencies & required packages

        npm install

3.  Run docker-compose to bring database up

        docker-compose up

4.  Run the application

        npm start

## High-level Architecture

The scheme below describes the application's file structure along with a table describing it's main components.

        qlik-messages
        |-- config
            |-- config.env
        |-- service
            |-- models
                |-- message.js
            |-- messageService.js
        |-- controllers
            | -- message.js
        |-- routes
            |-- message.js
        |-- helpers
            |-- helpers.js
            |-- helpers.unit.spec.js
        |-- e2e
            |-- rest.e2e.spec.js
        |-- app.js
        |-- server.js

| Name               | Description                                                                          |
| :----------------- | ------------------------------------------------------------------------------------ |
| /config/config.env | config file for environment variables. e.g: port number, MONGO_URI.                  |
| /service/          | REST API Service and Database models.                                                |
| /controllers/      | Controllers.                                                                         |
| /routes/           | REST API routers.                                                                    |
| /helpers/          | helpers functions and their unit tests. e.g: Define if a message is a Palindrom.     |
| /e2e/              | E2E Testing.                                                                         |
| /app.js            | The Express application which define and activate the routers.                       |
| /server.js         | Entry point that starts up the application and set the server to listen to requests. |

## Architecture Diagram

![Express Rest API Architecture](images/Express%20Rest%20API%20Architecture.jpg)

## REST API Endpoints

### Message [/messages/{message_id}]

-   Parameters

    -   message_id (string) - The unique identifier of the message.

    #### Get a Message [GET]

    This action retrieves the message with the specified id. If found in the database, it returns a response with 200 status code, along with request date and the representation of the message, Otherwise a 404 is returned

-   Response 200 (application/json)

    -   Body

              {
                  "status": "Success",
                  "requestedAt": "2022-05-24T17:05:01.446Z",
                  "data": {
                      "message": {
                          "_id": "628b6283ae92b47716818e40",
                          "text": "check",
                          "isPalindrom": false,
                          "status": "New",
                          "messageHistory": [],
                          "createdAt": "2022-05-24T17:05:01.454Z",
                          "updatedAt": "2022-05-24T17:05:01.454Z"
                      }
                  }
              }

-   Response 404 (application/json)

    -   Body

              {
                  "status": "fail",
                  "message": "Message not found"
              }

    #### Update a Message [PATCH]

    This action updates and retrieves the message with the specified id. The request body should contain only the new text of the message.
    If found in the database, it updates the message status, stores the old text of the message in embedded array called "messageHistory", and returns a response with 200 status code, along with request date and the other representation of the message, Otherwise a 400 is returned

    -   Parameters
        -   text - The new text of the message.

-   Request (application/json)

    -   Body

              {
                  "text": "new text txet wen"
              }

-   Response 200 (application/json)

    -   Body

              {
                  "status": "success",
                  "requestedAt": "2022-05-23T11:42:06.411Z",
                  "data": {
                      "message": {
                          "_id": "628b6170ae92b47716818e1e",
                          "text": "new text txet wen",
                          "isPalindrom": true,
                          "status": "Updated",
                          "dateModified": "2022-05-23T11:42:06.529Z",
                          "messageHistory": [
                              {
                                  "text": "check",
                                  "isPalindrom": false,
                                  "updatedAt": "2022-05-23T10:26:56.193Z",
                                  "_id": "628b730eae92b47716818e63"
                              }
                          ],
                          "createdAt": "2022-05-23T10:26:56.193Z",
                          "updatedAt": "2022-05-23T11:42:06.420Z"
                      }
                  }

              }

-   Response 400 (application/json)

    -   Body

              {
                  "status": "fail",
                  "message": "Message not found"
              }

#### Delete a Message [DELETE]

This action deletes the message with the specified id. In fact, it changes the message status to 'Deleted', and prevent access to this message in all other requests.
If found in the database, it returns a response with 204 status code (empty body), Otherwise a 400 is returned.

-   Response 400 (application/json)

    -   Body

              {
                  "status": "fail",
                  "message": "Message not found"
              }

### Messages [/messages]

#### Get all messages [GET]

This action retrieves all the messages in the Database (That were not deleted). it returns a response with 200 status code, along with request date, number of results and the representation of the messages, Otherwise a 404 is returned.

-   Response 200 (application/json)

    -   Body

              {
                  "status": "Success",
                  "requestedAt": "2022-05-23T12:03:53.966Z",
                  "results": 1,
                  "data": {
                      "messages": [
                          {
                              "_id": "628b77afae92b47716818e69",
                              "text": "check",
                              "isPalindrom": false,
                              "status": "New",
                              "messageHistory": [],
                              "createdAt": "2022-05-23T12:01:51.189Z",
                              "updatedAt": "2022-05-23T12:01:51.189Z"
                          }
                      ]
                  }
              }

#### Create a messages [POST]

This action allows create a new message. If the request is successful, a new message is created in the Database and it returns a response with 201 status code, along with request date, and the representation of the messages. Otherwise a 400 is returned

-   Parameters

    -   text - The text of the message.

-   Request (application/json)

    -   Body

            {
                "text": "new message egassem wen"
            }

-   Response 201 (application/json)

    -   Body

                  {
                      "status": "success",
                      "requestedAt": "2022-05-23T12:07:31.127Z",
                      "data": {
                          "message": {
                              "text": "new message egassem wen",
                              "isPalindrom": true,
                              "status": "New",
                              "_id": "628b7903ae92b47716818e6c",
                              "messageHistory": [],
                              "createdAt": "2022-05-23T12:07:31.135Z",
                              "updatedAt": "2022-05-23T12:07:31.135Z"
                          }
                      }

                  }

## Tests

### E2E Tests

In order to run the end to end testing use the following command (while the service is running):

     npm run test:e2e

Note: For testing purposes, All the messages in the Database will be deleted before each test, and after all the tests.

### Unit Tests

In order to run the unit testing use the following command:

    npm run test:unit

## Command-line interface

#### Get all Message [GET]

    node .\commanderCli\commander.js get-all

#### Get a Message [GET]

    node .\commanderCli\commander.js get <messageID>

#### Create a Message [GET]

    node .\commanderCli\commander.js create <text>

#### Update a Message [GET]

    node .\commanderCli\commander.js update <messageID> <text>

#### Delete a Message [GET]

    node .\commanderCli\commander.js delete <messageID>
