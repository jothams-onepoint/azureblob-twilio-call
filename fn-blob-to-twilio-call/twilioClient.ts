import { Twilio } from "twilio";
import { CallInstance } from "twilio/lib/rest/api/v2010/account/call";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new Twilio(accountSid, authToken);

export async function createTwilioCalls(url: string, phoneNumbers: string[]): Promise<{operator: string, response: CallInstance}[]> {
    // make calls using twilio
    const results: {operator: string, response: CallInstance}[] = [];
    for (let operator in phoneNumbers) {
        const response = await client.calls.create(
            {
                from: twilioNumber,
                to: operator,
                url: url
            }
        );
        results.push({operator, response});
    }
    
    return results;
}