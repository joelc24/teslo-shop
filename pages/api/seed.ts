import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/database'
import { OrderModel, ProductModel, UserModel } from '@/models'
import { seedDatabase } from '@/database'

type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if (process.env.NODE_ENV === 'production') {
        return res.status(401).json({
            message: 'No tienes acceso a este endpoint en produccion'
        })
    }

    await db.connect()

    await UserModel.deleteMany()
    await UserModel.insertMany(seedDatabase.initialData.users)
    
    await ProductModel.deleteMany()
    await ProductModel.insertMany(seedDatabase.initialData.products)

    await OrderModel.deleteMany()
    await db.disconnect()

    res.status(200).json({ message : 'Exito al llenar la informacion' })
}