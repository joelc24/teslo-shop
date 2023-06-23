import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import Cookies from 'js-cookie'

import { CartContext } from '@/context'
import { ShopLayout } from '@/components/layouts'
import { countries } from '@/utils'

type FormData = {
    firstName: string
    lastName: string
    address: string
    address2?: string
    zip: string
    city: string
    country: string
    phone: string
}

const getAddressFromCookies = (): FormData =>{

    return {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        zip: Cookies.get('zip') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || ''
    }
}

const Addresspage = () => {

    const { updateAddress } = useContext(CartContext)
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            address: '',
            address2: '',
            zip: '',
            city: '',
            country: countries[0].code,
            phone: ''
        }
    })

    useEffect(() => {
      
        reset(getAddressFromCookies())

    }, [reset])
    

    const onSubmitForm = (data:FormData) =>{
        
        updateAddress(data)
        router.push('/checkout/sumary')
    }

  return (
    <ShopLayout title='Direccion' pageDescription='Confirmar direccion del destino'>
        <Typography variant='h1' component="h1">Direccion</Typography>
        <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label="Nombre" 
                        variant='filled' 
                        fullWidth 
                        {...register('firstName', { required: 'Este campo es requerido' })}
                        error={ !!errors.firstName }
                        helperText={ errors.firstName?.message } 
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label="Apellido" 
                        variant='filled' 
                        fullWidth 
                        {...register('lastName', { required: 'Este campo es requerido' })}
                        error={ !!errors.lastName }
                        helperText={ errors.lastName?.message }
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label="Direccion" 
                        variant='filled' 
                        fullWidth 
                        {...register('address', { required: 'Este campo es requerido' })}
                        error={ !!errors.address }
                        helperText={ errors.address?.message }
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label="Direccion 2 (Opcional)" 
                        variant='filled' 
                        fullWidth 
                        {...register('address2')}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label="Codigo Postal" 
                        variant='filled' 
                        fullWidth 
                        {...register('zip', { required: 'Este campo es requerido' })}
                        error={ !!errors.zip }
                        helperText={ errors.zip?.message }
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label="Ciudad" 
                        variant='filled' 
                        fullWidth 
                        {...register('city', { required: 'Este campo es requerido' })}
                        error={ !!errors.city }
                        helperText={ errors.city?.message }
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    {/* <FormControl fullWidth> */}
                        {/* <InputLabel>Pais</InputLabel> */}
                        <TextField
                            // select
                            variant='filled'
                            label="Pais"
                            fullWidth
                            // defaultValue={ Cookies.get('country') || countries[0].code }
                            {...register('country', { required: 'Este campo es requerido' })}
                            error={ !!errors.country }
                            helperText={ errors.country?.message }
                        />
                            {/* {
                                countries.map(countrie =>(
                                    
                                    <MenuItem key={countrie.code} value={countrie.code}>{ countrie.name }</MenuItem>
                                ))
                            } */}
                        {/* </TextField> */}
                    {/* </FormControl> */}
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        label="Telefono" 
                        variant='filled' 
                        fullWidth 
                        {...register('phone')}
                        error={ !!errors.phone }
                        helperText={ errors.phone?.message }
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
                <Button type='submit' color='secondary' className="circular-btn">
                    Revisar Pedido
                </Button>
            </Box>
        </form>
    </ShopLayout>
  )
}



// export const getServerSideProps: GetServerSideProps = async ({ req }) => { https://noodlemagazine.com/watch/-123400772_456245853
    
//     const { token = '' } = req.cookies

//     let isValidToken = false

//     try {
//         await jwt.isValidToken(token)
//         isValidToken = true
//     } catch (error) {
//         isValidToken = false
//     }

//     if (!isValidToken) {
//         return {
//             redirect: {
//                 destination: '/auth/login?p=checkout/address',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {
            
//         }
//     }
// }

export default Addresspage