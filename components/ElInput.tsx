import {Dispatch, SetStateAction} from "react";

export default function ElInput({value, setValue, placeholder}: {
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    placeholder?: string
}) {
    return (
        <input
            type="text"
            className="w-full font-lg border p-2 my-2 border-gray-300"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={placeholder || ""}
        />
    )
}