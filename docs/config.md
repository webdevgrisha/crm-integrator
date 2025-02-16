# Project Configuration Guide

This document provides detailed instructions on how to configure the CRM Integrator project to suit your needs. It includes descriptions of the configuration files located in the `projectConfig` folder.

## Table of Contents

1. [Introduction](#introduction)
2. [Configuration Files](#configuration-files)
   - [callback24Config.ts](#callback24configts)
   - [facebookConfig.ts](#facebookconfigts)
   - [gmailConfig.ts](#gmailconfigts)
   - [pipedriveConfig.ts](#pipedriveconfigts)
   - [utilsConfig.ts](#utilsconfigts)
3. [Customizing the Configuration](#customizing-the-configuration)
4. [Secrets Management](#secrets-management)

## Introduction

The `projectConfig` folder contains configuration files for various services used in the CRM Integrator project. These files allow you to customize the behavior of the project to match your specific requirements.

## Configuration Files

### callback24Config.ts

- **Description**: Configuration for Callback24 integration.
- **Settings**:

  - `serviceName`: The name of the service.
  - `filterServiceName`: The name used to filter Callback24 data.
  - `getHistoryEndPoint`: The endpoint for fetching call history.
  - `getCallInfoEndPoint`: The endpoint for fetching call information.
  - `apiKeyName`: The name of the secret storing the API key.
  - `schedule`: The schedule for running the synchronization.
  - `timeZone`: The time zone for the schedule.
  - `region`: The region for the Firebase function.

### facebookConfig.ts

- **Description**: Configuration for Facebook integration.
- **Settings**:
  - `serviceName`: The name of the service.
  - `apiKeyName`: The name of the secret storing the API key.
  - `formFields`: The fields to retrieve from Facebook leads.
  - `schedule`: The schedule for running the synchronization.
  - `timeZone`: The time zone for the schedule.
  - `region`: The region for the Firebase function.

### gmailConfig.ts

- **Description**: Configuration for Gmail integration.
- **Settings**:
  - `serviceName`: The name of the service.
  - `filterMailTitles`: The titles of emails to filter.
  - `imapSecretConfig`: Configuration for IMAP access.
    - `secretName`: The name of the secret storing IMAP credentials.
    - `connTimeout`: Connection timeout for IMAP.
    - `authTimeout`: Authentication timeout for IMAP.
    - `keepalive`: Whether to keep the IMAP connection alive.
  - `gmailApiSecretConfig`: Configuration for Gmail API access.
    - `credentialsName`: The name of the secret storing OAuth2 credentials.
    - `tokenName`: The name of the secret storing the OAuth2 token.
  - `schedule`: The schedule for running the synchronization.
  - `timeZone`: The time zone for the schedule.
  - `region`: The region for the Firebase function.

### pipedriveConfig.ts

- **Description**: Configuration for Pipedrive integration.
- **Settings**:
  - `apiKeyName`: The name of the secret storing the API key.
  - `personConfig`: Configuration for creating persons in Pipedrive.
    - `visible_to`: Visibility group for the person.
    - `customFields`: Custom fields for the person.
  - `leadConfig`: Configuration for creating leads in Pipedrive.
    - `channelIds`: Channel IDs for different lead sources.
    - `currency`: Currency for the leads.
    - `visibleTo`: Visibility group for the lead.
    - `customFields`: Custom fields for the lead.

### utilsConfig.ts

- **Description**: Configuration for utility functions used across the project.
- **Settings**:

  - `secretManagerConfig`: Configuration for Google Secret Manager.
    - `projectId`: The project ID for Google Secret Manager.
    - `versionId`: The version ID for the secrets.
  - `proxyConfig`: Configuration for the proxy server.

    - `secretName`: The name of the secret storing proxy credentials.
    - `protocol`: The protocol used by the proxy server.

## Customizing the Configuration

To customize the configuration, modify the respective configuration files in the `projectConfig` folder. Ensure that the settings match your specific requirements and environment.


## Secrets Management

For detailed information on the structure and usage of secrets stored in Google Secret Manager, please refer to the [Secrets Management Guide](secrets.md).