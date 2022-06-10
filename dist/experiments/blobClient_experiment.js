"use strict";
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
const blobClient_1 = require("../fn-lexblob-to-ptcs3/blobClient");
const archiveFolder = (0, blobClient_1.generateArchiveFolder)();
console.log('archiveFolder', archiveFolder);
blobClient_1.containerClient.exists().then((res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('containerClient', res);
    const fileName = "baf069f8-cdff-44f0-9224-04416ce47e9f.pdf";
    const result = yield (0, blobClient_1.archiveBlob)(fileName);
    console.log(`result: ${JSON.stringify(result)}`);
    const blobFile = blobClient_1.containerClient.getBlockBlobClient(fileName);
    // const exists = await blobFile.exists()
    // console.log('source file exists', exists)
    // const targetFile = `${archiveFolder}/${fileName}`
    // console.log('targetFile', targetFile)
    // const blobFileCopy = archiveContainerClient.getBlockBlobClient(targetFile)
    // console.log('target file exists', await blobFileCopy.exists())
    // const signedUrl = await getSignedUrl(blobFile)
    // console.log('signedUrl', signedUrl)
    // const copyRes = await blobFileCopy.syncCopyFromURL(signedUrl)
    // console.log('copyRes', copyRes)
}));
//# sourceMappingURL=blobClient_experiment.js.map