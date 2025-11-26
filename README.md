[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=21838847)
# User Management Server ✨
A Node.js Express server with full CRUD functionality for managing users. Features include encrypted password storage, JSON-based persistence, and RESTful API endpoints for GET, POST, PUT, and DELETE operations.

## Up & running 🏃‍➡️
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. The server runs on `http://localhost:3000`

### API Endpoints
- **GET** `/users` - Get all users (or specific user with `?id=X`)
- **POST** `/users` - Create new user (requires: name, email, password, profilePictureUrl)
- **PUT** `/users/:id` - Update user
- **DELETE** `/users/:id` - Delete user

### Example: Create a user
```bash
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "profilePictureUrl": "https://example.com/avatar.jpg"
}
```

## Sources 🗃️
List **ALL your used sources** here:
- Used a tutorial or example code? Place a link to them here. (youtube, website, github, ...) and **list the files in which they were used**.
- Used ChatGPT? Generate a ChatGPT share link: options (three dots) > share and **list the files in which it was used**. This will not work if you have uploaded images in your prompt. In that case, add screenshots instead.

It's not enough to only list the sources here, also add the sources to the top of the files in which you used them and indicate the specific parts of the code which are not your own (by writing comments and refering to the correct source(s)). \
IF you use a source as the base/start for a file, then first place the source in the file and **COMMIT it IMMEDIATELY, BEFORE** adding your own code or modifying it. \
**ALWAYS** use concise BUT CLEAR commit messages!

Have a look at the example repository: https://github.com/EHB-MCT/example-readme
