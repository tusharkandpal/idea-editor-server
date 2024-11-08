"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
// Schema & Model creation
const userSchema = new Schema({
    _id: String,
    email: String,
    username: String,
    password: String,
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
