# CRM Integrator

CRM Integrator is a project designed for automatically synchronizing leads from three sources: **Facebook**, **Callback24**, and **Gmail**, directly into **Pipedrive CRM**. This ensures that all incoming data is processed and recorded in the CRM, providing a centralized solution for managing leads and improving workflow efficiency.

## Table of Contents
1. [Features](#features)
2. [Getting Started](#getting-started)
3. [Usage](#usage)
4. [Contributing](#contributing)
5. [License](#license)

## Requirements

This project requires several tools and configurations to run properly. Please ensure you have the following:

- [Node.js](https://nodejs.org/) at least version 14 (see [functions/package.json](functions/package.json))  
- [Firebase CLI](https://firebase.google.com/docs/cli) (refer to [firebase.json](firebase.json))  
- A valid Firebase project configured (see [functions/.firebaserc](functions/.firebaserc))  
- [Google Secret Manager](https://cloud.google.com/secret-manager) for storing API keys (refer to [`getSecret`](functions/src/utils/getSecret.ts))  
- **Firestore** for storing errors and data related to integrations  
- **Callback24 API key** for integrating Callback24 leads  
- **Google App Password or Gmail API credentials** for accessing Gmail data  
- **A Facebook Business App** for Facebook lead integration  
- **Pipedrive API key** for CRM integration (stored in Google Secret Manager)  
- Additional dependencies listed in [functions/package.json](functions/package.json)

Check the [installation notes](#getting-started) for detailed instructions on how to install and configure the project.

## Features
- **Gmail Integration**: Retrieves and processes email leads from Gmail, then automatically creates records in Pipedrive via the API.  
- **Facebook Integration**: Retrieves and processes Facebook leads, then automatically creates records in Pipedrive.  
- **Callback24 Integration**: Retrieves and processes Callback24 leads, then automatically creates records in Pipedrive.  
- **Pipedrive Integration**: Centralizes all incoming data so new leads and persons are created seamlessly based on the transformed information from other services.  
- **Error Handling**: Includes robust error handling and logging to ensure data consistency and easier debugging.  
- **Scalability**: Designed to support high-volume data flows from multiple sources without performance degradation.  
- **Custom Protection Mechanism**: Implements a custom protection mechanism to handle potential errors that may occur during lead creation on the Pipedrive side, ensuring data integrity.  
- **Security**: Uses Google Secret Manager to securely store and manage sensitive information.

## Technologies Used
- **Node.js**: v14.x
- **Firebase**: v9.x
- **TypeScript**: v4.x
- **Google Secret Manager**

## Getting Started

### Prerequisites
- Node.js
- Firebase CLI
- A Firebase project
- Google Secret Manager

### Installation
1. Clone the repository:  
    ```sh
    git clone https://github.com/your-repo.git
    cd your-repo/functions
    ```
2. Install dependencies:  
    ```sh
    npm install
    ```

## Usage
Provide brief instructions on how to start or use the project. Include code or command examples when possible.

## Contributing
Contributions are welcome! Please open an issue first to discuss potential changes. Fork the repo, create your feature branch, then submit a pull request.

## License
Distributed under the MIT License. See [LICENSE](LICENSE) for more information.