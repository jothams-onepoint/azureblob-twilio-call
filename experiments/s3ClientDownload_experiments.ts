import { listBuckets, listBucket } from "../fn-lexblob-to-ptcs3/s3Client";

listBuckets()
    .then(list => {
        console.log("buckets", list)
        return listBucket("IPCSDU_ORDER_PLAN_")    
    })
    .then(bucketObjects => {
        console.log("bucket content", bucketObjects)
    })
