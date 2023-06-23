import { IOrder } from '@/interface';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { authOptions } from '../auth/[...nextauth]';
import { db } from '@/database';
import { OrderModel, ProductModel } from '@/models';

type Data = 
    { message: string }
    | IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            
            return createRouteLoader(req, res);
    
        default:
            res.status(400).json({ message: 'Bad Request' });
    }

    res.status(200).json({ message: 'Example' })
}

async function createRouteLoader(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    const { orderItems, total } = req.body as IOrder

    //?verificar que tengamos un usuario
    const session: any = await getServerSession(req, res, authOptions)
    
    if (!session) {
        return res.status(401).json({ message: 'Debe de estar autenticado para hacer esto'})
    }

    //?Crear un arreglo con los productos que la persona quiere

    const productIds = orderItems.map(producto => producto._id)
    await db.connect()

    const dbProducts = await ProductModel.find({ _id: { $in: productIds } })
    
    try {
        const subTotal = orderItems.reduce((prev, current) => {

            const currentPrice = dbProducts.find(prod => prod.id === current._id)?.price
            if (!currentPrice) {
                throw new Error("Verifique el carrito de nuevo producto no existe");
                
            }
            
            return (currentPrice * current.quantity) + prev
        }, 0)

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)
        const backendTotal = subTotal * (taxRate + 1)

        if (total !== backendTotal) {
            throw new Error("El total no cuadra con el monto");
        }

        //? Todo bien hasta este punto
        const userId = session.user._id
        const newOrder = new OrderModel({...req.body, isPaid: false, user: userId})
        newOrder.total = Math.round( newOrder.total * 100 ) / 100
        
        await newOrder.save()
        await db.disconnect()
        return res.status(201).json(newOrder)
    } catch (error:any) {
        await db.disconnect()
        console.log(error)
        return res.status(400).json({
            message: error.message || 'Revise los logs del servidor'
        })
    }

}
