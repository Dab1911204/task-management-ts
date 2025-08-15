import crypto from 'crypto';

export const generateRandomString = (length:number):String => {
    const characters:String = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength:number = characters.length;
    let result:String = '';

    const randomBytes:Buffer = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        const index:number = randomBytes[i] % charactersLength;
        result += characters.charAt(index);
    }

    return result;
};
export const generateRandomNumber = (length:number):String => {
    const characters:String = '0123456789';
    const charactersLength:number = characters.length;
    let result:String = '';

    const randomBytes:Buffer = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        const index:number = randomBytes[i] % charactersLength;
        result += characters.charAt(index);
    }

    return result;
};
