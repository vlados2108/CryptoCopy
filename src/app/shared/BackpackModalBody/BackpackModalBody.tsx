'use client'
import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../Button'
import { appPrefix, formatNumber } from '../Utility'
import { useGlobalContext } from '../../Context'
import styles from './BackpackModalBody.module.scss'

interface coinInBackPack {
    id: string
    name: string
    price: number
    count: number
    totalPrice: number
}
const BackpackModalBody = (): ReactElement => {
    const [coins, setCoins] = useState<coinInBackPack[]>([])
    const { coinAdded, setCoinAdded } = useGlobalContext()
    useEffect(() => {
        const coins: coinInBackPack[] = []
        for (let key in localStorage) {
            if (!localStorage.hasOwnProperty(key)) {
                continue
            }
            if (key.startsWith(appPrefix)) {
                const data: coinInBackPack = JSON.parse(localStorage[key])
                coins.push(data)
            }
        }
        setCoins(coins)
    }, [coinAdded])

    const deleteCoin = (id: string) => {
        localStorage.removeItem(appPrefix + id)
        const newCoins = coins.filter((coin) => coin.id != id)
        setCoins(newCoins)
        setCoinAdded(Math.random())
    }

    return (
        <div className={styles.backpackContainer}>
            <div className={styles['backpack-header']}>Backpack</div>
            <div className={styles['backpack-body']}>
                <div
                    className={`${styles['backpack-column']} ${styles['header']}`}
                >
                    Name
                </div>
                <div
                    className={`${styles['backpack-column']} ${styles['header']}`}
                >
                    Count
                </div>
                <div
                    className={`${styles['backpack-column']} ${styles['header']}`}
                >
                    Total Price
                </div>
                <div
                    className={`${styles['backpack-column']} ${styles['header']}`}
                >
                    Delete
                </div>
                {coins.map((coin) => {
                    return (
                        <>
                            <div className={styles['backpack-column']}>
                                {coin.name}
                            </div>
                            <div className={styles['backpack-column']}>
                                {coin.count}
                            </div>
                            <div className={styles['backpack-column']}>
                                {formatNumber(coin.totalPrice)} USD
                            </div>
                            <div className={styles['backpack-column']}>
                                <Button
                                    value="Delete"
                                    className={styles['backpack-remove-btn']}
                                    handler={() => {
                                        deleteCoin(coin.id)
                                    }}
                                />
                            </div>
                        </>
                    )
                })}
            </div>
        </div>
    )
}

export default BackpackModalBody
