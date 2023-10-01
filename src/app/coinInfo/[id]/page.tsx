'use client'
import React, { ReactElement, useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Chart from './chart'
import Button from '../../shared/Button'
import Modal from '../../shared/Modal'
import AddModalBody from '../../shared/AddModalBody'
import {
    coinInfo,
    coinInfoResponse,
    coinPrice,
    coinPriceResponse,
} from './types'
import { formatPrice, getLogoUrl, formatNumber } from '../../shared/Utility'
import styles from './CoinInfo.module.scss'

interface ICoinInfoProps {
    params: { id: string }
}
const periods = ['1D', '7D', '1M']
const CoinInfo = ({ params }: ICoinInfoProps): ReactElement => {
    const [info, setInfo] = useState<coinInfo>()
    const [error, setError] = useState<any>(null)
    const [graphData, setGraphData] = useState<coinPrice[]>([])
    const [currPeriod, setCurrPeriod] = useState(0)
    const [addModalActive, setAddModalActive] = useState(false)
    const [coinAddId, setCoinAddId] = useState('')
    const [coinAddPrice, setCoinAddPrice] = useState(0)
    const [coinAddName, setCoinAddName] = useState('')

    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000

    useEffect(() => {
        if (params.id) {
            const id = params.id
            axios
                .get(`https://api.coincap.io/v2/assets/${id}`)
                .then((response) => {
                    const res = response.data.data as coinInfoResponse
                    const info: coinInfo = {
                        id: res.id,
                        name: res.name,
                        rank: res.rank,
                        maxSupply: parseFloat(res.maxSupply),
                        marketCapUsd: parseFloat(res.marketCapUsd),
                        priceUsd: parseFloat(res.priceUsd),
                        supply: parseFloat(res.supply),
                        symbol: res.symbol,
                        volumeUsd24Hr: parseFloat(res.volumeUsd24Hr),
                        image: getLogoUrl(res.symbol),
                    }
                    setInfo(info)
                })
                .catch((error) => {
                    setError(error)
                })
        }
    }, [params])

    useEffect(() => {
        const id = params.id
        if (id)
            switch (currPeriod) {
                case 0: {
                    getPriceChangingData(id, 'm5', oneDayAgo, now)
                    break
                }
                case 1: {
                    getPriceChangingData(id, 'h1', sevenDaysAgo, now)
                    break
                }
                case 2: {
                    getPriceChangingData(id, 'h12', oneMonthAgo, now)
                    break
                }
            }
    }, [currPeriod])

    const getPriceChangingData = (
        coinId: string,
        interval: string,
        start?: number,
        end?: number
    ) => {
        axios
            .get(
                `https://api.coincap.io/v2/assets/${coinId}/history?interval=${interval}&start=${start}&end=${end}`
            )
            .then((response) => {
                const res = response.data.data as coinPriceResponse[]
                const graphData = res.map((el) => {
                    const date = new Date(el.time).toLocaleDateString('en-ru')
                    return {
                        Date: date,
                        Price: parseFloat(el.priceUsd),
                    }
                })
                setGraphData(graphData)
            })
            .catch((error) => {
                setError(error)
            })
    }

    if (error) {
        return <div>Error fetching data: {error.message}</div>
    }
    if (!info) return <div>Loading...</div>
    return (
        <div className={styles['coinpage-container']}>
            <div className={styles['coininfo-container']}>
                <div className={styles['coininfo-name-container']}>
                    <img src={info.image} className={styles['coininfo-logo']} />
                    <div className={`${styles['coininfo-text']} ${styles['name']}`}>
                        {info.name}
                    </div>
                    <div className={`${styles['coininfo-text']} ${styles['symbol']}`}>
                        {info.symbol}
                    </div>
                    <Link href={'/'}>
                        <img
                            src="/back.png"
                            className={styles['coinInfo-back-arrow']}
                        />
                    </Link>
                </div>

                <div className={`${styles['coininfo-text']} ${styles['price']}`}>
                    {info.priceUsd < 0.01
                        ? info.priceUsd.toFixed(7)
                        : formatPrice(info.priceUsd)}{' '}
                    $
                </div>
                <div className={styles['coininfo-text-key-value-container']}>
                    <div className={`${styles['coininfo-text']} ${styles['key']}`}>Rank: </div>
                    <div className={`${styles['coininfo-text']} ${styles['value']}`}>
                        #{info.rank}
                    </div>
                </div>

                <div className={styles['coininfo-text-key-value-container']}>
                    <div className={`${styles['coininfo-text']} ${styles['key']}`}>Supply: </div>
                    <div className={`${styles['coininfo-text']} ${styles['value']}`}>
                        {formatNumber(info.supply)} {info.symbol}
                    </div>
                </div>
                <div className={styles['coininfo-text-key-value-container']}>
                    <div className={`${styles['coininfo-text']} ${styles['key']}`}>
                        Max Supply:{' '}
                    </div>
                    <div className={`${styles['coininfo-text']} ${styles['value']}`}>
                        {info.maxSupply ? formatNumber(info.maxSupply) : '-'}{' '}
                        {info.symbol}
                    </div>
                </div>
                <div className={styles['coininfo-text-key-value-container']}>
                    <div className={`${styles['coininfo-text']} ${styles['key']}`}>
                        Market Cap:{' '}
                    </div>
                    <div className={`${styles['coininfo-text']} ${styles['value']}`}>
                        {formatNumber(info.marketCapUsd)}$
                    </div>
                </div>
            </div>

            <Button
                value="Add"
                className={styles['coinInfo-btn']}
                handler={() => {
                    setAddModalActive(true)
                    setCoinAddId(info.id)
                    setCoinAddName(info.name)
                    setCoinAddPrice(info.priceUsd)
                }}
            />

            <div className={styles['coininfo-chart-container']}>
                <div className={styles['coininfo-period-container']}>
                    {periods.map((el, index) => {
                        return (
                            <Button
                                key={index}
                                className={
                                    currPeriod == index
                                        ? `${styles['coininfo-period-btn']} ${styles['active']}`
                                        : styles['coininfo-period-btn']
                                }
                                value={el}
                                handler={() => {
                                    setCurrPeriod(index)
                                }}
                            />
                        )
                    })}
                </div>
                <div className={styles['coininfo-chart']}>
                    <Chart graphData={graphData} width={1000} height={600} />
                </div>
            </div>
            <Modal
                active={addModalActive}
                setActive={setAddModalActive}
                width={window.innerWidth > 480 ? 10 : 30}
            >
                <AddModalBody
                    coinId={coinAddId}
                    coinName={coinAddName}
                    coinPrice={coinAddPrice}
                    onCloseAdd={() => {
                        setAddModalActive(false)
                    }}
                />
            </Modal>
        </div>
    )
}

export default CoinInfo
