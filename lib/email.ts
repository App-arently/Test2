import nodemailer from "nodemailer"

interface OrderConfirmationParams {
  email: string
  orderId: string
  printfulOrderId: string
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendOrderConfirmationEmail({
  email,
  orderId,
  printfulOrderId,
}: OrderConfirmationParams) {
  try {
    const mailOptions = {
      from: `"FanMerch AI" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: "Order Confirmation - FanMerch AI",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: #3b82f6;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-radius: 0 0 8px 8px;
              }
              .order-id {
                background: white;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                border: 1px solid #e5e7eb;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background: #3b82f6;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Order Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Thank you for your order! Your custom merchandise is being prepared for production.</p>

              <div class="order-id">
                <strong>Order ID:</strong> ${orderId}<br>
                <strong>Fulfillment ID:</strong> ${printfulOrderId}
              </div>

              <h3>What's Next?</h3>
              <ul>
                <li>Your design will be printed within 2-3 business days</li>
                <li>Estimated delivery: 7-10 business days</li>
                <li>You'll receive a tracking number once shipped</li>
              </ul>

              <p>If you have any questions, reply to this email and we'll be happy to help!</p>

              <div class="footer">
                <p>FanMerch AI - Your idea. AI's design. Your hoodie.</p>
                <p style="font-size: 12px; color: #9ca3af;">
                  This is an automated email. Please do not reply to this address.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Order Confirmed!

Thank you for your order! Your custom merchandise is being prepared for production.

Order ID: ${orderId}
Fulfillment ID: ${printfulOrderId}

What's Next?
- Your design will be printed within 2-3 business days
- Estimated delivery: 7-10 business days
- You'll receive a tracking number once shipped

If you have any questions, reply to this email and we'll be happy to help!

FanMerch AI - Your idea. AI's design. Your hoodie.
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent:", info.messageId)
    return info
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

export async function sendPaymentFailedEmail(email: string) {
  try {
    const mailOptions = {
      from: `"FanMerch AI" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: email,
      subject: "Payment Issue - FanMerch AI",
      html: `
        <p>Hi there,</p>
        <p>We had trouble processing your payment. Please try again or contact your bank.</p>
        <p>If you continue to experience issues, please contact us.</p>
        <p>Best regards,<br>FanMerch AI Team</p>
      `,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error("Error sending payment failed email:", error)
  }
}
