export type TapEffectProps = {
    id?: number
    top: number
    left: number
    text: string
}

const TapEffect = ({ top, left, text }: TapEffectProps) => {
    return <div className="flex items-center gap-[8px] absolute animate-fadeup pointer-events-none" style={{ left, top }}>
        <span className="font-bold text-[28px] leading-[42px] text-yellow-300">{text}</span>
    </div>
}

export default TapEffect;