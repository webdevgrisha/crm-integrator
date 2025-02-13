# Usage Guide

This document describes the usage and structure of the CRM Integrator project. It provides an overview of the project folders and files, and explains how to use and manage the various functions included in the project.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Functions Overview](#functions-overview)
   - [Callback24 Sync](#callback24-sync)
   - [Facebook Sync](#facebook-sync)
   - [Gmail Sync](#gmail-sync)
3. [Folder Overview](#folder-overview)
   - [callback24Sync](#callback24sync)
   - [facebookSync](#facebookSync)
   - [gamilSync](#gamilSync)
   - [pipedrive](#pipedrive)
   - [utils](#utils)
   - [Other Files](#other-files)
4. [Disabling Unnecessary Functions](#disabling-unnecessary-functions)
5. [Additional Resources](#additional-resources)

## Project Structure

    .  
    ├── .firebase/  
    ├── functions/  
    │   ├── lib/  
    │   │   ├── callback24Sync/  
    │   │   ├── facebookSync/  
    │   │   ├── gamilSync/  
    │   │   ├── pipedrive/  
    │   │   ├── utils/  
    │   │   ├── index.js  
    │   │   ├── init.js  
    │   │   ├── interfaces.js  
    │   ├── src/  
    │   │   ├── callback24Sync/  
    │   │   │   ├── getCallInfo.ts  
    │   │   │   ├── getHistory.ts  
    │   │   │   ├── handleCallback24Data.ts  
    │   │   │   ├── callback24Sync.ts  
    │   │   ├── facebookSync/  
    │   │   │   ├── getFacebookLeads.ts  
    │   │   │   ├── handleFacebookLeads.ts  
    │   │   │   ├── reformatFacebookLeads.ts  
    │   │   │   ├── facebookSync.ts  
    │   │   ├── gmailSync/  
    │   │   │   ├── authorize.ts  
    │   │   │   ├── extractGmailFields.ts  
    │   │   │   ├── getGmailHistoryGmailApi.ts  
    │   │   │   ├── getGmailHistoryImap.ts  
    │   │   │   ├── handleGmailDataGmailApi.ts  
    │   │   │   ├── handleGmailDataImap.ts  
    │   │   │   ├── gmailSync.ts  
    │   │   ├── pipedrive/  
    │   │   │   ├── createLeads.ts  
    │   │   │   ├── createPerson.ts  
    │   │   ├── utils/  
    │   │   │   ├── dateFuncs.ts  
    │   │   │   ├── delay.ts  
    │   │   │   ├── getSecret.ts  
    │   │   │   ├── handleSyncError.ts  
    │   │   │   ├── saveLeadInfo.ts  
    │   │   │   ├── sendMails.ts  
    │   │   │   ├── filterSavedLeads.ts  
    │   │   ├── index.ts  
    │   │   ├── init.ts  
    │   │   ├── interfaces.ts
    │   ├── .eslintrc.js  
    │   ├── package.json  
    │   ├── tsconfig.json  
    │   ├── tsconfig.dev.json  
    ├── public/  
    │   ├── index.html  
    │   ├── privacy-policy.html  
    │   ├── terms-of-service.html  
    ├── .firebaserc  
    ├── .gitignore  
    ├── firebase.json  
    └── README.md  

## Functions Overview

### Callback24 Sync

- **Path**: `functions/src/callback24Sync/callback24Sync.ts`
- **Description**: Synchronizes leads from Callback24 and creates records in Pipedrive.
- **Usage**:
```ts
  import { scheduleCallback24Sync } from "./callback24Sync/callback24Sync";
```


### Facebook Sync

- **Path**: `functions/src/facebookSync/facebookSync.ts`
- **Description**: Synchronizes leads from Facebook and creates records in Pipedrive.
- **Usage**:
```ts
  import { scheduleFacebookSync } from "./facebookSync/facebookSync";
```

### Gmail Sync

- **Path**: `functions/src/gamilSync/gmailSync.ts`
- **Description**: Synchronizes leads from Gmail and creates records in Pipedrive.
- **Usage**:
```ts
  import { scheduleGmailSync } from "./gamilSync/gmailSync";
```

## Folder Overview

### callback24Sync

- **Description**: Contains all the files related to synchronizing leads from Callback24 and creating records in Pipedrive.
- **Files**:
  - `getCallInfo.ts`: Retrieves call information from Callback24.
  - `getHistory.ts`: Fetches call history from Callback24.
  - `handleCallback24Data.ts`: Processes and handles data from Callback24.
  - `callback24Sync.ts`: Main file for synchronizing data from Callback24.

### facebookSync

- **Description**: Contains all the files related to synchronizing leads from Facebook and creating records in Pipedrive.
- **Files**:
  - `getFacebookLeads.ts`: Retrieves leads from Facebook.
  - `handleFacebookLeads.ts`: Processes and handles Facebook leads.
  - `reformatFacebookLeads.ts`: Reformats Facebook leads data.
  - `facebookSync.ts`: Main file for synchronizing data from Facebook.

### gamilSync

- **Description**: Contains all the files related to synchronizing leads from Gmail and creating records in Pipedrive.
- **Files**:
  - `authorize.ts`: Handles Gmail authorization.
  - `extractGmailFields.ts`: Extracts fields from Gmail messages.
  - `getGmailHistoryGmailApi.ts`: Fetches Gmail history using Gmail API.
  - `getGmailHistoryImap.ts`: Fetches Gmail history using IMAP.
  - `handleGmailDataGmailApi.ts`: Processes Gmail data using Gmail API.
  - `handleGmailDataImap.ts`: Processes Gmail data using IMAP.
  - `gmailSync.ts`: Main file for synchronizing data from Gmail.

### pipedrive

- **Description**: Contains all the files related to creating leads and persons in Pipedrive.
- **Files**:
  - `createLeads.ts`: Creates leads in Pipedrive.
  - `createPerson.ts`: Creates persons in Pipedrive.

### utils

- **Description**: Contains utility functions used across the project.
- **Files**:
  - `dateFuncs.ts`: Contains date utility functions.
  - `delay.ts`: Implements delay functionality.
  - `getSecret.ts`: Retrieves secrets from Google Secret Manager.
  - `handleSyncError.ts`: Handles synchronization errors.
  - `saveLeadInfo.ts`: Saves processed lead information.
  - `sendMails.ts`: Sends error and fixed emails.
  - `filterSavedLeads.ts`: Filters saved leads.

### Other Files

- **index.ts**: Main entry point for function exports.
- **init.ts**: Initializes Firebase admin.
- **interfaces.ts**: Defines TypeScript interfaces.


### Disabling Unnecessary Functions

If any function is not needed, you can disable it by removing its import and usage from the `index.ts` file. After making the changes, you can deploy the updated functions using the following command:

```sh
firebase deploy --only functions
```

Alternatively, you can delete the function using Firebase CLI with the following command:
```sh
firebase functions:delete <functionName>
```

## Additional Resources

- **Facebook Marketing API**: [Facebook Marketing API Documentation](https://developers.facebook.com/docs/marketing-apis)
- **GraphQL API**: [GraphQL API Documentation](https://graphql.org/learn/)
- **Gmail IMAP, POP, and SMTP**: [IMAP, POP, and SMTP](https://developers.google.com/gmail/imap/imap-smtp)
- **Gmail IMAP**: [Gmail IMAP Documentation](https://developers.google.com/gmail/imap)
- **Gmail Api**: [Gmail API Documentation](https://developers.google.com/gmail/api/reference/rest)
- **imap-simple**: [imap-simple Documentation](https://github.com/chadxz/imap-simple)
- **nodemailer**: [Nodemailer Documentation](https://nodemailer.com/about/)
- **Callback24API**: [CallbackAPI Documentation](https://callback24.pl/api/)
- **Pipedrive - How to Create a Lead**: [Pipedrive Guide](https://developers.pipedrive.com/tutorials/adding-leads-to-pipedrive)
- **Pipedrive - API v1 Endpoints**: [List of API Endpoints for API v1](https://github.com/pipedrive/client-nodejs/blob/HEAD/docs/v1.md)