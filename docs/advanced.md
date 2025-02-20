## Development Notes

This document provides additional information and nuances to consider during the development and testing of the CRM Integrator project.

## Table of Contents

1. [Development Notes](#development-notes)
2. [Gmail API](#gmail-api)
   - [Refresh Token Expiry](#refresh-token-expiry)
3. [Pipedrive Lead or User Creation Issue](#pipedrive-lead-or-user-creation-issue)
4. [Callback24 Data Retrieval Issue](#callback24-data-retrieval-issue)
5. [Generating Facebook an Application Token](#generating-facebook-an-application-token)

### Gmail API

- **Refresh Token Expiry**: If you are using the Gmail API in test mode, the refresh token will expire every week. Make sure to refresh the token regularly to avoid interruptions in the synchronization process.

To resolve this issue, you need to make your application public. Alternatively, you can use Google Workspace and set the application to internal mode, which allows you to avoid publishing the application.

As an alternative, you can enable IMAP support in Gmail settings and create an app password. This will solve the token expiration problem. It is important to note that using IMAP is much less secure than using the Gmail API and OAuth.

This project provides two solutions: one using IMAP and the other using the Gmail API.

For more information on token expiration, refer to the following links:
- [Do Google refresh tokens expire?](https://stackoverflow.com/questions/8953983/do-google-refresh-tokens-expire#:~:text=Refresh%20tokens%20will%20actually%20expire,token%20expiring%20in%207%20days.)
- [Access token expiration time](https://www.googlecloudcommunity.com/gc/Cloud-Hub/Access-token-expiration-time/m-p/529757)
- [Google Groups discussion on token expiration](https://groups.google.com/g/adwords-api/c/1w_BuKfbWPI)


### Pipedrive Lead or User Creation Issue

If you attempt to create multiple leads or users simultaneously, you may encounter an error indicating that you have made too many requests in a short period of time. To resolve this issue, you can wait until the previous lead or user has been created and introduce a small delay between calls (200ms should be sufficient).

This project already includes a solution to this problem. The `delay` function in the `utils` folder is used to add a delay between API calls, ensuring that you do not exceed the rate limit.


### Callback24 Data Retrieval Issue

Direct requests to Callback24 from Firebase servers may be blocked. To resolve this issue, a proxy server is used to route the requests.

This project already includes a solution to this problem. The `proxy` configuration in the `utils` folder is used to route requests through a proxy server, ensuring that data can be retrieved from Callback24 without being blocked.

### Generating Facebook an Application Token

To access data from the Contact Center in Meta Business Suite using the Graph API, it is necessary to generate an appropriate access token. This token authorizes requests to the API and provides access to the required resources.

Steps to generate an access token:

1. **Create an Application in Meta for Developers:**
   - Go to the [Meta for Developers](https://developers.facebook.com/) website and log in to your account.
   - In the "My Apps" section, click "Create App".
   - Select the type of app that suits your needs (e.g., "Business") and click "Next".
   - Enter the app name, contact email, and if you do not have a business account, select the "No Business Account" option. Then click "Create App".

2. **Obtain a User Token:**
   - In the app dashboard, go to the "Tools" section and select "Graph API Explorer".
   - In the top right corner, select the previously created app.
   - Click "Get User Access Token" and in the permissions window, check the ones necessary for accessing contact data, such as `leads_retrieval` and `pages_read_engagement`.
   - Click "Get Access Token" and, if necessary, log in to your Facebook account to authorize the app.

3. **Generate a Long-Lived Access Token:**
   - After obtaining the access token, go to the [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/) tool.
   - Enter the obtained token and click "Debug".
   - Then click "Extend Access Token" to get a long-lived token, which will be valid for about 60 days.

4. **Obtain a Page Access Token:**
   - Return to "Graph API Explorer" and ensure you are using the long-lived user token.
   - Make a GET request to the endpoint:

     ```bash
     https://graph.facebook.com/v13.0/me/accounts?access_token={long_lived_user_access_token}
     ```

   - This request will return a list of pages that the user has access to, along with their respective access tokens.

5. **Retrieve Form IDs:**
   - To get the form IDs from which you want to retrieve lead information, make a GET request to the following endpoint:

     ```bash
     https://graph.facebook.com/v13.0/{page_id}/leadgen_forms?access_token={page_access_token}
     ```

   - Replace `{page_id}` with the ID of the page and `{page_access_token}` with the access token obtained in the previous step.

By following these steps, you will be able to generate the necessary tokens and retrieve the form IDs to access lead information from the Facebook Marketing API.