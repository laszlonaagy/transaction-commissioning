## Description

RESTful API with an endpoint for transaction commission calculation.

After run the application you can reach the endpoint which takes care of your input.
The API accepts only JSON format.

## Endpoint

 - Http Method: POST  
 - Header: content-type: application/json
 - Endpoint: /transaction /*By default http://localhost:3000/transaction*/

#Parameters

 - date: string | required
 - amount: string | required
 - currency: string | required | maximum 3 character
 - client_id: number

#Example result
{
"amount":"25.00",
"currency":"EUR"
}

## Installation
 - After clone please do a npm install in order to install the neccessary libraries.
 - $ npm install
 - Setup a databse with xampp or lamp or any other way you would.
 - The ormconfig.json file contains the connection informations.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
