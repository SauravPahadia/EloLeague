import {ReactNode} from "react";

export default function ElH2(props: {children: ReactNode, className?: string}) {
    return (
        <h2 className={"font-bold text-4xl el-font-display uppercase " + props.className}>
            {props.children}
        </h2>
    )
}