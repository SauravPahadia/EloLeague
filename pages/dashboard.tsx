import React, {useEffect, useState} from "react";
import ElButton from "../components/ElButton";
import ElModal from "../components/ElModal";
import ElH2 from "../components/ElH2";
import ElH3 from "../components/ElH3";
import ElInput from "../components/ElInput";
import axios from "axios";
import {useRouter} from "next/router";
import useSWR, {responseInterface} from "swr";
import {fetcher} from "../utils/fetcher";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import {LeagueObj, SessionObj} from "../utils/types";
import ElH1 from "../components/ElH1";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

export default function Dashboard(props: {session: SessionObj}) {
    const router = useRouter();
    const [newLeagueOpen, setNewLeagueOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [urlName, setUrlName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [newLeagueLoading, setNewLeagueLoading] = useState<boolean>(false);
    const [urlNameError, setUrlNameError] = useState<boolean>(false);
    const [urlNameNotUnique, setUrlNameNotUnique] = useState<boolean>(false);

    const {data: leagues, error: _}: responseInterface<LeagueObj[], any> = useSWR(`/api/league/list?userId=${props.session.userId}`, fetcher);

    function onCreateLeague() {
        setNewLeagueLoading(true);

        axios.post("/api/league/new", {
            name: name,
            urlName: urlName,
            description: description || "",
        }).then(res => {
            if (res.data.notUnique) {
                setNewLeagueLoading(false);
                setUrlNameNotUnique(true);
            }
            else router.push(`/${urlName}`);
        }).catch(e => {
           console.log(e);
           setNewLeagueLoading(false);
        });
    }

    function onCancelCreateLeague() {
        setName("");
        setUrlName("");
        setDescription("");
        setNewLeagueOpen(false);
    }

    useEffect(() => {
        if (urlName !== encodeURIComponent(urlName) || urlName.includes("/") || ["dashboard", "signin", "about"].includes(urlName)) {
            setUrlNameError(true);
        } else {
            setUrlNameError(false);
        }
        setUrlNameNotUnique(false);
    }, [urlName]);

    return (
        <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-end">
                <ElH1>Your leagues</ElH1>
                <div className="ml-auto mb-6">
                    <ElButton onClick={() => setNewLeagueOpen(true)}>
                        New league
                    </ElButton>
                </div>
            </div>
            <hr className="my-4"/>
            {leagues ? leagues.map(league => (
                <Link href={`/${league.url_name}`}>
                    <a className="w-full p-4 shadow-md my-4 block">
                        <ElH3>{league.name}</ElH3>
                        {league.description && <p>{league.description}</p>}
                        <p>{league.players ? league.players.length : 0} players</p>
                        <p>Access code: <span className="el-font-display">{league.code}</span></p>
                    </a>
                </Link>
            )) : (
                <div className="my-4">
                    <Skeleton count={3} className="h-24"/>
                </div>
            )}
            <ElModal isOpen={newLeagueOpen} closeModal={onCancelCreateLeague}>
                <ElH2>New league</ElH2>
                <p className="my-2">
                    Leagues left in your <b>{props.session.tier}</b> plan: {props.session.tier === "free" ? (
                        (leagues ?
                            0 :
                            props.session.numAllowedLeagues - (leagues && leagues.length) > 0 ? props.session.numAllowedLeagues - (leagues && leagues.length) : 0)
                        + "/" + props.session.numAllowedLeagues
                    ) : "unlimited"}
                </p>
                <hr className="my-6"/>
                {((leagues && (leagues.length < props.session.numAllowedLeagues)) || props.session.tier !== "free")  ? (
                    <>
                        <ElH3>League name</ElH3>
                        <ElInput value={name} setValue={setName} placeholder="Example House Ping Pong League"/>
                        <hr className="my-6"/>
                        <ElH3>League URL name</ElH3>
                        <p className="my-2">Players will be able to view rankings and log games at this link.</p>
                        <div className="flex items-center">
                            <p className="text-lg mr-1">eloleague.com/</p>
                            <ElInput value={urlName} setValue={setUrlName} placeholder="example-ping-pong"/>
                        </div>
                        {urlNameError && (
                            <p className="my-2 text-red-500">Invalid URL name</p>
                        )}
                        {urlNameNotUnique && (
                            <p className="my-2 text-red-500">URL name already taken</p>
                        )}
                        <hr className="my-6"/>
                        <ElH3>League description (optional)</ElH3>
                        <ElInput
                            value={description}
                            setValue={setDescription}
                            placeholder="Informal ping pong rankings for Example House"
                        />
                        <hr className="my-6"/>
                        <ElButton onClick={onCreateLeague} isLoading={newLeagueLoading}>
                            Create
                        </ElButton>
                        <ElButton text={true} onClick={onCancelCreateLeague} disabled={newLeagueLoading}>
                            Cancel
                        </ElButton>
                    </>
                ) : (
                    <>
                        <p>Upgrade to an Individual or Club plan to create more leagues.</p>
                        <ElButton className="mt-4">Start free trial</ElButton>
                    </>
                )}
            </ElModal>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        context.res.setHeader("location", "/signin");
        context.res.statusCode = 302;
        context.res.end();
    }

    return {props: {session: session}};
};
