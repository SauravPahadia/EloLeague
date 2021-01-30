import SignInButton from "./SignInButton";
import {useSession} from "next-auth/client";
import Link from "next/link";

export default function Navbar() {
    const [session, loading] = useSession();

    return (
        <div className="bg-black w-full">
            <div className="max-w-4xl mx-auto px-4 h-16 flex items-center sticky top-0 text-white">
                <p className="font-bold text-xl">EloLeague</p>
                <div className="ml-auto">
                    {(loading || !session) ? (
                        <SignInButton/>
                    ) : (
                        <Link href="/dashboard">
                            <a className="underline">Go to your dashboard</a>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}