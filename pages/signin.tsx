import React from 'react';
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import SignInButton from "../components/SignInButton";
import ElNextSeo from "../components/ElNextSeo";

export default function SignIn() {
    return (
        <div className="max-w-sm mx-auto px-4">
            <ElNextSeo title="Sign in"/>
            <SignInButton/>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) {
        context.res.setHeader("location", "/leagues");
        context.res.statusCode = 302;
        context.res.end();
    }

    return {props: {}};
};
