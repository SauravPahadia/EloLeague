import Link from "next/link";
import {ReactNode} from "react";

export default function ElButton({onClick, disabled, isLoading, href, text = false, children}: {
    onClick?: () => any,
    disabled?: boolean,
    isLoading?: boolean,
    href?: string,
    text?: boolean,
    children: ReactNode,
}) {
    const ElButtonStyling = "p-2 transition mr-2 el-font-display uppercase font-medium"
        + (text ? " hover:bg-gray-50" : " bg-gray-700 text-white hover:bg-black transition")
        + ((disabled || isLoading) ? " opacity-50 cursor-not-allowed" : "");

    return href ? (
        <Link href={href}>
            <a className={ElButtonStyling}>{children}</a>
        </Link>
    ) : (
        <button onClick={onClick} disabled={disabled || isLoading} className={ElButtonStyling}>
            {isLoading ? "Loading..." : children}
        </button>
    )
}