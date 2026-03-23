const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const generatePassPDF = async (visitor, appointment, passId) => {
  // Generate a PDF document for the visitor pass with visitor details, appointment details, and a QR code for the pass ID
  // Used Promise to handle the asynchronous nature of PDF generation and return the PDF as a buffer
  return new Promise(async (resolve) => {
    const doc = new PDFDocument({ size: "A6", margin: 20 });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    const qr = await QRCode.toDataURL(passId);
    const hostName = appointment?.employeeId?.name || "Assigned Host";

    doc.fontSize(18).text("Visitor Pass", { align: "center" });
    doc.moveDown();
    doc.text(`Name: ${visitor.name}`);
    doc.text(`Host: ${hostName}`);
    doc.text(`Purpose: ${appointment.purpose}`);
    doc.text(`Date: ${appointment.visitDate.toDateString()}`);
    doc.text(`Time: ${appointment.visitTime}`);
    doc.moveDown();
    doc.image(
      visitor.photo || "https://placehold.co/150x150?text=No+Photo",
      {
        fit: [150, 150],
        align: "center"
      }
    )
    doc.moveDown();
    doc.image(qr, {
      fit: [120, 120],
      align: "center"
    });
    doc.moveDown();
    doc.text(`Pass ID: ${passId}`, { align: "center" });
    doc.end();
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
  });
};

module.exports = { generatePassPDF };