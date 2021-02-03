import {ReactNode} from "react";

export default function ElH1({children} : {children: ReactNode}) {
    return (
        <h1 className="text-4xl mt-12 mb-6">
            {children}
        </h1>
    )
}