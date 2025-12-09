import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

const config = useRuntimeConfig()

// When running in AWS (Amplify), credentials are automatically provided via IAM role
// For local development, use AWS CLI credentials or environment variables
const client = new DynamoDBClient({
  region: config.awsRegion || 'eu-central-1'
})

const docClient = DynamoDBDocumentClient.from(client)

export interface MemoryItem {
  type: 'photo' | 'text'
  s3Key?: string
  s3Url?: string
  story?: string
  textMemory?: string
  uploadedAt: string
}

export interface RsvpRecord {
  id: string
  name: string
  email: string
  attending: 'yes' | 'no'
  guests?: number
  contribution?: string
  message?: string
  locale: string
  createdAt: string
  memories?: MemoryItem[]
}

export async function saveRsvp(rsvp: RsvpRecord): Promise<void> {
  const tableName = config.dynamodbTableName || 'party-rsvps'

  const command = new PutCommand({
    TableName: tableName,
    Item: rsvp
  })

  await docClient.send(command)
}

export async function getRsvpById(id: string): Promise<RsvpRecord | null> {
  const tableName = config.dynamodbTableName || 'party-rsvps'

  const command = new GetCommand({
    TableName: tableName,
    Key: { id }
  })

  const result = await docClient.send(command)
  return result.Item as RsvpRecord | null
}

export async function addMemoryToRsvp(id: string, memory: MemoryItem): Promise<void> {
  const tableName = config.dynamodbTableName || 'party-rsvps'

  const command = new UpdateCommand({
    TableName: tableName,
    Key: { id },
    UpdateExpression: 'SET memories = list_append(if_not_exists(memories, :empty), :memory)',
    ExpressionAttributeValues: {
      ':memory': [memory],
      ':empty': []
    }
  })

  await docClient.send(command)
}

export async function addMemoriesToRsvp(id: string, memories: MemoryItem[]): Promise<void> {
  const tableName = config.dynamodbTableName || 'party-rsvps'

  const command = new UpdateCommand({
    TableName: tableName,
    Key: { id },
    UpdateExpression: 'SET memories = list_append(if_not_exists(memories, :empty), :memories)',
    ExpressionAttributeValues: {
      ':memories': memories,
      ':empty': []
    }
  })

  await docClient.send(command)
}
