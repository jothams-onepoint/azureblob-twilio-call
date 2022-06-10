"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3Client_1 = require("../libs/s3Client");
(0, s3Client_1.listBuckets)()
    .then(list => {
    console.log("buckets", list);
    return (0, s3Client_1.listBucket)("IPCSDU_ORDER_PLAN_");
})
    .then(bucketObjects => {
    console.log("bucket content", bucketObjects);
});
//# sourceMappingURL=s3ClientDownload_experiments.js.map