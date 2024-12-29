import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

export const createError = (status, msg) => {
    const err = new Error();
    err.statusCode = status || 500;
    err.message = msg;

    return err;
};

export const createToken = (data) => {
    const jwt_key = process.env.JWT_SECRET;

    const payload = {
        date: Date(),
        ...data,
    };

    const token = jwt.sign(data, jwt_key, { expiresIn: '24h' });

    return token;
};

export const createHashedPassword = async (password) => {
    // generate hashed Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

export const verifyUser = (req, res, next) => {

    const token = req.cookies.user_login_session;

    if (!token) {
        const err = createError(401, "Token Missed")
        return next(err);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // Decode and verify the token
        req.user = decoded; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        next(createError(err.statusCode, err.message));
    }
};