# Info-sec-analyzer

## Manual Installation and Launch Guide

**Prerequisites:**

- Linux
- Git
- Node.js and npm
- Python 3 and pip
- sudo privileges

## Server Setup

1. **Clone the repository:**

```bash
git clone https://github.com/cansolele/info-sec-analyzer
```

2. **Navigate to the server directory:**

```bash
cd info-sec-analyzer/server
```

3. **Install server dependencies:**

```bash
pip install Flask flask-socketio gunicorn openpyxl requests python-dateutil flask_cors
```

4. **Install required system packages:**

```bash
sudo apt install libxml-xpath-perl pdfgrep
```

5. **Install and configure exploitdb:**

```bash
sudo git clone https://gitlab.com/exploit-database/exploitdb.git /opt/exploitdb
sudo ln -sf /opt/exploitdb/searchsploit /usr/local/bin/searchsploit
```

6. **Update the searchsploit database:**

```bash
searchsploit -u
```

7. **Run the server:**

```bash
python3 server.py
```

## Client Setup

1. **Navigate to the client directory:**

```bash
cd info-sec-analyzer/client
```

2. **Install client dependencies:**

```bash
npm install
```

3. **Edit the configuration file (if server is on a different host)::**

_If your server is running on a different machine than the client, open `info-sec-analyzer/client/src/config.js` and modify the `apiURL` value to match the address of your server._ For example:

```javascript
const config = Object.freeze({
  apiURL: "http://127.0.0.1:5000", // Replace with your server address
});
export default config;
```

4. **Build the client application:**

```bash
npm run build
```

This will create a production-ready build of your application in the `dist` folder.

5. **Serve the client application:**

You can use any static file server to serve the content of the `dist` folder. Here are two options:

- **Simple HTTP server (Python 3):**

```bash
python3 -m http.server 8080 --directory dist
```

- **Serve package (Node.js):**

```bash
npx serve -s dist
```
