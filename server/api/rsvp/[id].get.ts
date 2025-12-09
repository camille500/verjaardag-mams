import { getRsvpById } from '../../utils/dynamodb'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'RSVP ID is required'
    })
  }

  try {
    const rsvp = await getRsvpById(id)

    if (!rsvp) {
      throw createError({
        statusCode: 404,
        message: 'RSVP not found'
      })
    }

    // Return only safe fields (not the full record for privacy)
    return {
      success: true,
      rsvp: {
        id: rsvp.id,
        name: rsvp.name,
        attending: rsvp.attending,
        hasMemories: (rsvp.memories?.length || 0) > 0,
        memoriesCount: rsvp.memories?.length || 0
      }
    }
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode === 404) {
      throw error
    }
    console.error('Failed to fetch RSVP:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch RSVP'
    })
  }
})
