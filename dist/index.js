"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const loadEnvironment_1 = __importDefault(require("./loadEnvironment"));
const user_model_1 = __importDefault(require("./models/user.model"));
const room_route_1 = require("./routes/room.route");
dotenv_1.default.config();
(0, loadEnvironment_1.default)();
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const options = {
    cors: {
        origin: ['http://localhost:5173', 'https://idea-editor.vercel.app'],
    }
};
const io = new socket_io_1.Server(httpServer, options);
io.on("connect", (socket) => {
    console.log(`User Connected !! ${socket.id}`);
    socket.on('create-room', (roomId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`room : ${roomId} create room enter !!`);
        socket.join(roomId);
        const roomCreatedRes = yield (0, room_route_1.createRoom)(socket.id, roomId);
        const roomCreated = roomCreatedRes === null || roomCreatedRes === void 0 ? void 0 : roomCreatedRes.toObject();
        socket.emit("code-change", roomCreated === null || roomCreated === void 0 ? void 0 : roomCreated.code);
        // console.log(`User ${socket.id} joined room: ${roomCreated.roomId}`);
    }));
    // Handle codeChange events
    socket.on('code-change', (data) => {
        const { roomId, code } = data;
        console.log(`room : ${roomId} code changes enter !!`);
        // Broadcast code change to other users in the room
        (0, room_route_1.persistCodeChanges)(roomId, code);
        socket.to(roomId).emit('code-change', code);
        console.log(`room : ${roomId} code changes EXIT !!`);
    });
    // Handle codeChange events
    socket.on('event', () => {
        console.log(`Event emitted by TUshar YOOOO!! `);
    });
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
const roomNamespace = io.of("/rooms");
roomNamespace.on("connection", (socket) => {
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Room disconnected:', socket.id);
    });
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find({});
    const roomsToSet = [{
            roomId: "sdhghghghgh",
            members: ["Tushar, Sneha"]
        },
        {
            roomId: "sdasdasdasdasd",
            members: ["Tushar, Tanuj"]
        }];
    // Room.insertMany(roomsToSet);
    res.json({ status: 200, message: "Users Fetched!!" });
}));
httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
