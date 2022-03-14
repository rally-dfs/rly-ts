import React, { ReactNode } from 'react'
import Head from 'next/head'
import styles from './layout.module.css'

type Props = {
    children?: ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <>
            <Head>
                <title>Layouts Example </title>
            </Head>
            < main className={styles.main} > {children} </main>
        </>
    )
}

export default Layout