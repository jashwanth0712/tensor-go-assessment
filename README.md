# TensorGo Project

This repository contains assesment for Tensorgo where I was asked to build a invoice tracking and automation application 

## Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/jashwanth0712/tensor-go-assessment.git
    ```

2. Install dependencies for the client and the service host:

    ```bash
    cd tensor-go-assessment/client
    npm install

    cd ../service-host
    npm install
    ```

## Usage

1. Run the client:

    ```bash
    cd tensor-go-assessment/client
    npm start
    ```

   This will start the client application.

2. Run the service host:

    ```bash
    cd ../service-host
    npm start
    ```

   This will start the service host.

Open your browser and visit `http://localhost:3000` for the client application
# what it does 
Streamline invoice management for SaaS platforms — effortlessly create, track, and send reminders for payments with ease.
# Architecture
![](https://github.com/jashwanth0712/tensor-go-assessment/blob/main/client/public/images/flowchart.png?raw=true)
- Since the features of the assignment given are limited , there was no need to create smaller services , hence I have only created a single service which handles invoices
- Authentication and session management is completely managed by service-host
- all the interactions with the database is done through the invoice service
- service host and invoice service are communicated with message broker rabbitmq
![](https://github.com/jashwanth0712/tensor-go-assessment/blob/main/client/public/images/message.gif?raw=true)
# Features
### Authentication with Google Oauth
![](https://github.com/jashwanth0712/tensor-go-assessment/blob/main/client/public/images/oauth.gif?raw=true)
### wide range of filters
![](https://github.com/jashwanth0712/tensor-go-assessment/blob/main/client/public/images/filter.gif)
### creating new invoice
![](https://github.com/jashwanth0712/tensor-go-assessment/blob/main/client/public/images/createnew.gif)
