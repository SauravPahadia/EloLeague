import {Dispatch, SetStateAction} from "react";

export default function ElInput({value, setValue, type = "text", placeholder}: {
    value: string | number,
    setValue: Dispatch<SetStateAction<string | number>>,
    type?: "text" | "number",
    placeholder?: string
}) {
    return (
        <input
            type={type}
            className="w-full font-lg border p-2 my-2 border-gray-300"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={placeholder || ""}
        />
    )
}