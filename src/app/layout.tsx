import { ReactElement,ReactNode } from 'react'
import Header from './shared/Header'
import { GlobalContextProvider } from './Context'
import './layout.scss'

const RootLayout =({
    children,
}: {
    children: ReactNode
}):ReactElement => {
    return (
        <html lang="en">
            <body>
                <GlobalContextProvider>
                    <Header />
                    {children}
                </GlobalContextProvider>
            </body>
        </html>
    )
}
export default RootLayout
