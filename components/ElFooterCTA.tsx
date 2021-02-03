import ElH2 from "./ElH2";
import ElButton from "./ElButton";
import {signIn} from "next-auth/client";

export default function ElFooterCTA({noDisplay}: {noDisplay: boolean}) {
    return noDisplay ? null : (
        <div className="bg-gray-100 px-4 py-8 border">
            <ElH2 className="opacity-50 mb-4">Start your own league</ElH2>
            <p className="text-lg">EloLeague is the easiest way to <strong>track games and calculate player ratings</strong> for your dorm, club, or friend group. Create a league today <strong>for free</strong>.</p>
            <ElButton className="mt-4" onClick={() => signIn("google", {callbackUrl: process.env.NEXT_PUBLIC_URL + "/dashboard"})}>Sign up</ElButton>
        </div>
    )
}