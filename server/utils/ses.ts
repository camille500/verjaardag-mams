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

// Hippie flower SVG for email decoration
const flowerSvg = `<svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="10" fill="#F4A261"/>
  <g fill="#E76F51">
    <ellipse cx="50" cy="22" rx="10" ry="16" />
    <ellipse cx="50" cy="78" rx="10" ry="16" />
    <ellipse cx="22" cy="50" rx="16" ry="10" />
    <ellipse cx="78" cy="50" rx="16" ry="10" />
  </g>
</svg>`

const flowerSvgTeal = `<svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="10" fill="#E9C46A"/>
  <g fill="#2A9D8F">
    <ellipse cx="50" cy="22" rx="10" ry="16" />
    <ellipse cx="50" cy="78" rx="10" ry="16" />
    <ellipse cx="22" cy="50" rx="16" ry="10" />
    <ellipse cx="78" cy="50" rx="16" ry="10" />
  </g>
</svg>`

const peaceSvg = `<svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#E9C46A" stroke-width="6">
  <circle cx="50" cy="50" r="45" />
  <line x1="50" y1="5" x2="50" y2="95" />
  <line x1="50" y1="50" x2="20" y2="80" />
  <line x1="50" y1="50" x2="80" y2="80" />
</svg>`

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
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(180deg, #FDF6E9 0%, #FEF3E2 100%);">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(253,246,233,0.95) 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 8px 32px rgba(231,111,81,0.15);">
          <!-- Header with groovy gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #E76F51 0%, #F4A261 50%, #E9C46A 100%); padding: 50px 40px; text-align: center; position: relative;">
              <!-- Decorative flowers -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="60" style="vertical-align: top;">${flowerSvg}</td>
                  <td style="text-align: center;">
                    <h1 style="margin: 0; color: white; font-family: 'Playfair Display', Georgia, serif; font-size: 36px; font-weight: 400; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">Peace, Love & Party!</h1>
                  </td>
                  <td width="60" style="vertical-align: top; text-align: right;">${flowerSvgTeal}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 45px 40px;">
              <p style="font-size: 20px; color: #264653; margin: 0 0 20px; font-family: 'Playfair Display', Georgia, serif;">Hoi ${name},</p>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 25px;">
                Super leuk dat je komt! We hebben je RSVP ontvangen voor het verjaardagsfeest van Petra.
              </p>
              <!-- Info box with hippie styling -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(231,111,81,0.08) 0%, rgba(233,196,106,0.12) 50%, rgba(42,157,143,0.08) 100%); border-radius: 16px; margin: 25px 0; border: 2px solid rgba(233,196,106,0.3);">
                <tr>
                  <td style="padding: 25px 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="40" style="vertical-align: middle;">${peaceSvg}</td>
                        <td style="padding-left: 15px;">
                          <p style="margin: 0 0 8px; font-size: 15px; color: #264653;"><strong style="color: #E76F51;">Datum:</strong> 18 april 2025</p>
                          <p style="margin: 0 0 8px; font-size: 15px; color: #264653;"><strong style="color: #E76F51;">Locatie:</strong> De Walvis, Amsterdam</p>
                          <p style="margin: 0; font-size: 15px; color: #264653;"><strong style="color: #E76F51;">Aantal personen:</strong> ${guests}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 25px;">
                We kijken ernaar uit je te zien! Meer details over de exacte tijd volgen nog.
              </p>
              <!-- Signature with flower -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">${flowerSvg}</td>
                  <td>
                    <p style="font-size: 18px; color: #2A9D8F; font-style: italic; margin: 0; font-family: 'Playfair Display', Georgia, serif;">
                      Liefs,<br>De organisatie
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer with groovy gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #264653 0%, #2A9D8F 100%); padding: 30px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px; color: #E9C46A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Peace & Love</p>
                    <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px; font-family: 'Playfair Display', Georgia, serif;">
                      Petra's 60e Verjaardag
                    </p>
                  </td>
                </tr>
              </table>
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
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(180deg, #FDF6E9 0%, #FEF3E2 100%);">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(253,246,233,0.95) 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 8px 32px rgba(42,157,143,0.15);">
          <!-- Header with teal groovy gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #2A9D8F 0%, #264653 100%); padding: 50px 40px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="60" style="vertical-align: top;">${flowerSvgTeal}</td>
                  <td style="text-align: center;">
                    <h1 style="margin: 0; color: white; font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 400; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">RSVP Ontvangen</h1>
                  </td>
                  <td width="60" style="vertical-align: top; text-align: right;">${flowerSvgTeal}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 45px 40px;">
              <p style="font-size: 20px; color: #264653; margin: 0 0 20px; font-family: 'Playfair Display', Georgia, serif;">Hoi ${name},</p>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 20px;">
                Jammer dat je er niet bij kunt zijn! We hebben je RSVP ontvangen.
              </p>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 30px;">
                Mocht je situatie veranderen, laat het ons dan weten!
              </p>
              <!-- Signature with flower -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">${flowerSvgTeal}</td>
                  <td>
                    <p style="font-size: 18px; color: #2A9D8F; font-style: italic; margin: 0; font-family: 'Playfair Display', Georgia, serif;">
                      Liefs,<br>De organisatie
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer with groovy gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #264653 0%, #2A9D8F 100%); padding: 30px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px; color: #E9C46A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Peace & Love</p>
                    <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px; font-family: 'Playfair Display', Georgia, serif;">
                      Petra's 60e Verjaardag
                    </p>
                  </td>
                </tr>
              </table>
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
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(180deg, #FDF6E9 0%, #FEF3E2 100%);">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(253,246,233,0.95) 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 8px 32px rgba(231,111,81,0.15);">
          <!-- Header with groovy gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #E76F51 0%, #F4A261 50%, #E9C46A 100%); padding: 50px 40px; text-align: center; position: relative;">
              <!-- Decorative flowers -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="60" style="vertical-align: top;">${flowerSvg}</td>
                  <td style="text-align: center;">
                    <h1 style="margin: 0; color: white; font-family: 'Playfair Display', Georgia, serif; font-size: 36px; font-weight: 400; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">Peace, Love & Party!</h1>
                  </td>
                  <td width="60" style="vertical-align: top; text-align: right;">${flowerSvgTeal}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 45px 40px;">
              <p style="font-size: 20px; color: #264653; margin: 0 0 20px; font-family: 'Playfair Display', Georgia, serif;">Hi ${name},</p>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 25px;">
                Great that you're coming! We've received your RSVP for Petra's birthday party.
              </p>
              <!-- Info box with hippie styling -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(231,111,81,0.08) 0%, rgba(233,196,106,0.12) 50%, rgba(42,157,143,0.08) 100%); border-radius: 16px; margin: 25px 0; border: 2px solid rgba(233,196,106,0.3);">
                <tr>
                  <td style="padding: 25px 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="40" style="vertical-align: middle;">${peaceSvg}</td>
                        <td style="padding-left: 15px;">
                          <p style="margin: 0 0 8px; font-size: 15px; color: #264653;"><strong style="color: #E76F51;">Date:</strong> April 18, 2025</p>
                          <p style="margin: 0 0 8px; font-size: 15px; color: #264653;"><strong style="color: #E76F51;">Location:</strong> De Walvis, Amsterdam</p>
                          <p style="margin: 0; font-size: 15px; color: #264653;"><strong style="color: #E76F51;">Number of guests:</strong> ${guests}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 25px;">
                We look forward to seeing you! More details about the exact time will follow.
              </p>
              <!-- Signature with flower -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">${flowerSvg}</td>
                  <td>
                    <p style="font-size: 18px; color: #2A9D8F; font-style: italic; margin: 0; font-family: 'Playfair Display', Georgia, serif;">
                      Love,<br>The organizers
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer with groovy gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #264653 0%, #2A9D8F 100%); padding: 30px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px; color: #E9C46A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Peace & Love</p>
                    <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px; font-family: 'Playfair Display', Georgia, serif;">
                      Petra's 60th Birthday
                    </p>
                  </td>
                </tr>
              </table>
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
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(180deg, #FDF6E9 0%, #FEF3E2 100%);">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(253,246,233,0.95) 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 8px 32px rgba(42,157,143,0.15);">
          <!-- Header with teal groovy gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #2A9D8F 0%, #264653 100%); padding: 50px 40px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="60" style="vertical-align: top;">${flowerSvgTeal}</td>
                  <td style="text-align: center;">
                    <h1 style="margin: 0; color: white; font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 400; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">RSVP Received</h1>
                  </td>
                  <td width="60" style="vertical-align: top; text-align: right;">${flowerSvgTeal}</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 45px 40px;">
              <p style="font-size: 20px; color: #264653; margin: 0 0 20px; font-family: 'Playfair Display', Georgia, serif;">Hi ${name},</p>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 20px;">
                Sorry to hear you can't make it! We've received your RSVP.
              </p>
              <p style="font-size: 16px; color: #5a6c7d; line-height: 1.8; margin: 0 0 30px;">
                If your situation changes, please let us know!
              </p>
              <!-- Signature with flower -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">${flowerSvgTeal}</td>
                  <td>
                    <p style="font-size: 18px; color: #2A9D8F; font-style: italic; margin: 0; font-family: 'Playfair Display', Georgia, serif;">
                      Love,<br>The organizers
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer with groovy gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #264653 0%, #2A9D8F 100%); padding: 30px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px; color: #E9C46A; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Peace & Love</p>
                    <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px; font-family: 'Playfair Display', Georgia, serif;">
                      Petra's 60th Birthday
                    </p>
                  </td>
                </tr>
              </table>
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
