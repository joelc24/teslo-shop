import { useContext, useState } from "react"
import { useRouter } from "next/router"
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import { Box, Button, Chip, Grid, Typography } from "@mui/material"

import { ShopLayout } from "@/components/layouts"
import { ProductSlideShow, SizeSelector } from "@/components/products"
import { ItemCounter } from "@/components/ui"
import { dbProduct } from "@/database"
import { ICartProduct, IProduct, ISize } from "@/interface"
import { CartContext } from "@/context"

interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {

  // const { products: product, isLoading } = useProducts(`/products/${router.query.slug}`)
  const { addProductToCart } = useContext( CartContext )
  
  const router = useRouter()
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
      _id: product._id,   
      image: product.images[0],
      price: product.price,
      size: undefined,
      slug: product.slug,
      title: product.title,
      gender: product.gender,
      quantity: 1
  })

  const selectedSize = (size:ISize)=>{
    setTempCartProduct({
      ...tempCartProduct,
      size
    })
  }

  const updateQuantity = (quantity:number) =>{
    setTempCartProduct({
      ...tempCartProduct,
      quantity
    })
  }
  

  

  const onAddProduct = () => {

    if ( !tempCartProduct.size ) { return; }

    addProductToCart(tempCartProduct);
    router.push('/cart');
  }
  
  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideShow images={product.images} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            {/* Titulos */}
            <Typography variant="h1" component="h1">{product.title}</Typography>
            <Typography variant="subtitle1" component="h2">{`$ ${product.price}`}</Typography>

            {/* Cantidad */}
            <Box sx={{
                my: 2
              }}
            >
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                maxValue={product.inStock}
                onUpdateQuantity={(value) => updateQuantity(value)}
              />
              <SizeSelector 
                // selectedSize={product.sizes[0]}
                sizes={product.sizes}
                selectedSize={tempCartProduct.size}
                onSelectedSize={(size)=> selectedSize(size)}
              />
            </Box>

              {
                (product.inStock > 0)
                ? (
                  
                  <Button onClick={onAddProduct} color="secondary" className="circular-btn">
                    {
                      tempCartProduct.size
                      ? 'Agregar al carrito'
                      : 'Seleccione una talla'
                    }
                    
                  </Button>
                )
                : (
                  <Chip label="No hay disponibles" color="error" variant="outlined"/>
                )
              }

            {/* Descripcion */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripcion</Typography>
              <Typography variant="body2">{ product.description }</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}



export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const products = await  dbProduct.getAllProductSlugs() 

  return {
    paths: products.map(({ slug }) => ({
      params: {
        slug
      }
    })),
    fallback: "blocking"
  }
}



export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug } = params as { slug:string }

  const product = await  dbProduct.getProductBySlug(slug)

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 86_400
  }
}

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug } = params as { slug: string }
//   const product = await dbProduct.getProductBySlug(slug) // your fetch function here 


//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }



export default ProductPage