# PIAXE PAYMENT SYSTEM

        API for managing PAYMENTS AND ECOMMERCE.

        **Authentication**: Each endpoint manages its own authentication and permissions.
        

## Version: 1.0.0

### /

#### GET
##### Summary:

Root

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/token

#### POST
##### Summary:

Login For Access Token

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/refresh

#### POST
##### Summary:

Refresh Access Token

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/signup

#### POST
##### Summary:

Create User

##### Description:

Endpoint to handle user signup.

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/verify-otp

#### POST
##### Summary:

Verify Signup Otp

##### Description:

Endpoint to verify OTPs for user signup.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/activate

#### POST
##### Summary:

Activate Account

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/request-new-otp

#### POST
##### Summary:

Request New Otp

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | query |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/search

#### GET
##### Summary:

Search Users

##### Description:

Search for users and merchants by username, email, first/last name, or business name.
Excludes the current user from the results.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| query | query | Search by username, email, name, or business name | Yes | string |
| limit | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/me

#### GET
##### Summary:

Read Users Me

##### Description:

Get current user's profile - returns UserProfileResponse for users, MerchantProfileResponse for merchants

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/users/me

#### PUT
##### Summary:

Update User

##### Description:

Update user profile with optional avatar upload

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/users/change-role

#### POST
##### Summary:

Change Role

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/users/{user_id}

#### GET
##### Summary:

Get User Details

##### Description:

Get details for a specific user or merchant

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| user_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/verify/user

#### POST
##### Summary:

Verify User

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/verify/merchant

#### POST
##### Summary:

Verify Merchant

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/merchants/register

#### POST
##### Summary:

Register Merchant

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 400 | Bad request - invalid data |
| 409 | Conflict - merchant already exists or business name taken |
| 422 | Validation Error |
| 500 | Internal server error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/merchant/profile

#### GET
##### Summary:

Get Merchant Profile

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PATCH
##### Summary:

Update Merchant

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/merchant

#### PUT
##### Summary:

Update Merchant

##### Description:

Update merchant profile with optional avatar upload

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/payment-methods

#### GET
##### Summary:

Get Payment Methods

##### Description:

Get all active payment methods for the current user

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### POST
##### Summary:

Add Payment Method

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/payment_methods/{payment_method_id}

#### DELETE
##### Summary:

Delete Payment Method

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| payment_method_id | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/payment-methods/{payment_method_id}

#### PATCH
##### Summary:

Update Payment Method

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| payment_method_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

Get Payment Method

##### Description:

Get a specific payment method by ID for the current user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| payment_method_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/create_pin

#### POST
##### Summary:

Create Pin

##### Description:

Create or update API PIN for user

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/change_pin

#### PUT
##### Summary:

Change Pin

##### Description:

Change user's API PIN after verifying the old PIN

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/validate_api_access/

#### POST
##### Summary:

Validate Api Access

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/api-access/invalidate

#### POST
##### Summary:

Invalidate Api Access

##### Description:

Invalidate API access for the current account.
This can be called when:
- User logs out
- User switches screens
- Session timeout
- Security concern

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/request_pin_reset

#### POST
##### Summary:

Request Pin Reset

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | query |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/reset_pin

#### POST
##### Summary:

Reset Pin

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | query |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/accounts/me

#### DELETE
##### Summary:

Delete Account

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/change_password

#### POST
##### Summary:

Change Password

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| old_password | query |  | Yes | string |
| new_password | query |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/request_password_reset

#### POST
##### Summary:

Request Password Reset

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | query |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/reset_password

#### POST
##### Summary:

Reset Password

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | query |  | Yes | string |
| new_password | query |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/merchants/{merchant_id}/add_admin

#### POST
##### Summary:

Add Admin

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| merchant_id | path |  | Yes | string (uuid) |
| admin_email | query |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/merchants

#### GET
##### Summary:

List Merchants

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/users

#### GET
##### Summary:

List Users

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/merchant/api-key/reset

#### POST
##### Summary:

Request Api Key Reset

##### Description:

Request a new API key - sends reset link via email

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/merchants/client-id/reset

#### POST
##### Summary:

Reset Client Id

##### Description:

Reset merchant's client ID

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/merchants/client-id

#### GET
##### Summary:

Get Client Id

##### Description:

Get merchant's current client ID

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/merchant/api-key/reset/confirm

#### POST
##### Summary:

Confirm Api Key Reset

##### Description:

Confirm API key reset and generate new key

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | query |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/webhooks

#### POST
##### Summary:

Create Webhook

##### Description:

Create a new webhook for the merchant

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 400 | Bad Request |
| 401 | Unauthorized |
| 422 | Validation Error |
| 500 | Internal Server Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/merchant/webhooks

#### GET
##### Summary:

List Webhooks

##### Description:

List all webhooks for the merchant

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/merchant/webhooks/{webhook_id}

#### PATCH
##### Summary:

Update Webhook

##### Description:

Update an existing webhook

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| webhook_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Delete Webhook

##### Description:

Delete a webhook

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| webhook_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /users/merchant/verify/{merchant_id}

#### POST
##### Summary:

Verify Merchant

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| merchant_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/request-otp

#### POST
##### Summary:

Request Internal Otp

##### Description:

Request OTP for internal operations (escrow fulfillment, etc.)

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | query |  | No |  |
| phone_number | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/wallet/create

#### POST
##### Summary:

Create Wallet

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/wallets/

#### GET
##### Summary:

Get User Wallets

##### Description:

Retrieve all wallets associated with the authenticated user.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/wallets/{wallet_id}/

#### GET
##### Summary:

Get Wallet Detail

##### Description:

Retrieve details for a specific wallet owned by the authenticated user.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| wallet_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/currency/add

#### POST
##### Summary:

Add Currency

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/currencies

#### GET
##### Summary:

Get Supported Currencies

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/escrows/

#### POST
##### Summary:

Create Escrow

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/escrows/send

#### POST
##### Summary:

Create Email Phone Escrow

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/escrows/purchase

#### POST
##### Summary:

Create Purchase Escrow

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/escrows/{escrow_id}/fulfill-term

#### POST
##### Summary:

Fulfill Escrow Term

##### Description:

Fulfill an escrow term with support for both registered and unregistered users.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| escrow_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/escrows/{escrow_id}/fulfill-term-unregistered

#### POST
##### Summary:

Fulfill Escrow Term Unregistered

##### Description:

Fulfill an escrow term for unregistered users with comprehensive audit logging.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| escrow_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/escrows/{escrow_id}/release

#### POST
##### Summary:

Release Escrow Funds

##### Description:

Release escrow funds with comprehensive audit logging.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| escrow_id | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/escrows/{escrow_id}/reverse

#### POST
##### Summary:

Reverse Escrow

##### Description:

Reverse an escrow transaction.
Only allowed if the escrow has reached its expiry date and terms allow reversal.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| escrow_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/escrows/sent/

#### GET
##### Summary:

List Sent Escrows

##### Description:

Lists escrows sent by the current user.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| status | query | Filter escrows by status (e.g., pending, completed) | No |  |
| page | query | Page number | No | integer |
| limit | query | Number of escrows per page | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/escrows/received/

#### GET
##### Summary:

List Received Escrows

##### Description:

Lists escrows received by the current user.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| status | query | Filter escrows by status (e.g., pending, completed) | No |  |
| page | query | Page number | No | integer |
| limit | query | Number of escrows per page | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/escrows/{escrow_id}

#### GET
##### Summary:

Get Escrow

##### Description:

Retrieve details for a specific escrow.
Users can only view escrows where they are the sender or receiver.
Supports both registered and unregistered users.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| escrow_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/transfers

#### POST
##### Summary:

Create Transfer

##### Description:

Create a transfer to registered or unregistered user

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Wallet Transfers

##### Description:

List transfers for current user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| transfer_type | query |  | No |  |
| status | query |  | No |  |
| start_date | query |  | No |  |
| end_date | query |  | No |  |
| currency | query |  | No |  |
| limit | query |  | No | integer |
| offset | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/transfers/{transfer_id}

#### GET
##### Summary:

Get Transfer Detail

##### Description:

Get detailed information about a specific transfer

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| transfer_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/deposits

#### POST
##### Summary:

Create Deposit

##### Description:

Create deposit for registered users

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Wallet Deposits

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| status | query |  | No |  |
| start_date | query |  | No |  |
| end_date | query |  | No |  |
| currency | query |  | No |  |
| payment_method | query |  | No |  |
| limit | query |  | No | integer |
| offset | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/deposits/{deposit_id}

#### GET
##### Summary:

Get Deposit Detail

##### Description:

Get detailed information about a specific deposit

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| deposit_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/withdrawals

#### POST
##### Summary:

Create Withdrawal

##### Description:

Create withdrawal for registered or unregistered users

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| mfa_code | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Withdrawals

##### Description:

List withdrawals for user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| status | query |  | No |  |
| start_date | query |  | No |  |
| end_date | query |  | No |  |
| currency | query |  | No |  |
| payment_method | query |  | No |  |
| limit | query |  | No | integer |
| offset | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/withdrawals/{withdrawal_id}

#### GET
##### Summary:

Get Withdrawal Detail

##### Description:

Get detailed information about a specific withdrawal

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| withdrawal_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/transactions

#### GET
##### Summary:

List Wallet Transactions

##### Description:

Get transaction history for user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| transaction_type | query |  | No |  |
| start_date | query |  | No |  |
| end_date | query |  | No |  |
| status | query |  | No |  |
| currency | query |  | No |  |
| limit | query |  | No | integer |
| offset | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /wallet/bulk-escrows/

#### POST
##### Summary:

Create Bulk Escrow Payment

##### Description:

Create bulk escrow payments with comprehensive audit logging.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /payments/payments

#### POST
##### Summary:

Create Payment

##### Description:

Create a payment between users or to external users

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Payments

##### Description:

List payments for current user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| payment_type | query |  | No |  |
| status | query |  | No |  |
| limit | query |  | No | integer |
| offset | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /payments/payment-requests/create

#### POST
##### Summary:

Create Payment Request

##### Description:

Create a new payment request

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /payments/payment-requests/{request_id}/pay

#### POST
##### Summary:

Pay Payment Request

##### Description:

Pay a specific payment request

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| request_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /payments/payments/qr/{qr_token}

#### POST
##### Summary:

Pay With Qr

##### Description:

Process payment using QR code

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| qr_token | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /payments/payment-requests

#### GET
##### Summary:

List Payment Requests

##### Description:

List payment requests for current user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| status | query |  | No |  |
| limit | query |  | No | integer |
| offset | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /payments/payment-requests/received

#### GET
##### Summary:

List Received Payment Requests

##### Description:

List payment requests where the current user is the recipient or an allowed payer.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| status | query | Filter by status (default: pending) | No |  |
| limit | query |  | No | integer |
| offset | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /payments/payment-requests/{request_id}

#### GET
##### Summary:

Get Payment Request Details

##### Description:

Get detailed information about a payment request

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| request_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /payments/payments/{payment_id}

#### GET
##### Summary:

Get Payment Details

##### Description:

Get detailed information about a payment

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| payment_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /chain_payments/payment-chains

#### POST
##### Summary:

Initiate Payment Chain

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /chain_payments/products/authenticate

#### POST
##### Summary:

Authenticate Product

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| code | query |  | Yes | string |
| code_type | query |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /chain_payments/payment-chains/{chain_id}/add-participant

#### POST
##### Summary:

Add Chain Participant

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| chain_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /chain_payments/payment-chains/{chain_id}/remove-participant

#### POST
##### Summary:

Remove Chain Participant

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| chain_id | path |  | Yes | string (uuid) |
| user_id | query |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /chain_payments/payment-chains/{chain_id}/update-participant

#### POST
##### Summary:

Update Chain Participant

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| chain_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /chain_payments/manual-cash-transaction/

#### POST
##### Summary:

Record Manual Cash Transaction

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| product_id | query |  | Yes | string (uuid) |
| amount | query |  | Yes |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /chain_payments/debts/

#### GET
##### Summary:

Get User Debts

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /chain_payments/debts/{debt_id}/pay

#### POST
##### Summary:

Pay Debt

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| debt_id | path |  | Yes | string (uuid) |
| amount | query |  | Yes |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/authorize

#### GET
##### Summary:

Authorize

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| merchant_id | query |  | Yes | string |
| external_user_id | query |  | Yes | string |
| redirect_uri | query |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/token

#### POST
##### Summary:

Token

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| grant_type | query |  | Yes | string |
| code | query |  | Yes | string |
| redirect_uri | query |  | Yes | string |
| client_id | query |  | Yes | string |
| client_secret | query |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/escrows/

#### POST
##### Summary:

Create Escrow

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/escrows/{escrow_id}

#### GET
##### Summary:

Get Escrow

##### Description:

Get detailed escrow information including terms status

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| escrow_id | path |  | Yes | string (uuid) |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/escrows/{escrow_id}/release

#### POST
##### Summary:

Release Escrow

##### Description:

Release escrow funds with proper authentication and authorization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| escrow_id | path |  | Yes | string (uuid) |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/escrows/{escrow_id}/terms/{term_id}/fulfill

#### POST
##### Summary:

Fulfill Escrow Term External

##### Description:

External API endpoint for fulfilling escrow terms

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| escrow_id | path |  | Yes | string (uuid) |
| term_id | path |  | Yes | string (uuid) |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/escrows/{escrow_id}/reverse

#### POST
##### Summary:

Reverse Escrow

##### Description:

Reverse escrow with proper authentication and term validation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| escrow_id | path |  | Yes | string (uuid) |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/escrows/{escrow_id}/disputes

#### POST
##### Summary:

Initiate Dispute

##### Description:

Initiate a dispute for an escrow.

This endpoint allows merchants to initiate a dispute for an escrow payment.

- **escrow_id**: The ID of the escrow to dispute
- **reason**: The reason for initiating the dispute

Returns the details of the created dispute.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| escrow_id | path |  | Yes | string (uuid) |
| reason | query |  | Yes | string |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/request-otp

#### POST
##### Summary:

Request Otp

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/api/mtn/callback

#### POST
##### Summary:

Mtn Callback

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/payments/create

#### POST
##### Summary:

Create Payment

##### Description:

Create a direct payment with support for both internal and external flows

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| mfa_code | query |  | No |  |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/escrows/{escrow_id}/status

#### GET
##### Summary:

Get Escrow Status External

##### Description:

Get detailed status of an escrow for merchants

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| escrow_id | path |  | Yes | string (uuid) |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/payments/{payment_id}

#### GET
##### Summary:

Get Payment Details

##### Description:

Get detailed information about a payment including its status

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| payment_id | path |  | Yes | string (uuid) |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/merchant-payments

#### GET
##### Summary:

List Merchant Payments

##### Description:

List all payments for a merchant with optional filters

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| status | query | Filter by payment status | No |  |
| payment_method | query | Filter by payment method | No |  |
| from_date | query | Filter payments from date | No |  |
| to_date | query | Filter payments to date | No |  |
| limit | query |  | No | integer |
| offset | query |  | No | integer |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/disbursements

#### POST
##### Summary:

Create Disbursement

##### Description:

Create a new disbursement to multiple recipients.
This endpoint allows merchants to disburse funds to multiple recipients in a single request.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Disbursements

##### Description:

List all disbursements with optional filters

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| status | query |  | No |  |
| from_date | query |  | No |  |
| to_date | query |  | No |  |
| limit | query |  | No | integer |
| offset | query |  | No | integer |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/disbursements/{disbursement_id}

#### GET
##### Summary:

Get Disbursement

##### Description:

Get detailed disbursement status including individual recipient statuses

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| disbursement_id | path |  | Yes | string (uuid) |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/disbursements/{disbursement_id}/cancel

#### POST
##### Summary:

Cancel Disbursement

##### Description:

Cancel a pending disbursement

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| disbursement_id | path |  | Yes | string (uuid) |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/escrow-disbursements

#### POST
##### Summary:

Create Escrow Disbursement

##### Description:

Create a new escrow disbursement to multiple recipients with terms.

This endpoint allows merchants to create escrows with terms that recipients must fulfill.
Unlike regular disbursements which are direct payments, escrow disbursements create
escrows that require term fulfillment before funds are released.

Each recipient will get an escrow with the specified terms that they must fulfill
(e.g., location verification, photo upload, etc.) before receiving the funds.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Escrow Disbursements

##### Description:

List all escrow disbursements with optional filters

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| limit | query |  | No | integer |
| offset | query |  | No | integer |
| status | query |  | No |  |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/escrow-disbursements/{disbursement_id}

#### GET
##### Summary:

Get Escrow Disbursement

##### Description:

Get details of a specific escrow disbursement

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| disbursement_id | path |  | Yes | string (uuid) |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/escrow-disbursements/{disbursement_id}/cancel

#### POST
##### Summary:

Cancel Escrow Disbursement

##### Description:

Cancel an escrow disbursement if possible.

Note: This only cancels the disbursement record. Individual escrows that were
already created may need to be cancelled separately if they haven't been fulfilled.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| disbursement_id | path |  | Yes | string (uuid) |
| api-key | header |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/ecommerce/products

#### GET
##### Summary:

List Ecommerce Products

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| skip | query |  | No | integer |
| limit | query |  | No | integer |
| category_id | query |  | No |  |
| search | query |  | No |  |
| store_id | query |  | No |  |
| min_price | query |  | No |  |
| max_price | query |  | No |  |
| delivery_available | query |  | No |  |
| sort_by | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/promotions

#### POST
##### Summary:

Create Promotion

##### Description:

Create a new promotion

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Promotions

##### Description:

List store promotions

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | query |  | Yes | string (uuid) |
| active_only | query |  | No | boolean |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/promotions/{promotion_id}

#### PUT
##### Summary:

Update Promotion

##### Description:

Update promotion

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| promotion_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/ecommerce/cart/add

#### POST
##### Summary:

Add To Ecommerce Cart

##### Description:

Adds a product type and quantity to the user's ECOMMERCE cart.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/ecommerce/my-cart

#### GET
##### Summary:

Get my active ecommerce cart

##### Description:

Get the current user's active ecommerce cart. Creates one if none exists.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/ecommerce/carts/{cart_id}/details

#### GET
##### Summary:

Get ecommerce cart details

##### Description:

Get detailed information about an ecommerce cart including all items and totals.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| cart_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/ecommerce/cart/items/{item_id}

#### DELETE
##### Summary:

Remove From Ecommerce Cart

##### Description:

Remove item from ecommerce cart

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| item_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PUT
##### Summary:

Update Cart Item Quantity

##### Description:

Update quantity of ecommerce cart item

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| item_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/logistics/callback

#### POST
##### Summary:

Logistics Callback

##### Description:

Handle logistics provider callback

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/orders/{order_id}/fulfill

#### POST
##### Summary:

Fulfill Order Escrow

##### Description:

Fulfill escrow terms using delivery confirmation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| order_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/product-requests

#### POST
##### Summary:

Create Product Request

##### Description:

Create a new product request

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Product Requests

##### Description:

List product requests

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| status | query |  | No |  |
| skip | query |  | No | integer |
| limit | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/product-requests/{request_id}/offers

#### POST
##### Summary:

Create Escrow Product Offer

##### Description:

Create a new offer for a product request.

This endpoint allows a seller to make an offer for a product request.

- **request_id**: The ID of the product request.
- **offer_data**: The details of the offer.
- **current_user**: The authenticated seller creating the offer.

