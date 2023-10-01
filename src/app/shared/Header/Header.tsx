'use client'
import React, { ReactElement, useEffect, useState } from 'react'
import axios from 'axios'
import Modal from '../Modal'
import BackpackModalBody from '../BackpackModalBody'
import { appPrefix, formatNumber } from '../Utility'
import { useGlobalContext } from '../../Context'
import styles from './Header.module.scss'

const Header = (): ReactElement => {
    const [price1, setPrice1] = useState(0)
    const [price2, setPrice2] = useState(0)
    const [price3, setPrice3] = useState(0)
    const [backpackSum, setBackpackSum] = useState(0)
    const [diff, setDiff] = useState(0)
    const [modalWidth, setModalWidth] = useState(40);

    const [backpackModalActive, setBackpackModalActive] = useState(false)
    const { coinAdded } = useGlobalContext()
    useEffect(() => {
        axios.get(`https://api.coincap.io/v2/assets/bitcoin`).then((res) => {
            setPrice1(res.data.data.priceUsd)
        })
        axios.get(`https://api.coincap.io/v2/assets/ethereum`).then((res) => {
            setPrice2(res.data.data.priceUsd)
        })
        axios.get(`https://api.coincap.io/v2/assets/solana`).then((res) => {
            setPrice3(res.data.data.priceUsd)
        })
        if (typeof window !== 'undefined') {
            setModalWidth(window.innerWidth <= 480 ? 90 : 40);
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
            const diff = mySum - currSum

            setBackpackSum(mySum)
            setDiff(diff)
        })
    }, [coinAdded])

    return (
        <div className={styles['header-container']}>
            <div className={styles['header-trending-container']}>
                <div className={styles['header-trending']}>Trending:</div>
                <div className={styles['header-tending-row']}>
                    <div className={styles['header-trending-text']}>BTC:</div>
                    <div className={styles['header-trending-text']}>
                        {formatNumber(price1)} $
                    </div>
                </div>
                <div className={styles['header-tending-row']}>
                    <div className={styles['header-trending-text']}>ETH:</div>
                    <div className={styles['header-trending-text']}>
                        {formatNumber(price2)} $
                    </div>
                </div>
                <div className={styles['header-tending-row']}>
                    <div className={styles['header-trending-text']}>SOL:</div>
                    <div className={styles['header-trending-text']}>
                        {formatNumber(price3)} $
                    </div>
                </div>
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
                    {diff > 0 ? '+' : ''}
                    {formatNumber(diff)} ({formatNumber(diff / 100)} %)
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
