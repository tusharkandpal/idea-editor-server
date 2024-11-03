import Room from '../models/room.model';

const createRoom = async (roomId: string) => {
    try {

        const roomCreated = await new Room({ roomId }).save();
        return roomCreated;
    }
    catch (e) {
        console.error(`Error createRoom :: ${e}`)
    }
}

export { createRoom }