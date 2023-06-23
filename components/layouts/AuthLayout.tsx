import { Box } from "@mui/material"
import Head from "next/head"
import { FC, ReactElement } from "react"

interface Props {
    title: string
    children: ReactElement | ReactElement[]
}

export const AuthLayout: FC<Props> = ({ children, title }) => {
  return (
    <>
        <Head>
            <title>{ title }</title>
        </Head>

        <main>
            <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 100px)">
                { children }
            </Box>
        </main>
    </>
  )
}
