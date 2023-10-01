'use client'
import { ReactElement, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Input from './shared/Input'
import Button from './shared/Button'
import Modal from './shared/Modal'
import AddModalBody from './shared/AddModalBody'
import FilterContent from './FilterContent'
import Arrows from './Arrows'
import { Coin, CoinResponse, Filters } from './types'
import {
    formatPrice,
    getLogoUrl,
    filterCoins,
    sortByAscending,
    sortByDescending,
} from './shared/Utility'
import styles from './home.module.scss'

const Home = (): ReactElement => {
    const [coins, setCoins] = useState<Coin[]>([])
    const [oldCoins, setOldCoins] = useState<Coin[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [filterModalActive, setFilterModalActive] = useState(false)
    const [addModalActive, setAddModalActive] = useState(false)
    const [coinAddId, setCoinAddId] = useState('')
    const [coinAddPrice, setCoinAddPrice] = useState(0)
    const [coinAddName, setCoinAddName] = useState('')

    const coinsPerPage = 20
    const totalCoins = coins.length

    const indexOfLastCoin = currentPage * coinsPerPage
    const indexOfFirstCoin = indexOfLastCoin - coinsPerPage
    const currentCoins = coins.slice(indexOfFirstCoin, indexOfLastCoin)

    const totalPages = Math.ceil(totalCoins / coinsPerPage)

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    const router = useRouter()
    useEffect(() => {
        axios.get(`https://api.coincap.io/v2/assets`).then(async (res) => {
            const originalArray = res.data.data as CoinResponse[]
            let newArray: Coin[] = []
            if (Array.isArray(originalArray)) {
                newArray = originalArray.map((obj) => {
                    return {
                        id: obj.id,
                        symbol: obj.symbol,
                        name: obj.name,
                        priceUsd: parseFloat(obj.priceUsd),
                        marketCapUsd: parseFloat(obj.marketCapUsd),
                        changePercent24Hr: parseFloat(obj.changePercent24Hr),
                        logoUrl: getLogoUrl(obj.symbol),
                    }
                })
            }
            setCoins(newArray)
            setOldCoins(newArray)
        })
    }, [])

    const onSearch = (searchValue: string) => {
        if (searchValue.length >= 2) {
            const results = oldCoins.filter((coin) => {
                return coin.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
            })
            setCoins(results)
        } else {
            setCoins(oldCoins)
        }
    }

    const applyFilters = (filters: Filters) => {
        const filteredCoins = filterCoins(coins, filters)
        filteredCoins.length !== 0
            ? setCoins(filteredCoins)
            : setCoins(oldCoins)
        setFilterModalActive(false)
    }

    const discardFilters = () => {
        setCoins(oldCoins)
        setFilterModalActive(false)
    }

    const sort = (direction: string, criteria: keyof Coin) => {
        const sortedCoins =
            direction == 'asc'
                ? sortByAscending(coins, criteria)
                : sortByDescending(coins, criteria)
        setCoins(sortedCoins)
    }

    return (
        <>
            <div className={styles['home-container']}>
                <Input
                    placeholder="Search coin"
                    className={styles['search-input']}
                    handler={onSearch}
                    type="search"
                ></Input>
                <Button
                    className={styles['home-filter-btn']}
                    handler={() => {
                        setFilterModalActive(true)
                    }}
                    value="Filters"
                />
                <div className={styles['home-table']}>
                    <div
                        className={`${styles['home-table-row']} ${styles['header']}`}
                    >
                        <div
                            className={`${styles['home-table-column']} ${styles['header']}`}
                        >
                            Symbol
                        </div>
                        <div
                            className={`${styles['home-table-column']} ${styles['header']}`}
                        >
                            Logo
                        </div>
                        <div
                            className={`${styles['home-table-column']} ${styles['header']}`}
                            onClick={() => {}}
                        >
                            Price
                            <Arrows
                                sortAsc={() => {
                                    sort('asc', 'priceUsd')
                                }}
                                sortDsc={() => {
                                    sort('dsc', 'priceUsd')
                                }}
                            />
                        </div>

                        <div
                            className={`${styles['home-table-column']} ${styles['header']}`}
                            onClick={() => {}}
                        >
                            Market cap
                            <Arrows
                                sortAsc={() => {
                                    sort('asc', 'marketCapUsd')
                                }}
                                sortDsc={() => {
                                    sort('dsc', 'marketCapUsd')
                                }}
                            />
                        </div>
                        <div
                            className={`${styles['home-table-column']} ${styles['header']}`}
                            onClick={() => {}}
                        >
                            24h %
                            <Arrows
                                sortAsc={() => {
                                    sort('asc', 'changePercent24Hr')
                                }}
                                sortDsc={() => {
                                    sort('dsc', 'changePercent24Hr')
                                }}
                            />
                        </div>
                        <div
                            className={`${styles['home-table-column']} ${styles['header']}`}
                        >
                            Buy
                        </div>
                    </div>
                    {currentCoins.map((coin) => {
                        return (
                            <div key={coin.id}>
                                <div
                                    onClick={() =>
                                        router.push(`coinInfo/${coin.id}`)
                                    }
                                    className={styles['home-table-row']}
                                >
                                    <div
                                        className={styles['home-table-column']}
                                    >
                                        {coin.symbol}
                                    </div>
                                    <div
                                        className={styles['home-table-column']}
                                    >
                                        <img
                                            src={coin.logoUrl}
                                            className={
                                                styles['home-table-image']
                                            }
                                            loading="lazy"
                                        ></img>
                                    </div>

                                    <div
                                        className={styles['home-table-column']}
                                    >
                                        {coin.priceUsd < 0.01
                                            ? '<' + formatPrice(coin.priceUsd)
                                            : formatPrice(coin.priceUsd)}{' '}
                                        $
                                    </div>
                                    <div
                                        className={styles['home-table-column']}
                                    >
                                        {formatPrice(coin.marketCapUsd)} $
                                    </div>
                                    <div
                                        className={
                                            coin.changePercent24Hr > 0
                                                ? `${styles['home-table-column']} ${styles['percent-red']}`
                                                : `${styles['home-table-column']} ${styles['percent-green']}`
                                        }
                                    >
                                        {formatPrice(coin.changePercent24Hr)}%
                                    </div>
                                    <div
                                        className={styles['home-table-column']}
                                    >
                                        <Button
                                            value="Add"
                                            className={
                                                styles['home-table-add-btn']
                                            }
                                            handler={(e) => {
                                                e.stopPropagation()
                                                setCoinAddId(coin.id)
                                                setCoinAddName(coin.name)
                                                setCoinAddPrice(coin.priceUsd)
                                                setAddModalActive(true)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    <div className={styles['pagination']}>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <Button
                                handler={() => handlePageChange(index + 1)}
                                className={
                                    currentPage === index + 1
                                        ? `${styles['pagination-btn']} ${styles['active']}`
                                        : styles['pagination-btn']
                                }
                                value={(index + 1).toString()}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Modal active={filterModalActive} setActive={setFilterModalActive}>
                <FilterContent
                    applyFilters={applyFilters}
                    discardFilters={discardFilters}
                />
            </Modal>
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
        </>
    )
}

export default Home
