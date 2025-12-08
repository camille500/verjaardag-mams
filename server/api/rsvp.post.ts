import { v4 as uuidv4 } from 'uuid'
import { saveRsvp, type RsvpRecord } from '../utils/dynamodb'
import { sendConfirmationEmail } from '../utils/ses'

interface RsvpRequestBody {
  name: string
  email: string
  attending: 'yes' | 'no'
  guests?: string
  contribution?: string
  message?: string
  locale?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RsvpRequestBody>(event)

  // Validate required fields
  if (!body.name || !body.email || !body.attending) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: name, email, and attending are required'
    })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format'
    })
  }

  // Validate attending value
  if (body.attending !== 'yes' && body.attending !== 'no') {
    throw createError({
      statusCode: 400,
      message: 'Invalid attending value. Must be "yes" or "no"'
    })
  }

  const rsvpId = uuidv4()
  const now = new Date().toISOString()
  const locale = body.locale || 'nl'

  // Create RSVP record
  const rsvpRecord: RsvpRecord = {
    id: rsvpId,
    name: body.name.trim(),
    email: body.email.toLowerCase().trim(),
    attending: body.attending,
    guests: body.attending === 'yes' ? parseInt(body.guests || '1', 10) : undefined,
    contribution: body.contribution?.trim() || undefined,
    message: body.message?.trim() || undefined,
    locale,
    createdAt: now
  }

  try {
    // Save to DynamoDB
    await saveRsvp(rsvpRecord)
    console.log(`RSVP saved successfully: ${rsvpId}`)
  } catch (error) {
    console.error('Failed to save RSVP to DynamoDB:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to save RSVP. Please try again.'
    })
  }

  try {
    // Send confirmation email
    await sendConfirmationEmail({
      to: rsvpRecord.email,
      name: rsvpRecord.name,
      attending: rsvpRecord.attending,
      guests: rsvpRecord.guests,
      locale
    })
    console.log(`Confirmation email sent to: ${rsvpRecord.email}`)
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    // Don't throw error for email failure - RSVP was saved successfully
  }

  return {
    success: true,
    message: 'RSVP submitted successfully',
    id: rsvpId
  }
})
