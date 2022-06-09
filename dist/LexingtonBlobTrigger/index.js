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
const s3Client_1 = require("./s3Client");
const blobClient_1 = require("./blobClient");
const extractName = (bindingData) => {
    const splits = bindingData.split('/');
    return splits[splits.length - 1];
};
const blobTrigger = function (context, myBlob) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log("Blob trigger function processed blob \n Name:", JSON.stringify(context.bindingData), "\n Blob Size:", myBlob.length, "Bytes");
        const fileName = extractName(context.bindingData['blobTrigger']);
        context.log("File name", fileName);
        try {
            // write to s3 bucket
            const response = yield (0, s3Client_1.uploadBlob)(myBlob, fileName);
            context.log("S3 response", JSON.stringify(response));
            // move blob to archive folder
            const result = yield (0, blobClient_1.archiveBlob)(fileName);
            context.log("Archive result", JSON.stringify(result));
        }
        catch (e) {
            context.log("Failed to upload", e);
        }
    });
};
exports.default = blobTrigger;
//# sourceMappingURL=index.js.map