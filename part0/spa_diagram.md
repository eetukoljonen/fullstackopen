# 0.5: Single page app diagram

```mermaid
sequenceDiagram
  participant browser
  participant server

  Note right of browser: The browser makes a GET request to server
  browser->>server: GET /exampleapp/spa
  activate server
  server-->>browser: STATUS 200 + HTML page
  deactivate server

  browser->>server: GET /exampleapp/main.css
  activate server
  server-->>browser: STATUS 200 + main.css
  deactivate server

  browser->>server: GET /exampleapp/spa.js
  activate server
  server-->>browser: STATUS 200 + spa.js
  deactivate server

  browser->>server: GET /exampleapp/data.json
  activate server
  server-->>browser: STATUS 200 + raw json data
  deactivate server
  Note right of browser: Script fills all of the notes
```
