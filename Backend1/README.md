# Seba Master Solace backend application

Frontend application can be found [here](https://gitlab.lrz.de/seba-master-2021/team-32/frontend)

## Prerequisites

Both for the backend and frontend application:

* nodejs [official website](https://nodejs.org/en/) - nodejs includes [npm](https://www.npmjs.com/) (node package manager)

Just for the backend application:

* mongodb [official installation guide](https://docs.mongodb.org/manual/administration/install-community/)
* Or use an online store [MongoDB Atlas](https://cloud.mongodb.com/)

### Clone Solace Project

Clone the [backend](https://gitlab.lrz.de/seba-master-2021/team-32/backend.git) repository using git:

```
git clone https://gitlab.lrz.de/seba-master-2021/team-32/backend.git
cd backend
```

**Install node dependencies**

```
npm install
```

**Set up your database**

* Create a new database on [mongodb atlas](https://cloud.mongodb.com/).
* Or create a new database locally.
```
mongod --dbpath "path/to/database"
```

**Set up your Paypal accounts**

* Login to [Paypal dashboard for developers](https://www.paypal.com/signin?returnUri=https%3A%2F%2Fdeveloper.paypal.com%2Fdeveloper%2Fapplications)
* Go to "Accounts" under "SANDBOX" in the left menu.
* Make sure to create at least 2 personal accounts for executer and requester and one business account.
* You can then edit the account. You can edit each account's email, first and last names, password and balance.
* Navigate to "My Apps & Credentials" under "DASHBOARD" in the left menu.
* Create a new app with the new business account.
* Make sure the sandbox tab is highlighted and not the live tab.
* Click on your new app and copy the "Client ID", "secret" and the email, we will need them later in the configuration file.
* To check the accounts and their balances, always use [https://sandbox.paypal.com/](https://sandbox.paypal.com/) and not the live version of paypal.

**Create configuration file**
> Under the root folder "backend", create a file called ".env" and set its content to:

```
DB_URI='mongodb+srv://solace:sebateam32@cluster0.o0qqf.mongodb.net/solaceDB?retryWrites=true&w=majority'
PORT=5000
ENV='DEMO'
JWT_SECRET='solace-secret-key'
PAYPAL_CLIENT_ID='paste-long-paypal-business-account-client-id-here'
PAYPAL_SECRET='paste-long-paypal-business-account-secret-key-here'
SOLACE_PAYPAL_EMAIL='solace.business@email.com'
```

* Replace DB_URI with your databse URI, it should look something like: mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/solaceDB.
* Use ENV='PROD' when launching the product to users, otherwise use 'TEST' or 'DEMO'.
* Replace the 3 keys related to PAYPAL with your credentials and the new business email account.

## Start the project

**Development environment**
```bash
npm run devstart
```

**Production environment**
```bash
npm start
```
