'use client'

import {
    createContext,
    useContext,
    Dispatch,
    SetStateAction,
    useState,
    ReactNode,
} from 'react'

interface ContextProps {
    coinAdded: number
    setCoinAdded: Dispatch<SetStateAction<number>>
}

const GlobalContext = createContext<ContextProps>({
    coinAdded: 0,
    setCoinAdded: (): number => 0,
})

export const GlobalContextProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const [coinAdded, setCoinAdded] = useState(0)

    return (
        <GlobalContext.Provider value={{ coinAdded, setCoinAdded }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)
