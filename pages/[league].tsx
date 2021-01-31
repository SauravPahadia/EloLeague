import { useState } from "react";
import { useRouter } from "next/router";
import {GetServerSideProps} from "next";
import {LeagueObj, SessionObj} from "../utils/types";
import {getSession} from "next-auth/client";
import useSWR, {responseInterface} from "swr";
import {fetcher} from "../utils/fetcher";
import { useEffect } from "react";
import {createClient} from "@supabase/supabase-js";
import ElH1 from "../components/ElH1";
import FileCopyIcon from '@material-ui/icons/FileCopy';

export default (props: {session: SessionObj, league: LeagueObj}) => {

    const {data: league, error: _}: responseInterface<LeagueObj, any> = useSWR(`/api/league/get?userId=${props.session.userId}`, fetcher);
    const isAdmin = props.session && league.user_id == props.session.userId

    return (
        <div className="max-w-4xl mx-auto px-4">
        <div >
            <ElH1>
                {props.league.name}
            </ElH1>
            {isAdmin && <p>is admin</p>}
          
        </div>
        </div>
    );


}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // get user session
    const session = await getSession(context);

    // check if league page exists - else redirect back to home
    const url = context.query.league;

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

    const {data: leagueId, error: _} = await supabase
        .from<LeagueObj>("Leagues")
        .select("id")
        .eq("url_name", url);
    
    if (leagueId.length === 0) {
        context.res.setHeader("location", "/");
        context.res.statusCode = 302;
        context.res.end();
    }

    return {
        props: {
            session: session
        },         
    };
};