import { Context } from "@azure/functions";
import { Twilio } from "twilio";
import { CallInstance } from "twilio/lib/rest/api/v2010/account/call";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const phoneList = process.env.RECIPIENTS;

const client = new Twilio(accountSid, authToken);

export async function createTwilioCalls(message: string, context: Context): Promise<{operator: string, response: CallInstance}[]> {
    // make calls using twilio
    const results: {operator: string, response: CallInstance}[] = [];
    context.log("Twilio Number: "+twilioNumber);
    context.log("Message: "+message);

    // construct twiML
    const twiml = new VoiceResponse();
    twiml.say({
        voice: "man",
        language:"en-GB"
    }, message);

    const operatorNumbers = phoneList.split(";");
    for (let operator in operatorNumbers) {
        context.log("Calling Operator: "+operatorNumbers[operator]);
        const response = await client.calls.create(
            {
                twiml: twiml.toString(),
                from: twilioNumber,
                to: operatorNumbers[operator],
            }
        );
        results.push({operator: operatorNumbers[operator], response});
    }

    return results;
}