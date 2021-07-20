import {createServer} from "http";
import {Server, Socket} from "socket.io";
import https from "https";
import DatabaseHandler from "./util/databaseHandler";
import Bot from "./bot";
import * as fs from "fs";
import * as path from "path";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        //to github
        origin: "*",
        methods: ["GET", "POST"]
    }
});
//http server
io.on("connection", (socket: Socket) => {
    let init = DatabaseHandler.getStartData();
    socket.emit("initStartup", init);
});
httpServer.listen(3000);

//https server
try {
    // Certificates ToDo change the files to the correct pems
    const privateKey = fs.readFileSync(path.resolve(process.cwd(), "pkey.txt")).toString("utf-8");
    const certificate = fs.readFileSync(path.resolve(process.cwd(), "csr.txt")).toString("utf-8");
    const ca = fs.readFileSync(path.resolve(process.cwd(), "ca.txt")).toString("utf-8");

    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };
    // Create https server
    const httpsServer = https.createServer(credentials);

    // Socket listens on https
    io.listen(httpsServer);
    httpsServer.listen(3001);

} catch (e) {
    // Certificates not found
    console.log(e);
}

// @ts-ignore
new Bot(process.env.token!, process.env.prefix!, io);

