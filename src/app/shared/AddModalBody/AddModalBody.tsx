'use client'
import React, { ReactElement, useState } from 'react'
import Input from '../Input'
import Button from '../Button'
import { appPrefix } from '../Utility'
import { useGlobalContext } from '@/app/Context'
import styles from './AddModalBody.module.scss'

interface IAddModalBodyProps {
    coinId: string
    coinName: string
    coinPrice: number
    onCloseAdd: () => void
}
const AddModalBody = ({
    coinId,
    coinName,
    coinPrice,
    onCloseAdd,
}: IAddModalBodyProps): ReactElement => {
    const [n, setN] = useState('')
    const [error, setError] = useState<any>(null)
    const { coinAdded, setCoinAdded } = useGlobalContext()
    const MAX_COUNT = 10000
    const MIN_COUNT = 0
    const handleAdd = () => {
        const count = parseFloat(n)
        if (count < MIN_COUNT || count > MAX_COUNT) {
            setError(
                new Error('Count of coins should be in range of 1 to 10000')
            )
            return
        }
        const totalPrice = count * coinPrice

        const Exists = localStorage.getItem(appPrefix + coinId)
        let data = {}
        if (Exists) {
            const data2 = JSON.parse(Exists)
            const newCount = data2.count + count
            const newTotalPrice = data2.totalPrice + totalPrice
            data = {
                id: coinId,
                name: coinName,
                price: coinPrice,
                count: newCount,
                totalPrice: newTotalPrice,
            }
        } else {
            data = {
                id: coinId,
                name: coinName,
                price: coinPrice,
                count: count,
                totalPrice: totalPrice,
            }
        }

        localStorage.setItem(appPrefix + coinId, JSON.stringify(data))
        setCoinAdded(Math.random())
        onCloseAdd()
    }

    if (error)
        return (
            <div className={styles['addBody-container']}>
                <div className={styles['addBody-error']}>{error.message}</div>
                <Button
                    className={styles['addBody-btn']}
                    handler={() => {
                        setError(null)
                        setN('')
                    }}
                    value="Try again"
                />
            </div>
        )

    return (
        <div className={styles['addBody-container']}>
            <Input
                className={styles['addBody-input']}
                type="number"
                value={n}
                setValue={setN}
                placeholder="Count of coins"
            />
            <Button
                className={styles['addBody-btn']}
                handler={() => {
                    handleAdd()
                }}
                value="Add"
            />
        </div>
    )
}

export default AddModalBody
