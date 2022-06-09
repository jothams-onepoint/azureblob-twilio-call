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
const s3Client_1 = require("../fn-lexblob-to-ptcs3/s3Client");
const blobClient_1 = require("../fn-lexblob-to-ptcs3/blobClient");
const FILE_FILTER = process.env.FILE_FILTER;
const DIR_NAME = process.env.DIR_NAME_OUT;
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('HTTP trigger function processed a request.');
        try {
            // check files and get keys to move
            const objects = yield (0, s3Client_1.listBucket)(FILE_FILTER);
            const files = yield Promise.all(objects
                // filter out the folder itself
                .filter(object => object.Key !== DIR_NAME)
                .map((object) => __awaiter(this, void 0, void 0, function* () {
                // retrieve individual file
                const data = yield (0, s3Client_1.getFromS3)(object.Key);
                // get file name for blob
                const fileName = object.Key.replace(DIR_NAME, "");
                // add file to blob
                const succeeded = yield (0, blobClient_1.addFileToBlob)(data, fileName);
                // delete file from s3 
                if (succeeded) {
                    yield (0, s3Client_1.removeFromS3)(object.Key);
                }
                return {
                    success: succeeded,
                    key: object.Key,
                    fileName: fileName
                };
            })));
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: {
                    success: files.map(f => f.success).reduce((curr, prev) => curr && prev),
                    filesMoved: files
                }
            };
        }
        catch (e) {
            console.error("Error occurred", e);
            context.res = {
                status: 500,
                body: {
                    exception: e,
                    params: process.env
                }
            };
        }
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map