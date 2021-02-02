import {getSession} from "next-auth/client";
import {NextApiRequest, NextApiResponse} from "next";

const stripe = require("stripe")(process.env.STRIPE_SK);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // check method
    if (req.method !== "POST") return res.status(405).json({message: "Invalid request method"});

    // check for missing fields
    if (!req.body.priceId) return res.status(406).json({message: "Missing priceId field"});

    const session = await getSession({req});

    if (!session) return res.status(403).json({message: "You must be logged in to create a checkout session."});

    const existingCustomers = await stripe.customers.list({
        email: session.user.email,
    });

    let checkoutSessionObj = {
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
            {
                price: req.body.priceId,
                quantity: 1,
            },
        ],
        success_url: process.env.NEXTAUTH_URL + "/dashboard?upgrade=true",
        cancel_url: process.env.NEXTAUTH_URL + "/pricing?cancel=true",
    };

    if (existingCustomers.data.length > 0) {
        checkoutSessionObj["customer"] = existingCustomers.data[0].id;
    } else {
        checkoutSessionObj["customer_email"] = session.user.email;
    }

    try {
        const checkoutSession = await stripe.checkout.sessions.create(checkoutSessionObj);
        res.status(200).json({sessionId: checkoutSession.id});
    } catch(e) {
        res.status(400).json({message: e.message});
    }
}