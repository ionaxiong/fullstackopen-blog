require("./models");
const http = require("http");
const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db");
const logger = require("./utils/logger");
const app = require("./app");

const server = http.createServer(app);

// await connectToDatabase();
const startServer = async () => {
  await connectToDatabase();
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

startServer();

// server.listen(PORT, () => {
//   logger.info(`Server running on port ${PORT}`);
// });
