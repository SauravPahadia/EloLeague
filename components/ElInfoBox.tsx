import {ReactNode} from "react";

export default function ElInfoBox({children, className}: {children: ReactNode, className?: string}) {
    return (
        <div className={"px-4 py-6 bg-gray-100 border " + className}>
            {children}
        </div>
    )
}