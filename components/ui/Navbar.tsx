import { useContext, useState } from 'react';
import NextLink from 'next/link'
import { useRouter } from 'next/router';
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { UiContext, CartContext } from '@/context';



export const Navbar = () => {

    
    const { asPath, push } = useRouter()
    const { toggleSideMenu } = useContext( UiContext );
    const { numberOfItems } = useContext( CartContext );

    const [searchTerm, setSearchTerm] = useState('')
    const [isSearchVisible, setIsSearchVisible] = useState(false)

    const onSerachTerm = () => {
        if (searchTerm.trim().length === 0) {
            return
        }
        push(`/search/${searchTerm}`)

    }
      

    return (
        <AppBar>
            <Toolbar>
                <NextLink href="/" passHref legacyBehavior>
                    <Link display="flex" alignItems="center">
                        <Typography variant='h6'>Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}> Shop</Typography>
                    </Link>
                </NextLink>

                <Box flex={1} />

                <Box
                    className="fadeIn"
                    sx={{
                        display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' }
                    }}
                >
                    <NextLink href="/category/men" passHref legacyBehavior>
                        <Link>
                            <Button color={ asPath === "/category/men" ? "primary": 'info' } >Hombre</Button>
                        </Link>
                    </NextLink>

                    <NextLink href="/category/women" passHref legacyBehavior>
                        <Link>
                            <Button color={ asPath === "/category/women" ? "primary": 'info' }>Mujeres</Button>
                        </Link>
                    </NextLink>

                    <NextLink href="/category/kid" passHref legacyBehavior>
                        <Link>
                            <Button color={ asPath === "/category/kid" ? "primary": 'info' }>Niños</Button>
                        </Link>
                    </NextLink>



                </Box>

                    <Box flex={1} />

                    {
                        isSearchVisible
                        ? (
                            <Input
                            sx={{
                                display: { xs: 'none', sm: 'flex' }
                            }}
                            className="fadeIn"
                            autoFocus
                            type='text'
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={({ target })=> setSearchTerm(target.value)}
                            onKeyPress={(e)=> e.key === 'Enter' ? onSerachTerm() : null}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={()=> setIsSearchVisible(false)}
                                        >
                                         <ClearOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                />
                                
                        ) :
                        (
                            /* Pantallas grandes */
                            <IconButton
                                onClick={() => setIsSearchVisible(true)}
                                className="fadeIn"
                                sx={{
                                    display:  { xs: 'none', sm: 'flex' }
                                }}
                            >
                                <SearchOutlined />
                            </IconButton> 
                        )
                    }
                            
                    
                    {/* Pantallas pequeñas */}
                    <IconButton
                        sx={{ display: { xs: 'flex', sm: 'none' } }}
                        onClick={ toggleSideMenu }
                    >
                        <SearchOutlined />
                    </IconButton>

                    <NextLink href="/cart" legacyBehavior>
                        <Link>
                            <IconButton>
                                <Badge badgeContent={numberOfItems > 9 ? +9 : numberOfItems} color='secondary'>
                                    <ShoppingCartOutlined />
                                </Badge>
                            </IconButton>
                        </Link>
                    </NextLink>

                <Button onClick={toggleSideMenu}>
                    Menu
                </Button>

            </Toolbar>
        </AppBar>
    )
}
