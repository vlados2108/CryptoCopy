import { Coin, Filters } from '../../types'

export const appPrefix = 'cryptomarket_'

export const formatPrice = (price: number): string => {
    if (Math.abs(price) >= 1e9) {
        return (price / 1e9).toFixed(2) + 'b'
    } else if (Math.abs(price) >= 1e6) {
        return (price / 1e6).toFixed(2) + 'm'
    } else if (Math.abs(price) >= 1e3) {
        return (price / 1e3).toFixed(2) + 'k'
    } else {
        return price.toFixed(2)
    }
}

export const formatNumber = (number: number): string => {
    const [integerPart, fractionalPart] = Number(number).toFixed(2).split('.')
    const formattedIntegerPart = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
    )
    return `${formattedIntegerPart}.${fractionalPart}`
}

export const getLogoUrl = (coinSymbol: string): string => {
    return `https://assets.coincap.io/assets/icons/${coinSymbol.toLowerCase()}@2x.png`
}

// Функция сортировки по возрастанию
export const sortByAscending = (coins: Coin[], key: keyof Coin): Coin[] => {
    //return [...coins].sort((a, b) => a[key] - b[key]);
    return [...coins].sort((a, b) => {
        if (a[key] < b[key]) return -1
        if (a[key] > b[key]) return 1
        return 0
    })
}

// Функция сортировки по убыванию
export const sortByDescending = (coins: Coin[], key: keyof Coin): Coin[] => {
    return [...coins].sort((a, b) => {
        if (a[key] > b[key]) return -1
        if (a[key] < b[key]) return 1
        return 0
    })
}

export const filterCoins = (coins: Coin[], filters: Filters): Coin[] => {
    return coins.filter((coin) => {
        // Функция проверки диапазона
        const isInRange = (value: number, min: string, max: string) => {
            if (min !== '' && max !== '') {
                return value >= parseFloat(min) && value <= parseFloat(max)
            } else if (min !== '') {
                return value >= parseFloat(min)
            } else if (max !== '') {
                return value <= parseFloat(max)
            }
            return true
        }

        // Фильтрация по цене
        const isPriceInRange = isInRange(
            coin.priceUsd,
            filters.price1,
            filters.price2
        )

        // Фильтрация по капитализации
        const isCapInRange = isInRange(
            coin.marketCapUsd,
            filters.cap1,
            filters.cap2
        )

        // Фильтрация по процентному изменению
        const isPercInRange = isInRange(
            coin.changePercent24Hr,
            filters.perc1,
            filters.perc2
        )

        return isPriceInRange && isCapInRange && isPercInRange
    })
}
