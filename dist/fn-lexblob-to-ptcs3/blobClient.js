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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFileToBlob = exports.listBlobSimple = exports.archiveBlob = exports.getSignedUrl = exports.generateArchiveFolder = exports.archiveContainerClient = exports.destContainerClient = exports.containerClient = void 0;
const storage_blob_1 = require("@azure/storage-blob");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const inputConnectionString = process.env.BLOB_STORAGE_IN;
const outputConnectionString = process.env.BLOB_STORAGE_OUT;
const inContainer = process.env.CONTAINER_IN;
const outContainer = process.env.CONTAINER_OUT;
const archiveContainer = process.env.ARCHIVE_CONTAINER || inContainer;
// Create the BlobServiceClient object which will be used to create a container client
const inputBlobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(inputConnectionString);
const outputBlobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(outputConnectionString);
// Get a reference to a container
exports.containerClient = inputBlobServiceClient.getContainerClient(inContainer);
exports.destContainerClient = outputBlobServiceClient.getContainerClient(outContainer);
exports.archiveContainerClient = inputBlobServiceClient.getContainerClient(archiveContainer);
const generateArchiveFolder = () => {
    return new Date().toISOString().split("T")[0];
};
exports.generateArchiveFolder = generateArchiveFolder;
const getSignedUrl = (blobClient) => __awaiter(void 0, void 0, void 0, function* () {
    const expiry = 3600;
    const startsOn = new Date();
    const expiresOn = new Date(new Date().valueOf() + expiry * 1000);
    const permission = new storage_blob_1.BlobSASPermissions();
    permission.read = true;
    const token = (0, storage_blob_1.generateBlobSASQueryParameters)({
        containerName: blobClient.containerName,
        blobName: blobClient.location,
        permissions: permission,
        startsOn,
        expiresOn, // Optional
    }, blobClient.credential);
    return `${blobClient.url}?${token.toString()}`;
});
exports.getSignedUrl = getSignedUrl;
const archiveBlob = (sourceFile) => __awaiter(void 0, void 0, void 0, function* () {
    const blobFile = exports.containerClient.getBlockBlobClient(sourceFile);
    const exists = yield blobFile.exists();
    if (!exists) {
        return { "message": `File '${sourceFile}' does not exist in blob '${inContainer}'.` };
    }
    const archiveFolder = (0, exports.generateArchiveFolder)();
    const targetFile = `${archiveFolder}/${sourceFile}`;
    const blobFileCopy = exports.archiveContainerClient.getBlockBlobClient(targetFile);
    const copyExists = yield blobFileCopy.exists();
    if (copyExists) {
        return { "message": `File '${targetFile}' does not exist in blob '${archiveContainer}'.` };
    }
    const signedUrl = yield (0, exports.getSignedUrl)(blobFile);
    const res = yield blobFileCopy.syncCopyFromURL(signedUrl);
    console.log('syncCopyFromURL', JSON.stringify(res));
    yield blobFile.delete();
    return res;
});
exports.archiveBlob = archiveBlob;
const listBlobSimple = (containerClient) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    let i = 1;
    try {
        for (var _b = __asyncValues(containerClient.listBlobsFlat()), _c; _c = yield _b.next(), !_c.done;) {
            const blob = _c.value;
            console.log(`Blob ${i++}: ${blob.name}`);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
exports.listBlobSimple = listBlobSimple;
const addFileToBlob = (data, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    // upload data to the blob
    const blockBlobClient = exports.destContainerClient.getBlockBlobClient(fileName); // create a blob block for the new file
    console.info(`Uploading ${fileName} to blob`);
    const response = yield blockBlobClient.upload(data, data.length);
    if (response._response.status !== 201) {
        return false;
    }
    else {
        return true;
    }
});
exports.addFileToBlob = addFileToBlob;
//# sourceMappingURL=blobClient.js.map