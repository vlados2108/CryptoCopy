'use client'
import React, { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react'
import styles from './Modal.module.scss'

interface ActiveProps {
    active: boolean
    setActive: Dispatch<SetStateAction<boolean>>
    children?: ReactNode
    width?: number
}
const Modal = ({
    active,
    setActive,
    children,
    width = 50,
}: ActiveProps): ReactElement => {
    return (
        <div
            className={`${styles.modal} ${active && styles.active}`}
            onClick={() => {
                setActive(false)
            }}
        >
            <div
                className={`${styles['modal-content']} ${
                    active && styles.active
                }`}
                style={{ width: `${width}vw` }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}

export default Modal
