"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const roomSchema = new Schema({
    roomId: String,
    members: [String],
    code: String
}, { versionKey: false });
const Room = mongoose_1.default.model('Room', roomSchema);
exports.default = Room;
