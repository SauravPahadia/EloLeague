import {GetServerSideProps} from "next";
import {LeagueObj} from "../utils/types";
import {getSession, useSession} from "next-auth/client";
import {createClient} from "@supabase/supabase-js";
import ElH1 from "../components/ElH1";
import ElButton from "../components/ElButton";
import React, {useState} from "react";
import ElModal from "../components/ElModal";
import ElH2 from "../components/ElH2";
import ElH3 from "../components/ElH3";
import ElInput from "../components/ElInput";
import axios, {AxiosError, AxiosResponse} from "axios";
import {BiArrowBack} from "react-icons/bi";
import Link from "next/link";

export default function League({league}: {league: LeagueObj}) {
    const [session, loading] = useSession();
    const isAdmin = session && (+league.user_id === +session.userId);
    const [newGameOpen, setNewGameOpen] = useState<boolean>(false);
    const [player1, setPlayer1] = useState<string>("");
    const [score1, setScore1] = useState<number>(0);
    const [player2, setPlayer2] = useState<string>("");
    const [score2, setScore2] = useState<number>(0);
    const [code, setCode] = useState<string>("");
    const [newGameLoading, setNewGameLoading] = useState<boolean>(false);
    const [unauth, setUnauth] = useState<boolean>(false);

    function onSubmitGame() {
        setNewGameLoading(true);
        setUnauth(false);

        axios.post("/api/game/new", {
            player1: player1,
            score1: score1,
            player2: player2,
            score2: score2,
            code: code,
            leagueId: league.id,
        }).then((res: AxiosResponse) => {
            setNewGameLoading(false);
            if (res.data.unauth) {
                setUnauth(true);
            } else {
                onCancelSubmitGame();
            }
        }).catch((e: AxiosError) => {
            setNewGameLoading(false);
            console.log(e);
        });
    }

    function onCancelSubmitGame() {
        setPlayer1("");
        setScore1(0);
        setPlayer2("");
        setScore2(0);
        setCode("");
        setNewGameOpen(false);
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            {isAdmin && (
                <Link href="/dashboard">
                    <a className="flex items-center mt-8">
                        <BiArrowBack/>
                        <span className="ml-4">Back to dashboard</span>
                    </a>
                </Link>
            )}
            <div className="flex items-end">
                <div>
                    <ElH1>{league.name}</ElH1>
                    <p className="text-lg">{league.description || (isAdmin ? <span className="opacity-50">Add a description</span> : "")}</p>
                    {isAdmin && (
                        <p className="text-lg">Access code: <span className="el-font-display">{league.code}</span></p>
                    )}
                </div>
                <div className="ml-auto mb-6">
                    <ElButton onClick={() => setNewGameOpen(true)}>
                        Log new game
                    </ElButton>
                    <ElModal isOpen={newGameOpen} setIsOpen={setNewGameOpen}>
                        <ElH2>Log new game</ElH2>
                        <hr className="my-6"/>
                        <div className="flex -mx-2">
                            <div className="mx-2">
                                <ElH3>Player 1</ElH3>
                                <ElInput value={player1} setValue={setPlayer1}/>
                            </div>
                            <div className="mx-2">
                                <ElH3>P1 score</ElH3>
                                <ElInput value={score1} setValue={setScore1} type="number"/>
                            </div>
                        </div>
                        <hr className="my-6"/>
                        <div className="flex -mx-2">
                            <div className="mx-2">
                                <ElH3>Player 2</ElH3>
                                <ElInput value={player2} setValue={setPlayer2}/>
                            </div>
                            <div className="mx-2">
                                <ElH3>P2 score</ElH3>
                                <ElInput value={score2} setValue={setScore2} type="number"/>
                            </div>
                        </div>
                        <hr className="my-6"/>
                        {!isAdmin && (
                            <>
                                <ElH3>Access code</ElH3>
                                <p>Ask your league admin for the access code.</p>
                                <ElInput value={code} setValue={setCode}/>
                                {unauth && (
                                    <p className="my-2 text-red-500">Incorrect access code</p>
                                )}
                                <hr className="my-6"/>
                            </>
                        )}
                        <ElButton onClick={onSubmitGame} isLoading={newGameLoading}>
                            Create
                        </ElButton>
                        <ElButton text={true} onClick={onCancelSubmitGame} disabled={newGameLoading}>
                            Cancel
                        </ElButton>
                    </ElModal>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // get user session
    const session = await getSession(context);

    // load in league data or throw 404
    const url = context.query.league;

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

    const {data: thisLeague, error: _} = await supabase
        .from<LeagueObj>("Leagues")
        .select("*")
        .eq("url_name", url);
    
    if (thisLeague.length === 0) {
        return {notFound: true};
    }

    let returnLeague = {...thisLeague[0]};

    if (!session || returnLeague.user_id !== session.userId) delete returnLeague.code;

    return {props: {league: thisLeague[0]}};
};