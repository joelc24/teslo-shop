import NextLink from 'next/link'
import { ShopLayout } from "@/components/layouts"
import { RemoveShoppingCartOutlined } from "@mui/icons-material"
import { Box, Link, Typography } from "@mui/material"



const EmptyPage = () => {
  return (
    <ShopLayout title="Carrito de compras vacio" pageDescription="No hay articulos en el carrito de compras">
        <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            sx={{ flexDirection: { xs: "column", sm: "row" } }} 
            height="calc(100vh - 200px)"
        >
            <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
            <Box display="flex" flexDirection="column" alignItems="center">
                <Typography>Su carrito esta vacio</Typography>
                <NextLink href="/" passHref legacyBehavior>
                    <Link>
                        <Typography variant='h4' color="secondary">Regresar</Typography>
                    </Link>
                </NextLink>
            </Box>
        </Box>
    </ShopLayout>
  )
}

export default EmptyPage