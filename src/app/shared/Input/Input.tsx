'use client'
import React, { SetStateAction, Dispatch, ReactElement } from 'react'
import classNames from 'classnames'
import styles from './Input.module.scss'

type InputProps = {
    handler?: (value: string) => void
    className?: string
    placeholder?: string
    customAttrs?: Record<string, string>
    type?: string
    value?: string
    setValue?: Dispatch<SetStateAction<string>>
}

const Input = ({
    handler,
    className,
    placeholder,
    customAttrs,
    type,
    value,
    setValue,
}: InputProps):ReactElement => {
    return (
        <input
            placeholder={placeholder}
            className={classNames({
                [styles.input]: true,
                [className as string]: !!className,
            })}
            {...customAttrs}
            value={
                type === 'number'
                    ? (value as number | undefined)
                    : (value as string)
            }
            type={type}
            onChange={(e) => {
                const inputValue = e.target.value
                const parsedValue =
                    type === 'number' ? Number(inputValue) : inputValue
                setValue ? setValue(inputValue) : ''
                handler ? handler(inputValue) : ''
            }}
        ></input>
    )
}

export default Input