import Room, { IRoom } from '../models/room.model';

// TO UPDATE MEMBERS
const updateMembers =
    async (isRoomExists: IRoom, roomId: string, socketId: string) => {
        try {
            // console.log(isRoomExists);
            if (isRoomExists.members?.some(member => member !== socketId)) {
                const newRoom = { ...isRoomExists, members: [...isRoomExists.members, socketId] };
                await Room.updateOne({ roomId }, newRoom);
                console.log(`members updated !!`);
            } else {
                console.log(`member aleady present !!`);
            }
        }
        catch (err) {
            console.error(`Error persistCodeChanges :: ${err}`);
        }
    }

// TO CREATE A ROOM
const createRoom = async (socketId: string, roomId: string) => {
    try {
        const isRoomExists = await Room.findOne({ roomId });

        if (isRoomExists) {
            await updateMembers(isRoomExists.toObject(), roomId, socketId);
            console.log(`room : ${roomId} ALREADY EXISTS !!`);
            return isRoomExists;

        } else {
            const roomCreated = await new Room({ roomId, members: [socketId], code: "console.log('hello world!');" }).save();
            console.log(`new room : ${roomId} CREATED  !!`);
            return roomCreated;
        }
    }
    catch (e) {
        console.error(`Error createRoom :: ${e}`)
    }
}

// TO PERSIST CODE CHANGES
const persistCodeChanges = async (roomId: string, newCode: string) => {
    try {
        const currentRoom = await Room.find({ roomId });
        const roomToBeUpdated = { ...currentRoom, code: newCode };
        await Room.updateOne(roomToBeUpdated);
        console.log(`room : ${roomId} code persisted done !!`);
    }
    catch (e) {
        console.error(`Error persistCodeChanges :: ${e}`)
    }
}

export { createRoom, persistCodeChanges }