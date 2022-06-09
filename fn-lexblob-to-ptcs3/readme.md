# Azure Blob To S3

This project sets up an Azure function which is triggered by a write event on amn Azure Blob storage folder which copies the file accross to S3.

## How it works

For a `BlobTrigger` to work, you provide a path which dictates where the blobs are located inside your container, and can also help restrict the types of blobs you wish to return. For instance, you can set the path to `samples/{name}.png` to restrict the trigger to only the samples path and only blobs with ".png" at the end of their name.

## Learn more

<TODO> Documentation

DefaultEndpointsProtocol=https;AccountName=lexingtonoutputs;AccountKey=NFVJflf1N/O/G1OPLd1jrFsT87fRXwwy/krdEn3YtJI8kCO3MnPq/KlVFPbTqrmdPxyA7ud8y1pkto1s9cF0Lg==;EndpointSuffix=core.windows.net

DefaultEndpointsProtocol=https;AccountName=onepointtest;AccountKey=ZinQvc8VG2qBB5BbPI5uRqmCI5gu1oYywlVzvkU3m/WfiENt15oVVQuOHVnFjNmqO95ZXoQS5lcZfUkCFD5Uww==;EndpointSuffix=core.windows.net