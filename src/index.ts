import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server, ServerOptions, Socket } from 'socket.io';
import initializeDBConnection from "./loadEnvironment";
import { IRoom } from './models/room.model';
import User from './models/user.model';
import { createRoom, persistCodeChanges } from './routes/room.route';

dotenv.config();
initializeDBConnection();

const port = process.env.PORT || 3000;
const app: Express = express();
const httpServer = createServer(app);
const options = {
    cors: {
        origin: 'http://localhost:5173',
    }
};
const io: Server = new Server(httpServer, options);

io.on("connect", (socket: Socket) => {
    console.log(`User Connected !! ${socket.id}`);

    socket.on('create-room', async (roomId) => {
        console.log(`room : ${roomId} create room enter !!`);
        socket.join(roomId);
        const roomCreatedRes = await createRoom(socket.id, roomId);
        const roomCreated = roomCreatedRes?.toObject();
        socket.emit("code-change", roomCreated?.code)
        // console.log(`User ${socket.id} joined room: ${roomCreated.roomId}`);
    });

    // Handle codeChange events
    socket.on('code-change', (data) => {
        const { roomId, code } = data;
        console.log(`room : ${roomId} code changes enter !!`);
        // Broadcast code change to other users in the room
        persistCodeChanges(roomId, code);
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


app.get("/", async (req: Request, res: Response) => {
    const users = await User.find({});

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
});


httpServer.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});