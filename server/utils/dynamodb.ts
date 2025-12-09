import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const config = useRuntimeConfig()

// When running in AWS (Amplify), credentials are automatically provided via IAM role
// For local development, use AWS CLI credentials or environment variables
const client = new DynamoDBClient({
  region: config.awsRegion || 'eu-central-1'
})

const docClient = DynamoDBDocumentClient.from(client)

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
}

export async function saveRsvp(rsvp: RsvpRecord): Promise<void> {
  const tableName = config.dynamodbTableName || 'party-rsvps'

  const command = new PutCommand({
    TableName: tableName,
    Item: rsvp 
  })

  await docClient.send(command)
}
