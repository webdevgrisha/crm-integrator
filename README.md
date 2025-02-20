# CRM Integrator

CRM Integrator is a project designed for automatically synchronizing leads from three sources: **Facebook**, **Callback24**, and **Gmail**, directly into **Pipedrive CRM**. This ensures that all incoming leads is processed and recorded in the CRM, providing a centralized solution for managing leads and improving workflow efficiency. The synchronization occurs every hour. The synchronization time can be changed at any moment.

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Requirements](#requirements)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Configuration](#configuration)
7. [Secrets Management](#secrets-management)
8. [Advanced](#advanced)
9. [Contributing](#contributing)
10. [License](#license)

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
- **Node.js**: v18.x
- **Firebase**: v13.x (firebase-admin), v6.x (firebase-functions)
- **TypeScript**: v5.x
- **Google Secret Manager**

## Requirements
This project requires several tools and configurations to run properly. Please ensure you have the following:

- [Node.js](https://nodejs.org/) at least version 14 (see [functions/package.json](functions/package.json))  
- [Firebase CLI](https://firebase.google.com/docs/cli) (refer to [firebase.json](firebase.json))  
- A valid Firebase project configured (see [functions/.firebaserc](functions/.firebaserc))  
- [Google Secret Manager](https://cloud.google.com/secret-manager) for storing API keys (refer to [`getSecret`](functions/src/utils/getSecret.ts))  
- **Firestore** for storing errors and data related to integrations  
- **Callback24 API key** for integrating Callback24 leads
- **Proxy** for accessing Callback24 API  
- **Google App Password or Gmail API credentials** for accessing Gmail data  
- **A Facebook Business App** for Facebook lead integration  
- **Pipedrive API key** for CRM integration (stored in Google Secret Manager)  
- Additional dependencies listed in [functions/package.json](functions/package.json)

Check the [installation notes](#installation) for detailed instructions on how to install and configure the project.

## Installation

For a Installation guide, please refer to the [Installation Guide](docs/installation.md).

## Usage

For detailed instructions on how to start or use the project, please refer to the [Usage Guide](docs/usage.md).

## Configuration

To customize the project configuration, please refer to the [Configuration Guide](). This guide provides detailed instructions on how to configure various aspects of the project, including Callback24, Facebook, Gmail, and Pipedrive integrations.

## Secrets Management

For detailed information on the structure and usage of secrets stored in Google Secret Manager, please refer to the [Secrets Management Guide](docs/config.md).

## Advanced

For information on potential issues users may encounter during synchronization with Pipedrive, Gmail, and Facebook, please refer to the [Advanced Guide](docs/advanced.md).

## Contributing
Contributions are welcome! Please open an issue first to discuss potential changes. Fork the repo, create your feature branch, then submit a pull request.

## License
Distributed under the MIT License. See [LICENSE](LICENSE) for more information.