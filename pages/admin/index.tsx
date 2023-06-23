import { SumaryTile } from '@/components/admin'
import { AdminLayout } from '@/components/layouts'
import { DashboardSummaryResponse } from '@/interface'
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'
import { Grid, Typography } from '@mui/material'
import React from 'react'
import useSWR from 'swr'

const DashboardPage = () => {

    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1_000
    })

    if (!error && !data) {
        return <></>
    }

    if (!error) {
        console.log(error)
        return <Typography>Error al cargar la informacion</Typography>
    }

    const { 
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders
    } = data!

    return (
        <AdminLayout title='Dashboard' subtitle='Estadisticas generales' icon={<DashboardOutlined />}>
            <Grid container spacing={2}>
                <SumaryTile
                    title={numberOfOrders}
                    subtitle='Ordenes totales'
                    icon={<CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }} />}
                />
                <SumaryTile
                    title={paidOrders}
                    subtitle='Ordenes pagadas'
                    icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
                />
                <SumaryTile
                    title={notPaidOrders}
                    subtitle='Ordenes pendientes'
                    icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
                />
                <SumaryTile
                    title={numberOfClients}
                    subtitle='Clientes'
                    icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
                />
                <SumaryTile
                    title={numberOfOrders}
                    subtitle='Productos'
                    icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
                />
                <SumaryTile
                    title={lowInventory}
                    subtitle='Sin existencias'
                    icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
                />
                <SumaryTile
                    title={7}
                    subtitle='Bajo inventario'
                    icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
                />
                <SumaryTile
                    title={8}
                    subtitle='Actualizacion en: '
                    icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
                />
            </Grid>
        </AdminLayout>
    )
}

export default DashboardPage