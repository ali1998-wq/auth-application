const {DBconnection}=require("./utils/db/index");
const app=require("./utils/express/index");
const {socketSetup}=require("./utils/socket/index");
const http=require("http");

const startServer = async () => {
  DBconnection();
  const server=http.createServer(app);
  socketSetup(server);
  const PORT = process.env.PORT;
  server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
};

startServer();
