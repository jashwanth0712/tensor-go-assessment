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
3. Fill the `.env`
   - Create `.env` file in tensor-go-assessment/client folder and enter the following path
     ```bash
     REACT_APP_API_URL=http://localhost:8080/
     ```
   - similarly create `.env` file in tensor-go-assessment/service-host folder and enter the following path
     ```bash
        CLIENT_ID=
        CLIENT_SECRET = 
        CLIENT_URL = http://localhost:3000/
        PORT= "8080"
        USER_EMAIL=
        USER_PASSWORD=
     ```
     `Note` I have mentioned the .env file in the submission , kindly copy and paste that
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
### Zapier Integration
<div>
    <img src="https://github.com/jashwanth0712/tensor-go-assessment/blob/main/client/public/images/zapier.png?raw=true" alt="Zapier Integration" width="400" style="display:inline; margin-right:20px;" />
    <img src="https://github.com/jashwanth0712/tensor-go-assessment/blob/main/client/public/images/mail.png?raw=true" alt="Mail Integration" width="400" style="display:inline;" />
</div>

### wide range of filters
![](https://github.com/jashwanth0712/tensor-go-assessment/blob/main/client/public/images/filter.gif)
### creating new invoice
![](https://github.com/jashwanth0712/tensor-go-assessment/blob/main/client/public/images/createnew.gif)
