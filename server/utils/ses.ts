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
  rsvpId: string
}

const getSiteUrl = () => config.siteUrl || 'http://localhost:3000'

// Flower decorations as inline SVG data URIs
const flowerLeft = `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%2393B8A5' opacity='0.7'%3E%3Ccircle cx='30' cy='20' r='8'/%3E%3Ccircle cx='20' cy='30' r='8'/%3E%3Ccircle cx='40' cy='30' r='8'/%3E%3Ccircle cx='25' cy='40' r='8'/%3E%3Ccircle cx='35' cy='40' r='8'/%3E%3Ccircle cx='30' cy='30' r='6' fill='%23E9C46A'/%3E%3C/g%3E%3C/svg%3E" alt="" style="width: 50px; height: 50px;" />`

const flowerRight = `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23C4956A' opacity='0.6'%3E%3Cellipse cx='30' cy='30' rx='12' ry='6' transform='rotate(0 30 30)'/%3E%3Cellipse cx='30' cy='30' rx='12' ry='6' transform='rotate(45 30 30)'/%3E%3Cellipse cx='30' cy='30' rx='12' ry='6' transform='rotate(90 30 30)'/%3E%3Cellipse cx='30' cy='30' rx='12' ry='6' transform='rotate(135 30 30)'/%3E%3Ccircle cx='30' cy='30' r='5' fill='%23E9C46A'/%3E%3C/g%3E%3C/svg%3E" alt="" style="width: 45px; height: 45px;" />`

