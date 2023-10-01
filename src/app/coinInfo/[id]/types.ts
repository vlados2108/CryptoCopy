export interface coinInfo {
    id: string
    rank: string
    symbol: string
    name: string
    supply: number
    maxSupply: number
    marketCapUsd: number
    volumeUsd24Hr: number
    priceUsd: number
    image:string
}

export interface coinInfoResponse {
    id: string
    rank: string
    symbol: string
    name: string
    supply: string
    maxSupply: string
    marketCapUsd: string
    volumeUsd24Hr: string
    priceUsd: string
    changePercent24Hr: string
    vwap24Hr: string
}

export interface coinPriceResponse {
    priceUsd: string
    time: number
    date: string
}

export interface coinPrice{
    Price: number
    Date: string
} 
