import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const config = useRuntimeConfig()

// When running in AWS (Amplify), credentials are automatically provided via IAM role
// For local development, use AWS CLI credentials or environment variables
const sesClient = new SESClient({
  region: config.awsRegion || 'eu-central-1'
})

interface EmailParams {
  to: string
  name: string
  attending: 'yes' | 'no'
  guests?: number
  locale: string
}

const templates = {
  nl: {
    subjectYes: 'Bevestiging: Je komt naar het feest van Petra!',
    subjectNo: 'Bevestiging: RSVP ontvangen',
    bodyYes: (name: string, guests: number) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FDF6E9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #E76F51 0%, #F4A261 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 400;">Tot op het feest!</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 18px; color: #264653; margin: 0 0 20px;">Hoi ${name},</p>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 20px;">
                Super leuk dat je komt! We hebben je RSVP ontvangen voor het verjaardagsfeest van Petra.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #FDF6E9; border-radius: 12px; margin: 25px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <p style="margin: 0 0 10px; font-size: 14px; color: #264653;"><strong>Datum:</strong> 18 april 2025</p>
                    <p style="margin: 0 0 10px; font-size: 14px; color: #264653;"><strong>Locatie:</strong> De Walvis, Amsterdam</p>
                    <p style="margin: 0; font-size: 14px; color: #264653;"><strong>Aantal personen:</strong> ${guests}</p>
                  </td>
                </tr>
              </table>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 20px;">
                We kijken ernaar uit je te zien! Meer details over de exacte tijd volgen nog.
              </p>
              <p style="font-size: 16px; color: #2A9D8F; font-style: italic; margin: 30px 0 0;">
                Liefs,<br>De organisatie
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background: #264653; padding: 25px; text-align: center;">
              <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 13px;">
                Petra's 60e Verjaardag
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    bodyNo: (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FDF6E9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2A9D8F 0%, #264653 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 400;">RSVP Ontvangen</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 18px; color: #264653; margin: 0 0 20px;">Hoi ${name},</p>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 20px;">
                Jammer dat je er niet bij kunt zijn! We hebben je RSVP ontvangen.
              </p>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 20px;">
                Mocht je situatie veranderen, laat het ons dan weten!
              </p>
              <p style="font-size: 16px; color: #2A9D8F; font-style: italic; margin: 30px 0 0;">
                Liefs,<br>De organisatie
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background: #264653; padding: 25px; text-align: center;">
              <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 13px;">
                Petra's 60e Verjaardag
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  },
  en: {
    subjectYes: 'Confirmation: You\'re coming to Petra\'s party!',
    subjectNo: 'Confirmation: RSVP received',
    bodyYes: (name: string, guests: number) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FDF6E9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #E76F51 0%, #F4A261 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 400;">See you at the party!</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 18px; color: #264653; margin: 0 0 20px;">Hi ${name},</p>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 20px;">
                Great that you're coming! We've received your RSVP for Petra's birthday party.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #FDF6E9; border-radius: 12px; margin: 25px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <p style="margin: 0 0 10px; font-size: 14px; color: #264653;"><strong>Date:</strong> April 18, 2025</p>
                    <p style="margin: 0 0 10px; font-size: 14px; color: #264653;"><strong>Location:</strong> De Walvis, Amsterdam</p>
                    <p style="margin: 0; font-size: 14px; color: #264653;"><strong>Number of guests:</strong> ${guests}</p>
                  </td>
                </tr>
              </table>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 20px;">
                We look forward to seeing you! More details about the exact time will follow.
              </p>
              <p style="font-size: 16px; color: #2A9D8F; font-style: italic; margin: 30px 0 0;">
                Love,<br>The organizers
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background: #264653; padding: 25px; text-align: center;">
              <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 13px;">
                Petra's 60th Birthday
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    bodyNo: (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FDF6E9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2A9D8F 0%, #264653 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 400;">RSVP Received</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 18px; color: #264653; margin: 0 0 20px;">Hi ${name},</p>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 20px;">
                Sorry to hear you can't make it! We've received your RSVP.
              </p>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 20px;">
                If your situation changes, please let us know!
              </p>
              <p style="font-size: 16px; color: #2A9D8F; font-style: italic; margin: 30px 0 0;">
                Love,<br>The organizers
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background: #264653; padding: 25px; text-align: center;">
              <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 13px;">
                Petra's 60th Birthday
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }
}

export async function sendConfirmationEmail(params: EmailParams): Promise<void> {
  const { to, name, attending, guests, locale } = params
  const template = templates[locale as keyof typeof templates] || templates.nl

  const subject = attending === 'yes' ? template.subjectYes : template.subjectNo
  const body = attending === 'yes'
    ? template.bodyYes(name, guests || 1)
    : template.bodyNo(name)

  const fromEmail = config.sesFromEmail || 'noreply@example.com'

  const command = new SendEmailCommand({
    Source: `Petra's Verjaardag <${fromEmail}>`,
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      }
    }
  })

  await sesClient.send(command)
}
