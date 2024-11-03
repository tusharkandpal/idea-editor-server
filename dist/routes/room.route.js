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
exports.persistCodeChanges = exports.createRoom = void 0;
const room_model_1 = __importDefault(require("../models/room.model"));
// TO UPDATE MEMBERS
const updateMembers = (isRoomExists, roomId, socketId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // console.log(isRoomExists);
        if ((_a = isRoomExists.members) === null || _a === void 0 ? void 0 : _a.some(member => member !== socketId)) {
            const newRoom = Object.assign(Object.assign({}, isRoomExists), { members: [...isRoomExists.members, socketId] });
            yield room_model_1.default.updateOne({ roomId }, newRoom);
            console.log(`members updated !!`);
        }
        else {
            console.log(`member aleady present !!`);
        }
    }
    catch (err) {
        console.error(`Error persistCodeChanges :: ${err}`);
    }
});
// TO CREATE A ROOM
const createRoom = (socketId, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isRoomExists = yield room_model_1.default.findOne({ roomId });
        if (isRoomExists) {
            yield updateMembers(isRoomExists.toObject(), roomId, socketId);
            console.log(`room : ${roomId} ALREADY EXISTS !!`);
            return isRoomExists;
        }
        else {
            const roomCreated = yield new room_model_1.default({ roomId, members: [socketId], code: "console.log('hello world!');" }).save();
            console.log(`new room : ${roomId} CREATED  !!`);
            return roomCreated;
        }
    }
    catch (e) {
        console.error(`Error createRoom :: ${e}`);
    }
});
exports.createRoom = createRoom;
// TO PERSIST CODE CHANGES
const persistCodeChanges = (roomId, newCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentRoom = yield room_model_1.default.find({ roomId });
        const roomToBeUpdated = Object.assign(Object.assign({}, currentRoom), { code: newCode });
        yield room_model_1.default.updateOne(roomToBeUpdated);
        console.log(`room : ${roomId} code persisted done !!`);
    }
    catch (e) {
        console.error(`Error persistCodeChanges :: ${e}`);
    }
});
exports.persistCodeChanges = persistCodeChanges;
