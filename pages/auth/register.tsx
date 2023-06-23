import { useContext, useState } from "react"
import { GetServerSideProps } from "next"
import NextLink from "next/link"
import { getSession, signIn } from "next-auth/react"
import { useForm } from "react-hook-form"

import { Box, Grid, Typography, TextField, Button, Link, Chip } from "@mui/material"
import { ErrorOutline } from "@mui/icons-material"

import { AuthLayout } from "@/components/layouts"
import { tesloApi } from "@/api"
import { validations } from "@/utils"
import { useRouter } from "next/router"
import { AuthContext } from "@/context"

type FormData = {
    name: string,
    email: string,
    password: string
}

const Register = () => {

    const router = useRouter()
    const { registerUser } = useContext(AuthContext)
    const { handleSubmit, register, formState: { errors } } = useForm<FormData>() 
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onRegisterForm = async({ name, email, password }:FormData) =>{
        setShowError(false)

        const { hasError, message } = await registerUser(name, email, password)

        if (hasError) {
            setShowError(true)
            setErrorMessage(message!)
            setTimeout(() => {
                setShowError(false)
            }, 3000);
            return
        }

        // const destination = router.query.p?.toString() || '/'
        // router.replace(destination)

        await signIn('credentials',{email, password})
    }

  return (
    <AuthLayout title='Registrarse'>
        <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
            <Box sx={{ width: 350, padding:'10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item>
                        <Typography variant='h1' component="h1">Crear Cuenta</Typography>
                        <Chip
                            label="Oops.. ocurrio un error"
                            color="error"
                            icon={<ErrorOutline/>}
                            className="fadeIn"
                            sx={{ display: showError ? 'flex' : 'none' }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField 
                            label="Nombre Completo" 
                            variant='filled' 
                            fullWidth
                            {...register('name', { required: 'Este campo es requerido', minLength: { value: 3, message: 'Debe contener al menos 3 caracteres' } })}
                            error={ !!errors.name }
                            helperText={errors.name?.message}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField 
                            type="email"
                            label="Correo" 
                            variant='filled' 
                            fullWidth
                            {...register('email', { required: 'Este campo es requerido', validate: validations.isEmail })}
                            error={ !!errors.email }
                            helperText={ errors.email?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label="Password" 
                            type="password" 
                            variant='filled'
                            fullWidth
                            {...register('password', { required: 'Este campo es requerido', minLength: { value: 6, message: 'Debe contener al menos 6 caracteres' } })}
                            error={ !!errors.password }
                            helperText={ errors.password?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" color="secondary" className='circular-btn' size='large' fullWidth>
                            Ingresar
                        </Button>
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="end">
                        <NextLink href={ router.query.p ?  `/auth/login?p=${router.query.p}` : '/auth/login'} passHref legacyBehavior>
                            <Link underline='always'>
                                ¿Ya tienes cuenta?
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session = await getSession({ req })

    const { p = '/' } = query

    if (session) {
        return {
            redirect:{
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}

export default Register