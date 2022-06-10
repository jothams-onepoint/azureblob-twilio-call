"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3Client_1 = require("../fn-lexblob-to-ptcs3/s3Client");
console.log('config', s3Client_1.config);
// uploadFile("./experiments/dummy.txt")
//     .then((data) => console.info(`Success ${JSON.stringify(data)}`))
//     .catch((e) =>  console.error(`Error ${JSON.stringify(e)}`))
var buffer = new Buffer("hello, world", 'utf8');
(0, s3Client_1.uploadBlob)(buffer, "hello.txt")
    .then((data) => console.info(`Success ${JSON.stringify(data)}`))
    .catch((e) => console.error(`Error ${JSON.stringify(e)}`));
//# sourceMappingURL=s3Client_experiments.js.map