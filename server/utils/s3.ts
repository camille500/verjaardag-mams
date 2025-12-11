import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const config = useRuntimeConfig()

// When running in AWS (Amplify), credentials are automatically provided via IAM role
// For local development, use AWS CLI credentials or environment variables
const s3Client = new S3Client({
  region: config.awsRegion || 'eu-central-1'
})

export interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
}

export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  s3FolderId: string,
  uploaderName?: string,
  story?: string
): Promise<UploadResult> {
  const bucketName = config.s3BucketName || 'party-photos'

  // Generate unique key with timestamp and original filename
  const timestamp = Date.now()
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const key = `memories/${s3FolderId}/${timestamp}-${sanitizedName}`

  try {
    // Upload the image with metadata
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      Metadata: {
        'uploader-name': uploaderName || '',
        'story': story || '',
        'uploaded-at': new Date().toISOString()
      }
    })

    await s3Client.send(command)

    // Return the S3 URL
    const url = `https://${bucketName}.s3.eu-central-1.amazonaws.com/${key}`

    return {
      success: true,
      url,
      key
    }
  } catch (error) {
    console.error('Failed to upload to S3:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

