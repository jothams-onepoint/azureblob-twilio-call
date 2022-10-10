import { BlobSASPermissions, BlobServiceClient, generateBlobSASQueryParameters } from '@azure/storage-blob'
import * as dotenv from "dotenv";

dotenv.config();

const inputConnectionString = process.env.BLOB_STORAGE
const container = process.env.CONTAINER
const archiveContainer = process.env.ARCHIVE_CONTAINER || container

// Create the BlobServiceClient object which will be used to create a container client
const inputBlobServiceClient = BlobServiceClient.fromConnectionString(
    inputConnectionString
);

// Get a reference to a container
export const containerClient = inputBlobServiceClient.getContainerClient(container);
export const archiveContainerClient = inputBlobServiceClient.getContainerClient(archiveContainer);

export const generateArchiveFolder = () => {
    return new Date().toISOString().split("T")[0]
}

export const getSignedUrl = async (blobClient) => {
    const expiry = 3600;
    const startsOn = new Date();
    const expiresOn = new Date(new Date().valueOf() + expiry * 1000);

    const permission = new BlobSASPermissions()
    permission.read = true
    const token = generateBlobSASQueryParameters(
        {
            containerName: blobClient.containerName,
            blobName: blobClient.location,
            permissions: permission, // Required
            startsOn, // Required
            expiresOn, // Optional
        },
        blobClient.credential,
    );
    return `${blobClient.url}?${token.toString()}`;
}

export const archiveBlob = async (sourceFile: string) : Promise<any> => {
    const blobFile = containerClient.getBlockBlobClient(sourceFile)
    const exists = await blobFile.exists()
    if(!exists) {
        return {"message": `File '${sourceFile}' does not exist in blob '${container}'.`}
    }
    const archiveFolder = generateArchiveFolder()
    const targetFile = `${archiveFolder}/${sourceFile}`
    const blobFileCopy = archiveContainerClient.getBlockBlobClient(targetFile)
    const copyExists = await blobFileCopy.exists()
    if(copyExists) {
        return {"message": `File '${targetFile}' already exists in blob '${archiveContainer}'.`}
    }
    const signedUrl = await getSignedUrl(blobFile)
    const res = await blobFileCopy.syncCopyFromURL(signedUrl)
    console.log('syncCopyFromURL', JSON.stringify(res))
    await blobFile.delete()
    return res
}

export const listBlobSimple = async (containerClient) => {
    let i = 1;
    for await (const blob of containerClient.listBlobsFlat()) {
      console.log(`Blob ${i++}: ${blob.name}`);
    }
}