const templates = {
  nl: {
    subjectYes: 'Tot op het feest van Petra!',
    subjectNo: 'Bedankt voor je reactie',
    bodyYes: (name: string, guests: number, rsvpId: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Quicksand', 'Segoe UI', Tahoma, sans-serif; background-color: #F9F7F4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

          <!-- Decorative top bar -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #93B8A5 0%, #B8D4C8 50%, #E9C46A 100%);"></td>
          </tr>

          <!-- Header with flowers -->
          <tr>
            <td style="padding: 40px 40px 25px; text-align: center; background: #FDFCFA;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="60" style="vertical-align: top;">${flowerLeft}</td>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #93B8A5; font-weight: 600;">Over het feest</p>
                    <h1 style="margin: 0; color: #4A5D52; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 400;">Vier het leven,</h1>
                    <h1 style="margin: 4px 0 0; color: #93B8A5; font-family: Georgia, 'Times New Roman', serif; font-size: 30px; font-weight: 400; font-style: italic;">vier de liefde</h1>
                  </td>
                  <td width="60" style="vertical-align: top; text-align: right;">${flowerRight}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Decorative divider -->
          <tr>
            <td style="padding: 0 50px; background: #FDFCFA;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-bottom: 1px solid #E8E4DC;"></td>
                  <td style="width: 50px; text-align: center; color: #C4956A; font-size: 10px;">&#10022; &#9135; &#10022;</td>
                  <td style="border-bottom: 1px solid #E8E4DC;"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px 50px; background: #FDFCFA;">
              <p style="font-size: 15px; color: #5D5D5D; line-height: 1.8; margin: 0 0 20px; text-align: center;">
                Het feest van Petra begint steeds meer vorm te krijgen! Op 18 april om [tijd volgt nog] gaan we er een groot feest van maken bij De Walvis in Amsterdam.
              </p>

              <p style="font-size: 15px; color: #5D5D5D; line-height: 1.8; margin: 0 0 20px; text-align: center;">
                We vieren dit bijzondere moment graag samen met jou! Kom gezellig langs voor een (na)middag en avond vol plezier, lekker eten en mooie herinneringen.
              </p>

              <!-- Highlight box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #F5F2ED; border-radius: 12px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px 25px; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #6B6B6B; line-height: 1.7;">
                      Zoals jullie weten is Petra altijd degene die voor anderen klaarstaat — van goede doelen tot iedereen om haar heen. Voor haar 60e verjaardag draaien we het een keer om: <strong style="color: #4A5D52;">dit keer zamelen wij iets in voor haar!</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- RSVP Confirmation Box -->
          <tr>
            <td style="padding: 0 50px 30px; background: #FDFCFA;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #F0F5F2 0%, #E8F0EB 100%); border-radius: 12px; border: 1px solid #D4E4DA;">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <p style="margin: 0 0 5px; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #7A9B8A;">Bevestiging</p>
                    <h2 style="margin: 0 0 18px; color: #4A5D52; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 400; font-style: italic;">Je komt naar het feest!</h2>

                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td style="padding: 8px 18px; border-right: 1px solid #C4D9CC;">
                          <p style="margin: 0 0 3px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #93B8A5;">Naam</p>
                          <p style="margin: 0; font-size: 15px; color: #4A5D52; font-weight: 500;">${name}</p>
                        </td>
                        <td style="padding: 8px 18px; border-right: 1px solid #C4D9CC;">
                          <p style="margin: 0 0 3px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #93B8A5;">Datum</p>
                          <p style="margin: 0; font-size: 15px; color: #4A5D52; font-weight: 500;">18 april 2025</p>
                        </td>
                        <td style="padding: 8px 18px;">
                          <p style="margin: 0 0 3px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #93B8A5;">Personen</p>
                          <p style="margin: 0; font-size: 15px; color: #4A5D52; font-weight: 500;">${guests}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Memory upload section -->
          <tr>
            <td style="padding: 0 50px 30px; background: #FDFCFA;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #FDF9F3; border-radius: 12px; border: 1px solid #EDE6DA;">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 17px; color: #4A5D52; font-family: Georgia, 'Times New Roman', serif; font-style: italic;">
                      Deel je mooiste herinneringen!
                    </p>
                    <p style="margin: 0 0 18px; font-size: 14px; color: #7A7A7A; line-height: 1.6;">
                      Help ons een fotoboek vol mooie momenten te maken.<br>Upload je foto's en verhalen over Petra.
                    </p>
                    <a href="${getSiteUrl()}/herinneringen/${rsvpId}" style="display: inline-block; padding: 12px 28px; background: #93B8A5; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.3px;">
                      Herinneringen delen
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #F5F2ED; padding: 25px; text-align: center; border-top: 1px solid #E8E4DC;">
              <p style="margin: 0 0 6px; color: #93B8A5; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">Vier het leven, vier de liefde</p>
              <p style="margin: 0; color: #7A7A7A; font-size: 15px; font-family: Georgia, 'Times New Roman', serif; font-style: italic;">
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
    bodyNo: (name: string, rsvpId: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Quicksand', 'Segoe UI', Tahoma, sans-serif; background-color: #F9F7F4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

          <!-- Decorative top bar -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #93B8A5 0%, #B8D4C8 50%, #E9C46A 100%);"></td>
          </tr>

          <!-- Header with flowers -->
          <tr>
            <td style="padding: 40px 40px 25px; text-align: center; background: #FDFCFA;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="60" style="vertical-align: top;">${flowerLeft}</td>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #93B8A5; font-weight: 600;">Bevestiging</p>
                    <h1 style="margin: 0; color: #4A5D52; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 400;">Bedankt voor</h1>
                    <h1 style="margin: 4px 0 0; color: #93B8A5; font-family: Georgia, 'Times New Roman', serif; font-size: 30px; font-weight: 400; font-style: italic;">je reactie</h1>
                  </td>
                  <td width="60" style="vertical-align: top; text-align: right;">${flowerRight}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Decorative divider -->
          <tr>
            <td style="padding: 0 50px; background: #FDFCFA;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-bottom: 1px solid #E8E4DC;"></td>
                  <td style="width: 50px; text-align: center; color: #C4956A; font-size: 10px;">&#10022; &#9135; &#10022;</td>
                  <td style="border-bottom: 1px solid #E8E4DC;"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px 50px; background: #FDFCFA;">
              <p style="font-size: 16px; color: #4A5D52; margin: 0 0 18px; font-family: Georgia, 'Times New Roman', serif;">Lieve ${name},</p>

              <p style="font-size: 15px; color: #5D5D5D; line-height: 1.8; margin: 0 0 20px;">
                Jammer dat je er niet bij kunt zijn op Petra's 60e verjaardag! We hebben je reactie ontvangen en begrijpen dat het niet altijd mogelijk is.
              </p>

              <p style="font-size: 15px; color: #5D5D5D; line-height: 1.8; margin: 0 0 20px;">
                Mocht je situatie veranderen, laat het ons gerust weten. Je bent altijd welkom!
              </p>
            </td>
          </tr>

          <!-- Memory upload section -->
          <tr>
            <td style="padding: 0 50px 30px; background: #FDFCFA;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #FDF9F3; border-radius: 12px; border: 1px solid #EDE6DA;">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 17px; color: #4A5D52; font-family: Georgia, 'Times New Roman', serif; font-style: italic;">
                      Deel toch je mooiste herinneringen!
                    </p>
                    <p style="margin: 0 0 18px; font-size: 14px; color: #7A7A7A; line-height: 1.6;">
                      Ook al kun je er niet bij zijn, je kunt wel bijdragen aan het fotoboek.<br>Upload je foto's en verhalen over Petra.
                    </p>
                    <a href="${getSiteUrl()}/herinneringen/${rsvpId}" style="display: inline-block; padding: 12px 28px; background: #93B8A5; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.3px;">
                      Herinneringen delen
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="padding: 0 50px 25px; background: #FDFCFA;">
              <p style="font-size: 15px; color: #93B8A5; font-style: italic; margin: 0; font-family: Georgia, 'Times New Roman', serif; text-align: center;">
                Met liefde,<br>De organisatie
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #F5F2ED; padding: 25px; text-align: center; border-top: 1px solid #E8E4DC;">
              <p style="margin: 0 0 6px; color: #93B8A5; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">Vier het leven, vier de liefde</p>
              <p style="margin: 0; color: #7A7A7A; font-size: 15px; font-family: Georgia, 'Times New Roman', serif; font-style: italic;">
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
    subjectYes: 'See you at Petra\'s party!',
    subjectNo: 'Thank you for your response',
    bodyYes: (name: string, guests: number, rsvpId: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Quicksand', 'Segoe UI', Tahoma, sans-serif; background-color: #F9F7F4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

          <!-- Decorative top bar -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #93B8A5 0%, #B8D4C8 50%, #E9C46A 100%);"></td>
          </tr>

          <!-- Header with flowers -->
          <tr>
            <td style="padding: 40px 40px 25px; text-align: center; background: #FDFCFA;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="60" style="vertical-align: top;">${flowerLeft}</td>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #93B8A5; font-weight: 600;">About the party</p>
                    <h1 style="margin: 0; color: #4A5D52; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 400;">Celebrate life,</h1>
                    <h1 style="margin: 4px 0 0; color: #93B8A5; font-family: Georgia, 'Times New Roman', serif; font-size: 30px; font-weight: 400; font-style: italic;">celebrate love</h1>
                  </td>
                  <td width="60" style="vertical-align: top; text-align: right;">${flowerRight}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Decorative divider -->
          <tr>
            <td style="padding: 0 50px; background: #FDFCFA;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-bottom: 1px solid #E8E4DC;"></td>
                  <td style="width: 50px; text-align: center; color: #C4956A; font-size: 10px;">&#10022; &#9135; &#10022;</td>
                  <td style="border-bottom: 1px solid #E8E4DC;"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px 50px; background: #FDFCFA;">
              <p style="font-size: 15px; color: #5D5D5D; line-height: 1.8; margin: 0 0 20px; text-align: center;">
                Petra's party is taking shape! On April 18 at [time TBD] we're going to throw a big party at De Walvis in Amsterdam.
              </p>

              <p style="font-size: 15px; color: #5D5D5D; line-height: 1.8; margin: 0 0 20px; text-align: center;">
                We'd love to celebrate this special moment with you! Join us for an afternoon and evening full of fun, great food and beautiful memories.
              </p>

              <!-- Highlight box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #F5F2ED; border-radius: 12px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px 25px; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #6B6B6B; line-height: 1.7;">
                      As you know, Petra is always the one who's there for others — from charities to everyone around her. For her 60th birthday, we're turning the tables: <strong style="color: #4A5D52;">this time we're collecting something for her!</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- RSVP Confirmation Box -->
          <tr>
            <td style="padding: 0 50px 30px; background: #FDFCFA;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #F0F5F2 0%, #E8F0EB 100%); border-radius: 12px; border: 1px solid #D4E4DA;">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <p style="margin: 0 0 5px; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #7A9B8A;">Confirmation</p>
                    <h2 style="margin: 0 0 18px; color: #4A5D52; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 400; font-style: italic;">You're coming to the party!</h2>

                    <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td style="padding: 8px 18px; border-right: 1px solid #C4D9CC;">
                          <p style="margin: 0 0 3px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #93B8A5;">Name</p>
                          <p style="margin: 0; font-size: 15px; color: #4A5D52; font-weight: 500;">${name}</p>
                        </td>
                        <td style="padding: 8px 18px; border-right: 1px solid #C4D9CC;">
                          <p style="margin: 0 0 3px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #93B8A5;">Date</p>
                          <p style="margin: 0; font-size: 15px; color: #4A5D52; font-weight: 500;">April 18, 2025</p>
                        </td>
                        <td style="padding: 8px 18px;">
                          <p style="margin: 0 0 3px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #93B8A5;">Guests</p>
                          <p style="margin: 0; font-size: 15px; color: #4A5D52; font-weight: 500;">${guests}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Memory upload section -->
          <tr>
            <td style="padding: 0 50px 30px; background: #FDFCFA;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #FDF9F3; border-radius: 12px; border: 1px solid #EDE6DA;">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 17px; color: #4A5D52; font-family: Georgia, 'Times New Roman', serif; font-style: italic;">
                      Share your favorite memories!
                    </p>
                    <p style="margin: 0 0 18px; font-size: 14px; color: #7A7A7A; line-height: 1.6;">
                      Help us create a photobook full of beautiful moments.<br>Upload your photos and stories about Petra.
                    </p>
                    <a href="${getSiteUrl()}/herinneringen/${rsvpId}" style="display: inline-block; padding: 12px 28px; background: #93B8A5; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.3px;">
                      Share memories
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #F5F2ED; padding: 25px; text-align: center; border-top: 1px solid #E8E4DC;">
              <p style="margin: 0 0 6px; color: #93B8A5; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">Celebrate life, celebrate love</p>
              <p style="margin: 0; color: #7A7A7A; font-size: 15px; font-family: Georgia, 'Times New Roman', serif; font-style: italic;">
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
    bodyNo: (name: string, rsvpId: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Quicksand', 'Segoe UI', Tahoma, sans-serif; background-color: #F9F7F4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

          <!-- Decorative top bar -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #93B8A5 0%, #B8D4C8 50%, #E9C46A 100%);"></td>
          </tr>

          <!-- Header with flowers -->
          <tr>
            <td style="padding: 40px 40px 25px; text-align: center; background: #FDFCFA;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="60" style="vertical-align: top;">${flowerLeft}</td>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #93B8A5; font-weight: 600;">Confirmation</p>
                    <h1 style="margin: 0; color: #4A5D52; font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 400;">Thank you for</h1>
                    <h1 style="margin: 4px 0 0; color: #93B8A5; font-family: Georgia, 'Times New Roman', serif; font-size: 30px; font-weight: 400; font-style: italic;">your response</h1>
                  </td>
                  <td width="60" style="vertical-align: top; text-align: right;">${flowerRight}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Decorative divider -->
          <tr>
            <td style="padding: 0 50px; background: #FDFCFA;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-bottom: 1px solid #E8E4DC;"></td>
                  <td style="width: 50px; text-align: center; color: #C4956A; font-size: 10px;">&#10022; &#9135; &#10022;</td>
                  <td style="border-bottom: 1px solid #E8E4DC;"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px 50px; background: #FDFCFA;">
              <p style="font-size: 16px; color: #4A5D52; margin: 0 0 18px; font-family: Georgia, 'Times New Roman', serif;">Dear ${name},</p>

              <p style="font-size: 15px; color: #5D5D5D; line-height: 1.8; margin: 0 0 20px;">
                Sorry to hear you can't make it to Petra's 60th birthday! We've received your response and understand that it's not always possible.
              </p>

              <p style="font-size: 15px; color: #5D5D5D; line-height: 1.8; margin: 0 0 20px;">
                If your situation changes, please let us know. You're always welcome!
              </p>
            </td>
          </tr>

          <!-- Memory upload section -->
          <tr>
            <td style="padding: 0 50px 30px; background: #FDFCFA;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #FDF9F3; border-radius: 12px; border: 1px solid #EDE6DA;">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 17px; color: #4A5D52; font-family: Georgia, 'Times New Roman', serif; font-style: italic;">
                      Share your favorite memories anyway!
                    </p>
                    <p style="margin: 0 0 18px; font-size: 14px; color: #7A7A7A; line-height: 1.6;">
                      Even if you can't attend, you can still contribute to the photobook.<br>Upload your photos and stories about Petra.
                    </p>
                    <a href="${getSiteUrl()}/herinneringen/${rsvpId}" style="display: inline-block; padding: 12px 28px; background: #93B8A5; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.3px;">
                      Share memories
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="padding: 0 50px 25px; background: #FDFCFA;">
              <p style="font-size: 15px; color: #93B8A5; font-style: italic; margin: 0; font-family: Georgia, 'Times New Roman', serif; text-align: center;">
                With love,<br>The organizers
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #F5F2ED; padding: 25px; text-align: center; border-top: 1px solid #E8E4DC;">
              <p style="margin: 0 0 6px; color: #93B8A5; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">Celebrate life, celebrate love</p>
              <p style="margin: 0; color: #7A7A7A; font-size: 15px; font-family: Georgia, 'Times New Roman', serif; font-style: italic;">
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
  const { to, name, attending, guests, locale, rsvpId } = params
  const template = templates[locale as keyof typeof templates] || templates.nl

  const subject = attending === 'yes' ? template.subjectYes : template.subjectNo
  const body = attending === 'yes'
    ? template.bodyYes(name, guests || 1, rsvpId)
    : template.bodyNo(name, rsvpId)

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
