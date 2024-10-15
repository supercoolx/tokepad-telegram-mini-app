import { useState, Fragment } from "react";

type ImageProps = {
    src: string
    width?: number
    height?: number
    className?: string
    alt?: string
    [key: string]: any
}

const Image = ({ src, width, height, alt, className, ...otherProps }: ImageProps) => {
    const [loading, setLoading] = useState(true);

    return <Fragment>
        {loading &&
            <div
                className={` ${className ?? ''}`}
                style={{
                    width: width ? width + 'px' : '',
                    height: height ? height + 'px' : ''
                }}
            />}
        <img
            className={`animate-fadeshow ${className ?? ''}`}
            style={{
                opacity: loading ? 0 : 1,
                width: width ? width + 'px' : '',
                height: height ? height + 'px' : ''
            }}
            src={src} alt={alt ?? ''}
            onLoad={() => setLoading(false)}
            {...otherProps}
        />
    </Fragment>
}

export default Image;