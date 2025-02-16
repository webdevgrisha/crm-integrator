# Secrets Management

This document describes the data contained in each secret stored in Google Secret Manager and how they are used in the project.

## Table of Contents

[List of Secrets](#list-of-secrets)
   - [1. `gmail-info`](#1-gmail-info)
   - [2. `gmail-imap`](#2-gmail-imap)
   - [3. `credentials`](#3-credentials)
   - [4. `token`](#4-token)
   - [5. `facebook-api`](#5-facebook-api)
   - [6. `callback24-api`](#6-callback24-api)
   - [7. `pipedrive-api`](#7-pipedrive-api)
   - [8. `proxy`](#8-proxy)

## List of Secrets

### 1. `gmail-info`

- **Description**: Contains credentials for accessing Gmail.
- **Format**: JSON
- **Example**:

```json
{
  "user": "your-email@gmail.com",
  "pass": "your-app-password",
  "receiver": "receiver-email@gmail.com"
}
```

### 2. `gmail-imap`

- **Description**: Contains credentials for accessing Gmail via IMAP.
- **Format**: JSON
- **Example**:

```json
{
  "user": "your-email@gmail.com",
  "password": "your-app-password",
  "host": "imap.gmail.com",
  "port": 993
}
```

### 3. `credentials`

- **Description**: Contains OAuth2 credentials for accessing the Gmail API.
- **Format**: JSON
- **Example**:

```json
{
  "installed": {
    "client_id": "your-client-id",
    "project_id": "your-project-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "your-client-secret",
    "redirect_uris": ["your-redirect-uri"]
  }
}
```

### 4. `token`

- **Description**: Contains the OAuth2 token for accessing the Gmail API.
- **Format**: JSON
- **Example**:

```json
{
  "access_token": "your-access-token",
  "refresh_token": "your-refresh-token",
  "scope": "https://www.googleapis.com/auth/gmail.readonly",
  "token_type": "Bearer",
  "expiry_date": 1234567890
}
```

### 5. `facebook-api`

- **Description**: Contains the access token for Facebook API and the ID of the form from which data is retrieved.
- **Format**: JSON
- **Example**:

```json
{
  "access_token": "your-facebook-access-token",
  "id": "your-facebook-form-id"
}
```

### 6. `callback24-api`

- **Description**: Contains the API key for accessing Callback24.
- **Format**: String
- **Example**:

```
your-callback24-api-key
```

### 7. `pipedrive-api`

- **Description**: Contains the API key for accessing Pipedrive.
- **Format**: String
- **Example**: random-api-key

```
your-pipedrive-api-key
```

### 8. `proxy`

- **Description**: Contains data for configuring the proxy server.
- **Format**: JSON
- **Example**:

```json
{
  "host": "your-proxy-host",
  "port": "your-proxy-port",
  "username": "your-username",
  "password": "your-password"
}
```
