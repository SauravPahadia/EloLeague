import Link from "next/link";
import {ReactNode} from "react";
import { AiOutlineCopy } from "react-icons/ai";
import { useToasts } from 'react-toast-notifications';

export default function ElCopy({text, className, size, success, error}: {
    text: string,
    className?: string,
    size?: number,
    success?: string, 
    error?: string
}) {
    const { addToast } = useToasts();

    function copy () {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            addToast(success || 'Copied!', { appearance: 'success', autoDismiss: true });
        } catch (err) {
            addToast(error || 'Error copying text', { appearance: 'error', autoDismiss: true });
        }

        document.body.removeChild(textArea);
    }
    
    return (
        <button onClick={copy} className={className + " focus:outline-none"}>
            <AiOutlineCopy  size={size || 25}/>
        </button>
    )
}