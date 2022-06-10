# Azure S3 To Blob

This function is triggered by an HTTP call. It looks for files in an S3 bucket with a specified prefix and copies them over to an azure blob. It then removes them from the S3 bucket.