const http = require('http');
const { v4: uuidv4 } = require('uuid');
const todos = [];

const requestListener = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  };

  let body = '';
  req.on('data', (chunk) => {
    body += chunk
  });

  if (req.url == '/todos' && req.method == 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      todos
    }));
    res.end();
  } else if (req.url == '/todos' && req.method == 'POST') {
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const newTodo = {
          id: uuidv4(),
          name: data.name
        };
        todos.push(newTodo);
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          "status": "success",
          todos
        }));
        res.end();
      } catch (error) {
        res.writeHead(400, headers);
        res.write(JSON.stringify({
          "status": "false",
          "message": "格式錯誤",
          "error": error
        }));
        res.end();
      }
    });
  } else if (req.url == '/todos' && req.method == 'DELETE') {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      todos
    }));
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex(el => el.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        "status": "success",
        todos
      }));
      res.end();
    } else {
      res.writeHead(400, headers);
      res.write(JSON.stringify({
        "status": "false",
        "message": "無此 ID"
      }));
      res.end();
    }
  } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
    req.on('end', () => {
      const id = req.url.split('/').pop();
      const index = todos.findIndex(el => el.id === id);
      const data = JSON.parse(body);
      if (index !== -1 && data.name !== undefined) {
        todos[index].name = data.name;
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          "status": "false",
          todos
        }));
        res.end();
      } else {
        res.writeHead(400, headers);
        res.write(JSON.stringify({
          "status": "false",
          "message": "無此 ID 或未填寫 name 屬性"
        }));
        res.end();
      }
    });
  } else {
    res.writeHead(400, headers);
    res.write("404 not found");
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(4000)