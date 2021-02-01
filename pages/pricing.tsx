import {useSession} from "next-auth/client";
import ElH1 from "../components/ElH1";
import ElH2 from "../components/ElH2";
import ElButton from "../components/ElButton";

export default function Pricing() {
    const [session, loading] = useSession();

    const priceContainerClass = "mx-4 md:w-1/3 p-4 shadow-md";
    const priceClass = "text-xl mt-2 font-bold mb-4";
    const priceDescriptClass = "list-disc pl-6 text-xl";
    const priceButtonClass = "mt-8";

    return (
        <div className="max-w-4xl mx-auto px-4 py-4">
            <ElH1>{session ? "Upgrade" : "Pricing"}</ElH1>
            <hr className="my-6"/>
            <div className="md:flex -mx-4">
                <div className={priceContainerClass}>
                    <ElH2>Free</ElH2>
                    <p className={priceClass}>$0/month</p>
                    <ul className={priceDescriptClass}>
                        <li>One league</li>
                        <li>Unlimited players</li>
                        <li>Unlimited games</li>
                    </ul>
                    <ElButton className={priceButtonClass} disabled={!!session}>Get started</ElButton>
                </div>
                <div className={priceContainerClass}>
                    <ElH2>Individual</ElH2>
                    <p className={priceClass}>$10/month</p>
                    <ul className={priceDescriptClass}>
                        <li>Unlimited leagues</li>
                    </ul>
                    <ElButton className={priceButtonClass}>Life of the party</ElButton>
                </div>
                <div className={priceContainerClass}>
                    <ElH2>Club</ElH2>
                    <p className={priceClass}>$30/month</p>
                    <ul className={priceDescriptClass}>
                        <li>Unlimited leagues</li>
                        <li>Unlimited tournaments</li>
                    </ul>
                    <ElButton className={priceButtonClass}>Go pro</ElButton>
                </div>
            </div>
        </div>
    )
}