Returns the created offer details.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| request_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/product-requests/{request_id}/offers/{offer_id}/accept

#### POST
##### Summary:

Accept Escrow Product Offer

##### Description:

Accept a product offer and update the escrow.

This endpoint allows the requester to accept an offer. If the offer price is higher than the original escrow amount,
the user can top up the escrow.

- **request_id**: The ID of the product request.
- **offer_id**: The ID of the offer being accepted.
- **current_user**: The authenticated user accepting the offer.
- **payment_method_id**: Optional payment method ID for topping up the escrow if needed.

Returns the updated escrow details.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| request_id | path |  | Yes | string (uuid) |
| offer_id | path |  | Yes | string (uuid) |
| payment_method_id | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/product-requests/

#### POST
##### Summary:

Create Escrow Product Request

##### Description:

Create a new product request with an escrow.

This endpoint allows a user to create a request for a product they're looking for and create an escrow for the amount they're willing to pay.

- **request_data**: The details of the product request and escrow.
- **current_user**: The authenticated user creating the request.

Returns the created product request details, including the escrow ID.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/product-requests/{request_id}/fulfill

#### POST
##### Summary:

Fulfill Escrow Product Request

##### Description:

Fulfill escrow for a product request and mark corresponding inventory item(s) as sold.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| request_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/categories

#### GET
##### Summary:

List Categories

##### Description:

List all categories in a tree structure.
Returns a list of all top-level categories with their subcategories.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### POST
##### Summary:

Create Category

##### Description:

Create a new category (admin only).

- **category_data**: The details of the category to be created.
- **current_user**: The authenticated admin user.

Returns the created category details.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/categories/{category_id}

#### PUT
##### Summary:

Update Category

##### Description:

Update an existing category (admin only).

- **category_id**: The UUID of the category to update.
- **category_data**: The updated details of the category.
- **current_user**: The authenticated admin user.

Returns the updated category details.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| category_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Delete Category

##### Description:

Delete a category (admin only).

- **category_id**: The UUID of the category to delete.
- **current_user**: The authenticated admin user.

Returns no content on successful deletion.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| category_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 204 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

Get Category

##### Description:

Get details of a specific category, including its subcategories.

- **category_id**: The UUID of the category to retrieve.
- **current_user**: The authenticated user.

Returns the details of the specified category and its subcategories.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| category_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/categories/{category_id}/subcategories

#### GET
##### Summary:

Get Subcategories

##### Description:

Fetch direct subcategories of a given category.

- **category_id**: The UUID of the parent category.
- **current_user**: The authenticated user.

Returns a list of direct subcategories (children) for the specified category.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| category_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/categories/bulk

#### POST
##### Summary:

Bulk Create Categories

##### Description:

Bulk create categories

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PATCH
##### Summary:

Bulk Update Categories

##### Description:

Bulk update categories

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/categories/bulk-delete

#### POST
##### Summary:

Bulk Delete Categories

##### Description:

Bulk delete categories

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores

#### GET
##### Summary:

List Stores

##### Description:

List all stores owned by the user

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### POST
##### Summary:

Create Store

##### Description:

Create a new store with initial setup

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/staff

#### POST
##### Summary:

Add Store Staff

##### Description:

Add staff member to store

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Store Staff

##### Description:

List all staff members of a store

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/all-stores

#### GET
##### Summary:

List All Stores

##### Description:

List all stores in the system with pagination.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| page | query | Page number (1-indexed) | No | integer |
| size | query | Number of items per page (max 100) | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}

#### GET
##### Summary:

Get Store

##### Description:

Get store details

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PUT
##### Summary:

Update Store

##### Description:

Update store details

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Delete Store

##### Description:

Delete a store

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 204 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/staff/{staff_id}

#### PUT
##### Summary:

Update Store Staff

##### Description:

Update staff member role and permissions

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| staff_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Remove Store Staff

##### Description:

Remove staff member from store

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| staff_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 204 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/staff/{staff_account_id}

#### GET
##### Summary:

Get Store Staff Details

##### Description:

Fetches detailed information about a specific staff member of a store, including their permissions.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| staff_account_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/products

#### GET
##### Summary:

List Store Products

##### Description:

List products configured for a store, optionally filtered, with inventory counts.
Provides pagination and search capabilities.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| page | query |  | No | integer |
| limit | query |  | No | integer |
| search | query | Search term for product name or description | No |  |
| category_id | query | Filter by global Category ID | No |  |
| store_category_id | query | Filter by StoreProductCategory ID | No |  |
| in_stock_only | query | Only show products with items currently in stock | No | boolean |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/locations

#### POST
##### Summary:

Add Store Location

##### Description:

Add a new location to a store

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Store Locations

##### Description:

List all locations of a store

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/products/batch

#### POST
##### Summary:

Batch Add Products

##### Description:

Batch add products to a store and create initial inventory items.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/products/import

#### POST
##### Summary:

Import Products From File

##### Description:

Accepts a product import file (CSV/Excel), creates an initial import record,
and schedules a background task to process it. Returns the task ID for status checking.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/products/import/{task_id}/status

#### GET
##### Summary:

Check Product Import Status

##### Description:

Check status of product import task

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| task_id | path |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/products/scan

#### POST
##### Summary:

Scan And Add Product

##### Description:

STREAMLINED: Scans a product code and adds quantity to inventory.
- If product exists: Adds quantity to StoreInventory (quantity-based)
- If product doesn't exist: Creates product definition + inventory
- For high-value items: Creates individual InventoryItem records
- Same code scanned multiple times = increased quantity (real-world behavior)

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/products/scan-lookup

#### POST
##### Summary:

Scan Product Lookup

##### Description:

STREAMLINED: Look up a product by scanning its code without adding to inventory.
Returns product details if found, or suggestions for similar products.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| code | query |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/debug/generate-token-for-product

#### POST
##### Summary:

Debug Generate Token For Product

##### Description:

DEBUG: Generate and store a piaxe_token for a product.
This helps with the issue where quantity-based products don't have stored piaxe_tokens.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| product_code | query |  | Yes | string |
| store_id | query |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/debug/inventory-status/{product_code}

#### GET
##### Summary:

Debug Inventory Status

##### Description:

DEBUG: Check inventory status for a product in a store.
This helps debug the "Only 0 items available" issue.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| product_code | path |  | Yes | string |
| store_id | query |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/cart/add-by-scan

#### POST
##### Summary:

Add Product To Cart By Scan Streamlined

##### Description:

STREAMLINED: Add product to cart by scanning code - AUTO-CREATES CART!
No cart_id required - automatically gets or creates user's active cart.
Automatically detects store from piaxe_token if not provided.
Handles both quantity-based and individually tracked products.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| product_code | query |  | Yes | string |
| quantity | query |  | No | integer |
| store_id | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/carts/{cart_id}/add-by-scan

#### POST
##### Summary:

Add Product To Cart By Scan Legacy

##### Description:

LEGACY: Add product to cart by scanning code (requires store_id).
Use /carts/{cart_id}/add-by-scan instead for streamlined experience.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| cart_id | path |  | Yes | string (uuid) |
| product_code | query |  | Yes | string |
| quantity | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/inventory/bulk-update

#### POST
##### Summary:

Bulk Update Inventory

##### Description:

STREAMLINED: Bulk update inventory quantities for multiple products.
Supports both quantity-based and individually tracked products.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/inventory-items

#### GET
##### Summary:

List All Inventory Items in Store

##### Description:

Retrieves a paginated list of all inventory items associated with a specific store.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| page | query | Page number | No | integer |
| limit | query | Items per page | No | integer |
| status | query | Filter by item status (e.g., 'in_stock', 'sold') | No |  |
| product_id | query | Filter by specific product ID | No |  |
| location_id | query | Filter by specific store location ID | No |  |
| search_code | query | Search by external code or piaxe_token | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/products/{product_id}/inventory-items

#### GET
##### Summary:

List Inventory Items for a Specific Product in Store

##### Description:

Retrieves a paginated list of inventory items for a specific product within a store.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| product_id | path |  | Yes | string (uuid) |
| page | query | Page number | No | integer |
| limit | query | Items per page | No | integer |
| status | query | Filter by item status (e.g., 'in_stock', 'sold') | No |  |
| location_id | query | Filter by specific store location ID | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/inventory-items/{inventory_item_id}

#### GET
##### Summary:

Get Single Inventory Item Details

##### Description:

Retrieves detailed information about a specific inventory item within a store.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| inventory_item_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PUT
##### Summary:

Update Single Inventory Item

##### Description:

Updates details of a specific inventory item within a store. Use with caution for status changes.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| inventory_item_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Delete Single Inventory Item

##### Description:

Deletes a specific inventory item from a store. Fails if item is in certain statuses (e.g., sold, in active cart).

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| inventory_item_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 204 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/instore-cart/active

#### GET
##### Summary:

Get Active Instore Cart

##### Description:

Get user's active IN-STORE cart in the specified store

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/carts/{cart_id}/items/{inventory_item_id}

#### DELETE
##### Summary:

Remove Item From Physical Cart

##### Description:

Remove a specific InventoryItem from the physical store cart

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| cart_id | path |  | Yes | string (uuid) |
| inventory_item_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/carts/{cart_id}/verify

#### POST
##### Summary:

Verify Physical Cart

##### Description:

Verify physical cart contents by store staff or owner

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| cart_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/carts/by-id/{cart_id}

#### GET
##### Summary:

Scan Cart Code For Staff

##### Description:

Scan cart UUID to view contents (for staff or owner)

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| cart_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/carts/by-token/{cart_token}

#### GET
##### Summary:

Scan Cart Code

##### Description:

Get cart details by scanning its unique token (for staff/owner).

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| cart_token | path |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/instore-carts

#### GET
##### Summary:

List all physical (instore) carts for a store

##### Description:

Returns all instore carts for a store, filterable by status, user, etc.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| status | query | Filter by cart status | No |  |
| user_id | query | Filter by user ID | No |  |
| skip | query |  | No | integer |
| limit | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/my-carts

#### GET
##### Summary:

List all carts for the current user

##### Description:

Returns all carts for the current user, filterable by status, store, and type.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| status | query | Filter by cart status | No |  |
| store_id | query | Filter by store ID | No |  |
| cart_type | query | Filter by cart type (instore/ecommerce) | No |  |
| skip | query |  | No | integer |
| limit | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/carts/{cart_id}

#### GET
##### Summary:

Get cart details

##### Description:

Get details of a cart by its ID, including items and user.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| cart_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/verify/scan

#### POST
##### Summary:

Verify Scanned Inventory Item Status

##### Description:

Verify a scanned InventoryItem and check its status (in cart, sold, etc.)

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| identifier | query |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/carts/active

#### GET
##### Summary:

List Active Carts

##### Description:

List all active carts in the store (for staff)

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/carts/{cart_id}/notify

#### POST
##### Summary:

Notify Cart Owner

##### Description:

Send notification to cart owner

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| cart_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/cart/{cart_id}/checkout

#### POST
##### Summary:

Checkout Cart

##### Description:

Checkout cart (INSTORE or ECOMMERCE) and create orders.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| cart_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/carts/{cart_id}/share

#### POST
##### Summary:

Share Cart For Remote Payment

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| cart_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/shared-carts/{cart_token}/details

#### GET
##### Summary:

Get Shared Cart Details

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| cart_token | path |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/carts/me/shared

#### GET
##### Summary:

List My Shared Carts

##### Description:

Lists all carts shared by the currently authenticated user (User A).
Allows filtering by the status of the shared cart and cart type.
Now supports both INSTORE and ECOMMERCE shared carts.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| status_filter | query | Filter by shared cart status (e.g., shared_pending_payment, shared_expired) | No |  |
| cart_type_filter | query | Filter by cart type (INSTORE or ECOMMERCE) | No |  |
| page | query |  | No | integer |
| limit | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/shared-carts/{cart_token}/pay

#### POST
##### Summary:

Pay For Shared Cart

##### Description:

Pay for shared INSTORE cart

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| cart_token | path |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/shared-ecommerce-carts/{cart_token}/pay

#### POST
##### Summary:

Pay For Shared Ecommerce Cart

##### Description:

Pay for shared ECOMMERCE cart

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| cart_token | path |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/pay/request/{request_id}

#### POST
##### Summary:

Pay Product Request Flow

##### Description:

Pay for a product payment request. Handles coupons, loyalty points,
and updates InventoryItem status *if* specific items can be identified.

NOTE: This endpoint assumes the PaymentRequest was for specific quantities of
product *types*. Identifying *which* specific InventoryItems are being sold
at this stage is problematic unless linked via a Cart or similar mechanism.
The current implementation decrements stock based on count, which is less ideal
with InventoryItem tracking. Consider linking PaymentRequest to a Cart instead.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| request_id | path |  | Yes | string (uuid) |
| qr_token | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/coupons

#### POST
##### Summary:

Create Store Coupon

##### Description:

Create store coupon

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Store Coupons

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| skip | query |  | No | integer |
| limit | query |  | No | integer |
| is_active | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/loyalty-program

#### POST
##### Summary:

Create Loyalty Program

##### Description:

Create or update store loyalty program

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PUT
##### Summary:

Update Store Loyalty Program

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

Get Store Loyalty Program

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/shares

#### POST
##### Summary:

Create Product Share

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Store Product Shares

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| page | query |  | No | integer |
| limit | query |  | No | integer |
| is_active | query | Filter by active status | No |  |
| sharer_id | query | Filter by sharer (user ID) | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/shared/items/{share_code}

#### GET
##### Summary:

Get Shared Product Details

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| share_code | path |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/shares/{share_id}

#### PUT
##### Summary:

Update Product Share

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| share_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Delete Product Share

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| share_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 204 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/shared/items/{share_code}/purchase

#### POST
##### Summary:

Purchase Shared Product

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| share_code | path |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/shared/products/orders/{order_id}/fulfill

#### POST
##### Summary:

Fulfill Shared Product Escrow

##### Description:

Fulfill escrow for shared product purchase

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| order_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/products/{product_id}

#### GET
##### Summary:

Get Store-Specific Product Details

##### Description:

Retrieves detailed information about a product within the context of a specific store, including store price and inventory count.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| product_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PUT
##### Summary:

Update Store-Specific Product Details

##### Description:

Updates core product information and the store-specific price for a product within a store.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| product_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Remove Product from Store

##### Description:

Removes the association of a product with a specific store by deleting its store-specific price. Fails if inventory exists for this product in the store.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| product_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 204 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/stores/{store_id}/coupons/{coupon_id}

#### GET
##### Summary:

Get Store Coupon Detail

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| coupon_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PUT
##### Summary:

Update Store Coupon

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |
| coupon_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /shopping_and_inventory/users/me/loyalty-points

#### GET
##### Summary:

Get My Loyalty Points

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/contacts

#### POST
##### Summary:

Create Contact

##### Description:

Create a new contact with proper validation and error handling

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Contacts

##### Description:

List contacts with pagination and filtering

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| page | query | Page number | No | integer |
| limit | query | Items per page | No | integer |
| search | query | Search term for name, email, or company | No |  |
| contact_type | query | Filter by contact type | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/contacts/{contact_id}

#### GET
##### Summary:

Get Contact

##### Description:

Get a specific contact with detailed information

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| contact_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PUT
##### Summary:

Update Contact

##### Description:

Update a contact with proper validation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| contact_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Delete Contact

##### Description:

Delete a contact

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| contact_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/appointments

#### POST
##### Summary:

Create Appointment

##### Description:

Create a new appointment with proper validation

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Appointments

##### Description:

List appointments with pagination and filtering

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| page | query | Page number | No | integer |
| limit | query | Items per page | No | integer |
| start_date | query | Filter appointments from this date | No |  |
| end_date | query | Filter appointments until this date | No |  |
| search | query | Search appointments by description or contact name | No |  |
| contact_id | query | Filter by specific contact | No |  |
| appointment_type | query | Filter by appointment type | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/appointments/{appointment_id}

#### GET
##### Summary:

Get Appointment

##### Description:

Get a specific appointment with detailed information

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| appointment_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PUT
##### Summary:

Update Appointment

##### Description:

Update an appointment with proper validation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| appointment_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Delete Appointment

##### Description:

Delete an appointment

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| appointment_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/financial-categories

#### POST
##### Summary:

Create Financial Category

##### Description:

Create a new financial category with proper validation

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Financial Categories

##### Description:

List financial categories with optional filtering

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| category_type | query | Filter by category type | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/financial-categories/{category_id}

#### GET
##### Summary:

Get Financial Category

##### Description:

Get a specific financial category with detailed information

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| category_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PUT
##### Summary:

Update Financial Category

##### Description:

Update a financial category with proper validation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| category_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Delete Financial Category

##### Description:

Delete a financial category

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| category_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/events

#### POST
##### Summary:

Create Event

##### Description:

Create a new event with proper validation

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Events

##### Description:

List events with pagination and filtering

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| page | query |  | No | integer |
| limit | query |  | No | integer |
| start_date | query |  | No | dateTime |
| end_date | query |  | No | dateTime |
| search | query | Search events by title or description | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/events/{event_id}

#### GET
##### Summary:

Get Event

##### Description:

Get a specific event

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| event_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PUT
##### Summary:

Update Event

##### Description:

Update an event with proper validation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| event_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Delete Event

##### Description:

Delete an event

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| event_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/reminders

#### POST
##### Summary:

Create Reminder

##### Description:

Create a new reminder with proper validation

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Reminders

##### Description:

List reminders with pagination and filtering

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| page | query |  | No | integer |
| limit | query |  | No | integer |
| sent | query |  | No | boolean |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/reminders/{reminder_id}

#### PUT
##### Summary:

Update Reminder

##### Description:

Update a reminder with proper validation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| reminder_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Delete Reminder

##### Description:

Delete a reminder

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| reminder_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PATCH
##### Summary:

Update Reminder

##### Description:

Update reminder settings

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| reminder_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/templates

#### POST
##### Summary:

Create Message Template

##### Description:

Create a new message template with proper validation

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Message Templates

##### Description:

