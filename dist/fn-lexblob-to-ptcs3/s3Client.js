"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromS3 = exports.getFromS3 = exports.uploadBlob = exports.uploadFile = exports.listBucket = exports.listBuckets = exports.config = void 0;
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Import required AWS SDK clients and commands for Node.js.
const client_s3_1 = require("@aws-sdk/client-s3");
dotenv.config();
exports.config = {
    bucketName: process.env.BUCKET_NAME,
    inDirName: process.env.DIR_NAME_IN || '',
    outDirName: process.env.DIR_NAME_OUT || '',
    region: process.env.REGION
};
const s3Client = new client_s3_1.S3Client({ region: exports.config.region });
const listBuckets = () => __awaiter(void 0, void 0, void 0, function* () { return yield s3Client.send(new client_s3_1.ListBucketsCommand({})); });
exports.listBuckets = listBuckets;
const listBucket = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    console.info('before ListObjectsCommand', exports.config.bucketName);
    const bucketContent = yield s3Client.send(new client_s3_1.ListObjectsCommand({ Bucket: exports.config.bucketName }));
    console.info('after ListObjectsCommand', bucketContent);
    const contents = bucketContent === null || bucketContent === void 0 ? void 0 : bucketContent.Contents;
    return contents
        .filter(obj => obj.Key.includes(exports.config.outDirName))
        .filter(obj => filter ? obj.Key.includes(filter) : true);
});
exports.listBucket = listBucket;
const writeToS3 = (uploadParams) => __awaiter(void 0, void 0, void 0, function* () {
    // call S3 to retrieve upload file to specified bucket
    const data = yield s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
    console.error(`Successfully uploaded object: ${uploadParams.Bucket} / ${uploadParams.Key}`);
    return data;
});
const uploadFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const fileStream = fs.createReadStream(file);
    fileStream.on('error', function (err) {
        console.error('File Error', err);
    });
    const uploadParams = { Bucket: exports.config.bucketName, Key: path.basename(file), Body: fileStream };
    return yield writeToS3(uploadParams);
});
exports.uploadFile = uploadFile;
const uploadBlob = (blob, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadParams = {
        Bucket: exports.config.bucketName,
        Key: !!exports.config.inDirName ? `${exports.config.inDirName}/${fileName}` : fileName,
        Body: blob
    };
    return yield writeToS3(uploadParams);
});
exports.uploadBlob = uploadBlob;
const getFromS3 = (key) => __awaiter(void 0, void 0, void 0, function* () {
    // function to convert stream from s3 to a string
    const streamToString = (stream) => new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
    const data = yield s3Client.send(new client_s3_1.GetObjectCommand({ Bucket: exports.config.bucketName, Key: key }));
    return yield streamToString(data.Body);
});
exports.getFromS3 = getFromS3;
const removeFromS3 = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield s3Client.send(new client_s3_1.DeleteObjectCommand({ Bucket: exports.config.bucketName, Key: key }));
});
exports.removeFromS3 = removeFromS3;
//# sourceMappingURL=s3Client.js.map