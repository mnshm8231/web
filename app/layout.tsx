import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Menu from './menu'
import ThemeRegistry from './_theme/theme.registory'
import { AuthContextProvider } from './account/AuthContext'
import { Button } from 'antd';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import "@fortawesome/fontawesome-free/css/all.min.css"
import React from 'react'
//import Icon from './icon'



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

const sss={
  display: 'flex',
  paddingTop:'17px',
  paddingLeft:'17px',
  backgroundColor:'#FF95CA'

}

const icon={
  paddingLeft:'60%'
  
}



  return (
    <html lang="en">
      <body className={inter.className}>
        <div style={sss}>
        <h1>輔仁大學學餐菜單</h1>
          {/*<div  style={icon}>
        <AuthContextProvider>
        <Icon/>
        </AuthContextProvider>
        </div>*/}
        </div>
        <ThemeRegistry>
          <AuthContextProvider>
            <Menu />
            {children}
          </AuthContextProvider>
        </ThemeRegistry>
      </body>
      
    </html>
  )
}
