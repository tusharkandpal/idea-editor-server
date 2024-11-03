import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server, ServerOptions, Socket } from 'socket.io';
import initializeDBConnection from "./loadEnvironment";
import { IRoom } from './models/room.model';
import User from './models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { createRoom } from './routes/room.route';

dotenv.config();
initializeDBConnection();

const port = process.env.PORT || 3000;
const app: Express = express();
const httpServer = createServer(app);
const options = { /* ... */ };
const io: Server = new Server(httpServer, options);

io.on("connect", (socket: Socket) => {
    console.log(`User Connected !! ${socket.id}`);

    socket.on('create-room', async () => {
        const roomId = uuidv4();
        socket.join(roomId);
        const roomCreated = await createRoom(roomId) as IRoom;
        console.log(`User ${socket.id} joined room: ${roomCreated.roomId}`);

    });

    // Handle codeChange events
    socket.on('codeChange', (data) => {
        const { roomId, code } = data;
        // Broadcast code change to other users in the room
        socket.to(roomId).emit('codeChange', code);
        console.log(`Code change in room ${roomId}:`, code);
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