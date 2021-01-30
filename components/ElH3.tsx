import {ReactNode} from "react";

export default function ElH3(props: {children: ReactNode}) {
    return (
        <h3 className="font-bold">
            {props.children}
        </h3>
    )
}