import { Typography } from "@mui/material";

import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { useProducts } from "@/hooks";
import { FullScreenLoading } from "@/components/ui";


export default function WomenPage() {

  const { products, isLoading, isError } = useProducts('/products?gender=women')

  return (
    <ShopLayout title="Teslo-Shop - women" pageDescription="Encuentra los mejores productos de Teslo para ellas">
      <>
        <Typography variant="h1" component="h1">Mjeres</Typography>
        <Typography variant="h2" sx={{ mb: 1 }}>Productos para ellas</Typography>
        {
          isLoading
          ? <FullScreenLoading/>
          : <ProductList products={products} />
        }
        
      </>
    </ShopLayout>
  )
}
