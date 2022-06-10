import { containerClient, generateArchiveFolder, archiveContainerClient, getSignedUrl, archiveBlob} from "../libs/blobClient";

const archiveFolder = generateArchiveFolder()

console.log('archiveFolder', archiveFolder)

containerClient.exists().then(async (res) => {
    console.log('containerClient', res)
    const fileName = "baf069f8-cdff-44f0-9224-04416ce47e9f.pdf"
    const result = await archiveBlob(fileName)
    console.log(`result: ${JSON.stringify(result)}`);
    const blobFile = containerClient.getBlockBlobClient(fileName)

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
})

