import { config, uploadBlob } from "../fn-lexblob-to-ptcs3/s3Client";

console.log('config', config)

// uploadFile("./experiments/dummy.txt")
//     .then((data) => console.info(`Success ${JSON.stringify(data)}`))
//     .catch((e) =>  console.error(`Error ${JSON.stringify(e)}`))

var buffer = new Buffer("hello, world", 'utf8');    
uploadBlob(buffer, "hello.txt")
    .then((data) => console.info(`Success ${JSON.stringify(data)}`))
    .catch((e) =>  console.error(`Error ${JSON.stringify(e)}`))