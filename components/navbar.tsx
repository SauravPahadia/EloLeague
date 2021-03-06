import SignInButton from "./SignInButton";
import {signOut, useSession} from "next-auth/client";
import Link from "next/link";

export default function Navbar() {
    const [session, loading] = useSession();

    return (
        <div className="bg-black w-full">
            <div className="max-w-4xl mx-auto px-4 h-16 flex items-center sticky top-0 text-white">
                <Link href="/">
                    <a className="font-bold text-xl flex items-center">
                        <img src="/logo.svg" alt="EloLeague logo" className="w-6 h-6 mr-4" style={{filter: "invert(100%)"}}/>
                        <span>EloLeague</span>
                    </a>
                </Link>
                <div className="ml-auto flex">
                    {(loading || !session) ? (
                        <SignInButton/>
                    ) : (
                        <>
                            <Link href="/dashboard">
                                <a className="underline mr-6">Your leagues</a>
                            </Link>
                            <button className="underline" onClick={() => signOut({callbackUrl: `${process.env.NEXT_PUBLIC_URL}`})}>Sign out</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}