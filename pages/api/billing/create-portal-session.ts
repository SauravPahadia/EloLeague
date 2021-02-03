import {getSession} from "next-auth/client";
import {NextApiRequest, NextApiResponse} from "next";

const stripe = require("stripe")(process.env.STRIPE_SK);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // check method
    if (req.method !== "POST") return res.status(405).json({message: "Invalid request method"});

    const session = await getSession({req});
    if (!session) return res.status(403).json({message: "You must be logged in to create a checkout session."});

    // find existing customer
    const existingCustomers = await stripe.customers.list({
        email: session.user.email,
    });

    if (existingCustomers.length === 0) return res.status(400).json({mesage: "No customer found for logged in email"});

    // create billing portal session
    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: existingCustomers.data[0].id,
            return_url: process.env.NEXTAUTH_URL + "/dashboard",
        });
        
        res.status(200).json({url: portalSession.url});
    } catch(e) {
        res.status(400).json({message: e.message});
    }
}