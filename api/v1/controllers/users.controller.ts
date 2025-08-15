import { Request, Response } from 'express';
import User from '../../../models/user.model';
import ForgotPassword from '../../../models/forgot-password.model';
import md5 from 'md5';
import {generateRandomNumber, generateRandomString} from '../../../helpers/generate';
import sendMailHelper  from '../../../helpers/sendMail';

//[POST] /api/v1/users/register
export const register = async (req: Request, res: Response) => {
    req.body.password = md5(req.body.password)

    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    if (existEmail) {
        res.json({
            code: 400,
            message: "Email đã tồn tại!"
        })
    } else {
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            tokenUser:generateRandomString(32)
        })

        await user.save()

        const token = user.tokenUser
        res.cookie("token", token)

        res.json({
            code: 200,
            message: "Tạo tài khoản thành công!",
            token: token
        })
    }

}

//[POST] /api/v1/users/login
export const login = async (req: Request, res: Response) => {
    const email:String = req.body.email;
    const password:String = req.body.password

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại!"
        })
        return
    } else {
        if (md5(password) !== user.password) {
            res.json({
                code: 400,
                message: "Sai mật khẩu!"
            })
            return
        }

        const token = user.tokenUser
        res.cookie("token", token)

        res.json({
            code: 200,
            message: "Đăng nhập thành công!",
            token: token
        })
    }

}

//[POST] /api/v1/users/password/forgot
export const forgotPassword = async (req: Request, res: Response) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại!"
        })
        return
    }

    const otp = generateRandomNumber(6)

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

    //gửi email
    const subject = "Mã OTP xác minh lấy lại mật khẩu"
    const html = `Mã OTP xác minh lấy lại mật khẩu: <b>${otp}</b>. Thời hạn sửa dụng là 3 phút`
    sendMailHelper(email, subject, html)

    res.json({
        code: 200,
        message: "Gửi mã OTP qua email thành công!"
    })
}

//[POST] /api/v1/users/password/otp
export const otpPassword = async (req: Request, res: Response) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    if(!result){
        res.json({
            code: 400,
            message: "Mã OTP không đúng!"
        })
        return
    }
    const user = await User.findOne({
        email: email,
        deleted: false
    })

    const token = user.tokenUser
    res.cookie("token", token)

    res.json({
        code: 200,
        message: "Xác thực thành công!",
        token: token
    })

}

//[POST] /api/v1/users/password/reset
export const resetPassword = async (req: Request, res: Response) => {
    const token = req.cookies.token;
    const password = req.body.password;

    const user = await User.findOne({
        tokenUser: token,
        deleted: false
    })

    if(md5(password) === user.password){
        res.json({
            code: 400,
            message: "Mật khẩu mới không được trùng với mật khẩu cũ!"
        })
        return
    }

    await User.updateOne({
        tokenUser: token
    }, {
        password: md5(password)
    })





    res.json({
        code: 200,
        message: "Đổi mật khẩu thành công!"
    })

}

//[GET] /api/v1/users/detail
export const detail = async (req: Request, res: Response) => {

    res.json({
        code: 200,
        message: "Lấy thông tin thành công!",
        user: req["user"]
    })

}

//[GET] /api/v1/users/list
export const list = async (req: Request, res: Response) => {
    const users = await User.find({
        deleted: false
    }).select("fullName email")
    res.json({
        code: 200,
        message: "Lấy thông tin thành công!",
        users: users
    })

}