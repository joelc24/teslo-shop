import { useContext } from "react"
import { NextPage } from "next"
import { Grid, Typography } from "@mui/material"

import { CartContext } from "@/context"
import { currency } from "@/utils"

interface Props {
    numberOfItems?: number
    subTotal?: number
    total?: number
    tax?: number
}


export const OrderSumary: NextPage<Props> = (props) => {

    const state = useContext(CartContext)
    
    const numberOfItems = props.numberOfItems ? props.numberOfItems : state.numberOfItems
    const subTotal = props.subTotal ? props.subTotal : state.subTotal
    const tax = props.tax ? props.tax : state.tax
    const total = props.total ? props.total : state.total

  return (
    <Grid container>
        <Grid item xs={6}>
            <Typography>No. Productos</Typography>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="end">
            <Typography>{ numberOfItems } { numberOfItems > 1 ? 'productos' : 'producto' }</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>Subtotal</Typography>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="end">
            <Typography>{ currency.format(subTotal) }</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>Inpuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="end">
            <Typography>{ currency.format(tax) }</Typography>
        </Grid>
        <Grid item xs={6} sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Total:</Typography>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="end" sx={{ mt: 2 }}>
            <Typography variant="subtitle1">{currency.format(total)}</Typography>
        </Grid>
    </Grid>
  )
}
