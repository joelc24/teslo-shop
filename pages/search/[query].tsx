import { GetServerSideProps, NextPage } from "next";
import { Box, Typography } from "@mui/material";

import { useProducts } from "@/hooks";
import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { dbProduct } from "@/database";
import { IProduct } from "@/interface";

interface Props {
    products: IProduct[]
    foundProducts: boolean
    query: string
}

const QueryPage: NextPage<Props> = ({ products, foundProducts, query }) => {

//   const { products, isLoading, isError } = useProducts('/products')


  return (
    <ShopLayout title="Teslo-Shop - Search" pageDescription="Encuentra los mejores productos de Teslo aqui">
      <>
        <Typography variant="h1" component="h1">Buscar producto</Typography>
        
        {
            foundProducts
            ? <Typography variant="h2" sx={{ mb: 1 }} textTransform="capitalize">Termino: { query }</Typography>
            : (
                <Box display="flex">
                    <Typography variant="h2" sx={{ mb: 1 }}>No encontramos ningun producto</Typography>
                    <Typography variant="h2" sx={{ ml: 1 }} color="secondary" textTransform="capitalize">{ query }</Typography>

                </Box>
            )
        }
        


         <ProductList products={products} />
        
      </>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    
    const { query = '' } = params as { query:string }

    if (query.length === 0) {
        return {
            redirect:{ 
                destination: '/',
                permanent: true
            }
        }
    }

    let products = await dbProduct.getProductByTerm(query)
    const foundProducts = products.length > 0
    //TODO: Retornar otros productos
    if (!foundProducts) {
        products = await dbProduct.getAllProducts()
    }


    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default QueryPage