List message templates

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| template_type | query |  | No | [CommunicationType](#communicationtype) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/templates/{template_id}

#### GET
##### Summary:

Get Message Template

##### Description:

Get a specific message template

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| template_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PUT
##### Summary:

Update Message Template

##### Description:

Update a message template with proper validation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| template_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Delete Message Template

##### Description:

Delete a message template

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| template_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/documents

#### POST
##### Summary:

Create Document

##### Description:

Create a new document with proper validation

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Documents

##### Description:

List documents with pagination and filtering

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| page | query |  | No | integer |
| limit | query |  | No | integer |
| document_type | query |  | No | string |
| contact_id | query |  | No | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/documents/{document_id}

#### GET
##### Summary:

Get Document

##### Description:

Get a specific document

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| document_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PUT
##### Summary:

Update Document

##### Description:

Update a document with proper validation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| document_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Delete Document

##### Description:

Delete a document

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| document_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/contacts/import

#### POST
##### Summary:

Import Contacts

##### Description:

Import contacts with status tracking

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/financial/import

#### POST
##### Summary:

Import Financial Records

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/appointments/import

#### POST
##### Summary:

Import Appointments

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/interactions/import

#### POST
##### Summary:

Import Interactions

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/interactions

#### POST
##### Summary:

Create Interaction

##### Description:

Create an interaction with AI analysis and follow-up suggestions

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Interactions

##### Description:

List interactions with optional filtering

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| skip | query |  | No | integer |
| limit | query |  | No | integer |
| contact_id | query |  | No |  |
| interaction_type | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/interactions/{interaction_id}/followups

#### GET
##### Summary:

Get Interaction Followups

##### Description:

Get AI-generated follow-up suggestions for an interaction

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| interaction_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/financial/entry

#### POST
##### Summary:

Create Financial Entry

##### Description:

Create a single financial entry

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/financial/entries/bulk

#### POST
##### Summary:

Create Bulk Financial Entries

##### Description:

Create multiple financial entries in bulk

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/financial/export

#### GET
##### Summary:

Export Financial Data

##### Description:

Export financial data with security and filtering

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| format | query |  | No | string |
| start_date | query |  | No | dateTime |
| end_date | query |  | No | dateTime |
| type | query |  | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/import/{task_id}/status

#### GET
##### Summary:

Check Import Status

##### Description:

Check the status of an import task

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| task_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/recommendations/{recommendation_id}/feedback

#### POST
##### Summary:

Provide Recommendation Feedback

##### Description:

Provide feedback on an AI recommendation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| recommendation_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/recommendations/analytics

#### GET
##### Summary:

Get Recommendation Analytics

##### Description:

Get analytics for AI recommendations

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| start_date | query |  | No |  |
| end_date | query |  | No |  |
| recommendation_type | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/events/{event_id}/reminders

#### POST
##### Summary:

Create Event Reminder

##### Description:

Create a reminder for an event

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| event_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

Get Event Reminders

##### Description:

Get all reminders for an event

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| event_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/reports/financial

#### GET
##### Summary:

Get Financial Report

##### Description:

Get financial report with various format options

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| start_date | query |  | Yes | dateTime |
| end_date | query |  | Yes | dateTime |
| report_type | query |  | No | string |
| categories | query |  | No |  |
| format | query |  | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/reports/customer-analysis

#### GET
##### Summary:

Get Customer Analysis

##### Description:

Get customer analysis report

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| start_date | query |  | Yes | dateTime |
| end_date | query |  | Yes | dateTime |
| segment | query |  | No |  |
| format | query |  | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/reports/product-performance

#### GET
##### Summary:

Get Product Performance

##### Description:

Get comprehensive product performance analysis for all products or by category

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| start_date | query |  | Yes | dateTime |
| end_date | query |  | Yes | dateTime |
| category | query |  | No |  |
| format | query |  | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/reports/product-performance/{product_id}

#### GET
##### Summary:

Get Specific Product Performance

##### Description:

Get detailed performance analysis for a specific product

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| product_id | path |  | Yes | string (uuid) |
| start_date | query |  | Yes | dateTime |
| end_date | query |  | Yes | dateTime |
| format | query |  | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/shops/{shop_id}/inventory

#### GET
##### Summary:

Get Inventory Report

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| shop_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/analytics/visualization/customer-insights

#### GET
##### Summary:

Get Customer Visualization Data

##### Description:

Get customer data formatted for visualization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| start_date | query |  | Yes | dateTime |
| end_date | query |  | Yes | dateTime |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/analytics/visualization/product-insights

#### GET
##### Summary:

Get Product Visualization Data

##### Description:

Get product data formatted for visualization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| start_date | query |  | Yes | dateTime |
| end_date | query |  | Yes | dateTime |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns

#### GET
##### Summary:

List Campaigns

##### Description:

List all campaigns with comprehensive filtering and analytics.

This endpoint provides powerful campaign management capabilities with detailed
performance metrics and assessment data for marketing teams.

**Key Features:**
- **Advanced Filtering**: Filter by type, status, date ranges, recipient counts
- **Performance Metrics**: Delivery rates, engagement rates, ROI analysis
- **A/B Testing Support**: Dedicated filtering for A/B test campaigns
- **Cost Analysis**: Track campaign costs and cost-per-engagement
- **Search Capabilities**: Full-text search across campaign names and descriptions

**Filtering Options:**
- **Campaign Type**: email, sms, voice, multi_channel
- **Status**: draft, scheduled, active, completed, paused
- **Date Range**: Filter by campaign start dates
- **Recipient Count**: Filter by audience size
- **Performance**: Filter by delivery rate thresholds
- **A/B Testing**: Show only campaigns with A/B tests enabled

**Assessment Metrics Included:**
- **Delivery Rate**: Percentage of successfully delivered messages
- **Engagement Rate**: Combined opens, clicks, and responses rate
- **Total Cost**: Complete campaign cost breakdown
- **Cost Per Engagement**: ROI efficiency metric
- **A/B Test Results**: Performance comparison data (if applicable)

**Use Cases:**
- **Campaign Dashboard**: Overview of all marketing activities
- **Performance Analysis**: Identify top-performing campaigns
- **Budget Tracking**: Monitor campaign costs and ROI
- **A/B Test Management**: Track test campaigns and results
- **Team Reporting**: Generate campaign performance reports

**Example Response:**
```json
{
    "campaigns": [
        {
            "id": "uuid",
            "name": "Black Friday Email Campaign",
            "campaign_type": "email",
            "status": "completed",
            "total_recipients": 10000,
            "successful_deliveries": 9850,
            "summary": {
                "delivery_rate": 98.5,
                "engagement_rate": 25.3,
                "total_cost": "125.50",
                "cost_per_engagement": "0.49",
                "roi": 450.2
            }
        }
    ]
}
```

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| page | query | Page number | No | integer |
| limit | query | Items per page | No | integer |
| search | query | Search campaigns by name or description | No |  |
| campaign_type | query | Filter by campaign type (email, sms, voice) | No |  |
| status | query | Filter by status (draft, scheduled, active, completed, paused) | No |  |
| start_date_from | query | Filter campaigns starting from this date | No |  |
| start_date_to | query | Filter campaigns starting before this date | No |  |
| ab_test_only | query | Show only A/B test campaigns | No | boolean |
| min_recipients | query | Minimum number of recipients | No |  |
| max_recipients | query | Maximum number of recipients | No |  |
| min_delivery_rate | query | Minimum delivery rate percentage | No |  |
| sort_by | query | Sort field | No | string |
| sort_order | query | Sort order | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/templates

#### GET
##### Summary:

Get Campaign Templates

##### Description:

Get available campaign templates

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| campaign_type | query | Filter by campaign type | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### POST
##### Summary:

Create Campaign Template

##### Description:

Create a new campaign template

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/estimate-cost

#### POST
##### Summary:

Estimate Campaign Cost

##### Description:

Estimate campaign cost before creation

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/{campaign_id}

#### GET
##### Summary:

Get Campaign

##### Description:

Get individual campaign details

Returns comprehensive campaign information including basic details,
metrics, and current status.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| campaign_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/{campaign_id}/summary

#### GET
##### Summary:

Get Campaign Summary Analytics

##### Description:

📈 **Campaign Summary Analytics** (formerly /analytics)

**Purpose:** High-level campaign performance overview
**Use Cases:**
- Dashboard widgets
- Campaign list summaries
- Quick performance checks
- Management reporting

**Data Source:** Aggregated analytics from CampaignAnalytics model
**Performance:** Fast - pre-computed metrics

**Best For:** When you need quick insights without detailed breakdowns

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| campaign_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/{campaign_id}/actions

#### POST
##### Summary:

Campaign Action

##### Description:

⚡ **Campaign Lifecycle Management**

**NEW FEATURE** - Manage campaign lifecycle with advanced actions

**Available Actions:**
- **PAUSE**: Stop pending sends, preserve analytics
- **RESUME**: Continue from where it left off
- **DUPLICATE**: Create exact copy with new name

**Features:**
- ✅ Audit trail for all actions
- ✅ Reason tracking for decisions
- ✅ Analytics preservation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| campaign_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/{campaign_id}/comprehensive-analytics

#### GET
##### Summary:

Get Campaign Comprehensive Analytics

##### Description:

🔍 **Campaign Comprehensive Analytics** (detailed recipient-level data)

**Purpose:** Deep-dive campaign performance analysis
**Use Cases:**
- Detailed performance optimization
- A/B test statistical analysis
- Recipient behavior analysis
- Delivery troubleshooting
- Advanced reporting and insights

**Data Source:** Real-time data from CampaignRecipient model
**Performance:** Slower - computed on demand from individual records
**Update Frequency:** Real-time

**Returns:**
- Detailed delivery breakdown by status and timeline
- Individual recipient engagement patterns
- Device and geographic analysis
- Statistical A/B test results with significance
- Performance trends (hourly/daily)
- Sample recipient records

**Best For:** When you need detailed insights for optimization and analysis

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| campaign_id | path |  | Yes | string (uuid) |
| include_samples | query | Include recipient samples | No | boolean |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/{campaign_id}/ab-test-results

#### GET
##### Summary:

Get Ab Test Results Enhanced

##### Description:

🧪 **Enhanced A/B Test Results with Statistical Significance**

**New Features:**
- ✅ Statistical significance testing (two-proportion z-test)
- ✅ Confidence level calculation
- ✅ P-value analysis
- ✅ Automatic winner determination
- ✅ Sample size validation
- ✅ Test duration tracking
- ✅ Actionable recommendations

**Statistical Methods:**
- Uses two-proportion z-test for conversion rate comparison
- 95% confidence threshold for significance (p < 0.05)
- Accounts for sample size and effect size
- Provides clear recommendations for decision making

**Returns:**
- Detailed performance metrics for each variant
- Statistical significance indicator
- Confidence level and p-value
- Winner determination (if significant)
- Sample size and test duration
- Actionable recommendation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| campaign_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/documents/{document_id}/data

#### GET
##### Summary:

Get Document Data

##### Description:

Get document data for UI rendering

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| document_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/stores/{store_id}/documents/templates

#### POST
##### Summary:

Save Document Template

##### Description:

Save custom document template

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| store_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/{campaign_id}/email-analytics

#### GET
##### Summary:

Get Email Campaign Analytics Endpoint

##### Description:

Get detailed email campaign analytics

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| campaign_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/email

#### POST
##### Summary:

Create Email Campaign

##### Description:

Create new email campaign with flexible recipient validation

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/optimal-send-time

#### GET
##### Summary:

Get Optimal Send Time

##### Description:

Get optimal send time based on historical data

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| campaign_id | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/sms

#### POST
##### Summary:

Create Sms Campaign

##### Description:

Create new SMS campaign with flexible recipient validation

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/voice

#### POST
##### Summary:

Create Voice Campaign

##### Description:

Create new voice campaign with flexible recipient validation

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/{campaign_id}/schedule

#### POST
##### Summary:

Schedule Campaign Endpoint

##### Description:

📅 **Schedule Campaign Endpoint**

Schedule a campaign for future execution using the existing schedule_campaign utility function.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| campaign_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/{campaign_id}/cost/deduct

#### POST
##### Summary:

Deduct Campaign Cost Endpoint

##### Description:

💰 **Deduct Campaign Cost Endpoint**

Deduct the campaign cost from user's wallet using the existing deduct_campaign_cost utility function.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| campaign_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/export/csv

#### GET
##### Summary:

Export Campaigns Csv

##### Description:

📊 **Export Campaigns to CSV**

Export all user campaigns to CSV format using existing utility functions.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/export/excel

#### GET
##### Summary:

Export Campaigns Excel

##### Description:

📊 **Export Campaigns to Excel**

Export all user campaigns to Excel format with enhanced formatting and charts.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/campaigns/{campaign_id}/followup/generate

#### POST
##### Summary:

Generate Campaign Followup

##### Description:

🤖 **Generate Campaign Followup**

Generate AI-powered followup suggestions for campaign recipients using existing utility functions.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| campaign_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/leads

#### POST
##### Summary:

Create Lead

##### Description:

Create a new lead/prospect

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

List Leads

##### Description:

Retrieve a paginated list of leads with advanced filtering options.

This endpoint provides comprehensive lead listing with powerful filtering capabilities
for sales teams to manage their pipeline effectively.

**Filtering Options:**
- **Source**: Where the lead came from (website, referral, social media, etc.)
- **Status**: Current lead status (active, converted, disqualified, etc.)
- **Stage**: Position in sales pipeline (new, contacted, qualified, etc.)
- **Priority**: Urgency level (low, medium, high, urgent)
- **Quality**: Lead temperature (hot, warm, cold, unqualified)
- **Assignment**: Filter by responsible salesperson
- **Score Range**: Filter by calculated lead score (0-100)

**Use Cases:**
- Sales dashboard: Get high-priority, high-score leads
- Team management: View leads assigned to specific team members
- Pipeline analysis: Filter by stage to see conversion bottlenecks
- Lead qualification: Focus on unqualified leads needing attention

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| skip | query |  | No | integer |
| limit | query |  | No | integer |
| status | query |  | No |  |
| pipeline_stage | query |  | No |  |
| quality | query |  | No |  |
| assigned_to_id | query |  | No |  |
| source | query |  | No |  |
| min_score | query |  | No |  |
| max_score | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/leads/{lead_id}

#### GET
##### Summary:

Get Lead

##### Description:

Get a specific lead by ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| lead_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### PUT
##### Summary:

Update Lead

##### Description:

Update a lead

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| lead_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### DELETE
##### Summary:

Delete Lead

##### Description:

Delete a lead

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| lead_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/leads/fuzzy-search

#### POST
##### Summary:

Fuzzy Search Prospects

##### Description:

Perform intelligent fuzzy search across contacts and leads.

This endpoint uses advanced fuzzy matching algorithms to find contacts and leads
even when search terms don't exactly match the stored data. Perfect for when
you remember partial information about a prospect.

**Key Features:**
- **Fuzzy Matching**: Finds matches even with typos or partial names
- **Multi-field Search**: Searches across name, company, email, phone, etc.
- **Relevance Scoring**: Results ranked by match confidence (0-100)
- **Entity Type Filtering**: Search only contacts, only leads, or both
- **Search Analytics**: Tracks searches for optimization

**Search Examples:**
- "john smith" → matches "Jon Smith", "John Smyth", "J. Smith"
- "acme corp" → matches "ACME Corporation", "Acme Corp.", "acme-corp.com"
- "555-1234" → matches phone numbers with different formatting

**Use Cases:**
- Quick prospect lookup during calls
- Duplicate detection before creating new leads
- Sales team collaboration and handoffs
- CRM data cleanup and deduplication

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/leads/search/suggestions

#### GET
##### Summary:

Get Search Suggestions Endpoint

##### Description:

Get search suggestions based on partial query

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| query | query |  | Yes | string |
| limit | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/leads/{lead_id}/activities

#### GET
##### Summary:

Get Lead Activities

##### Description:

Get activities for a specific lead

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| lead_id | path |  | Yes | string (uuid) |
| skip | query |  | No | integer |
| limit | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### POST
##### Summary:

Create Lead Activity

##### Description:

Create a new activity for a lead

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| lead_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/leads/{lead_id}/stage

#### PUT
##### Summary:

Update Lead Pipeline Stage

##### Description:

Move a lead to a different stage in the sales pipeline.

Pipeline stages represent the progression of a lead through your sales process.
This endpoint handles stage transitions with automatic history tracking and
analytics calculation.

**Standard Pipeline Flow:**
1. **new_lead** → Just entered the system
2. **contacted** → Initial outreach made
3. **qualified** → Meets basic criteria (budget, authority, need, timeline)
4. **proposal_sent** → Formal proposal or quote provided
5. **negotiation** → Terms being discussed
6. **closed_won** → Deal successfully closed
7. **closed_lost** → Deal lost to competitor or no decision
8. **follow_up** → Requires future follow-up
9. **nurturing** → In automated nurturing sequence

**Automatic Tracking:**
- Stage transition history with timestamps
- Time spent in each stage (for analytics)
- User who made the change
- Optional notes for context

**Analytics Benefits:**
- Conversion rates between stages
- Average time in each stage
- Pipeline velocity metrics
- Bottleneck identification

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| lead_id | path |  | Yes | string (uuid) |
| new_stage | query |  | Yes | [PipelineStage](#pipelinestage) |
| notes | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/leads/{lead_id}/convert

#### POST
##### Summary:

Convert Lead To Customer Endpoint

##### Description:

Convert a qualified lead into a paying customer.

This is the ultimate goal of lead management - converting prospects into customers.
The conversion process updates the lead status, records the deal value, and triggers
various business processes.

**Conversion Process:**
1. Lead status changed to 'converted'
2. Pipeline stage set to 'closed_won'
3. Conversion value recorded for ROI analysis
4. Contact type updated to 'customer'
5. Conversion timestamp recorded
6. Activity log updated

**Business Impact:**
- **Revenue Tracking**: Records actual deal value
- **ROI Calculation**: Measures marketing/sales effectiveness
- **Customer Onboarding**: Can trigger welcome sequences
- **Team Notifications**: Alerts relevant team members
- **Analytics**: Updates conversion rate metrics

**Post-Conversion:**
- Lead becomes a customer record
- Can be linked to orders and invoices
- Enters customer lifecycle management
- Historical lead data preserved for analysis

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| lead_id | path |  | Yes | string (uuid) |
| conversion_value | query |  | No |  |
| notes | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/analytics/pipeline

#### GET
##### Summary:

Get Pipeline Analytics Endpoint

##### Description:

Get comprehensive sales pipeline analytics and metrics.

This endpoint provides deep insights into your sales pipeline performance,
helping sales managers optimize their processes and identify opportunities.

**Key Metrics Included:**

**Pipeline Health:**
- Total leads by stage
- Conversion rates between stages
- Average time spent in each stage
- Pipeline velocity (speed of deals moving through)

**Performance Analytics:**
- Total pipeline value
- Weighted pipeline value (probability-adjusted)
- Conversion rate from lead to customer
- Average deal size
- Win/loss ratios

**Trend Analysis:**
- Pipeline growth over time
- Stage-by-stage performance trends
- Seasonal patterns
- Lead source effectiveness

**Team Performance:**
- Individual rep performance
- Lead assignment distribution
- Activity levels by team member

**Use Cases:**
- Sales forecasting and planning
- Process optimization
- Team performance reviews
- Revenue projections
- Bottleneck identification

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| start_date | query |  | No |  |
| end_date | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/leads/bulk-operations

#### POST
##### Summary:

Perform Bulk Lead Operations

##### Description:

Perform bulk operations on multiple leads simultaneously.

This endpoint allows sales managers to efficiently manage large numbers of leads
by applying operations to multiple records at once, saving time and ensuring
consistency.

**Supported Operations:**

**1. Bulk Assignment** (`"assign"`):
- Assign multiple leads to specific sales rep
- Great for load balancing and territory management
- Automatically updates lead ownership

**2. Bulk Stage Update** (`"update_stage"`):
- Move multiple leads to same pipeline stage
- Useful after marketing campaigns or events
- Maintains stage history for each lead

**3. Bulk Status Update** (`"update_status"`):
- Change status of multiple leads (active, disqualified, etc.)
- Perfect for cleaning up old or invalid leads
- Preserves audit trail

**4. Bulk Delete** (`"delete"`):
- Remove multiple leads from system
- Use with caution - action is permanent
- Consider changing status instead

**Request Format:**
```json
{
    "operation": "assign",
    "lead_ids": ["uuid1", "uuid2", "uuid3"],
    "assigned_to_id": "user_uuid",
    "new_stage": "contacted",
    "new_status": "active"
}
```

**Response Format:**
```json
{
    "results": [
        {"lead_id": "uuid1", "status": "success"},
        {"lead_id": "uuid2", "status": "error", "error": "Lead not found"}
    ],
    "total_processed": 3
}
```

**Use Cases:**
- Territory redistribution
- Post-event lead processing
- Data cleanup operations
- Campaign result management

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/leads/import

#### POST
##### Summary:

Import Leads

##### Description:

Import leads from CSV or Excel files for bulk lead creation.

This endpoint enables rapid lead import from external sources like trade shows,
marketing campaigns, or data providers. Supports both CSV and Excel formats
with intelligent data mapping.

**Supported File Formats:**
- **CSV**: Comma-separated values (most common)
- **Excel**: .xlsx and .xls formats
- **Encoding**: UTF-8 recommended for special characters

**Required Columns:**
- `name`: Contact's full name (required)
- `email`: Email address (recommended)
- `company`: Company name (optional but valuable)

**Optional Columns:**
- `phone`: Phone number
- `address`: Mailing address
- `source`: Lead source (website, referral, etc.)
- `industry`: Business industry
- `company_size`: Number of employees
- `annual_revenue`: Company revenue range
- `website`: Company website URL
- `budget_range`: Expected budget
- `decision_timeline`: When they plan to buy

**Data Processing:**
1. **Validation**: Checks required fields and data formats
2. **Deduplication**: Prevents duplicate contacts (by email)
3. **Enrichment**: Automatically calculates lead scores
4. **Classification**: Sets appropriate lead quality and priority

**Response Information:**
- Number of successful imports
- Number of failed imports with reasons
- First 10 error details for troubleshooting
- Overall import statistics

**Best Practices:**
- Include header row with column names
- Use consistent data formats
- Clean data before import (remove duplicates, fix formatting)
- Test with small batch first
- Review failed imports and fix data issues

**Example CSV Format:**
```csv
name,email,company,phone,source,industry
John Smith,john@acme.com,Acme Corp,555-1234,website,technology
Jane Doe,jane@beta.com,Beta Inc,555-5678,referral,healthcare
```

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /crm/nurturing-sequences

#### GET
##### Summary:

List Nurturing Sequences

##### Description:

List all automated lead nurturing sequences.

Lead nurturing sequences are automated workflows that guide prospects through
your sales funnel with timely, relevant communications. They help maintain
engagement with leads who aren't ready to buy immediately.

**What are Nurturing Sequences?**
Automated series of touchpoints (emails, calls, content) designed to:
- Educate prospects about your solution
- Build trust and credibility
- Address common objections
- Keep your brand top-of-mind
- Move leads through the pipeline

**Example Sequence Flow:**
1. **Day 1**: Welcome email with valuable resource
2. **Day 3**: Educational content about industry challenges
3. **Day 7**: Case study showing success stories
4. **Day 14**: Product demo invitation
5. **Day 21**: Limited-time offer or consultation

**Trigger Conditions Examples:**
- Lead score reaches certain threshold
- Specific lead source (e.g., webinar attendees)
- Pipeline stage changes
- Inactivity periods
- Industry or company size criteria

**Benefits:**
- Automatic lead nurturing without manual effort
- Consistent messaging and follow-up
- Improved conversion rates
- Better lead qualification
- Scalable sales processes

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### POST
##### Summary:

Create Nurturing Sequence

##### Description:

Create a new automated lead nurturing sequence.

Design and implement automated workflows that nurture leads through personalized,
timely communications. This is one of the most powerful features for scaling
your sales process.

**Sequence Components:**

**1. Trigger Conditions** (when to start the sequence):
```json
{
    "lead_score_min": 50,
    "lead_sources": ["website", "webinar"],
    "industry": ["technology", "healthcare"],
    "company_size": ["50-200"],
    "pipeline_stage": ["new_lead", "contacted"]
}
```

**2. Sequence Steps** (what happens and when):
```json
[
    {
        "step": 1,
        "delay_days": 0,
        "action_type": "email",
        "template_id": "welcome_email",
        "subject": "Welcome! Here's your free guide",
        "conditions": {}
    },
    {
        "step": 2,
        "delay_days": 3,
        "action_type": "email",
        "template_id": "educational_content",
        "subject": "3 common challenges in your industry",
        "conditions": {"engagement_score": "> 30"}
    }
]
```

**Action Types Available:**
- **Email**: Automated email campaigns
- **Task**: Create tasks for sales reps
- **Call**: Schedule follow-up calls
- **Note**: Add notes to lead record
- **Stage_Change**: Move to different pipeline stage
- **Score_Update**: Adjust lead score

**Advanced Features:**
- **Conditional Logic**: Different paths based on lead behavior
- **A/B Testing**: Test different messages/timing
- **Dynamic Content**: Personalize based on lead data
- **Exit Conditions**: Stop sequence based on actions
- **Re-engagement**: Re-enter leads who become inactive

**Best Practices:**
- Start with value-driven content
- Gradually increase sales focus
- Include multiple touchpoint types
- Test and optimize regularly
- Respect unsubscribe preferences

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/constitution/vote

#### POST
##### Summary:

Vote On Constitution

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/constitution

#### GET
##### Summary:

Get Group Constitution

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups

#### POST
##### Summary:

Create Group

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/membership-requests

#### POST
##### Summary:

Create Membership Request

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/transactions

#### POST
##### Summary:

Create Transaction

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

Get Group Transactions

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |
| skip | query |  | No | integer |
| limit | query |  | No | integer |
| transaction_type | query |  | No |  |
| start_date | query |  | No |  |
| end_date | query |  | No |  |
| min_amount | query |  | No |  |
| max_amount | query |  | No |  |
| sort_by | query |  | No |  |
| sort_order | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/transactions/{transaction_id}/votes

#### POST
##### Summary:

Vote On Transaction

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| transaction_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/delegations

#### POST
##### Summary:

Create Delegation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

Get Group Delegations

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |
| skip | query |  | No | integer |
| limit | query |  | No | integer |
| status | query |  | No |  |
| sort_by | query |  | No |  |
| sort_order | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/change-requests

#### POST
##### Summary:

Create Change Request

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

Get Group Change Requests

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |
| skip | query |  | No | integer |
| limit | query |  | No | integer |
| status | query |  | No |  |
| sort_by | query |  | No |  |
| sort_order | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/change-requests/{change_request_id}/votes

#### POST
##### Summary:

Vote On Change Request

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| change_request_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/goals

#### POST
##### Summary:

Create Goal

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

Get Group Goals

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |
| skip | query |  | No | integer |
| limit | query |  | No | integer |
| status | query |  | No |  |
| sort_by | query |  | No |  |
| sort_order | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/withdrawals

#### POST
##### Summary:

Create Withdrawal Request

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/projects

#### POST
##### Summary:

Create Project

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

Get Group Projects

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |
| skip | query |  | No | integer |
| limit | query |  | No | integer |
| status | query |  | No |  |
| sort_by | query |  | No |  |
| sort_order | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/projects/{project_id}/contributions

#### POST
##### Summary:

Create Project Contribution

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| project_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/projects/{project_id}/votes

#### POST
##### Summary:

Vote On Project

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| project_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}

#### GET
##### Summary:

Get Group Details

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/members

#### GET
##### Summary:

Get Group Members

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |
| skip | query |  | No | integer |
| limit | query |  | No | integer |
| search | query |  | No |  |
| sort_by | query |  | No |  |
| sort_order | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/statistics

#### GET
##### Summary:

Get Group Statistics

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |
| time_range | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/member-contributions

#### GET
##### Summary:

Get Member Contributions

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |
| skip | query |  | No | integer |
| limit | query |  | No | integer |
| start_date | query |  | No |  |
| end_date | query |  | No |  |
| sort_by | query |  | No |  |
| sort_order | query |  | No |  |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/upcoming-goals

#### GET
##### Summary:

Get Upcoming Goals

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |
| days_ahead | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/member-activity

#### GET
##### Summary:

Get Member Activity

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |
| days_back | query |  | No | integer |
| skip | query |  | No | integer |
| limit | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/financial-summary

#### GET
##### Summary:

Get Financial Summary

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |
| time_range | query |  | No | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/invite

#### POST
##### Summary:

Invite Member

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/invitations/{invitation_id}

#### GET
##### Summary:

Get Invitation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| invitation_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/reminders

#### POST
##### Summary:

Create Reminder

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

#### GET
##### Summary:

Get Group Reminders

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /saccosavings/groups/{group_id}/deposits

#### POST
##### Summary:

Create Deposit

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| group_id | path |  | Yes | string (uuid) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /security/device-fingerprint

#### POST
##### Summary:

Generate Device Fingerprint

##### Description:

Generate a device fingerprint for the current request.

This endpoint collects device characteristics to create a unique identifier
for fraud detection and security purposes.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /security/fraud-analysis

#### POST
##### Summary:

Perform Fraud Analysis

##### Description:

Perform fraud analysis on a transaction.

This endpoint analyzes transaction data along with device fingerprint
and user behavior to assess fraud risk.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /security/security-status

#### GET
##### Summary:

Get Security Status

##### Description:

Get the current status of security services.

This endpoint provides information about the availability and health
of security components.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /security/risk-assessment/{transaction_id}

#### GET
##### Summary:

Get Risk Assessment

##### Description:

Get the risk assessment for a specific transaction.

This endpoint retrieves the fraud analysis results for a transaction
that has already been processed.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| transaction_id | path |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /monitoring/metrics

#### GET
##### Summary:

Get Metrics

##### Description:

Prometheus metrics endpoint with authentication.
Returns application metrics in Prometheus format.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /monitoring/health/detailed

#### GET
##### Summary:

Detailed Health Check

##### Description:

Detailed health check with authentication.
Provides comprehensive system health information.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /monitoring/system/stats

#### GET
##### Summary:

Get System Stats

##### Description:

Get comprehensive system statistics.
Requires monitoring authentication.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /monitoring/auth/token

#### POST
##### Summary:

Get Monitoring Token

##### Description:

Generate a monitoring access token.
Requires basic authentication.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /monitoring/audit/recent

#### GET
##### Summary:

Get Recent Audit Events

##### Description:

Get recent audit events for security monitoring.
Requires monitoring authentication.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| limit | query |  | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |
| 422 | Validation Error |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /health

#### GET
##### Summary:

Health Check

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /api/imagekit-auth

#### GET
##### Summary:

Get Imagekit Auth

##### Description:

Returns the ImageKit authentication parameters:
  {
    token: str,
    expire: int,
    signature: str
  }

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### /debug/ip

#### GET
##### Summary:

Debug Ip

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successful Response |

##### Security

| Security Schema | Scopes |
| --- | --- |
| BearerAuth | |

### Models


#### ABTestResults

Enhanced A/B test results with statistical significance

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| variant_performance | object |  | Yes |
| winner |  |  | No |
| confidence_level | number |  | Yes |
| statistical_significance | boolean |  | Yes |
| p_value | number |  | Yes |
| sample_size | integer |  | Yes |
| test_duration_hours | number |  | Yes |
| recommendation | string |  | Yes |

#### AccountType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| AccountType | string |  |  |

#### ActivationRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| email | string |  | Yes |
| otp | string |  | Yes |

#### ApiAccessSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| api_pin | integer |  | Yes |

#### ApiEscrowCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| receiver_id | string (uuid) |  | Yes |
| amount |  |  | Yes |
| currency_code | string |  | Yes |
| payment_method | [PaymentMethodEnum](#paymentmethodenum) |  | Yes |
| terms | [ [TermData](#termdata) ] |  | Yes |
| external_user_id |  |  | No |
| user_info |  |  | No |
| user_location |  |  | No |

#### ApiEscrowResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| amount | string |  | Yes |
| currency_code | string |  | Yes |
| status | string |  | Yes |
| payment_method | string |  | Yes |
| sender_id |  |  | Yes |
| receiver_id |  |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |
| terms | [ object ] |  | Yes |
| products |  |  | No |
| location |  |  | No |
| required_actions |  |  | No |
| external_user_id |  |  | No |

#### ApiPaymentCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| amount |  |  | Yes |
| currency | string |  | Yes |
| payment_method | string |  | Yes |
| recipient_id |  |  | No |
| user_info |  |  | No |
| products |  |  | No |

#### ApiTermFulfillmentSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| term_id | string (uuid) |  | Yes |
| term_type | string |  | Yes |
| data | object |  | Yes |
| user_info |  |  | No |

#### AppointmentCreate

Schema for creating an appointment

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id |  | Optional custom appointment ID | No |
| contact_id |  | Associated contact ID | No |
| type | [AppointmentType](#appointmenttype) |  | Yes |
| date_time | dateTime | Appointment date and time | Yes |
| description | string | Appointment description | No |

#### AppointmentListResponse

Schema for appointment list responses

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| appointments | [ [AppointmentResponse](#appointmentresponse) ] |  | Yes |
| pagination | [PaginationResponse](#paginationresponse) |  | Yes |

#### AppointmentResponse

Schema for appointment responses

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| type | [AppointmentType](#appointmenttype) |  | Yes |
| date_time | dateTime |  | Yes |
| description | string |  | Yes |
| contact |  |  | No |
| reminders |  |  | No |

#### AppointmentType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| AppointmentType | string |  |  |

#### AppointmentUpdate

Schema for updating an appointment

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| contact_id |  |  | No |
| type |  |  | No |
| date_time |  |  | No |
| description |  |  | No |

#### BatchAddProductResultItem

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| index | integer |  | Yes |
| status | string |  | Yes |
| action |  |  | No |
| product_id |  |  | No |
| product_name |  |  | No |
| piaxe_token_generated |  |  | No |
| message |  |  | No |
| original_data |  |  | No |

#### BatchAddProductsResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string |  | Yes |
| results | [ [BatchAddProductResultItem](#batchaddproductresultitem) ] |  | Yes |
| total_submitted | integer |  | Yes |
| successful_count | integer |  | Yes |
| failed_count | integer |  | Yes |
| inventory_items_scheduled | integer |  | Yes |

#### Body_change_pin_users_change_pin_put

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| old_pin | [ApiAccessSchema](#apiaccessschema) |  | Yes |
| new_pin | [ApiAccessSchema](#apiaccessschema) |  | Yes |

#### Body_import_appointments_crm_appointments_import_post

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| file | binary |  | Yes |

#### Body_import_contacts_crm_contacts_import_post

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| file | binary |  | Yes |

#### Body_import_financial_records_crm_financial_import_post

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| file | binary |  | Yes |

#### Body_import_interactions_crm_interactions_import_post

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| file | binary |  | Yes |

#### Body_import_leads_crm_leads_import_post

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| file | binary |  | Yes |

#### Body_import_products_from_file_shopping_and_inventory_stores__store_id__products_import_post

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| file | binary |  | Yes |

#### Body_notify_cart_owner_shopping_and_inventory_stores__store_id__carts__cart_id__notify_post

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string |  | Yes |
| notification_type | string |  | No |

#### Body_refresh_access_token_users_refresh_post

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| refresh_token | string |  | Yes |

#### Body_update_merchant_users_merchant_put

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| business_name | string |  | No |
| email | string |  | No |
| phone | string |  | No |
| address | string |  | No |
| website | string |  | No |
| business_type | [BusinessType](#businesstype) |  | No |
| avatar | binary |  | No |

#### Body_update_user_users_users_me_put

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| first_name | string |  | No |
| last_name | string |  | No |
| username | string |  | No |
| email | string |  | No |
| phone_number | string |  | No |
| avatar | binary |  | No |

#### Body_verify_merchant_users_verify_merchant_post

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| country | string |  | Yes |
| business_registration | binary |  | Yes |
| tax_document | binary |  | Yes |
| director_id | binary |  | Yes |
| business_license |  |  | No |
| additional_documents |  |  | No |

#### Body_verify_user_users_verify_user_post

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| country | string | Country code (e.g., US, UK) | Yes |
| id_or_passport_document | binary |  | Yes |
| self_photo | binary |  | Yes |
| video_document |  |  | No |
| additional_documents |  |  | No |

#### BulkEscrowPaymentRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| receivers | [  ] |  | Yes |
| amount_per_receiver |  |  | Yes |
| currency_code | string |  | Yes |
| terms | [ object ] |  | Yes |
| payment_method | string |  | Yes |
| products |  |  | No |
| user_location |  |  | No |

#### BulkFinancialEntryCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| entries | [ [FinancialEntryCreate](#financialentrycreate) ] |  | Yes |

#### BulkInventoryUpdate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| product_id | string (uuid) |  | Yes |
| quantity_to_add | integer | Quantity to add to inventory | Yes |
| cost_per_unit |  |  | No |
| location_id |  |  | No |

#### BulkInventoryUpdateRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| updates | [ [BulkInventoryUpdate](#bulkinventoryupdate) ] |  | Yes |

#### BulkLeadOperation

Bulk operations on leads

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| lead_ids | [ string (uuid) ] | List of lead IDs | Yes |
| operation | string | Operation type (assign, stage_change, delete) | Yes |
| operation_data | object | Operation-specific data | No |

#### BusinessType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| BusinessType | string |  |  |

#### CRM__schemas__ReminderCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| event_id | string (uuid) |  | Yes |
| notification_type | string |  | Yes |
| minutes_before | integer |  | No |
| message |  |  | No |

#### CRM__schemas__ReminderResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| event_id | string (uuid) |  | Yes |
| send_at | dateTime |  | Yes |
| notification_type | string |  | Yes |
| sent | boolean |  | Yes |
| created_at | dateTime |  | Yes |

#### CampaignAction

Schema for campaign actions (pause/resume/duplicate)

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| action | string |  | Yes |
| reason |  |  | No |

#### CampaignComprehensiveAnalytics

Campaign Comprehensive Analytics (detailed recipient-level data)

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| campaign_id | string (uuid) |  | Yes |
| campaign_name | string |  | Yes |
| delivery_breakdown | object |  | Yes |
| delivery_timeline | object |  | Yes |
| delivery_issues | [ object ] |  | Yes |
| engagement_patterns | object |  | Yes |
| device_breakdown | object |  | Yes |
| geographic_breakdown | object |  | Yes |
| time_to_engagement | object |  | Yes |
| ab_test_details |  |  | No |
| recipient_samples | [ object ] |  | Yes |
| hourly_performance | [ object ] |  | Yes |
| daily_performance | [ object ] |  | Yes |

#### CampaignListItem

Campaign list item with essential details and summary metrics

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| name | string |  | Yes |
| description |  |  | Yes |
| campaign_type | string |  | Yes |
| status | string |  | Yes |
| start_date | dateTime |  | Yes |
| end_date |  |  | Yes |
| total_recipients | integer |  | Yes |
| successful_deliveries | integer |  | Yes |
| ab_test_enabled | boolean |  | Yes |
| created_by | string |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |
| summary | [CampaignSummary](#campaignsummary) |  | Yes |

#### CampaignListResponse

Campaign list response with pagination and filtering info

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| campaigns | [ [CampaignListItem](#campaignlistitem) ] |  | Yes |
| pagination | [PaginationResponse](#paginationresponse) |  | Yes |
| filters_applied |  |  | No |

#### CampaignResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| name | string |  | Yes |
| description |  |  | Yes |
| campaign_type | string |  | Yes |
| status | string |  | Yes |
| start_date | dateTime |  | Yes |
| end_date |  |  | Yes |
| ab_test_enabled | boolean |  | Yes |
| total_recipients | integer |  | Yes |
| successful_deliveries | integer |  | Yes |
| opens | integer |  | Yes |
| clicks | integer |  | Yes |
| conversions | integer |  | Yes |
| created_by | string |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |
| metrics |  |  | No |
| cost |  |  | No |
| ab_test_results |  |  | No |

#### CampaignSchedule

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| schedule_type | [CampaignScheduleType](#campaignscheduletype) |  | Yes |
| start_date | dateTime |  | Yes |
| end_date |  |  | Yes |
| recurring_pattern |  |  | No |
| timezone | string |  | No |

#### CampaignScheduleType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| CampaignScheduleType | string |  |  |

#### CampaignSummary

Campaign summary for list responses with key metrics

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| delivery_rate | number |  | Yes |
| engagement_rate | number |  | Yes |
| total_cost | string |  | Yes |
| cost_per_engagement |  |  | No |
| roi |  |  | No |

#### CampaignSummaryAnalytics

Campaign Summary Analytics (renamed from basic analytics)

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| campaign_id | string (uuid) |  | Yes |
| campaign_name | string |  | Yes |
| campaign_type | string |  | Yes |
| status | string |  | Yes |
| total_recipients | integer |  | Yes |
| successful_deliveries | integer |  | Yes |
| failed_deliveries | integer |  | Yes |
| delivery_rate | number |  | Yes |
| total_opens | integer |  | Yes |
| total_clicks | integer |  | Yes |
| total_unsubscribes | integer |  | Yes |
| engagement_rate | number |  | Yes |
| total_cost | string |  | Yes |
| cost_per_delivery | string |  | Yes |
| cost_per_engagement | string |  | Yes |
| currency | string |  | Yes |
| ab_test_enabled | boolean |  | Yes |
| ab_test_winner |  |  | No |
| ab_test_confidence |  |  | No |
| created_at | dateTime |  | Yes |
| last_updated | dateTime |  | Yes |

#### CartCheckoutCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| payment_type | string | 'direct' or 'escrow' | Yes |
| payment_method | string |  | Yes |
| user_info |  | Specific details required by the payment_method, e.g., {'phone_number': '...'} | No |
| currency | string |  | Yes |
| shipping_address_id |  | ID of the selected shipping address for e-commerce orders | No |
| escrow_terms |  | Required if payment_type is 'escrow' | No |
| notes |  |  | No |
| coupon_code |  | Coupon code to apply at checkout | No |
| redeem_loyalty_points |  | Number of loyalty points the user wishes to redeem | No |
| mfa_code |  | MFA code if required for the transaction | No |

#### CartInventoryItemResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| piaxe_token | string |  | Yes |
| external_code |  |  | No |
| product_id | string (uuid) |  | Yes |
| product_name | string |  | Yes |
| currency | string |  | Yes |
| price | string |  | Yes |

#### CartResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| user_id | string (uuid) |  | Yes |
| store_id |  |  | No |
| cart_type | [CartTypeEnum](#carttypeenum) |  | Yes |
| status | string |  | Yes |
| piaxe_token |  |  | No |
| inventory_items |  |  | No |
| ecommerce_items |  |  | No |
| total_amount | string |  | Yes |
| verified_by |  |  | No |
| verification_time |  |  | No |
| notification_message |  |  | No |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |

#### CartStatus

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| CartStatus | string |  |  |

#### CartType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| CartType | string |  |  |

#### CartTypeEnum

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| CartTypeEnum | string |  |  |

#### CartVerificationCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| verification_note |  |  | No |

#### CartVerificationResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| cart_id | string (uuid) |  | Yes |
| verified_by | string (uuid) |  | Yes |
| verification_time | dateTime |  | Yes |
| verification_note |  |  | Yes |
| status | string |  | Yes |

#### CategoryBulkCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| categories | [ [CategoryCreate](#categorycreate) ] |  | Yes |

#### CategoryBulkDelete

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| category_ids | [ string (uuid) ] |  | Yes |
| move_products_to |  |  | No |

#### CategoryBulkUpdate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| updates | [ [CategoryBulkUpdateItem](#categorybulkupdateitem) ] |  | Yes |

#### CategoryBulkUpdateItem

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name |  |  | No |
| description |  |  | No |
| parent_id |  |  | No |
| is_active |  |  | No |
| id | string (uuid) |  | Yes |

#### CategoryCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| description |  |  | No |
| parent_id |  |  | No |
| store_id |  |  | No |
| is_active |  |  | No |

#### CategoryResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| description |  |  | No |
| parent_id |  |  | No |
| store_id |  |  | No |
| is_active |  |  | No |
| id | string (uuid) |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |

#### CategoryTree

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| description |  |  | No |
| parent_id |  |  | No |
| store_id |  |  | No |
| is_active |  |  | No |
| id | string (uuid) |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |
| subcategories | [ [CategoryTree](#categorytree) ] |  | No |

#### CategoryUpdate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name |  |  | No |
| description |  |  | No |
| parent_id |  |  | No |
| is_active |  |  | No |

#### ChangeRequestCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| group_id | string (uuid) |  | Yes |
| field_name | string |  | Yes |
| proposed_value |  |  | Yes |

#### ChangeRequestResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| field_name | string |  | Yes |
| current_value |  |  | Yes |
| proposed_value |  |  | Yes |
| initiator_id | string (uuid) |  | Yes |
| initiator_username | string |  | Yes |
| approved | boolean |  | Yes |
| created_at | dateTime |  | Yes |

#### ChangeRoleRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| role | [UserRole](#userrole) |  | Yes |

#### ChangeRoleResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string |  | Yes |

#### CheckoutResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string |  | Yes |
| orders | [ string (uuid) ] |  | Yes |
| escrows |  |  | No |
| delivery_request_id |  |  | No |

#### CodeType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| CodeType | string |  |  |

#### CommitmentPeriod

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| CommitmentPeriod | string |  |  |

#### CommunicationType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| CommunicationType | string |  |  |

#### ConstitutionField

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| ConstitutionField | string |  |  |

#### ConstitutionVoteCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| change_request_id | string (uuid) |  | Yes |
| approved | boolean |  | Yes |

#### ConstitutionVotingCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| field | [ConstitutionField](#constitutionfield) |  | Yes |
| value |  |  | Yes |

#### ConstitutionVotingResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| group_id | string (uuid) |  | Yes |
| field | [ConstitutionField](#constitutionfield) |  | Yes |
| value |  |  | Yes |
| votes_count | integer |  | Yes |
| created_at | dateTime |  | Yes |
| closed_at |  |  | Yes |

#### ContactCreate

Schema for creating a new contact

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Contact name | Yes |
| type | [ContactType](#contacttype) | Contact type | No |
| company |  | Company name | No |
| email |  | Email address | No |
| phone |  | Phone number | No |
| address |  | Physical address | No |
| gender |  | Gender for AI personalization | No |
| age |  | Age for AI personalization | No |
| segment_tags | [ string ] | Segmentation tags | No |

#### ContactListResponse

Schema for contact list responses

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| contacts | [ [ContactResponse](#contactresponse) ] |  | Yes |
| pagination | [PaginationResponse](#paginationresponse) |  | Yes |

#### ContactResponse

Schema for contact responses

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| name | string |  | Yes |
| type | [ContactType](#contacttype) |  | Yes |
| company |  |  | No |
| email |  |  | No |
| phone |  |  | No |
| address |  |  | No |
| gender |  |  | No |
| age |  |  | No |
| segment_tags | [ string ] |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |
| summary |  |  | No |

#### ContactSummary

Contact summary for list responses

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| total_interactions | integer |  | Yes |
| total_spent | string |  | Yes |
| last_interaction |  |  | No |

#### ContactType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| ContactType | string |  |  |

#### ContactUpdate

Schema for updating a contact

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name |  |  | No |
| type |  |  | No |
| company |  |  | No |
| email |  |  | No |
| phone |  |  | No |
| address |  |  | No |
| gender |  |  | No |
| age |  |  | No |
| segment_tags |  |  | No |

#### CouponCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string |  | Yes |
| type | [CouponType](#coupontype) |  | Yes |
| value |  |  | Yes |
| valid_from | dateTime |  | Yes |
| valid_until | dateTime |  | Yes |
| product_ids |  |  | No |
| usage_limit |  |  | No |
| description |  |  | No |
| is_active | boolean |  | No |

#### CouponResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| code | string |  | Yes |
| coupon_type | string |  | Yes |
| value | string |  | Yes |
| valid_from | dateTime |  | Yes |
| valid_until | dateTime |  | Yes |
| usage_limit |  |  | Yes |
| times_used | integer |  | Yes |
| is_active | boolean |  | Yes |
| products | [ object ] |  | Yes |
| description |  |  | No |
| store_id | string (uuid) |  | Yes |
| created_at | dateTime |  | Yes |

#### CouponType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| CouponType | string |  |  |

#### CouponUpdate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code |  |  | No |
| coupon_type |  |  | No |
| value |  |  | No |
| valid_from |  |  | No |
| valid_until |  |  | No |
| usage_limit |  |  | No |
| user_usage_limit |  |  | No |
| description |  |  | No |
| is_active |  |  | No |
| applies_to_all_products |  |  | No |
| product_ids |  |  | No |
| min_purchase_amount |  |  | No |

#### CreateCurrencyRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string |  | Yes |
| name | string |  | Yes |
| symbol | string |  | Yes |
| is_fiat | boolean |  | Yes |
| is_crypto | boolean |  | Yes |
| exchange_rate |  |  | Yes |

#### CreateGroupRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| initial_constitution | [GroupConstitutionCreate](#groupconstitutioncreate) |  | Yes |

#### CreateWalletRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| currency_code | string |  | Yes |

#### CurrencyResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string |  | Yes |
| name | string |  | Yes |
| symbol | string |  | Yes |
| is_fiat | boolean |  | Yes |
| is_crypto | boolean |  | Yes |
| exchange_rate | string |  | Yes |
| updated_at | dateTime |  | Yes |

#### DelegationCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| group_id | string (uuid) |  | Yes |
| delegate_to_id | string (uuid) |  | Yes |

#### DelegationResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| member_id | string (uuid) |  | Yes |
| member_username | string |  | Yes |
| delegate_to_id | string (uuid) |  | Yes |
| delegate_to_username | string |  | Yes |
| active | boolean |  | Yes |
| created_at | dateTime |  | Yes |

#### DeliveryZoneInfo-Input

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| price |  |  | No |
| currency |  |  | No |
| estimated_time_minutes |  |  | No |
| details |  |  | No |

#### DeliveryZoneInfo-Output

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| price |  |  | No |
| currency |  |  | No |
| estimated_time_minutes |  |  | No |
| details |  |  | No |

#### DepositDetailResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| wallet_id | string (uuid) |  | Yes |
| amount | string |  | Yes |
| wallet_amount | string |  | Yes |
| currency | string |  | Yes |
| wallet_currency | string |  | Yes |
| payment_method | string |  | Yes |
| transaction_id | string |  | Yes |
| status | string |  | Yes |
| created_at | dateTime |  | Yes |
| user_type | string |  | Yes |
| payment_details |  |  | Yes |
| transaction_data |  |  | Yes |
| user_info |  |  | Yes |
| status_history |  |  | Yes |

#### DepositListItem

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| wallet_id | string (uuid) |  | Yes |
| amount | string |  | Yes |
| wallet_amount | string |  | Yes |
| currency | string |  | Yes |
| wallet_currency | string |  | Yes |
| payment_method | string |  | Yes |
| transaction_id | string |  | Yes |
| status | string |  | Yes |
| created_at | dateTime |  | Yes |
| user_type | string |  | Yes |

#### DepositListResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| items | [ [DepositListItem](#depositlistitem) ] |  | Yes |
| total | integer |  | Yes |
| offset | integer |  | Yes |
| limit | integer |  | Yes |

#### DepositResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| wallet_id | string (uuid) |  | Yes |
| amount | string |  | Yes |
| wallet_amount | string |  | Yes |
| currency | string |  | Yes |
| wallet_currency | string |  | Yes |
| payment_method | string |  | Yes |
| transaction_id | string |  | Yes |
| status | string |  | Yes |
| created_at | dateTime |  | Yes |
| user_type | string |  | Yes |

#### DetailedBulkPaymentResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| status | string |  | Yes |
| escrows | [ string ] |  | Yes |
| total_amount | string |  | Yes |
| successful_receivers | integer |  | Yes |
| failed_receivers | integer |  | Yes |
| failed_receiver_details | [ [FailedReceiver](#failedreceiver) ] |  | Yes |

#### DeviceFingerprintRequest

Request model for device fingerprinting.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| screen |  |  | No |
| timezone |  |  | No |
| plugins |  |  | No |
| features |  |  | No |
| canvas |  |  | No |
| webgl |  |  | No |

#### DeviceFingerprintResponse

Response model for device fingerprinting.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| fingerprint_hash |  |  | Yes |
| fingerprint_data | object |  | Yes |
| timestamp | string |  | Yes |
| version | string |  | Yes |
| error |  |  | No |

#### DisbursementCancellation

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| reason |  |  | No |

#### DisbursementCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| recipients | [ [DisbursementRecipient](#disbursementrecipient) ] |  | Yes |
| currency | string |  | Yes |
| payment_method | [PaymentMethodEnum](#paymentmethodenum) |  | Yes |
| description |  |  | No |

#### DisbursementDetailResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| disbursement_id | string (uuid) |  | Yes |
| status | string |  | Yes |
| total_amount | string |  | Yes |
| currency | string |  | Yes |
| payment_method | string |  | Yes |
| description |  |  | Yes |
| created_at | dateTime |  | Yes |
| completed_at |  |  | Yes |
| cancelled_at |  |  | Yes |
| cancellation_reason |  |  | Yes |
| items | [ object ] |  | Yes |

#### DisbursementListResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| total | integer |  | Yes |
| offset | integer |  | Yes |
| limit | integer |  | Yes |
| results | [ [DisbursementResponse](#disbursementresponse) ] |  | Yes |

#### DisbursementRecipient

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| recipient_id |  |  | No |
| email |  |  | No |
| phone_number |  |  | No |
| amount |  |  | Yes |
| reference |  |  | No |

#### DisbursementResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| disbursement_id | string (uuid) |  | Yes |
| status | string |  | Yes |
| total_amount | string |  | Yes |
| currency | string |  | Yes |
| recipient_count | integer |  | Yes |
| successful_count | integer |  | Yes |
| failed_count | integer |  | Yes |
| pending_count | integer |  | Yes |

#### DisbursementStatus

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| DisbursementStatus | string |  |  |

#### DocumentCreate

Schema for creating a document

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| number | string | Document number (e.g., INV-2025-001) | Yes |
| type | [DocumentType](#documenttype) | Document type | Yes |
| date | dateTime | Document date | Yes |
| currency | string | Currency code | No |
| subtotal |  | Document subtotal | No |
| tax_amount |  | Tax amount | No |
| total |  | Total amount | No |
| contact_id |  | Associated contact ID | No |
| notes |  | Document notes | No |
| terms |  | Document terms | No |
| due_date |  | Due date | No |
| valid_until |  | Valid until date | No |
| reference_number |  | Reference number | No |
| tags | [ string ] | Document tags | No |

#### DocumentTemplateCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| document_type | [DocumentType](#documenttype) |  | Yes |
| template_type | [DocumentTemplateType](#documenttemplatetype) |  | Yes |
| layout | object |  | Yes |
| style | object |  | Yes |
| print | object |  | Yes |

#### DocumentTemplateType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| DocumentTemplateType | string |  |  |

#### DocumentType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| DocumentType | string |  |  |

#### DocumentUpdate

Schema for updating a document

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name |  |  | No |
| type |  |  | No |
| content |  |  | No |
| file_path |  |  | No |
| contact_id |  |  | No |

#### DocumentUploadStatus

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| DocumentUploadStatus | string |  |  |

#### EcommerceCartAddItem

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| product_id | string (uuid) |  | Yes |
| quantity | integer |  | No |

#### EcommerceCartItemResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| product_id | string (uuid) |  | Yes |
| product_name | string |  | Yes |
| product_description |  |  | No |
| currency | string |  | Yes |
| quantity | integer |  | Yes |
| unit_price | string |  | Yes |
| total_price | string |  | Yes |
| added_at | dateTime |  | Yes |
| product_image |  |  | No |

#### EcommerceCartResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| cart_type | string |  | Yes |
| status | string |  | Yes |
| total_amount | string |  | Yes |
| currency | string |  | Yes |
| items | [ [EcommerceCartItemResponse](#ecommercecartitemresponse) ] |  | Yes |
| user_id | string (uuid) |  | Yes |
| stores_summary | [ object ] |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |

#### EcommerceProductResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| name | string |  | Yes |
| description | string |  | Yes |
| price | string |  | Yes |
| current_price | string |  | Yes |
| currency | string |  | Yes |
| current_stock | integer | Current available stock across all store locations | Yes |
| requires_individual_tracking | boolean | Whether items need individual tracking | Yes |
| piaxe_token |  | Token for easy cart operations (encodes store_id) | Yes |
| product_code |  | Primary identification code (barcode/qr/sku) | Yes |
| images | [ string ] |  | Yes |
| store | object |  | Yes |
| category |  |  | Yes |
| rating |  |  | Yes |
| total_reviews | integer |  | Yes |
| delivery_enabled | boolean |  | Yes |
| delivery_options | object |  | Yes |
| specifications |  |  | Yes |
| variants |  |  | Yes |
| is_active | boolean |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |

#### EmailCampaignCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| description |  |  | Yes |
| recipients | [  ] | List of contact IDs, emails, or phone numbers | Yes |
| content | string |  | Yes |
| currency | string |  | Yes |
| features | [ string ] |  | No |
| email_settings | [EmailSettings](#emailsettings) |  | Yes |
| schedule | [CampaignSchedule](#campaignschedule) |  | Yes |
| ab_test_enabled | boolean |  | No |
| ab_test_variants |  |  | No |

#### EmailPhoneEscrowCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| recipient_email |  |  | No |
| recipient_phone |  |  | No |
| amount |  |  | Yes |
| currency | string |  | Yes |
| terms | [ [TermData](#termdata) ] |  | Yes |
| payment_method | string |  | Yes |
| products |  |  | No |

#### EmailSettings

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| from_name | string |  | Yes |
| reply_to |  |  | Yes |
| subject_line | string |  | Yes |
| preview_text |  |  | Yes |
| template_type | [EmailTemplateType](#emailtemplatetype) |  | Yes |
| track_opens | boolean |  | No |
| track_clicks | boolean |  | No |
| track_unsubscribes | boolean |  | No |

#### EmailTemplateType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| EmailTemplateType | string |  |  |

#### ErrorDetail

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string |  | Yes |
| message | string |  | Yes |
| field |  |  | No |
| details |  |  | No |

#### ErrorResponse

Standard error response model

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| detail | string |  | Yes |
| error_code |  |  | No |
| errors |  |  | No |

#### EscrowCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| receiver_id | string (uuid) |  | Yes |
| amount |  |  | Yes |
| currency_code | string |  | Yes |
| terms |  |  | No |
| products |  |  | No |
| payment_method | string |  | Yes |
| user_location |  |  | No |
| user_info |  |  | No |

#### EscrowDisbursementCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| recipients | [ [EscrowDisbursementRecipient](#escrowdisbursementrecipient) ] |  | Yes |
| currency | string |  | Yes |
| payment_method | [PaymentMethodEnum](#paymentmethodenum) |  | Yes |
| description |  |  | No |
| user_location |  |  | No |

#### EscrowDisbursementItemResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| recipient_id |  |  | Yes |
| email |  |  | Yes |
| phone_number |  |  | Yes |
| amount | string |  | Yes |
| escrow_id |  |  | Yes |
| status | string |  | Yes |
| terms_count | integer |  | Yes |
| reference |  |  | Yes |

#### EscrowDisbursementRecipient

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| recipient_id |  |  | No |
| email |  |  | No |
| phone_number |  |  | No |
| amount |  |  | Yes |
| terms | [ [TermData](#termdata) ] |  | Yes |
| reference |  |  | No |

#### EscrowDisbursementResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| disbursement_id | string (uuid) |  | Yes |
| status | string |  | Yes |
| total_amount | string |  | Yes |
| currency | string |  | Yes |
| recipient_count | integer |  | Yes |
| successful_count | integer |  | Yes |
| failed_count | integer |  | Yes |
| pending_count | integer |  | Yes |
| escrow_items | [ [EscrowDisbursementItemResponse](#escrowdisbursementitemresponse) ] |  | Yes |
| description |  |  | Yes |
| created_at | dateTime |  | Yes |

#### EscrowListResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| escrows | [ [EscrowSchema](#escrowschema) ] |  | Yes |
| page | integer |  | Yes |
| limit | integer |  | Yes |
| total | integer |  | Yes |

#### EscrowProductRequestCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| description | string |  | Yes |
| amount |  |  | Yes |
| currency_code | string |  | Yes |
| payment_method_id |  |  | Yes |
| escrow_terms | [ object ] |  | Yes |
| image |  |  | Yes |
| delivery_location |  |  | Yes |
| category_id |  |  | Yes |

#### EscrowProductRequestResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| requester | object |  | Yes |
| description | string |  | Yes |
| image |  |  | Yes |
| price_range_min |  |  | Yes |
| price_range_max | string |  | Yes |
| status | string |  | Yes |
| escrow |  |  | Yes |
| delivery_location | object |  | Yes |
| delivery_deadline |  |  | Yes |
| created_at | dateTime |  | Yes |
| offers | [ [ProductOfferResponse](#productofferresponse) ] |  | Yes |
| escrow_id | string (uuid) |  | Yes |
| payment_status | string |  | Yes |
| terms_status | [ object ] |  | Yes |

#### EscrowReleaseRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| escrow_id | integer | The ID of the escrow | Yes |
| transaction_password | string | The transaction password for the escrow | Yes |
| proof_file |  | The proof file for the escrow (if applicable) | No |
| otp |  | The OTP for the escrow | No |

#### EscrowReleaseResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| escrow_id | integer | The ID of the escrow | Yes |
| status | string | The status of the escrow after the release attempt | Yes |
| release_time |  | The timestamp of the release (if successful) | No |
| message | string | A message indicating the result of the release attempt | Yes |

#### EscrowReleaseSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| verification_code |  |  | No |
| verification_method | string |  | No |
| user_info |  |  | No |

#### EscrowResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| amount | string |  | Yes |
| currency_code | string |  | Yes |
| status | string |  | Yes |
| payment_method | string |  | Yes |
| sender_id |  |  | Yes |
| receiver_id |  |  | No |
| unregistered_receiver_id |  |  | No |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |
| terms | [ object ] |  | Yes |
| products |  |  | No |
| location |  |  | No |
| required_actions |  |  | No |
| recipient_details |  |  | No |

#### EscrowReverseSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| reason |  |  | No |

#### EscrowSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| sender_id |  |  | Yes |
| receiver_id |  |  | Yes |
| unregistered_user_id |  |  | No |
| unregistered_receiver_id |  |  | No |
| amount | string |  | Yes |
| currency_code | string |  | Yes |
| status | string |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |
| terms | [ object ] |  | Yes |
| payment_method |  |  | Yes |

#### EventCreate

Schema for creating an event

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Event name | Yes |
| description | string | Event description | No |
| type | [EventType](#eventtype) | Event type | No |
| start_date | dateTime | Event start date | Yes |
| end_date |  | Event end date | No |
| location |  | Event location | No |

#### EventReminderUpdate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| notification_type |  |  | Yes |
| minutes_before |  |  | Yes |
| message |  |  | Yes |
| enabled |  |  | Yes |

#### EventType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| EventType | string |  |  |

#### EventUpdate

Schema for updating an event

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name |  |  | No |
| description |  |  | No |
| type | [EventType](#eventtype) |  | Yes |
| start_date |  |  | No |
| end_date |  |  | No |
| location |  |  | No |

#### FailedReceiver

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string |  | Yes |
| reason | string |  | Yes |

#### FinancialCategoryCreate

Schema for creating a financial category

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Category name | Yes |
| type | [FinancialEntryType](#financialentrytype) | Category type | Yes |
| description |  | Category description | No |
| parent_id |  | Parent category ID | No |

#### FinancialCategoryListResponse

Schema for financial category list responses

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| categories | [ [FinancialCategoryResponse](#financialcategoryresponse) ] |  | Yes |

#### FinancialCategoryResponse

Schema for financial category responses

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| name | string |  | Yes |
| type | [FinancialEntryType](#financialentrytype) |  | Yes |
| description |  |  | No |
| parent |  |  | No |
| subcategories_count | integer |  | No |
| usage_stats |  |  | No |
| created_at | dateTime |  | Yes |

#### FinancialCategoryUpdate

Schema for updating a financial category

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name |  |  | No |
| description |  |  | No |
| parent_id |  |  | No |

#### FinancialEntryCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| type | string |  | Yes |
| amount |  |  | Yes |
| currency | string |  | No |
| description | string |  | Yes |
| category_id |  |  | No |
| due_date |  |  | No |
| date | date |  | Yes |
| reference_number |  |  | No |
| notes |  |  | No |
| tags | [ string ] |  | No |
| contact_id |  |  | No |

#### FinancialEntryType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| FinancialEntryType | string |  |  |

#### FinancialSummaryResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| total_deposits | string |  | Yes |
| total_withdrawals | string |  | Yes |
| net_savings | string |  | Yes |
| project_contributions | string |  | Yes |
| current_balance | string |  | Yes |
| time_range | string |  | Yes |

#### FraudAnalysisRequest

Request model for fraud analysis.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| transaction_data | object |  | Yes |
| device_fingerprint_data |  |  | No |

#### FraudAnalysisResponse

Response model for fraud analysis.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| risk_score | number |  | Yes |
| risk_level | string |  | Yes |
| risk_factors | [  ] |  | Yes |
| analysis_timestamp | string |  | Yes |
| requires_review | boolean |  | Yes |
| block_transaction | boolean |  | Yes |
| error |  |  | No |

#### FuzzySearchRequest

Schema for fuzzy search requests

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| query | string | Search query | Yes |
| threshold | integer | Fuzzy match threshold (0-100) | No |
| limit | integer | Maximum results to return | No |
| search_fields | [ string ] | Fields to search in | No |
| entity_type | string | Entity type to search (contacts, leads, all) | No |

#### FuzzySearchResponse

Fuzzy search response

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| query | string |  | Yes |
| threshold | integer |  | Yes |
| total_results | integer |  | Yes |
| results | [ [FuzzySearchResult](#fuzzysearchresult) ] |  | Yes |
| search_time_ms | integer |  | Yes |

#### FuzzySearchResult

Individual fuzzy search result

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| entity_type | string |  | Yes |
| name | string |  | Yes |
| email |  |  | Yes |
| company |  |  | Yes |
| phone |  |  | Yes |
| match_score | integer |  | Yes |
| matched_field | string |  | Yes |
| matched_text | string |  | Yes |

#### GoalCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| group_id | string (uuid) |  | Yes |
| description | string |  | Yes |
| target_amount |  |  | Yes |
| deadline |  |  | Yes |

#### GoalResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| description | string |  | Yes |
| target_amount | string |  | Yes |
| current_amount | string |  | Yes |
| deadline |  |  | Yes |
| achieved | boolean |  | Yes |
| created_at | dateTime |  | Yes |

#### GroupConstitutionCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| transaction_approval_percentage | number |  | Yes |
| leader_election_percentage | number |  | Yes |
| member_removal_percentage | number |  | Yes |
| voting_method | [VotingMethod](#votingmethod) |  | Yes |
| leaders_vote_weight | number |  | No |
| commitment_period | [CommitmentPeriod](#commitmentperiod) |  | Yes |
| commitment_minimum |  |  | Yes |
| constitution_change_percentage | number |  | No |

#### GroupConstitutionResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| transaction_approval_percentage | number |  | Yes |
| leader_election_percentage | number |  | Yes |
| member_removal_percentage | number |  | Yes |
| voting_method | [VotingMethod](#votingmethod) |  | Yes |
| leaders_vote_weight | number |  | Yes |
| commitment_period | [CommitmentPeriod](#commitmentperiod) |  | Yes |
| commitment_minimum | string |  | Yes |
| constitution_change_percentage | number |  | Yes |

#### GroupDetailResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| name | string |  | Yes |
| created_at | dateTime |  | Yes |
| wallet_id | string (uuid) |  | Yes |
| wallet_balance | string |  | Yes |
| constitution | [GroupConstitutionResponse](#groupconstitutionresponse) |  | Yes |
| total_savings | string |  | Yes |
| total_members | integer |  | Yes |
| active_goals | integer |  | Yes |
| active_projects | integer |  | Yes |

#### GroupMemberResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| user_id | string (uuid) |  | Yes |
| username | string |  | Yes |
| email | string |  | Yes |
| is_leader | boolean |  | Yes |
| savings_balance | string |  | Yes |
| commitment_amount | string |  | Yes |
| commitment_period | [CommitmentPeriod](#commitmentperiod) |  | Yes |
| joined_at | dateTime |  | Yes |

#### GroupResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| name | string |  | Yes |
| created_at | dateTime |  | Yes |
| wallet_id |  |  | Yes |

#### GroupStatisticsResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| total_deposits | string |  | Yes |
| total_withdrawals | string |  | Yes |
| net_savings | string |  | Yes |
| active_members | integer |  | Yes |
| total_members | integer |  | Yes |
| completed_goals | integer |  | Yes |
| total_goals | integer |  | Yes |
| completed_projects | integer |  | Yes |
| total_projects | integer |  | Yes |
| time_range | string |  | Yes |

#### HTTPValidationError

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| detail | [ [ValidationError](#validationerror) ] |  | No |

#### InteractionCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| contact_id | string (uuid) |  | Yes |
| type | [InteractionType](#interactiontype) |  | Yes |
| subject | string |  | Yes |
| content | string |  | Yes |
| scheduled_at |  |  | No |

#### InteractionType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| InteractionType | string |  |  |

#### InventoryItem

Schema for individual inventory items in reports.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| product_id | string (uuid) |  | Yes |
| product_name | string |  | Yes |
| quantity | integer |  | Yes |
| value | string |  | Yes |

#### InventoryItemDetailResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| piaxe_token | string |  | Yes |
| external_code |  |  | No |
| external_code_type |  |  | No |
| status | string |  | Yes |
| product_id | string (uuid) |  | Yes |
| product_name | string |  | Yes |
| location_id |  |  | No |
| location_name |  |  | No |
| added_at | dateTime |  | Yes |
| sold_at |  |  | No |
| current_holder_id |  |  | No |
| metadata |  |  | No |

#### InventoryItemUpdate

Schema for updating an InventoryItem.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| external_code |  | New or updated external code (QR/Barcode) | No |
| external_code_type |  | Type of the new external code | No |
| status |  | New status (e.g., 'in_stock', 'damaged', 'reserved_manual'). Use with caution. | No |
| store_location_id |  | Move item to a new StoreLocation within the same store | No |
| metadata |  | Replace or update item metadata | No |

#### InventoryReport

Schema for inventory reports containing shop inventory summary.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| shop_id | string (uuid) |  | Yes |
| items | [ [InventoryItem](#inventoryitem) ] |  | Yes |
| total_value | string |  | Yes |

#### InvitationCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| email | string (email) |  | Yes |
| commitment_amount |  |  | Yes |
| commitment_period | [CommitmentPeriod](#commitmentperiod) |  | Yes |

#### InvitationResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| group_id | string (uuid) |  | Yes |
| group_name | string |  | Yes |
| inviter_username | string |  | Yes |
| email | string (email) |  | Yes |
| commitment_amount | string |  | Yes |
| commitment_period | [CommitmentPeriod](#commitmentperiod) |  | Yes |
| created_at | dateTime |  | Yes |
| expires_at | dateTime |  | Yes |

#### LeadActivityCreate

Schema for creating lead activity

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| activity_type | string | Activity type | Yes |
| description | string | Activity description | Yes |
| outcome |  | Activity outcome | No |
| next_action |  | Next action required | No |

#### LeadActivityResponse

Lead activity response schema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| activity_type | string |  | Yes |
| description | string |  | Yes |
| outcome |  |  | Yes |
| next_action |  |  | Yes |
| created_by | object |  | Yes |
| created_at | dateTime |  | Yes |

#### LeadCreate

Schema for creating a new lead

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| contact_id |  | Existing contact ID (if using existing contact) | No |
| name |  | Contact name (for new contact) | No |
| company |  | Company name | No |
| email |  | Email address | No |
| phone |  | Phone number | No |
| address |  | Physical address | No |
| source | [LeadSource](#leadsource) | Lead source | Yes |
| status |  | Lead status | No |
| pipeline_stage |  | Pipeline stage | No |
| priority |  | Lead priority | No |
| quality |  | Lead quality | No |
| industry |  | Industry | No |
| company_size |  | Company size | No |
| annual_revenue |  | Annual revenue | No |
| website |  | Company website | No |
| budget_range |  | Budget range | No |
| decision_timeline |  | Decision timeline | No |
| pain_points | [ string ] | Pain points | No |
| qualification_notes |  | Qualification notes | No |
| assigned_to_id |  | Assigned user ID | No |

#### LeadListResponse

Lead list response with pagination

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| leads | [ [LeadResponse](#leadresponse) ] |  | Yes |
| pagination | [PaginationResponse](#paginationresponse) |  | Yes |

#### LeadQuality

Lead quality rating

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| LeadQuality | string | Lead quality rating |  |

#### LeadResponse

Lead response schema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| contact | object |  | Yes |
| source | [LeadSource](#leadsource) |  | Yes |
| status | [LeadStatus](#leadstatus) |  | Yes |
| pipeline_stage | [PipelineStage](#pipelinestage) |  | Yes |
| priority | [Priority](#priority) |  | Yes |
| quality | [LeadQuality](#leadquality) |  | Yes |
| lead_score | integer |  | Yes |
| qualification_notes |  |  | Yes |
| budget_range |  |  | Yes |
| decision_timeline |  |  | Yes |
| pain_points | [ string ] |  | Yes |
| industry |  |  | Yes |
| company_size |  |  | Yes |
| annual_revenue |  |  | Yes |
| website |  |  | Yes |
| assigned_to |  |  | Yes |
| conversion_value |  |  | Yes |
| converted_at |  |  | Yes |
| lost_reason |  |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |
| last_activity_at |  |  | Yes |

#### LeadSource

Source of lead acquisition

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| LeadSource | string | Source of lead acquisition |  |

#### LeadStatus

Lead status

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| LeadStatus | string | Lead status |  |

#### LeadUpdate

Schema for updating a lead

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name |  | Contact name | No |
| company |  | Company name | No |
| email |  | Email address | No |
| phone |  | Phone number | No |
| address |  | Physical address | No |
| source |  |  | No |
| status |  |  | No |
| pipeline_stage |  |  | No |
| priority |  |  | No |
| quality |  |  | No |
| lead_score |  |  | No |
| industry |  |  | No |
| company_size |  |  | No |
| annual_revenue |  |  | No |
| website |  |  | No |
| budget_range |  |  | No |
| decision_timeline |  |  | No |
| pain_points |  |  | No |
| qualification_notes |  |  | No |
| assigned_to_id |  |  | No |
| conversion_value |  |  | No |
| lost_reason |  |  | No |

#### LoginRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| username | string |  | Yes |
| password | string |  | Yes |

#### LoyaltyProgramCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| points_per_currency_unit |  | Points awarded per unit of currency spent (e.g., 1 point per $1). | Yes |
| currency_code_for_points | string | The currency code (e.g., USD, KES) this earning rule applies to. | Yes |
| min_points_for_redemption | integer | Minimum points a user must have to redeem. | Yes |
| points_value_in_currency |  | The value of 1 point in the redemption currency (e.g., 1 point = $0.01). | Yes |
| redemption_currency_code | string | The currency code for redemption value (e.g., USD, KES). | Yes |
| is_active | boolean |  | No |
| earn_rule_description |  | Text description of how points are earned. | No |
| redeem_rule_description |  | Text description of how points can be redeemed. | No |

#### LoyaltyProgramResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| store_id | string (uuid) |  | Yes |
| name | string |  | Yes |
| points_per_currency_unit | string |  | Yes |
| currency_code_for_points | string |  | Yes |
| min_points_for_redemption | integer |  | Yes |
| points_value_in_currency | string |  | Yes |
| redemption_currency_code | string |  | Yes |
| is_active | boolean |  | Yes |
| earn_rule_description |  |  | No |
| redeem_rule_description |  |  | No |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |

#### LoyaltyProgramUpdate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name |  |  | No |
| points_per_currency_unit |  |  | No |
| currency_code_for_points | string | The currency code (e.g., USD, KES) this earning rule applies to. | Yes |
| min_points_for_redemption |  |  | No |
| points_value_in_currency |  |  | No |
| redemption_currency_code | string | The currency code for redemption value (e.g., USD, KES). | Yes |
| is_active |  |  | No |
| earn_rule_description |  | Text description of how points are earned. | No |
| redeem_rule_description |  | Text description of how points can be redeemed. | No |
| calculation_currency_code |  |  | No |

#### MTNCallbackSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| externalId | string |  | Yes |
| status | string |  | Yes |
| reason |  |  | No |

#### MemberActivityResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| member_id | string (uuid) |  | Yes |
| username | string |  | Yes |
| deposits | integer |  | Yes |
| withdrawals | integer |  | Yes |
| votes | integer |  | Yes |
| project_contributions | integer |  | Yes |

#### MemberContributionResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| member_id | string (uuid) |  | Yes |
| username | string |  | Yes |
| total_contribution | string |  | Yes |

#### MembershipRequestCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| group_id | string (uuid) |  | Yes |
| commitment_amount |  |  | Yes |
| commitment_period | [CommitmentPeriod](#commitmentperiod) |  | Yes |

#### MerchantProfileResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string |  | Yes |
| account_id | string |  | Yes |
| business_name | string |  | Yes |
| address | string |  | Yes |
| website |  |  | No |
| business_type | [BusinessType](#businesstype) |  | Yes |
| status | [Status](#status) |  | Yes |
| api_key |  |  | No |
| ecommerce_platform_type |  |  | No |
| supports_escrow | boolean |  | Yes |
| accepted_release_types | [ string ] |  | Yes |
| is_verified | boolean |  | Yes |
| email | string |  | Yes |
| phone | string |  | Yes |
| avatar |  |  | No |
| admins | [ string ] |  | Yes |
| webhooks | [ [WebhookResponse](#webhookresponse) ] |  | Yes |
| store_count | integer |  | No |

#### MerchantRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| business_name | string |  | Yes |
| email | string |  | Yes |
| phone | string |  | Yes |
| address | string |  | Yes |
| website | string |  | Yes |
| business_type | [BusinessType](#businesstype) |  | Yes |
| admins | [ string (uuid) ] |  | No |

#### MerchantResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| is_verified | boolean |  | Yes |
| business_name | string |  | Yes |
| email | string |  | Yes |
| phone | string |  | Yes |
| address | string |  | Yes |
| website | string |  | Yes |
| business_type | [BusinessType](#businesstype) |  | Yes |
| status | [Status](#status) |  | Yes |
| admins | [ string (uuid) ] |  | No |

#### MerchantVerificationResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| country | string |  | Yes |
| business_registration_document |  |  | Yes |
| tax_id_document |  |  | Yes |
| director_id_document |  |  | Yes |
| business_license |  |  | Yes |
| additional_documents |  |  | No |
| verification_status | [VerificationStatus](#verificationstatus) |  | Yes |
| document_upload_status | [DocumentUploadStatus](#documentuploadstatus) |  | Yes |
| verification_date | dateTime |  | Yes |

#### MessageTemplateCreate

Schema for creating a message template

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Template name | Yes |
| type | [CommunicationType](#communicationtype) | Communication type | Yes |
| content | string | Template content | Yes |
| variables | [ string ] | Template variables | No |
| language | string | Template language | No |

#### MessageTemplateUpdate

Schema for updating a message template

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name |  |  | No |
| type |  |  | No |
| content |  |  | No |
| variables |  |  | No |
| language |  |  | No |

#### NurturingSequenceCreate

Create nurturing sequence

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | Sequence name | Yes |
| description |  | Sequence description | No |
| trigger_conditions | object | Trigger conditions | No |
| steps | [ object ] | Sequence steps | No |

#### NurturingSequenceResponse

Nurturing sequence response

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| name | string |  | Yes |
| description |  |  | Yes |
| trigger_conditions | object |  | Yes |
| steps | [ object ] |  | Yes |
| is_active | boolean |  | Yes |
| enrollments_count | integer |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |

#### PaginatedInventoryItemsResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| total | integer |  | Yes |
| page | integer |  | Yes |
| limit | integer |  | Yes |
| items | [ [InventoryItemDetailResponse](#inventoryitemdetailresponse) ] |  | Yes |

#### PaginatedPaymentRequestResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| items | [ [PaymentRequestListResponse](#paymentrequestlistresponse) ] |  | Yes |
| total | integer |  | Yes |
| offset | integer |  | Yes |
| limit | integer |  | Yes |

#### PaginatedPaymentResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| items | [ [PaymentListResponse](#paymentlistresponse) ] |  | Yes |
| total | integer |  | Yes |
| offset | integer |  | Yes |
| limit | integer |  | Yes |

#### PaginatedProductSharesResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| total | integer |  | Yes |
| page | integer |  | Yes |
| limit | integer |  | Yes |
| items | [ [ProductShareResponse](#productshareresponse) ] |  | Yes |

#### PaginatedStoreResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| total_items | integer |  | Yes |
| total_pages | integer |  | Yes |
| current_page | integer |  | Yes |
| page_size | integer |  | Yes |
| items | [ [StoreResponse](#storeresponse) ] |  | Yes |

#### PaginationResponse

Standard pagination response schema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| page | integer |  | Yes |
| limit | integer |  | Yes |
| total | integer |  | Yes |
| pages | integer |  | Yes |

#### ParticipantUpdate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| user_id | string (uuid) |  | Yes |
| markup_percentage | number |  | Yes |

#### PaymentChainCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| description |  |  | No |

#### PaymentChainResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| description |  |  | No |
| id | string (uuid) |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |

#### PaymentDetailResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| amount | string |  | Yes |
| currency | string |  | Yes |
| status | string |  | Yes |
| date | dateTime |  | Yes |
| payment_method | string |  | Yes |
| direction | string |  | Yes |
| counterparty |  |  | Yes |
| payment_request |  |  | Yes |
| qr_code |  |  | Yes |
| description |  |  | Yes |
| user_info |  |  | Yes |
| transaction_details |  |  | Yes |

#### PaymentDetails

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string |  | Yes |
| status | string |  | Yes |
| amount | string |  | Yes |
| currency | string |  | Yes |
| payment_method | string |  | Yes |
| created_at | dateTime |  | Yes |
| reference |  |  | Yes |
| receipt |  |  | Yes |
| merchant_details |  |  | Yes |
| recipient_details |  |  | Yes |
| product_details |  |  | Yes |
| chain_payment_details |  |  | Yes |
| transaction_details |  |  | Yes |

#### PaymentListResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| amount | string |  | Yes |
| currency | string |  | Yes |
| status | string |  | Yes |
| date | dateTime |  | Yes |
| payment_method | string |  | Yes |
| direction | string |  | Yes |
| counterparty |  |  | Yes |

#### PaymentMethodCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| type | [PaymentMethodEnum](#paymentmethodenum) |  | Yes |
| nickname | string |  | Yes |
| is_default | boolean |  | No |
| card_number |  |  | No |
| card_name |  |  | No |
| expiry_month |  |  | No |
| expiry_year |  |  | No |
| cvv |  |  | No |
| provider |  |  | No |
| phone_number |  |  | No |
| account_number |  |  | No |
| bank_name |  |  | No |
| account_name |  |  | No |
| email |  |  | No |

#### PaymentMethodEnum

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| PaymentMethodEnum | string |  |  |

#### PaymentMethodResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| type | [PaymentMethodEnum](#paymentmethodenum) |  | Yes |
| nickname | string |  | Yes |
| is_default | boolean |  | Yes |
| is_active | boolean |  | Yes |
| display_details | object |  | Yes |
| last_used_at |  |  | No |
| created_at |  |  | Yes |
| updated_at |  |  | Yes |

#### PaymentMethodUpdate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| type |  |  | No |
| nickname |  |  | No |
| is_default |  |  | No |
| card_number |  |  | No |
| card_name |  |  | No |
| expiry_month |  |  | No |
| expiry_year |  |  | No |
| provider |  |  | No |
| phone_number |  |  | No |
| account_number |  |  | No |
| bank_name |  |  | No |
| account_name |  |  | No |
| email |  |  | No |

#### PaymentRequestAccessType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| PaymentRequestAccessType | string |  |  |

#### PaymentRequestCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| amount |  |  | No |
| min_amount |  |  | No |
| max_amount |  |  | No |
| target_amount |  |  | No |
| currency | string |  | Yes |
| request_type | [PaymentRequestType](#paymentrequesttype) |  | Yes |
| access_type | [PaymentRequestAccessType](#paymentrequestaccesstype) |  | No |
| recipient_identifier |  |  | No |
| expires_at |  |  | No |
| message |  |  | No |
| conditions |  |  | No |
| generate_qr | boolean |  | No |

#### PaymentRequestDetailResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| amount |  |  | Yes |
| currency | string |  | Yes |
| status | string |  | Yes |
| created_at | dateTime |  | Yes |
| expires_at | dateTime |  | Yes |
| request_type | string |  | Yes |
| requester | object |  | Yes |
| allowed_payers | [ object ] |  | Yes |
| payments | [ object ] |  | Yes |
| message |  |  | Yes |
| conditions |  |  | Yes |
| qr_code |  |  | Yes |
| collected_amount | string |  | Yes |

#### PaymentRequestListResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| amount |  |  | Yes |
| currency | string |  | Yes |
| status | string |  | Yes |
| created_at | dateTime |  | Yes |
| expires_at | dateTime |  | Yes |
| request_type | string |  | Yes |

#### PaymentRequestPayment

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| amount |  |  | Yes |
| payment_method | [PaymentMethodEnum](#paymentmethodenum) |  | Yes |
| currency | string |  | Yes |
| mfa_code |  |  | No |
| user_info |  |  | No |

#### PaymentRequestResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| requester | object |  | Yes |
| recipient |  |  | Yes |
| amount |  |  | Yes |
| min_amount |  |  | Yes |
| max_amount |  |  | Yes |
| target_amount |  |  | Yes |
| collected_amount | string |  | Yes |
| currency | string |  | Yes |
| request_type | string |  | Yes |
| access_type | string |  | Yes |
| status | string |  | Yes |
| created_at | dateTime |  | Yes |
| expires_at | dateTime |  | Yes |
| message |  |  | Yes |
| conditions |  |  | Yes |
| qr_code |  |  | Yes |

#### PaymentRequestType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| PaymentRequestType | string |  |  |

#### PaymentResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| payment_id | string |  | Yes |
| status | string |  | Yes |
| amount | string |  | Yes |
| currency | string |  | Yes |

#### PaymentSchema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| status | string |  | Yes |
| amount | string |  | Yes |
| currency | string |  | Yes |
| payment_method | string |  | Yes |
| date | dateTime |  | Yes |
| user_id |  |  | No |
| merchant_id |  |  | No |
| payment_method_id |  |  | No |
| receipt |  |  | No |
| reference |  |  | No |
| qr_code_id |  |  | No |
| barcode_id |  |  | No |
| box_id |  |  | No |
| user_info |  |  | No |

#### PipelineAnalytics

Pipeline analytics response

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| stage_distribution | object |  | Yes |
| conversion_rates | object |  | Yes |
| average_stage_duration | object |  | Yes |
| pipeline_velocity | number |  | Yes |
| total_pipeline_value | number |  | Yes |
| stage_history | [ object ] |  | Yes |

#### PipelineStage

Sales pipeline stages

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| PipelineStage | string | Sales pipeline stages |  |

#### Priority

Priority levels

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| Priority | string | Priority levels |  |

#### ProductAuthenticationResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| is_authentic | boolean |  | Yes |
| original_manufacturer |  |  | Yes |
| original_url |  |  | Yes |
| current_owner | string |  | Yes |
| payment_chain |  |  | Yes |

#### ProductCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| description | string |  | Yes |
| brand |  | Product brand | No |
| model |  | Product model/variant | No |
| supplier_id |  |  | No |
| manufacturer_id |  |  | No |
| location_id |  | The ID of the StoreLocation where the item is being added | Yes |
| currency |  | Currency code (default: USD) | No |
| category_id |  | Optional global Category ID | No |
| store_category_id |  | Optional StoreProductCategory ID | No |
| sku |  | Stock Keeping Unit | No |
| barcode |  | Standard product barcode (UPC, EAN, etc.) | No |
| qr_code |  | QR code for product type | No |
| external_qr_code |  | External QR code from manufacturer/supplier | No |
| requires_individual_tracking | boolean | True for high-value items, serialized products, or items requiring warranty tracking | No |
| base_price |  | Base price (required if product doesn't exist) | No |
| expiry_date |  | Optional expiry date (YYYY-MM-DD) | No |
| markup |  | Markup percentage (0-100) | No |
| initial_quantity | integer | Initial quantity to add to store inventory | No |
| purchase_cost |  | Cost per unit when purchasing this product | No |
| low_stock_threshold | integer | Threshold for low stock notifications | No |
| reorder_point | integer | Point at which to reorder stock | No |
| reorder_quantity | integer | Quantity to reorder when restocking | No |
| is_ecommerce_enabled |  | Whether the product is enabled for ecommerce | No |
| images |  | List of image URLs | No |

#### ProductInEscrow

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| product_id | string (uuid) |  | Yes |
| quantity | integer |  | Yes |
| manual_price |  |  | No |

#### ProductOfferCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| product_id |  |  | Yes |
| custom_product_image |  |  | Yes |
| price |  |  | Yes |
| description | string |  | Yes |
| delivery_time |  |  | Yes |
| shipping_cost |  |  | Yes |

#### ProductOfferResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| seller | object |  | Yes |
| product |  |  | Yes |
| custom_product_image |  |  | Yes |
| price | string |  | Yes |
| description | string |  | Yes |
| status | string |  | Yes |
| created_at | dateTime |  | Yes |

#### ProductRequestCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| description | string |  | Yes |
| image |  |  | Yes |
| price_range_min |  |  | Yes |
| price_range_max |  |  | Yes |
| currency | string |  | No |
| escrow_terms |  |  | Yes |
| delivery_location | object |  | Yes |
| delivery_deadline |  |  | Yes |
| category_id |  |  | Yes |

#### ProductRequestFulfillmentCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| confirmation_type | string | Type of delivery confirmation (signature/photo/code) | Yes |
| confirmation_data | object | Confirmation data (signature/photo/code) | Yes |
| location | object | Current location coordinates | Yes |

#### ProductRequestPaymentCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| payment_method | string |  | Yes |
| payment_details | object |  | Yes |
| coupon_code |  |  | Yes |
| redeem_points |  |  | No |
| points_to_redeem |  |  | Yes |
| user_info |  |  | No |

#### ProductRequestResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| requester | object |  | Yes |
| description | string |  | Yes |
| image |  |  | Yes |
| price_range_min |  |  | Yes |
| price_range_max | string |  | Yes |
| status | string |  | Yes |
| escrow |  |  | Yes |
| delivery_location | object |  | Yes |
| delivery_deadline |  |  | Yes |
| created_at | dateTime |  | Yes |
| offers | [ [ProductOfferResponse](#productofferresponse) ] |  | Yes |

#### ProductScanResult

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| found | boolean |  | Yes |
| product |  |  | No |
| suggestions | [ object ] |  | No |
| can_create_new | boolean |  | No |

#### ProductShareCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| available_zones |  | Optional list of delivery zones the sharer supports, e.g., [{"name": "Zone A", "price": 5.00, "currency": "USD"}] | No |
| product_id |  | Product ID for quantity-based sharing (recommended approach) | No |
| quantity |  | Quantity to share (required with product_id) | No |
| inventory_item_ids |  | List of specific InventoryItem IDs to include in this share (legacy approach). | No |
| sharer_message |  | A message or title for this share. | No |
| pickup_location_override_id |  | Optional StoreLocation ID if pickup is different from items' current locations. | No |
| expires_at |  |  | No |

#### ProductShareDetailResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| share_code | string |  | Yes |
| store_id | string (uuid) |  | Yes |
| store_name | string |  | Yes |
| sharer_id | string (uuid) |  | Yes |
| sharer_message |  |  | No |
| pickup_location |  |  | Yes |
| available_items | [ [SharedInventoryItemDetail](#sharedinventoryitemdetail) ] |  | Yes |
| is_active | boolean |  | Yes |
| expires_at |  |  | Yes |

#### ProductShareResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| store_id | string (uuid) |  | Yes |
| share_code | string |  | Yes |
| sharer_id | string (uuid) |  | Yes |
| pickup_location |  |  | Yes |
| available_zones |  |  | Yes |
| product_id |  |  | No |
| quantity_shared |  |  | No |
| inventory_item_count |  | Number of individual items shared (for individual tracking approach) | No |
| is_active | boolean |  | Yes |
| created_at | dateTime |  | Yes |
| expires_at |  |  | Yes |
| metadata | object |  | Yes |

#### ProductShareUpdate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| available_zones |  | Optional list of delivery zones the sharer supports. | No |
| inventory_item_ids |  | List of specific InventoryItem IDs to include/update in this share. | No |
| sharer_message |  | A message or title for this share. | No |
| pickup_location_override_id |  | Optional StoreLocation ID if pickup is different from items' current locations. | No |
| expires_at |  |  | No |
| is_active |  |  | No |

#### ProjectContributionCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| project_id | string (uuid) |  | Yes |
| amount |  |  | Yes |

#### ProjectCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| group_id | string (uuid) |  | Yes |
| name | string |  | Yes |
| description | string |  | Yes |
| total_cost |  |  | Yes |

#### ProjectResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| name | string |  | Yes |
| description | string |  | Yes |
| total_cost | string |  | Yes |
| current_amount | string |  | Yes |
| approved | boolean |  | Yes |
| completed | boolean |  | Yes |
| created_at | dateTime |  | Yes |

#### ProjectVoteCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| project_id | string (uuid) |  | Yes |
| approved | boolean |  | Yes |

#### PromotionCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| description |  |  | Yes |
| type | [PromotionType](#promotiontype) |  | Yes |
| value |  |  | Yes |
| start_date | dateTime |  | Yes |
| end_date | dateTime |  | Yes |
| store_id | string (uuid) |  | Yes |
| product_ids | [ string (uuid) ] |  | Yes |
| category_ids |  |  | Yes |
| min_purchase_amount |  |  | Yes |
| usage_limit |  |  | Yes |

#### PromotionResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| name | string |  | Yes |
| description |  |  | Yes |
| type | [PromotionType](#promotiontype) |  | Yes |
| value | string |  | Yes |
| start_date | dateTime |  | Yes |
| end_date | dateTime |  | Yes |
| min_purchase_amount |  |  | Yes |
| usage_limit |  |  | Yes |
| times_used | integer |  | Yes |

#### PromotionType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| PromotionType | string |  |  |

#### PromotionUpdate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name |  |  | Yes |
| description |  |  | Yes |
| type |  |  | Yes |
| value |  |  | Yes |
| start_date |  |  | Yes |
| end_date |  |  | Yes |
| product_ids |  |  | Yes |
| category_ids |  |  | Yes |
| min_purchase_amount |  |  | Yes |
| usage_limit |  |  | Yes |
| is_active |  |  | Yes |

#### PurchaseEscrowCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| receiver_id | string (uuid) |  | Yes |
| amount |  |  | Yes |
| currency_code | string |  | Yes |
| category_id |  |  | No |
| expiry_days | integer |  | Yes |
| payment_method | string |  | Yes |

#### QRPaymentCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| amount |  |  | Yes |
| currency | string |  | Yes |
| payment_method | [PaymentMethodEnum](#paymentmethodenum) |  | Yes |
| mfa_code |  |  | No |
| user_info |  |  | No |

#### RecommendationFeedback

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| success_score | number |  | Yes |
| feedback |  |  | No |
| implementation_notes |  |  | No |

#### RecommendationType

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| RecommendationType | string |  |  |

#### ReminderCreateRequest

Schema for creating a reminder

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| appointment_id |  | Associated appointment ID | No |
| reminder_time | dateTime | When to send the reminder | Yes |
| message | string | Reminder message | No |

#### ReminderUpdateRequest

Schema for updating a reminder

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| reminder_time |  |  | No |
| message |  |  | No |
| sent |  |  | No |

#### RequestOTP

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| email |  |  | No |
| phone_number |  | Phone number in E.164 format (e.g., +256700000000) | No |

#### RequestStatus

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| RequestStatus | string |  |  |

#### SMSCampaignCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| description |  |  | Yes |
| recipients | [  ] | List of contact IDs, emails, or phone numbers | Yes |
| content | string |  | Yes |
| currency | string |  | Yes |
| country_code | string |  | Yes |
| schedule | [CampaignSchedule](#campaignschedule) |  | Yes |

#### ScanAndAddInput

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | string | The scanned code string (QR or Barcode) | Yes |
| quantity | integer | Quantity to add (default: 1) | No |
| location_id |  | The ID of the StoreLocation where the item is being added | Yes |
| code_type |  | Type of code ('qrcode' or 'barcode') | No |
| name |  | Product name (required if product doesn't exist for this code) | No |
| description |  | Product description | No |
| brand |  | Product brand | No |
| model |  | Product model/variant | No |
| base_price |  | Base price (required if product doesn't exist) | No |
| currency |  | Currency code (default: USD) | No |
| category_id |  | Optional global Category ID | No |
| store_category_id |  | Optional StoreProductCategory ID | No |
| requires_individual_tracking | boolean | True for high-value items requiring individual tracking | No |
| purchase_cost |  | Cost per unit when purchasing | No |
| images |  | List of image URLs | No |
| sku |  | Optional SKU if different from scanned code | No |
| qr_code |  | Optional QR Code if different from scanned code | No |
| barcode |  | Optional Barcode if different from scanned code | No |
| external_qr_code |  | External QR code from manufacturer/supplier | No |
| is_ecommerce_enabled | boolean | Enable for e-commerce? | No |

#### ScanAndAddResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| message | string |  | Yes |
| product_id | string (uuid) |  | Yes |
| product_name | string |  | Yes |
| brand |  |  | No |
| currency | string |  | Yes |
| quantity_added | integer |  | Yes |
| total_quantity | integer |  | Yes |
| inventory_type | string |  | Yes |
| inventory_item_id |  |  | No |
| piaxe_token |  |  | No |
| product_code |  |  | No |
| barcode |  |  | No |
| qr_code |  |  | No |
| external_qr_code |  |  | No |
| store_id | string (uuid) |  | Yes |
| location_id | string (uuid) |  | Yes |
| location_name | string |  | Yes |
| is_low_stock | boolean |  | No |
| needs_reorder | boolean |  | No |
| images |  | List of image URLs | No |

#### ShareCartResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| share_token |  |  | No |
| share_url |  |  | No |
| cart_id | string (uuid) |  | Yes |
| expires_at |  |  | No |
| total_amount | string |  | Yes |
| currency | string |  | Yes |
| store_name | string |  | Yes |
| store_id |  |  | No |
| store_location_id |  |  | No |
| store_location_name |  |  | No |
| status | string |  | Yes |

#### SharedInventoryItemDetail

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| inventory_item_id | string (uuid) |  | Yes |
| piaxe_token | string |  | Yes |
| product_name | string |  | Yes |
| product_description |  |  | No |
| product_images |  |  | No |
| price | string |  | Yes |
| currency | string |  | Yes |
| location_name |  |  | No |

#### SharedItemPurchaseCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| inventory_item_id_to_purchase | string (uuid) | The specific InventoryItem ID from the share to purchase. | Yes |
| payment_type | string | 'direct' or 'escrow' | Yes |
| payment_method | [PaymentMethodEnum](#paymentmethodenum) |  | Yes |
| escrow_terms |  | Required if payment_type is 'escrow' | No |
| delivery_location |  | Required if delivery is an option and selected. | No |
| user_info |  | For unregistered users: email, phone_number, name | No |
| coupon_code |  |  | No |
| redeem_loyalty_points |  |  | No |
| currency |  | Currency for the transaction. If None, derived from product. | No |

#### SharedProductFulfillmentCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| confirmation_type | string | Type of delivery confirmation (signature/photo/code) | Yes |
| confirmation_data | object | Confirmation data (signature/photo/code) | Yes |
| location | object | Current location coordinates | Yes |

#### StaffDetailResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| store_staff_id | string (uuid) |  | Yes |
| store_id | string (uuid) |  | Yes |
| staff_id | string (uuid) |  | Yes |
| role | string |  | Yes |
| permissions_config | object |  | Yes |
| active_permissions | [ [StaffPermission](#staffpermission) ] |  | Yes |
| staff_username | string |  | Yes |
| staff_email |  |  | No |
| staff_first_name |  |  | No |
| staff_last_name |  |  | No |
| staff_is_active | boolean |  | Yes |
| joined_store_at | dateTime |  | Yes |

#### StaffPermission

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| StaffPermission | string |  |  |

#### StandardResponse

Standard API response schema

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| status | string |  | Yes |
| message | string |  | Yes |

#### Status

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| Status | string |  |  |

#### StoreCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| description | string |  | Yes |
| store_code |  | Optional 5 uppercase letter store code. Auto-generated if not provided. | No |
| address | string |  | Yes |
| contact_email | string |  | Yes |
| contact_phone | string |  | Yes |
| business_hours |  |  | No |
| notification_preferences |  |  | No |

#### StoreLocationCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| description |  |  | No |
| latitude |  |  | No |
| longitude |  |  | No |
| is_active | boolean |  | No |

#### StoreLocationResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| store_id | string (uuid) |  | Yes |
| name | string |  | Yes |
| description |  |  | Yes |
| latitude |  |  | Yes |
| longitude |  |  | Yes |
| is_active | boolean |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |

#### StoreProductDetailResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| product_id | string (uuid) |  | Yes |
| name | string |  | Yes |
| description |  |  | No |
| sku |  |  | No |
| barcode |  |  | No |
| product_code |  |  | No |
| piaxe_token |  |  | No |
| qr_code |  |  | No |
| external_qr_code |  |  | No |
| category |  |  | No |
| base_price |  |  | No |
| manual_price |  |  | No |
| currency |  |  | No |
| store_price |  |  | No |
| in_stock_quantity | integer |  | Yes |
| total_quantity_in_store | integer |  | Yes |
| low_stock_threshold |  |  | No |
| images |  |  | No |
| is_active | boolean |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |
| specifications |  |  | No |
| variants |  |  | No |

#### StoreProductListPaginatedResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| total | integer |  | Yes |
| page | integer |  | Yes |
| limit | integer |  | Yes |
| products | [ [StoreProductListResponse](#storeproductlistresponse) ] |  | Yes |

#### StoreProductListResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| name | string |  | Yes |
| description |  |  | Yes |
| base_price | string |  | Yes |
| currency | string |  | Yes |
| quantity | integer |  | Yes |
| low_stock_threshold |  |  | Yes |
| product_code |  |  | Yes |
| barcode |  |  | Yes |
| qr_code |  |  | Yes |
| location |  |  | Yes |
| is_active | boolean |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |

#### StoreProductUpdate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name |  |  | No |
| description |  |  | No |
| base_price |  |  | No |
| manual_price |  |  | No |
| sku |  |  | No |
| barcode |  |  | No |
| currency |  |  | No |
| category_id |  |  | No |
| low_stock_threshold |  |  | No |
| is_active |  |  | No |
| images |  |  | No |
| specifications |  |  | No |
| variants |  |  | No |
| store_price |  | The specific price for this product in the target store. | No |

#### StoreResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| owner_id | string (uuid) |  | Yes |
| name | string |  | Yes |
| description | string |  | Yes |
| store_code |  |  | No |
| address | string |  | Yes |
| contact_email | string |  | Yes |
| contact_phone | string |  | Yes |
| business_hours | object |  | Yes |
| notification_preferences | object |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |

#### StoreStaffCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| account_id | string (uuid) |  | Yes |
| role | string |  | Yes |
| permissions |  |  | No |

#### StoreStaffResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| store_id | string (uuid) |  | Yes |
| staff_id | string (uuid) |  | Yes |
| role | string |  | Yes |
| permissions | object |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |

#### TermData

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| type | string |  | Yes |
| data | object |  | Yes |
| expiry_date |  |  | No |

#### TermFulfillment

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| term_id | string (uuid) |  | Yes |
| term_type | string |  | Yes |
| email |  |  | No |
| phone_number |  |  | No |
| data | object |  | Yes |

#### TermFulfillmentResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| status | string | Status of the term fulfillment | Yes |
| message | string | Descriptive message about the fulfillment | Yes |
| term_id | string (uuid) |  | Yes |
| term_type | string |  | Yes |
| data | object | Term-specific fulfillment data | Yes |
| escrow_completed | boolean | Whether the escrow was completed | No |

#### Token

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| access_token | string |  | Yes |
| refresh_token | string |  | Yes |
| token_type | string |  | Yes |

#### TransactionCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| group_id | string (uuid) |  | Yes |
| amount |  |  | Yes |
| description | string |  | Yes |

#### TransactionListResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| items | [ object ] |  | Yes |
| total | integer |  | Yes |
| offset | integer |  | Yes |
| limit | integer |  | Yes |

#### TransactionResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| amount | string |  | Yes |
| description | string |  | Yes |
| initiator_id | string (uuid) |  | Yes |
| initiator_username | string |  | Yes |
| created_at | dateTime |  | Yes |
| approved | boolean |  | Yes |
| executed | boolean |  | Yes |

#### TransferCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| to_identifier | string |  | Yes |
| amount |  |  | Yes |
| currency | string |  | Yes |
| description |  |  | Yes |
| mfa_code |  |  | No |

#### TransferDetailResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| from_wallet_id | string (uuid) |  | Yes |
| to_wallet_id | string (uuid) |  | Yes |
| amount | string |  | Yes |
| to_amount | string |  | Yes |
| from_currency | string |  | Yes |
| to_currency | string |  | Yes |
| description |  |  | Yes |
| status | string |  | Yes |
| created_at | dateTime |  | Yes |
| recipient_info | object |  | Yes |
| transaction_data |  |  | Yes |
| from_wallet_info | object |  | Yes |
| to_wallet_info | object |  | Yes |
| status_history |  |  | Yes |

#### TransferListItem

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| from_wallet_id | string (uuid) |  | Yes |
| to_wallet_id | string (uuid) |  | Yes |
| amount | string |  | Yes |
| to_amount | string |  | Yes |
| currency | string |  | Yes |
| from_currency | string |  | Yes |
| to_currency | string |  | Yes |
| status | string |  | Yes |
| description |  |  | Yes |
| created_at | dateTime |  | Yes |
| from_user_type | string |  | Yes |
| to_user_type | string |  | Yes |
| recipient_info | object |  | Yes |

#### TransferListResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| items | [ [TransferListItem](#transferlistitem) ] |  | Yes |
| total | integer |  | Yes |
| offset | integer |  | Yes |
| limit | integer |  | Yes |

#### TransferResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| from_wallet_id | string (uuid) |  | Yes |
| to_wallet_id | string (uuid) |  | Yes |
| amount | string |  | Yes |
| to_amount | string |  | Yes |
| from_currency | string |  | Yes |
| to_currency | string |  | Yes |
| description |  |  | Yes |
| status | string |  | Yes |
| created_at | dateTime |  | Yes |
| recipient_info | object |  | Yes |

#### UnregisteredTermFulfillment

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| term_id | string (uuid) |  | Yes |
| term_type | string |  | Yes |
| data | object |  | Yes |
| email |  |  | No |
| phone_number |  |  | No |
| otp |  |  | No |

#### UserAgent

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| browser | string |  | Yes |
| version | string |  | Yes |
| platform | string |  | Yes |
| device_id | string |  | Yes |

#### UserCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| email | string (email) |  | Yes |
| username | string |  | Yes |
| password | string |  | Yes |
| first_name | string |  | Yes |
| last_name | string |  | Yes |
| phone_number | string |  | Yes |
| account_type | [AccountType](#accounttype) |  | Yes |
| email_otp |  |  | No |
| phone_otp |  |  | No |

#### UserInfo

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| email | string |  | Yes |
| phone_number | string |  | Yes |
| ip_address | string |  | Yes |
| transaction_id | string |  | Yes |
| user_agent | [UserAgent](#useragent) |  | Yes |

#### UserLocation

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| latitude | number |  | Yes |
| longitude | number |  | Yes |

#### UserLoyaltyBalanceResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| program_id | string (uuid) |  | Yes |
| program_name | string |  | Yes |
| store_id | string (uuid) |  | Yes |
| store_name | string |  | Yes |
| points | integer |  | Yes |
| lifetime_points | integer |  | Yes |
| currency_value_of_points | string |  | Yes |

#### UserOut

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| first_name | string |  | Yes |
| last_name | string |  | Yes |
| username | string |  | Yes |
| is_admin | boolean |  | Yes |
| is_staff | boolean |  | Yes |
| is_employer | boolean |  | Yes |
| account_id | string (uuid) |  | Yes |
| email | string (email) |  | Yes |
| phone_number | string |  | Yes |
| account_type | [AccountType](#accounttype) |  | Yes |

#### UserPaymentCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| amount |  |  | Yes |
| currency | string |  | Yes |
| payment_method | [PaymentMethodEnum](#paymentmethodenum) |  | Yes |
| recipient_identifier |  |  | No |
| description |  |  | No |
| mfa_code |  |  | No |
| user_info |  |  | No |

#### UserPaymentResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| status | string |  | Yes |
| amount | string |  | Yes |
| currency | string |  | Yes |
| payment_method | string |  | Yes |
| date | dateTime |  | Yes |
| recipient |  |  | Yes |
| payer |  |  | Yes |
| description |  |  | Yes |
| qr_code |  |  | Yes |

#### UserProfileResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string |  | Yes |
| account_id | string |  | Yes |
| username | string |  | Yes |
| first_name | string |  | Yes |
| last_name | string |  | Yes |
| email | string |  | Yes |
| phone_number | string |  | Yes |
| account_type | [AccountType](#accounttype) |  | Yes |
| payment_qr |  |  | Yes |
| is_verified | boolean |  | Yes |
| has_api_pin | boolean |  | No |
| avatar |  |  | No |
| store_count | integer |  | No |

#### UserQRInfo

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| token | string |  | Yes |
| type | string |  | No |

#### UserRole

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| UserRole | string |  |  |

#### UserSearchResult

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| username | string |  | Yes |
| first_name |  |  | Yes |
| last_name |  |  | Yes |
| email | string |  | Yes |
| payment_qr |  |  | No |

#### UserUpdateOut

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| first_name | string |  | Yes |
| last_name | string |  | Yes |
| username | string |  | Yes |
| email | string |  | Yes |
| phone_number | string |  | Yes |
| account_type | [AccountType](#accounttype) |  | Yes |
| avatar |  |  | No |

#### UserVerificationResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| country | string |  | Yes |
| id_or_passport_document | string |  | Yes |
| self_photo | string |  | Yes |
| video_document |  |  | No |
| additional_documents |  |  | No |
| verification_status | [VerificationStatus](#verificationstatus) |  | Yes |
| document_upload_status | [DocumentUploadStatus](#documentuploadstatus) |  | Yes |
| verification_date | dateTime |  | Yes |

#### ValidationError

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| loc | [  ] |  | Yes |
| msg | string |  | Yes |
| type | string |  | Yes |

#### VerificationStatus

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| VerificationStatus | string |  |  |

#### VoiceCampaignCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string |  | Yes |
| description |  |  | Yes |
| recipients | [  ] | List of contact IDs, emails, or phone numbers | Yes |
| voice_script | [VoiceScript](#voicescript) |  | Yes |
| currency | string |  | Yes |
| country_code | string |  | Yes |
| schedule | [CampaignSchedule](#campaignschedule) |  | Yes |
| retry_attempts | integer |  | No |
| retry_delay_minutes | integer |  | No |
| record_calls | boolean |  | No |
| max_duration_seconds | integer |  | No |

#### VoiceScript

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| initial_message | string |  | Yes |
| menu_options | object |  | Yes |
| responses | object |  | Yes |
| fallback_message | string |  | Yes |
| goodbye_message | string |  | Yes |

#### VoteCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| transaction_id | string (uuid) |  | Yes |
| approved | boolean |  | Yes |

#### VotingMethod

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| VotingMethod | string |  |  |

#### WalletDetailResponse

Detailed information about a user's wallet.

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| currency_code | string |  | Yes |
| currency_name | string |  | Yes |
| currency_symbol | string |  | Yes |
| balance | string |  | Yes |
| escrow_in | string | Total amount in pending escrows to be received by this wallet. | No |
| escrow_out | string | Total amount sent from this wallet into pending escrows. | No |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |

#### WalletResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string |  | Yes |
| user_id | string |  | Yes |
| currency_code | string |  | Yes |
| currency_name | string |  | Yes |
| currency_symbol | string |  | Yes |
| balance | string |  | Yes |
| created_at | dateTime |  | Yes |
| updated_at | dateTime |  | Yes |

#### WebhookCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| url | string (uri) |  | Yes |
| description |  |  | No |
| events | [ string ] |  | Yes |

#### WebhookResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string |  | Yes |
| url | string |  | Yes |
| description |  |  | No |
| events | [ string ] |  | Yes |
| is_active | boolean |  | Yes |
| created_at | dateTime |  | Yes |
| last_triggered_at |  |  | No |
| failure_count | integer |  | Yes |

#### WebhookUpdate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| url |  |  | Yes |
| events |  |  | Yes |
| is_active |  |  | Yes |
| secret |  |  | Yes |

#### WithdrawalDetailResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| wallet_id | string (uuid) |  | Yes |
| amount | string |  | Yes |
| wallet_amount | string |  | Yes |
| currency | string |  | Yes |
| wallet_currency | string |  | Yes |
| payment_method | string |  | Yes |
| transaction_id | string |  | Yes |
| status | string |  | Yes |
| created_at | dateTime |  | Yes |
| user_type | string |  | Yes |
| payment_details |  |  | No |
| transaction_data |  |  | Yes |
| user_info | object |  | Yes |
| status_history | [ object ] |  | Yes |

#### WithdrawalListItem

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| wallet_id | string (uuid) |  | Yes |
| amount | string |  | Yes |
| wallet_amount | string |  | Yes |
| currency | string |  | Yes |
| wallet_currency | string |  | Yes |
| payment_method | string |  | Yes |
| transaction_id | string |  | Yes |
| status | string |  | Yes |
| created_at | dateTime |  | Yes |
| user_type | string |  | Yes |
| payment_details |  |  | Yes |

#### WithdrawalListResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| items | [ [WithdrawalListItem](#withdrawallistitem) ] |  | Yes |
| total | integer |  | Yes |
| offset | integer |  | Yes |
| limit | integer |  | Yes |

#### WithdrawalResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| wallet_id | string (uuid) |  | Yes |
| amount | string |  | Yes |
| wallet_amount | string |  | Yes |
| currency | string |  | Yes |
| wallet_currency | string |  | Yes |
| payment_method | string |  | Yes |
| transaction_id | string |  | Yes |
| status | string |  | Yes |
| created_at | dateTime |  | Yes |
| user_type | string |  | Yes |
| payment_details |  |  | No |

#### saccosavings__schemas__DepositCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| group_id | string (uuid) |  | Yes |
| amount |  |  | Yes |

#### saccosavings__schemas__ReminderCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| title | string |  | Yes |
| description |  |  | No |
| due_date | dateTime |  | Yes |

#### saccosavings__schemas__ReminderResponse

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string (uuid) |  | Yes |
| group_id | string (uuid) |  | Yes |
| creator_username | string |  | Yes |
| title | string |  | Yes |
| description |  |  | Yes |
| due_date | dateTime |  | Yes |
| created_at | dateTime |  | Yes |

#### saccosavings__schemas__WithdrawalCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| group_id | string (uuid) |  | Yes |
| amount |  |  | Yes |

#### wallet__schemas__DepositCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| amount |  |  | Yes |
| currency | string |  | Yes |
| payment_method | string |  | Yes |
| payment_details | object |  | Yes |

#### wallet__schemas__WithdrawalCreate

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| amount |  |  | Yes |
| currency | string |  | Yes |
| payment_method | string |  | Yes |
| payment_details | object |  | Yes |
| mfa_code |  |  | No |
| email |  |  | No |
| phone_number |  |  | No |
| otp |  |  | No |