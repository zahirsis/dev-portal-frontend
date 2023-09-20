import Header from '@/components/layout/Header'
import Content from '@/components/layout/Content'
import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import Footer from '@/components/layout/Footer'
import Sidebar from '@/components/layout/Sidebar'
import React from "react";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Dev Portal',
    description: 'IDP for developers',
}

export default function RootLayout({children,}: { children: React.ReactNode }) {
    return (
        <html lang="en" className='min-h-screen'>
            <body className={`${inter.className} min-h-screen flex flex-col`}>
            <Header/>
            <div className='flex flex-1 flex-row'>
                <Sidebar/>
                <div className='flex flex-1 flex-col sm:ml-64 '>
                    <Content>
                        {children}
                    </Content>
                    <Footer/>
                </div>
            </div>
            </body>
        </html>
    )
}
