import jsonServer from 'json-server';

const { create, router: _router, defaults } = jsonServer;

const server = create();
const router = _router('db.json');
const middlewares = defaults();
const port = process.env.PORT || 8080;

server.use(middlewares);
server.use(router);

server.listen(port);