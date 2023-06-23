import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import NextLink from "next/link"
import { CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material"
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip, CircularProgress } from "@mui/material"
import { ShopLayout } from "@/components/layouts"
import { CartList, OrderSumary } from "@/components/cart"
import { getSession } from 'next-auth/react'
import { dbOrders } from '@/database'
import { IOrder } from '@/interface'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { tesloApi } from '@/api'
import { useState } from 'react'


export type OrderResponseBody = {
    id: string
    status:
        | 'COMPLETED'
        | 'SAVED'
        | 'APPROVED'
        | 'VOIDED'
        | 'PAYER_ACTION_REQUIRED'
        | 'CREATED'
}

interface Props {
    order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {

    const router = useRouter()
    const [isPaying, setIsPaying] = useState(false)
    const { shippingAddress } = order

    const onOrderComplete = async(details: OrderResponseBody) =>{

        
        if (details.status !== 'COMPLETED') {
            return alert('No hay pago en paypal')
        }
        setIsPaying(true)

        try {
            
            const { data } = await tesloApi.post(`/orders/pay`,{
                transactionId: details.id,
                orderId: order._id
            })

            router.reload()

        } catch (error) {
            setIsPaying(false)
            console.log(error)
            alert('Error')
        }

    }

    return (
        <ShopLayout title="Resumen de orden" pageDescription={`Orden: ${order._id}`}>
            <Typography variant="h1" component="h1">Orden: {order._id}</Typography>

            {
                order.isPaid 
                ? (
                        <Chip
                            sx={{ my: 2 }}
                            label="Orden ya fue pagada"
                            variant="outlined"
                            color="success"
                            icon={<CreditScoreOutlined />}
                        />

                    ):
                    (
                        <Chip
                            sx={{ my: 2}}
                            label="Pendiente de pago"
                            variant="outlined"
                            color="error"
                            icon={ <CreditCardOffOutlined/> }
                        />

                )
            }


            <Grid container className='fadeIn'>
                <Grid item xs={12} sm={7}>
                    <CartList products={ order.orderItems }/>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="sumary-card">
                        <CardContent>
                            <Typography variant="h2">Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'Productos' : 'Producto'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="space-between">
                                <Typography variant='subtitle1'>Direccion de entrega</Typography>
                                <NextLink href="/checkout/address" passHref legacyBehavior>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography>{shippingAddress.firstName} { shippingAddress.lastName }</Typography>
                            <Typography>{ shippingAddress.address } { shippingAddress.address2 ? `, ${shippingAddress.address2}` : '' }</Typography>
                            <Typography>{ shippingAddress.city } { shippingAddress.zip } </Typography>
                            <Typography>{ shippingAddress.country }</Typography>
                            <Typography>{ shippingAddress.phone }</Typography>

                            <Divider />

                            <OrderSumary  
                                numberOfItems={order.numberOfItems}
                                tax={order.tax}
                                subTotal={order.subTotal}
                                total={order.total}
                            />

                            <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                                <Box 
                                    display="flex" 
                                    justifyContent="center" 
                                    className="fadeIn"
                                    sx={{ display: isPaying ? 'flex' : 'none' }}
                                >
                                    <CircularProgress/>
                                </Box>
                                <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection="column">
                                        {
                                            order.isPaid
                                            ? (
                                                <Chip
                                                    sx={{ my: 2 }}
                                                    label="Orden ya fue pagada"
                                                    variant="outlined"
                                                    color="success"
                                                    icon={<CreditScoreOutlined />}
                                                />
                                            ) :
                                            (
                                                <PayPalButtons
                                                    createOrder={(data, actions) => {
                                                        return actions.order.create({
                                                            purchase_units: [
                                                                {
                                                                    amount: {
                                                                        value: `${order.total}`,
                                                                    },
                                                                },
                                                            ],
                                                        });
                                                    }}
                                                    onApprove={(data, actions) => {
                                                        return actions.order!.capture().then((details) => {
                                                            onOrderComplete(details)
                                                            // console.log({ details })
                                                            // const name = details.payer.name!.given_name;
                                                            // alert(`Transaction completed by ${name}`);
                                                        });
                                                    }}
                                                />
                                            )
                                        }
                                </Box>

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}




export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const { id = '' } = query

    const session:any  = await getSession({ req })

    if(!session){
        return {
            redirect : {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false
            }
        }
    }

    const order = await dbOrders.getOrderById(id.toString())

    if(!order){
        return {
            redirect : {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }

    if (order.user !== session.user._id) {
        return {
            redirect : {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }


    return {
        props: {
            order
        }
    }
}

export default OrderPage