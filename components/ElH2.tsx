import {ReactNode} from "react";

export default function ElH2(props: {children: ReactNode}) {
    return (
        <h2 className="font-bold text-4xl el-font-display uppercase">
            {props.children}
        </h2>
    )
}