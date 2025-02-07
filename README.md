# API Configrations

## Environment Variables
**set the following environment variables in .env file to complete setup**
PORT=3110
MONGO_URL=the url to connect to mongodb
JWT_SECRET= secret key for token encryption and data signing
CLIENT_URL=http://localhost:3001

## API endpoints

### **Base URL : http://localhost:3001/api** 



#### **user managment**
| Request Method | Endpoint    |  Description |
|----------------|-------------|--------------|
| **GET** | /users/:id | get Single User information |
| **GET** | /users/me/info | the user gets his own information - more data available - |
| **GET** | /users/checkUsername/:username | check if the username available for usage or its already exists in db|
| **GET** | /users/checkEmail/:email | check if the email available for usage or its already exists in db |
| **PUT** | /users/:id/follow | the logged in user follow the user with specified id |
| **PUT** | /users/:id/unfollow | the logged in user unfollow the user with specified id |
| **PUT** | /users/ | Update userInformation for the user how send the request (logged in user) |
| **DELETE** | /users/ | Delete the user account by admin or by deactivate it |
