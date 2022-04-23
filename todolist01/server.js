const http = require('http');
const { v4: uuidv4 } = require('uuid');
const todos = [
    // {
    //     "name": "Jerry",
    //     "content": "今天天氣真晴朗"
    // }
];

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
                const todo = JSON.parse(body);
                if (todo.name === undefined || todo.content === undefined) {
                    res.writeHead(400, headers);
                    res.write(JSON.stringify({
                        "status": "false",
                        "message": "請填寫 name 屬性或 content 屬性"
                    }));
                    res.end();
                } else {
                    const newTodo = {
                        id: uuidv4(),
                        name: todo.name,
                        content: todo.content
                    }
                    todos.push(newTodo);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        todos
                    }));
                    res.end();
                }
            } catch (error) {
                console.log(error)
            }
        })
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
            try {
                const newTodo = JSON.parse(body);
                const id = req.url.split('/').pop();
                const index = todos.findIndex(el => el.id === id);
                if (index !== -1 && newTodo.name !== undefined && newTodo.content !== undefined) {
                    todos[index].name = newTodo.name;
                    todos[index].content = newTodo.content;
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
            } catch (error) {
                console.log(error)
            }
        });
        
        
    } else {
        res.writeHead(404, headers);
        res.write('404 not found');
        res.end();
    }
};

const server = http.createServer(requestListener);
server.listen(3000);