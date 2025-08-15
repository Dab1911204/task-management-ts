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
exports.list = exports.detail = exports.resetPassword = exports.otpPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../../../models/user.model"));
const forgot_password_model_1 = __importDefault(require("../../../models/forgot-password.model"));
const md5_1 = __importDefault(require("md5"));
const generate_1 = require("../../../helpers/generate");
const sendMail_1 = __importDefault(require("../../../helpers/sendMail"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.password = (0, md5_1.default)(req.body.password);
    const existEmail = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false
    });
    if (existEmail) {
        res.json({
            code: 400,
            message: "Email đã tồn tại!"
        });
    }
    else {
        const user = new user_model_1.default({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            tokenUser: (0, generate_1.generateRandomString)(32)
        });
        yield user.save();
        const token = user.tokenUser;
        res.cookie("token", token);
        res.json({
            code: 200,
            message: "Tạo tài khoản thành công!",
            token: token
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại!"
        });
        return;
    }
    else {
        if ((0, md5_1.default)(password) !== user.password) {
            res.json({
                code: 400,
                message: "Sai mật khẩu!"
            });
            return;
        }
        const token = user.tokenUser;
        res.cookie("token", token);
        res.json({
            code: 200,
            message: "Đăng nhập thành công!",
            token: token
        });
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại!"
        });
        return;
    }
    const otp = (0, generate_1.generateRandomNumber)(6);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    };
    const forgotPassword = new forgot_password_model_1.default(objectForgotPassword);
    yield forgotPassword.save();
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `Mã OTP xác minh lấy lại mật khẩu: <b>${otp}</b>. Thời hạn sửa dụng là 3 phút`;
    (0, sendMail_1.default)(email, subject, html);
    res.json({
        code: 200,
        message: "Gửi mã OTP qua email thành công!"
    });
});
exports.forgotPassword = forgotPassword;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = yield forgot_password_model_1.default.findOne({
        email: email,
        otp: otp
    });
    if (!result) {
        res.json({
            code: 400,
            message: "Mã OTP không đúng!"
        });
        return;
    }
    const user = yield user_model_1.default.findOne({
        email: email,
        deleted: false
    });
    const token = user.tokenUser;
    res.cookie("token", token);
    res.json({
        code: 200,
        message: "Xác thực thành công!",
        token: token
    });
});
exports.otpPassword = otpPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const password = req.body.password;
    const user = yield user_model_1.default.findOne({
        tokenUser: token,
        deleted: false
    });
    if ((0, md5_1.default)(password) === user.password) {
        res.json({
            code: 400,
            message: "Mật khẩu mới không được trùng với mật khẩu cũ!"
        });
        return;
    }
    yield user_model_1.default.updateOne({
        tokenUser: token
    }, {
        password: (0, md5_1.default)(password)
    });
    res.json({
        code: 200,
        message: "Đổi mật khẩu thành công!"
    });
});
exports.resetPassword = resetPassword;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        code: 200,
        message: "Lấy thông tin thành công!",
        user: req["user"]
    });
});
exports.detail = detail;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find({
        deleted: false
    }).select("fullName email");
    res.json({
        code: 200,
        message: "Lấy thông tin thành công!",
        users: users
    });
});
exports.list = list;
