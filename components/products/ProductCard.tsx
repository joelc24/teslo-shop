import { FC, useMemo, useState } from "react"
import NextLink from 'next/link'
import { Grid, Card, CardActionArea, CardMedia, Box, Typography, Link, Chip } from '@mui/material';

import { IProduct } from "@/interface"

interface Props {
    product: IProduct
}

export const ProductCard: FC<Props> = ({ product }) => {


    const [isHovered, setIsHovered] = useState(false)
    const [isImageLoader, setImageLoader] = useState(false)

    const productImage = useMemo(() => {
        return isHovered
        ? `/products/${product.images[1]}`
        : `/products/${product.images[0]}`
    }, [isHovered, product.images])

    return (
        <Grid 
            item 
            xs={6} 
            sm={4} 
            key={product.slug}
            onMouseEnter={()=> setIsHovered(true)}
            onMouseLeave={()=> setIsHovered(false)}
        >
            <Card>
                <NextLink href={`/product/${product.slug}`} passHref legacyBehavior prefetch={false}>
                    <Link>
                        <CardActionArea>
                            {
                                (product.inStock === 0) && (
                                    <Chip
                                        color="primary"
                                        label="No hay disponibles"
                                        sx={{ position: 'absolute', zIndex: 99, top: '10px', lef: '10px' }}
                                    />
                                )
                            }
                            <CardMedia
                                component="img"
                                image={productImage}
                                alt={product.title}
                                className="fadeIn"
                                onLoad={()=>  setImageLoader(false)}
                            />
                        </CardActionArea>
                    </Link>
                </NextLink>
            </Card>

            <Box sx={{ mt: 1, display: isImageLoader ? 'block' : 'none' }} className="fadeIn">
                <Typography fontWeight={700}>{ product.title }</Typography>
                <Typography fontWeight={500}>{ `$${product.price}` }</Typography>
            </Box>
        </Grid>
    )
}
