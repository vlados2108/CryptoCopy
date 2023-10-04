'use client'
import React, { ReactElement, useEffect, useState } from 'react'
import axios from 'axios'
import Modal from '../Modal'
import BackpackModalBody from '../BackpackModalBody'
import { appPrefix, formatNumber } from '../Utility'
import { useGlobalContext } from '../../Context'
import { Coin } from '@/app/types'
import styles from './Header.module.scss'

const Header = (): ReactElement => {
    const [coins, setCoins] = useState<Coin[]>([])
    const [backpackSum, setBackpackSum] = useState(0)
    const [diffUsd, setDiffUsd] = useState(0)
    const [diffPerc, setDiffPerc] = useState(0)
    const [modalWidth, setModalWidth] = useState(40)

    const [backpackModalActive, setBackpackModalActive] = useState(false)
    const { coinAdded } = useGlobalContext()
    useEffect(() => {
        axios.get(`https://api.coincap.io/v2/assets?limit=3`).then((res) => {
            setCoins(res.data.data)
        })
        if (typeof window !== 'undefined') {
            setModalWidth(window.innerWidth <= 480 ? 90 : 40)
        }
    }, [])

    useEffect(() => {
        let mySum = 0
        const fetchCurrentPrices = []
        for (let key in localStorage) {
            if (!localStorage.hasOwnProperty(key)) {
                continue
            }
            if (key.startsWith(appPrefix)) {
                const data = JSON.parse(localStorage[key])
                mySum += data.totalPrice

                const requestPromise = axios
                    .get(`https://api.coincap.io/v2/assets/${data.id}`)
                    .then((res) => res.data.data.priceUsd * data.count)

                fetchCurrentPrices.push(requestPromise)
            }
        }
        Promise.all(fetchCurrentPrices).then((prices) => {
            const currSum = prices.reduce((acc, curr) => acc + curr, 0)
            const diffUsd = currSum-mySum
            const diffPerc = (currSum-mySum)/mySum*100

            setBackpackSum(mySum)
            setDiffUsd(diffUsd)
            setDiffPerc(diffPerc)
        })
    }, [coinAdded])

    return (
        <div className={styles['header-container']}>
            <div className={styles['header-trending-container']}>
                <div className={styles['header-trending']}>Trending:</div>
                {coins.map((coin) => {
                    return (
                        <div className={styles['header-tending-row']}>
                            <div className={styles['header-trending-text']}>
                                {coin.symbol}:
                            </div>
                            <div className={styles['header-trending-text']}>
                                {formatNumber(coin.priceUsd)} $
                            </div>
                        </div>
                    )
                })}
            </div>

            <div
                className={styles['header-backpack-container']}
                onClick={() => {
                    setBackpackModalActive(true)
                }}
            >
                <div className={styles['header-backpack']}>Backpack:</div>
                <div
                    className={`${styles['header-backpack-text']} ${styles['price']}`}
                >
                    {formatNumber(backpackSum)} USD
                </div>
                <div
                    className={`${styles['header-backpack-text']} ${styles['diff']}`}
                >
                    {diffUsd > 0 ? '+' : ''}
                    {formatNumber(diffUsd)} ({formatNumber(diffPerc)} %)
                </div>
            </div>
            <Modal
                active={backpackModalActive}
                setActive={setBackpackModalActive}
                width={modalWidth}
            >
                <BackpackModalBody />
            </Modal>
        </div>
    )
}

export default Header
