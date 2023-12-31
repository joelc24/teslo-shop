import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';

import { db } from '@/database';
import { UserModel } from '@/models';
import { jwt, validations } from '@/utils';


type Data = 
{ message: string }
| { 
    token: string
    user: {
        email: string
        name: string
        role: string
    } 
}
export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            
            return registerUser(req, res);
    
        default:
            return res.status(400).json({
                message: 'Bad Request'
            });
    }

}


const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string }

    
    if (password.length < 6) {
        return res.status(400).json({
            message: 'La contraseña debe de ser de 6 caracteres o mas'
        })
    }
    
    if (name.length < 3) {
        return res.status(400).json({
            message: 'El nombre debe de ser de 2 caracteres o mas'
        })
    }

    if (!validations.isValidEmail(email)) {
        return res.status(400).json({
            message: 'El correo no es valido'
        })
    }
    
    await db.connect()
    const user = await UserModel.findOne({ email })

    if (user) {
        db.disconnect()
        return res.status(400).json({
            message: 'El correo ya está registrado'
        })
    }
    
    const newUser = new UserModel({ 
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name
    })

    try {
        await newUser.save({ validateBeforeSave: true })
    } catch (error) {
        console.log("error: ", error)
        return res.status(500).json({
            message: 'Revisar logs del servidor'
        })
    }

    const { _id } = newUser

    const token = await jwt.signToken(_id, email)

    return res.status(200).json({
        token,
        user: {
            email,
            role: 'client',
            name
        }
    })
}

