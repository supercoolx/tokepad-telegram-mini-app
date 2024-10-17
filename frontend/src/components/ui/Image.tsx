import { useState } from "react";

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

    return <div className="relative">
        <div
            className={` ${className ?? ''}`}
            style={{
                opacity: loading ? 1 : 0,
                width: width ? width + 'px' : '',
                height: height ? height + 'px' : ''
            }}
        />
        <img
            className={`animate-fadeshow absolute top-0 left-0 ${className ?? ''}`}
            style={{
                animationPlayState: loading ? 'paused' : 'running',
                opacity: loading ? 0 : 1,
                width: width ? width + 'px' : '',
                height: height ? height + 'px' : ''
            }}
            onLoad={() => setLoading(false)}
            src={src} alt={alt ?? ''}
            {...otherProps}
        />
    </div>
}

export default Image;