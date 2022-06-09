import * as dotenv from "dotenv";
import * as fs from 'fs';
import * as path from 'path';

// Import required AWS SDK clients and commands for Node.js.
import { S3Client, PutObjectCommand, PutObjectCommandInput, 
    ListBucketsCommand, ListObjectsCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

export const config = {
    bucketName: process.env.BUCKET_NAME,
    inDirName: process.env.DIR_NAME_IN || '',
    outDirName: process.env.DIR_NAME_OUT || '',
    region: process.env.REGION
}

const s3Client = new S3Client({ region: config.region });

export const listBuckets = async () => 
    await s3Client.send(new ListBucketsCommand({}));

export const listBucket = async (filter: string) => {
    console.info('before ListObjectsCommand', config.bucketName)
    const bucketContent = await s3Client.send(new ListObjectsCommand({ Bucket: config.bucketName }));
    console.info('after ListObjectsCommand', bucketContent)
    const contents = bucketContent?.Contents
    return contents
        .filter(obj => obj.Key.includes(config.outDirName))
        .filter(obj => filter ? obj.Key.includes(filter) : true)
}

const writeToS3 = async (uploadParams: PutObjectCommandInput) => {
    // call S3 to retrieve upload file to specified bucket
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.error(`Successfully uploaded object: ${uploadParams.Bucket} / ${uploadParams.Key}`);
    return data
}

export const uploadFile = async (file): Promise<any> => {
    const fileStream = fs.createReadStream(file);
    fileStream.on('error', function (err) {
        console.error('File Error', err);
    });
    const uploadParams = { Bucket: config.bucketName, Key: path.basename(file), Body: fileStream };
    return await writeToS3(uploadParams)
}

export const uploadBlob = async (blob, fileName): Promise<any> => {
    const uploadParams = {
        Bucket: config.bucketName,
        Key: !!config.inDirName ? `${config.inDirName}/${fileName}` : fileName,
        Body: blob
    };
    return await writeToS3(uploadParams)
}

export const getFromS3 = async (key: string): Promise<string> => {
    // function to convert stream from s3 to a string
    const streamToString = (stream: any): Promise<string> =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk: any) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      });
    const data = await s3Client.send(new GetObjectCommand({ Bucket: config.bucketName, Key: key }));
    return await streamToString(data.Body);
}

export const removeFromS3 = async (key: string) => {
    return await s3Client.send(new DeleteObjectCommand({ Bucket: config.bucketName, Key: key }));
}