import createDatabaseAccess from "../../config/database/createDbAccess";

// repositories
import {checkSubscribeExist, createToken, createSubscribe} from "./subscribe.repositories";

// utils
import generateRandomToken from "../../utils/generator/generateRandomToken";

// emailer
import emailer from '../../config/emailer/emailerInstance'

// types
import { SubscribeQuery, SubscribeTokenQuery } from "./subscribe.type";

export async function createSubscribeServices(email: string) {
    // confirm is already exist
    const adreadySubscribe = await checkSubscribeExist(email);
    if (adreadySubscribe) {
        return {
            status: 400,
            message: 'email already subscribed',
        };
    }

    // create token
    const token: string = await generateRandomToken();

    
    // create subscribe with status pending
    const subscribeId = await createSubscribe({email, status: 'pending', source: 'web', subscribed_at: new Date().toISOString(), confirmed_at: null, unsubscribed_at: null});
    
    // store token in token in database with an expiry date
    const expiryDate = new Date();
    const url = `${process.env.CLIENT_URL}/confirm-subscribe?token=${token}`;
    expiryDate.setDate(expiryDate.getDate() + 1);
    await createToken({token, subscriber_id: subscribeId, expires_at: expiryDate.toISOString(), type: 'confirmation'});

    // send email
    await (async function () {
        const { data: sendSubscribe, error: sendSubscribeError } = await emailer.emails.send({
            from: `MainThread.Writers <no-reply@${process.env.DOMAIN_NAME}>`,
            to: [email as string],
            subject: `Subscribe to mainThread`,
            html: `<strong>Click the link to confirm your subscription: ${url}</strong>`,
        });

        if (sendSubscribeError) {
            throw new Error(sendSubscribeError.message);
        }
    })();
    
    return {
        status: 201,
        message: 'Subscribe created successfully',
    };
}