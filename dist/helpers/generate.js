"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomNumber = exports.generateRandomString = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    const randomBytes = crypto_1.default.randomBytes(length);
    for (let i = 0; i < length; i++) {
        const index = randomBytes[i] % charactersLength;
        result += characters.charAt(index);
    }
    return result;
};
exports.generateRandomString = generateRandomString;
const generateRandomNumber = (length) => {
    const characters = '0123456789';
    const charactersLength = characters.length;
    let result = '';
    const randomBytes = crypto_1.default.randomBytes(length);
    for (let i = 0; i < length; i++) {
        const index = randomBytes[i] % charactersLength;
        result += characters.charAt(index);
    }
    return result;
};
exports.generateRandomNumber = generateRandomNumber;
