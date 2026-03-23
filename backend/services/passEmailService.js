const { generatePassPDF } = require("../utils/generatePDF");
const { transporter } = require("../utils/sendEmail");

const sendVisitorPass = async (visitor, appointment, passId) => {

  // Generate the visitor pass PDF and send it as an email attachment to the visitor
  const pdfBuffer = await generatePassPDF(visitor, appointment, passId);

  // Send email with PDF attachment
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: visitor.email,
    subject: "Visitor Pass Approved",
    text: "Your visit has been approved. Your visitor pass is attached.",
    attachments: [
      {
        filename: `visitor-pass-${passId}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf"
      }
    ]
  });

};

module.exports = { sendVisitorPass };