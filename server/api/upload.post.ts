import { uploadImage } from '../utils/s3'
import { addMemoriesToRsvp, getRsvpById, type MemoryItem } from '../utils/dynamodb'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface MemoryUpload {
  filename?: string
  success: boolean
  url?: string
  key?: string
  story?: string
  error?: string
}

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No data provided'
    })
  }

  // Extract form data
  let uploaderName = ''
  let rsvpId = ''
  let s3FolderId = ''
  let memoryType = 'photos' // 'photos' or 'text'
  let textMemory = ''
  const stories: Record<string, string> = {}
  const files: typeof formData = []

  for (const part of formData) {
    if (part.name === 'uploaderName' && part.data) {
      uploaderName = part.data.toString('utf-8')
    } else if (part.name === 'rsvpId' && part.data) {
      rsvpId = part.data.toString('utf-8')
    } else if (part.name === 's3FolderId' && part.data) {
      s3FolderId = part.data.toString('utf-8')
    } else if (part.name === 'memoryType' && part.data) {
      memoryType = part.data.toString('utf-8')
    } else if (part.name === 'textMemory' && part.data) {
      textMemory = part.data.toString('utf-8')
    } else if (part.name?.startsWith('story_') && part.data) {
      stories[part.name] = part.data.toString('utf-8')
    } else if (part.name === 'files' && part.filename) {
      files.push(part)
    }
  }

  if (!uploaderName.trim()) {
    throw createError({
      statusCode: 400,
      message: 'Name is required'
    })
  }

  // Require rsvpId for all uploads
  if (!rsvpId) {
    throw createError({
      statusCode: 400,
      message: 'RSVP ID is required'
    })
  }

  // If s3FolderId not provided directly, fetch it from the RSVP record
  if (!s3FolderId) {
    const rsvpRecord = await getRsvpById(rsvpId)
    if (!rsvpRecord) {
      throw createError({
        statusCode: 404,
        message: 'RSVP not found'
      })
    }
    s3FolderId = rsvpRecord.s3FolderId
  }

  // Handle text-only memory - stored directly in DynamoDB (no S3)
  if (memoryType === 'text') {
    if (!textMemory.trim()) {
      throw createError({
        statusCode: 400,
        message: 'Please write your memory'
      })
    }

    const memoryItem: MemoryItem = {
      type: 'text',
      textMemory: textMemory.trim(),
      uploadedAt: new Date().toISOString()
    }

    try {
      await addMemoriesToRsvp(rsvpId, [memoryItem])
      console.log(`Text memory saved to DynamoDB for RSVP ${rsvpId} from ${uploaderName}`)

      return {
        success: true,
        message: 'Memory saved successfully',
        uploaderName,
        rsvpId,
        memoryType: 'text'
      }
    } catch (error) {
      console.error(`Failed to save text memory to DynamoDB:`, error)
      throw createError({
        statusCode: 500,
        message: 'Failed to save memory. Please try again.'
      })
    }
  }

  // Handle photo memories
  if (files.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No photos provided'
    })
  }

  const results: MemoryUpload[] = []
  const memoryItems: MemoryItem[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const story = stories[`story_${i}`] || ''

    // Skip if no file data
    if (!file.data || !file.filename) {
      continue
    }

    // Validate file type
    const contentType = file.type || 'application/octet-stream'
    if (!ALLOWED_TYPES.includes(contentType)) {
      results.push({
        filename: file.filename,
        success: false,
        error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.'
      })
      continue
    }

    // Validate file size
    if (file.data.length > MAX_FILE_SIZE) {
      results.push({
        filename: file.filename,
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      })
      continue
    }

    // Upload to S3 with unique folder ID
    const uploadResult = await uploadImage(
      file.data,
      file.filename,
      contentType,
      s3FolderId,
      uploaderName,
      story
    )

    if (uploadResult.success) {
      results.push({
        filename: file.filename,
        success: true,
        url: uploadResult.url,
        key: uploadResult.key,
        story
      })

      // Prepare memory item for DynamoDB
      memoryItems.push({
        type: 'photo',
        s3Key: uploadResult.key,
        s3Url: uploadResult.url,
        story: story || undefined,
        uploadedAt: new Date().toISOString()
      })

      console.log(`Photo memory uploaded: ${uploadResult.key} from ${uploaderName}`)
    } else {
      results.push({
        filename: file.filename,
        success: false,
        error: uploadResult.error || 'Upload failed'
      })
      console.error(`Failed to upload ${file.filename}: ${uploadResult.error}`)
    }
  }

  if (results.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No valid files to upload'
    })
  }

  // If we have an RSVP ID and successful uploads, link memories to RSVP record
  if (rsvpId && memoryItems.length > 0) {
    try {
      await addMemoriesToRsvp(rsvpId, memoryItems)
      console.log(`${memoryItems.length} photo memories linked to RSVP ${rsvpId}`)
    } catch (error) {
      console.error(`Failed to link memories to RSVP ${rsvpId}:`, error)
      // Don't fail the request - the memories were saved to S3
    }
  }

  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length

  return {
    success: successCount > 0,
    message: `${successCount} photo(s) uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ''}`,
    uploaderName,
    rsvpId: rsvpId || undefined,
    memoryType: 'photos',
    results
  }
})
