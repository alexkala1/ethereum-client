# Ethereum-Client

## About
This is an application that runs in the browser and searches blocks and its transactions.
Its purpose is to draw information on why a contract is created or finding some same
patterns during searching them. You have access to blocks transactions and contracts that
you wish to search. To suggest features please contact me I am willing to continue supporting
the application. Thanks in advance.

## How to install

You need to have an infura account in order to connect into the ethereum node.  
When you create the account you just need to install project and copy the URL
for HTTP in the .env file you will create later.

After cloning the project open a command line with nodeJS and npm installed
on your machine. The project runs with 2 command lines one for the client folder
and one for the server folder.

### Back-end API install
  * cd server
  * npm i
  * cp .env.sample .env
  * copy infura http url in the position mentioned in the .env
  * run server by running **npm run dev**
  
### Front-end application install
  * cd client
  * npm i
  * start the app by running **npm run serve**
  
That's it you started the app both in front and back end. You can now search blocks
transactions wether they're contract or not and you can check their smart contract 
as well as the methods used in the code.
