'use client'
import React, { ReactElement } from 'react'
import styles from './Arrows.module.scss'
interface IArrowProps {
    sortAsc: () => void
    sortDsc: () => void
}
const Arrows = ({ sortAsc, sortDsc }: IArrowProps): ReactElement => {
    return (
        <div className={styles['filter-image-container']}>
            <img
                src="/arrowup.png"
                className={`${styles['filter-image']} ${styles['up']}`}
                onClick={() => {
                    sortAsc()
                }}
                loading="lazy"
            ></img>
            <img
                src="/arrowdown.png"
                className={`${styles['filter-image']} ${styles['down']}`}
                onClick={() => {
                    sortDsc()
                }}
                loading="lazy"
            ></img>
        </div>
    )
}
export default Arrows
