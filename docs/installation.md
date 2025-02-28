# Installation Guide

This document describes the installation and setup process for the CRM Integrator project.

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation Steps](#installation-steps)
   - [Step 1: Clone the Repository](#step-1-clone-the-repository)
   - [Step 2: Install Dependencies](#step-2-install-dependencies)
   - [Step 3: Initialize Firebase](#step-3-initialize-firebase)
   - [Step 4: Move Files](#step-4-move-files)
4. [Configuration](#configuration)
5. [Running Locally](#running-locally)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

## Requirements

Before starting the installation, ensure you have the following tools installed:

- [Node.js](https://nodejs.org/) version 14 or higher
- [Firebase CLI](https://firebase.google.com/docs/cli)
- An active Firebase project
- [Google Secret Manager](https://cloud.google.com/secret-manager) for storing API keys
- [TypeScript](https://www.typescriptlang.org/) installed globally

## Installation

### Step 1: Clone the Repository

First, clone the project repository and navigate to the `functions` directory:

```bash
git clone https://github.com/webdevgrisha/crm-integrator.git
cd crm-integrator/functions
```

### Step 2: Install Dependencies

Install all necessary dependencies by running the following command:

```sh
npm install
```

### Step 3: Configure Firebase

0. Create a Firebase project at [Firebase Console](https://firebase.google.com).


   > **Note:** Ensure you are on the Blaze plan; otherwise, you will not be able to run functions

1. Log in to Firebase CLI:

```sh
firebase login
```

During this step, make sure to select the Google account that has access to your Firebase project.

2. Initialize Firebase in the project:

```sh
firebase init
```

3. Select "Functions: Configure a Cloud Functions directory and its files" and follow the on-screen instructions. Make sure to choose ESLint and TypeScript when prompted.

- Select "Functions: Configure a Cloud Functions directory and its files"
- Use an existing project
- Select your project created in the previous step
- Choose TypeScript
- Select the option to use ESLint
- When prompted to install dependencies with npm, select "No"

4. Move all files from the root directory, except for .firebaserc and firebase.json, into the functions directory, including node_modules. Confirm the option to replace them if prompted.

After executing these commands, the project structure will look as follows:

    .  
    ├── .firebase/  
    ├── functions/ 
    ├── docs/  
    │   │   ├── advanced.md  
    │   │   ├── installation.md  
    │   │   ├── secrets.md  
    │   │   ├── usage.md
    │   ├── lib/  
    │   │   ├── callback24Sync/  
    │   │   ├── facebookSync/  
    │   │   ├── gmailSync/  
    │   │   ├── pipedrive/  
    │   │   ├── utils/  
    │   │   ├── index.js  
    │   │   ├── init.js  
    │   │   ├── interfaces.js  
    │   ├── src/  
    │   │   ├── callback24Sync/  
    │   │   ├── facebookSync/  
    │   │   ├── gmailSync/  
    │   │   ├── pipedrive/  
    │   │   ├── projectConfig/
    │   │   ├── utils/  
    │   │   ├── index.ts  
    │   │   ├── init.ts  
    │   │   ├── interfaces.ts  
    │   ├── .eslintrc.js  
    │   ├── package.json  
    │   ├── tsconfig.json  
    │   ├── tsconfig.dev.json  
    │   ├── .gitignore  
    │   ├── README.md  
    │   ├── public/  
    │   │   ├── index.html  
    │   │   ├── privacy-policy.html  
    │   │   ├── terms-of-service.html  
    ├── .firebaserc  
    ├── firebase.json  

5. Enable Firebase Database to ensure that the tables used in the project can be created.

### Step 4: Set Up Google Secret Manager

1. Create secrets in Google Secret Manager to store API keys and other sensitive information.

You can decide which secrets to store, whether it's a JSON file or a simple string.

 ```sh
gcloud secrets create gmail-info --data-file=gmail-info.json
gcloud secrets create pipedrive-api --data-file=pipedrive-api.json
```

2. Ensure your Firebase project has access to these secrets. Follow the instructions on how to add a principal to allow Firebase to access the data you store: [Google Cloud Functions - Configuring Secrets](https://cloud.google.com/functions/docs/configuring/secrets)

### Step 5: Build and Run

#### Local Development

To start the Firebase emulators for local development, use the command:

```sh
npm run serve
```

#### Deployment

To deploy the functions to Firebase, use the command:

```sh
npm run deploy 
```

## Additional Commands

- Lint the code:

 ```sh
npm run lint
```

- Automatically fix linting errors:

```sh
npm run lint:fix
```

- View function logs:

```sh
npm run logs
```

## Conclusion

Your project should now be set up and ready to use. If you have any questions or issues, please refer to the documentation or contact us at [roi.grisha.work@gmail.com](mailto:roi.grisha.work@gmail.com).