import { AzureFunction, Context } from "@azure/functions"
import { archiveBlob } from "./blobClient";
import { createTwilioCalls } from "./twilioClient";

const BASE_URL = "https://onepoint.blob.core.windows.net/";

const extractName = (bindingData: string) : string => {
    const splits = bindingData.split('/')
    return splits[splits.length - 1]
}

const blobTrigger: AzureFunction = async function (context: Context, myBlob: any): Promise<void> {
    context.log(
        "Blob trigger function processed blob \n Name:", 
        JSON.stringify(context.bindingData), "\n Blob Size:", myBlob.length, "Bytes"
    );
    const fullPath = context.bindingData['blobTrigger'];
    const fileName = extractName(fullPath);
    context.log("File name", fileName);
    try {
        // upload to twilio
        const twilioResults = await createTwilioCalls(myBlob, context);
        context.log("Twilio result", JSON.stringify(twilioResults));
        // move blob to archive folder
        // const result = await archiveBlob(fileName);
        // context.log("Archive result", JSON.stringify(result));
    } catch(e) {
        context.log("Failed to upload", e);
    }
};

export default blobTrigger;
