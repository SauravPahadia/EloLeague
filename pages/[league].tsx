import {GetServerSideProps} from "next";
import {GameObj, LeagueObj} from "../utils/types";
import {getSession, useSession} from "next-auth/client";
import {createClient} from "@supabase/supabase-js";
import ElH1 from "../components/ElH1";
import ElButton from "../components/ElButton";
import React, {useEffect, useState} from "react";
import ElModal from "../components/ElModal";
import ElH2 from "../components/ElH2";
import ElH3 from "../components/ElH3";
import ElInput from "../components/ElInput";
import axios, {AxiosError, AxiosResponse} from "axios";
import {BiArrowBack} from "react-icons/bi";
import Link from "next/link";
import useSWR, {responseInterface} from "swr";
import {fetcher} from "../utils/fetcher";
import {format} from "date-fns";

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
    const {data: games, error: gamesError}: responseInterface<GameObj[], any> = useSWR(`/api/game/list?leagueId=${league.id}`, fetcher);
    const {data: playerRatings, error: playerRatingsError}: responseInterface<any, any> = useSWR(`api/league/standings?leagueId=${league.id}`, fetcher);

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
            <hr className="my-6"/>
            <div className="md:flex -mx-4">
                <div className="md:w-1/2 md:mx-4">
                    <ElH3>Player rankings</ElH3>
                    <table>
                        <thead>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Elo</th>
                            <th>Wins</th>
                            <th>Losses</th>
                        </thead>
                        {playerRatings && playerRatings.map((playerObj, i) => (
                            <tr>
                                <td>{i + 1}</td>
                                <td>{playerObj.name}</td>
                                <td>{Math.round(playerObj.rating)}</td>
                                <td>{playerObj.wins ? playerObj.wins.length : 0}</td>
                                <td>{playerObj.losses ? playerObj.losses.length : 0}</td>
                            </tr>
                        ))}
                    </table>
                </div>
                <div className="md:w-1/2 md:mx-4">
                    <ElH3>Latest games</ElH3>
                    {games && (games.length > 0 ? (
                        games.map((game, i, a) => (
                            <>
                                {(i === 0 || format(new Date(game.date), "yyyy-MM-dd") !== format(new Date(a[i-1].date), "yyyy-MM-dd")) && (
                                    <p className="border-b-2 pb-2 mt-6 text-gray-400">{format(new Date(game.date), "EEEE, MMMM d, yyyy")}</p>
                                )}
                                <div className="py-4 border-b">
                                    <p className="text-sm opacity-50 text-center">{format(new Date(game.date), "h:mm a")}</p>
                                    <div className="flex items-center">
                                        <div className="w-1/3">
                                            <p className={(game.score1 > game.score2) ? "font-bold" : "opacity-50"}>{game.player1}</p>
                                            <p className="text-sm opacity-75">{Math.round(game.elo1_before)} → {Math.round(game.elo1_after)}</p>
                                        </div>
                                        <p className="text-xl w-1/3 text-center">
                                            <span className={(game.score1 > game.score2) ? "font-bold" : "opacity-50"}>{game.score1}</span>
                                            <span className="opacity-25"> | </span>
                                            <span className={(game.score2 > game.score1) ? "font-bold" : "opacity-50"}>{game.score2}</span>
                                        </p>
                                        <div className="text-right w-1/3">
                                            <p className={(game.score2 > game.score1) ? "font-bold" : "opacity-50"}>{game.player2}</p>
                                            <p className="text-sm opacity-75">{Math.round(game.elo2_before)} → {Math.round(game.elo2_after)}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ))
                    ) : isAdmin ? (
                        <p>You haven't logged any games yet. Hit the "Log new game" button to log games, or send the link to this page and the league access code to your friends!</p>
                    ) : (
                        <p>No games have been logged in this league.</p>
                    ))}
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