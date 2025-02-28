# Database Structure

## Database

- **Type**: Firestore
- **Description**: Firestore is a flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud Platform. It is a NoSQL document database that lets you easily store, sync, and query data for your applications. The reason for using this database is that the project was developed based on Firebase, and this database is integrated into Firebase.
- **Documentation**: [Firestore Documentation](https://firebase.google.com/docs/firestore)


## Collections

### 1. error_handle

- **Description**: This collection is responsible for storing the state of errors and the status of notification emails.
- **Documents**:
  - `callback24`: Document for Callback24 service.
  - `facebook`: Document for Facebook service.
  - `gmail`: Document for Gmail service.
- **Fields**:
  - `errorTime`: Timestamp - Indicates the time of synchronization when the error occurred. This is the same value as in `update_time/service_name/date`. If there is no error, it is `null`.
  - `isError`: Boolean - Indicates whether an error occurred or not.
  - `isSendEmail`: Boolean - Indicates whether an email was sent or not.

## Example Document

### callback24

```json
{
  "errorTime": "2023-10-01T12:34:56Z",
  "isError": true,
  "isSendEmail": false
}
```

### 2. lead_services

- **Description**: Stores successfully processed leads. Data from this collection is read only if an error occurred in the previous synchronization function call. This is done to prevent data duplication.
- **Documents**:
  - `callback24`: Document for Callback24 service.
  - `facebook`: Document for Facebook service.
  - `gmail`: Document for Gmail service.
- **Sub-collection**: `leads`
  - **Description**: Contains documents with the IDs of leads from the specific service.
  - **Fields**:
    - `createdLeadId`: String - ID obtained when creating the lead in Pipedrive. Can be `null` if there was an error during creation.
    - `createdPersonId`: Number - ID obtained when creating the person in Pipedrive. Can be `null` if there was an error during creation.
    - `dateFrom`: Timestamp - The date from which leads were read from the service.
    - `serviceLeadId`: String - ID of the lead obtained from the service.

## Example Document

### lead_services/callback24/leads/leadId

```json
{
  "createdLeadId": "260df3f0-e1ba-11ef-80d5-951407a3ee81",
  "createdPersonId": 344,
  "dateFrom": "2025-02-03T01:24:53Z",
  "serviceLeadId": "1822987174970860009"
}
```

### 3. update_time

- **Description**: Stores the date and time from which leads should be retrieved from the services.
- **Documents**:
  - `callback24`: Document for Callback24 service.
  - `facebook`: Document for Facebook service.
  - `gmail`: Document for Gmail service.
- **Fields**:
  - `date`: Timestamp - The date from which leads should be retrieved from the services.

## Example Document

### update_time/callback24

```json
{
  "date": "2025-02-28T19:00:11Z"
}
```