import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema & Model creation
export interface IRoom extends Document {
    roomId: string,
    members?: [],
}

const roomSchema = new Schema<IRoom>({
    roomId: String,
    members: []
}, { versionKey: false, id: false });

const Room = mongoose.model<IRoom>('Room', roomSchema);

export default Room;