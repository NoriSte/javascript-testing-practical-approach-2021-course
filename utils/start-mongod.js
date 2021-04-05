const { spawn } = require("child_process");

// on your local machine (but not in Travis) you need to launch mongoDB before using it
if (!process.env.CI) {
  spawn("mongod", ["--config", "/usr/local/etc/mongod.conf"]);
}
