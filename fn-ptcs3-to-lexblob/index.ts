import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { listBucket, getFromS3, removeFromS3 } from "../fn-lexblob-to-ptcs3/s3Client";
import { addFileToBlob } from "../fn-lexblob-to-ptcs3/blobClient";

const FILE_FILTER = process.env.FILE_FILTER;
const DIR_NAME = process.env.DIR_NAME_OUT;

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    try {
        // check files and get keys to move
        const objects = await listBucket(FILE_FILTER)
        const files = await Promise.all(objects
            // filter out the folder itself
            .filter(object => object.Key !== DIR_NAME)
            .map(async (object) => {
                // retrieve individual file
                const data = await getFromS3(object.Key);

                // get file name for blob
                const fileName = object.Key.replace(DIR_NAME, "");

                // add file to blob
                const succeeded = await addFileToBlob(data, fileName);
                
                // delete file from s3 
                if (succeeded) {
                    await removeFromS3(object.Key);
                }
                
                return {
                    success: succeeded,
                    key: object.Key,
                    fileName: fileName
                };
            })
        );
        
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                success: files.map(f => f.success).reduce((curr, prev) => curr && prev),
                filesMoved: files
            }
        };
    } catch(e) {
        console.error("Error occurred", e)
        context.res = {
            status: 500,
            body: {
                exception: e,
                params: process.env
            }
        };
    }

    
};

export default httpTrigger;