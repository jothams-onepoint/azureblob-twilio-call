import { AzureFunction, Context } from "@azure/functions"
import { uploadBlob } from "../libs/s3Client";
import { archiveBlob } from "../libs/blobClient";

const extractName = (bindingData: string) : string => {
    const splits = bindingData.split('/')
    return splits[splits.length - 1]
}

const blobTrigger: AzureFunction = async function (context: Context, myBlob: any): Promise<void> {
    context.log("Blob trigger function processed blob \n Name:", 
        JSON.stringify(context.bindingData), "\n Blob Size:", myBlob.length, "Bytes");
    const fileName = extractName(context.bindingData['blobTrigger'])
    context.log("File name", fileName)
    try {
        // write to s3 bucket
        const response = await uploadBlob(myBlob, fileName)
        context.log("S3 response", JSON.stringify(response))
        // move blob to archive folder
        const result = await archiveBlob(fileName)
        context.log("Archive result", JSON.stringify(result))
    } catch(e) {
        context.log("Failed to upload", e)
    }
};

export default blobTrigger;
