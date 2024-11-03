import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema & Model creation
export interface IRoom extends Document {
    roomId: string,
    members?: string[],
    code?: string
}

const roomSchema = new Schema<IRoom>({
    roomId: String,
    members: [String],
    code: String
}, { versionKey: false });

const Room = mongoose.model<IRoom>('Room', roomSchema);

export default Room;