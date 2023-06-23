import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';

import { db } from '@/database';
import { UserModel } from '@/models';
import { jwt } from '@/utils';


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
        case 'GET':
            
            return checkJWT(req, res);
    
        default:
            return res.status(400).json({
                message: 'Bad Request'
            });
    }

}


const checkJWT = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { token = ''  } = req.cookies

    
    let userId = ''
    
    try {
        userId = await jwt.isValidToken(token)
    } catch (error) {
        return res.status(401).json({
            message: 'Token de autorizacion no es valido'
        })
    }
    
    await db.connect()
    const user = await UserModel.findById(userId).lean()
    db.disconnect()

    if (!user) {
        return res.status(400).json({
            message: 'Usuario no existe'
        })
    }

    
    const { _id, email, role, name } = user

    return res.status(200).json({
        token: await jwt.signToken(_id, email),
        user: {
            email,
            role,
            name
        }
    })
}

