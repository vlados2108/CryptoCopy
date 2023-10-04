'use client'
import React, { ReactElement, useState } from 'react'
import styles from './Arrows.module.scss'
interface IArrowProps {
    sortAsc: () => void
    sortDsc: () => void
}
const Arrows = ({ sortAsc, sortDsc }: IArrowProps): ReactElement => {
    const [isActiveup, setIsActiveUp] = useState(false)
    const [isActiveDown, setIsActiveDown] = useState(false)
    return (
        <div className={styles['filter-image-container']}>
            <img
                src="/arrowup.png"
                className={`${styles['filter-image']} ${
                    isActiveup ? styles['activeup'] : ''
                }`}
                onClick={() => {
                    setIsActiveUp(!isActiveup)
                    setIsActiveDown(false)
                    sortAsc()
                }}
                loading="lazy"
            ></img>
            <img
                src="/arrowdown.png"
                className={`${styles['filter-image']} ${
                    isActiveDown ? styles['activedown'] : ''
                }`}
                onClick={() => {
                    setIsActiveDown(!isActiveDown)
                    setIsActiveUp(false)
                    sortDsc()
                }}
                loading="lazy"
            ></img>
        </div>
    )
}
export default Arrows
