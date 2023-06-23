import { db } from '@/database';
import { IProduct } from '@/interface';
import { ProductModel } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = 
| { message: string }
| IProduct[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return searchProducts(req, res);
    
        default:
            return res.status(400).json({
                message: 'Bad Request'
            });
    }

    
}

async function searchProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    let { q = '' } = req.query

    if (q.length === 0) {
        return res.status(400).json({
            message: 'Debe de especificar el query de busqueda'
        })
    }

    q = q.toString().toLocaleLowerCase()

    await db.connect()
    const products = await ProductModel.find({
        $text: { $search: q }
    })
    .select('title images price inStock slug -_id')
    .lean()
    await db.disconnect()

    return res.status(200).json(products)

}
