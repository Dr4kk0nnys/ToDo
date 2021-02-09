import { Router } from 'express';
import Database from '../utils/database';

/**
    * Configuration.
    * It will initialize the router of the file.
    * It will initialize the database and it's methods.
**/
const router = Router();
const database = new Database();


router.post('/', async (req, res) => {
    const { email, password }: { email: string, password: string } = req.body;

    /**
        * It will perform the following checks:
            * Check if the email is valid.
            * Check if the email is not on the database.
            * Check if the password attends the requirements.
    **/
    if (!email.includes('@')) return res.send({ success: false, errorCode: 0, message: 'Invalid Email!' });

    if (await database.isEmailAlreadyRegistered(email)) return res.send({ success: false, errorCode: 1, message: 'Email Already Registered!' });

    /**
        * The password requirements are the following:
            * At least 10 characters.
            * At least 2 numbers.
            * At least 2 capital letters.
    **/
    const quickPasswordMatch = (match: RegExp, length: number) => password.match(match) && password.match(match).length >= length;

    if (password.length >= 10 && quickPasswordMatch(/[0-9]/g, 2) && quickPasswordMatch(/[A-Z]/g, 2)) console.log(`\n\n\n yayy \n\n\n`);

    console.log(email, password);
    return res.send({ success: true });
});

export default router;