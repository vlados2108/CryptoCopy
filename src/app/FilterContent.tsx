import React, { ReactElement, useState } from 'react'
import Input from './shared/Input'
import Button from './shared/Button'
import { Filters } from './types'
import styles from './FilterContent.module.scss'

interface IFilterContentProps {
    applyFilters: (filters: Filters) => void
    discardFilters: () => void
}

const params = [
    { name: 'Price', min: 0, max: 99999 },
    { name: 'Market cap', min: 0, max: 999999999999 },
    { name: '24h %', min: -100, max: 1000 },
]
const FilterContent = ({
    applyFilters,
    discardFilters,
}: IFilterContentProps): ReactElement => {
    const [paramValues, setParamValues] = useState<any>({
        Price1: '',
        Price2: '',
        '24h %1': '',
        '24h %2': '',
        'Market cap1': '',
        'Market cap2': '',
    })
    const [error, setError] = useState<any>(null)

    const handleInputChange = (param: string, value: string) => {
        setParamValues((prevValues: any) => ({
            ...prevValues,
            [param]: value,
        }))
    }

    const apply = () => {
        let validationFailed = false
        params.map((param) => {
            if (
                !validateFilter(
                    paramValues[param.name + '1'],
                    paramValues[param.name + '2'],
                    param.min,
                    param.max
                )
            ) {
                setError(
                    new Error(
                        `${param.name} should be in range of ${param.min} to ${param.max} and left value must be less than right value`
                    )
                )
                validationFailed = true
            }
        })

        if (validationFailed) {
            return
        }
        const filters = {
            price1: paramValues[params[0].name + '1'],
            price2: paramValues[params[0].name + '2'],
            cap1: paramValues[params[1].name + '1'],
            cap2: paramValues[params[1].name + '2'],
            perc1: paramValues[params[2].name + '1'],
            perc2: paramValues[params[2].name + '2'],
        }

        applyFilters(filters)
    }
    const discard = () => {
        params.map((param) => {
            handleInputChange(param.name + '1', '')
            handleInputChange(param.name + '2', '')
        })
        discardFilters()
    }

    const validateFilter = (
        val1: string,
        val2: string,
        min: number,
        max: number
    ): boolean => {
        const numericMin = parseFloat(val1)
        const numericMax = parseFloat(val2)

        if (!isNaN(numericMin) && !isNaN(numericMax)) {
            return (
                numericMin <= numericMax && numericMin > min && numericMax < max
            )
        } else if (!isNaN(numericMin)) {
            return numericMin >= min && numericMin <= max
        } else if (!isNaN(numericMax)) {
            return numericMax >= min && numericMax <= max
        }

        return true
    }

    if (error)
        return (
            <div className={styles['filters-container']}>
                <div className={styles['filters-error']}>{error.message}</div>
                <Button
                    className={styles['filterContent-btn']}
                    handler={() => {
                        setError(null)
                    }}
                    value="Try again"
                />
            </div>
        )
    return (
        <div className={styles['filters-container']}>
            {params.map((param) => {
                const name = param.name
                return (
                    <div className={styles['filter-container']} key={name}>
                        <div className={styles['filter-name']}>{name}</div>

                        <div className={styles['filter-inputs-container']}>
                            <Input
                                type="number"
                                className={styles['filter-input']}
                                placeholder={
                                    param.min.toString() +
                                    (name === '24h %' ? '%' : '$')
                                }
                                value={paramValues[name + '1']}
                                handler={(value) => {
                                    handleInputChange(name + '1', value)
                                }}
                            />
                            <div className={styles['filter-to']}>to</div>
                            <Input
                                type="number"
                                className={styles['filter-input']}
                                placeholder={
                                    param.max.toString() +
                                    (name === '24h %' ? '%' : '$')
                                }
                                value={paramValues[name + '2']}
                                handler={(value) => {
                                    handleInputChange(name + '2', value)
                                }}
                            />
                        </div>
                    </div>
                )
            })}
            <div className={styles['filterContent-btn-container']}>
                <Button
                    className={styles['filterContent-btn']}
                    value="Apply filters"
                    handler={() => {
                        apply()
                    }}
                />
                <Button
                    className={styles['filterContent-btn']}
                    value="Discard filters"
                    handler={() => {
                        discard()
                    }}
                />
            </div>
        </div>
    )
}

export default FilterContent
