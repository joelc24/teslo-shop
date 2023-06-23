import { FC, ReactElement } from "react"
import { SideMenu } from "../ui"
import { AdminNavbar } from "../admin"
import { Box, Typography } from "@mui/material"

interface Props {
    title: string
    subtitle: string
    icon?: JSX.Element
    children: ReactElement | ReactElement[]
}

export const AdminLayout: FC<Props> = ({ children, title, subtitle, icon }) => {
  return (
    <>
        <nav>
            <AdminNavbar/>
        </nav>
        
        <SideMenu/>

        <main style={{
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0 30px'
        }}>
            <Box display="flex" flexDirection="column">
                <Typography variant="h1" component="h1">
                    {icon}
                    {title}
                </Typography>
                <Typography sx={{ mb:1 }} variant="h2">{ subtitle }</Typography>
            </Box>

            <Box className="fadeIn">
                { children }
            </Box>
        </main>
    </>
  )
}
