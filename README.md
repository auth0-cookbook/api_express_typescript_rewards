# Auth0 Eats Rewards API

You can use this sample to learn how to secure an Express API server with Auth0. You can then use a client application to practice making secure API calls.

As part of the setup process, you'll also learn how to quickly host this API on the cloud using Glitch.com and how to test it using the command line.

## 1. Get Started

Clone the repository: 

```bash
git clone git@github.com:auth0-cookbook/api_express_javascript_rewards.git typescript-rewards
```

Make the project directory your current directory:

```bash
cd typescript-rewards
```

Install the project dependencies:

```bash
npm i
```

Create a `.env` file under the project directory:

```bash
.env
```

Populate `.env` as follows:

```bash
PORT=6060
ISSUER_BASE_URL=https://<YOUR_AUTH0_DOMAIN>
AUDIENCE=<YOUR_AUTH0_API_IDENTIFIER>
```

Rename the `database.example.json` file present under `src/database` to `database.json`.

Finally, run the project:

```bash
npm start
```

### API Endpoints

These endpoints require the request to include an access token issued by Auth0 in the authorization header.

#### 🔐 Get rewards data

Provides rewards data using a customer ID.

```bash
GET /api/rewards/accounts/:id
```

##### Response

###### If rewards data is not found

```bash
Status: 404 Not Found
```

###### If rewards data is found

```bash
Status: 200 OK
```

```json
{
  "id": 1617480104622,
  "customerId": 9087654321,
  "balance": 830,
  "createdAt": 1617480104622,
  "perks": ["5% off entire sale", "1 free drink every month"]
}
```


## 2. Register an API Server with Auth0

You need an Auth0 account. If you don't have one yet, [sign up for a free Auth0 account](https://auth0.com/signup).

Open the [APIs section of the Auth0 Dashboard](https://manage.auth0.com/#/apis), click the **"Create API"** button.

Fill out the form that comes up:

- **Name:** Auth0 Eats Rewards API Sample

- **Identifier:** `https://rewards.example.com`

Leave the signing algorithm as `RS256`. It's the best option from a security standpoint.

Once you've added those values, click the **"Create"** button.

Once you create an Auth0 API, a new page loads up, presenting you with your Auth0 API information.

Keep page open to complete the next step.

## 3. Connect the Server with Auth0

Click on the `.env` file from your local project or your Glitch project.

You'll need to add the values for `AUTH0_AUDIENCE` and `AUTH0_DOMAIN` from your Auth0 API configuration.

Head back to your Auth0 API page, and **follow these steps to get the Auth0 Audience**:

![Get the Auth0 Audience to configure an API](https://cdn.auth0.com/blog/complete-guide-to-user-authentication/get-the-auth0-audience.png)

1. Click on the **"Settings"** tab.

2. Locate the **"Identifier"** field and copy its value.

3. Paste the **"Identifier"** value as the value of `AUTH0_AUDIENCE` in `.env`.

Now, **follow these steps to get the Auth0 Domain value**:

![Get the Auth0 Domain to configure an API](https://cdn.auth0.com/blog/complete-guide-to-user-authentication/get-the-auth0-domain.png)

1. Click on the **"Test"** tab.
2. Locate the section called **"Asking Auth0 for tokens from my application"**.
3. Click on the **cURL** tab to show a mock `POST` request.
4. Copy your Auth0 domain, which is _part_ of the `--url` parameter value: `tenant-name.region.auth0.com`.
5. Paste the Auth0 domain value as the value of `AUTH0_DOMAIN` in `.env`.

**Tips to get the Auth0 Domain**

- The Auth0 Domain is the substring between the protocol, `https://` and the path `/oauth/token`.

- The Auth0 Domain follows this pattern: `tenant-name.region.auth0.com`.
 
- The `region` subdomain (`au`, `us`, or `eu`) is optional. Some Auth0 Domains don't have it.

- **Click on the image above, please, if you have any doubt on how to get the Auth0 Domain value**.

With the `.env` configuration values set, you need to restart the local server so that Express can see these new environment variables. If you are using Glitch, simply refresh the project page.

## 4. Test the Server

You need your API server root URL to make requests.

The local server root URL is `http://localhost:6060`.

The Glitch server root URL is `https://<random-long-string>.glitch.me`.

> You can find the Glitch project server URL by following these instructions:
>
> In your Glitch project, click on the **"Share"** button, which you can find under the project name in the top-left corner.
> 
> Look for the **Project links** section and copy the **"Live Site"** link.

### Test a protected endpoint

You need an access token to call any of the protected API endpoints.

Try to make the following request:

```bash
curl <SERVER_ROOT_URL>/api/rewards/accounts/9087654321
```

You'll get the following response error:

```bash
No authorization token was found
```

To get an access token, head back to your API configuration page in the Auth0 Dashboard.

Click on the **"Test"** tab and locate the **"Sending the token to the API"**.

Click on the **"cURL"** tab.

You should see something like this:

```bash
curl --request GET \
  --url <SERVER_ROOT_URL>/path_to_your_api/ \
  --header 'authorization: Bearer really-long-string'
```

Copy and paste that value in a text editor.

In the value of the `--header` parameter, the value of `really-long-string` is your access token.

Replace the value of the `--url` parameter with your `GET api/rewards/:id` endpoint URL:

```bash
curl --request GET \
  --url <SERVER_ROOT_URL>/api/rewards/accounts/9087654321 \
  --header 'authorization: Bearer really-long-string'
```

Copy and paste the updated cURL command into a terminal window and execute it. You should now get a valid response.

You can also use any of the Auth0 Eats client applications to consume this API. The client applications require users to log in, obtaining an access token in the background, before they can call the Auth0 Eats Rewards API.

