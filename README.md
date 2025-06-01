An application that authenticates users via OTP code sent to their phone number. User-friendly interface with two main parts:

- **Client**: React frontend (Vite + TypeScript)

- **Server**: Node.js backend (Express + Firebase)

---
## 🛠 Environment Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/VinhLee-1501/github-auth-app.git
cd github-auth-app
```

### Step 2: Set up the Node.js backend
cd server
npm install
npm run dev

### Step 3: Set up the React frontend
cd client
npm install
npm run dev

---

## Application Interface
A simple OTP login flow via phone number with the following steps:
1. Enter your phone number
![Login Screenshot](server/screenshot/login.png)
2. Receive OTP via SMS
![OTP Screenshot](server/screenshot/otp.png)
3. Successful login
![Success Screenshot](server/screenshot/loginSuccessfully.png)
4. Personal profile screen
![Parsonal Screenshot](server/screenshot/personal.png)
### Step 4: Run the application
```bash
client
npm run dev

server
npm run dev
```