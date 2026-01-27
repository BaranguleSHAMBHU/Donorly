import PDFDocument from 'pdfkit';
import Camp from '../models/Camp.js';
import Donor from '../models/Donor.js';

/**
 * @desc    Generate and Download Certificate
 * @route   GET /api/certificate/:campId/:donorId
 */
export const generateCertificate = async (req, res) => {
  try {
    const { campId, donorId } = req.params;

    // 1. Fetch Data
    const camp = await Camp.findById(campId).populate('organizationId');
    const donor = await Donor.findById(donorId);

    if (!camp || !donor) {
      return res.status(404).json({ message: "Camp or Donor not found" });
    }

    // 2. Create PDF Document
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
    });

    // 3. Set Response Headers (to trigger download)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate-${donor.fullName}.pdf`);

    // Pipe PDF to the response
    doc.pipe(res);

    // ================= DESIGN THE CERTIFICATE =================
    
    // Background / Border (Simple Rectangle)
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .strokeColor('#CC0000') // Red Border
       .lineWidth(5)
       .stroke();

    // Corner Ornaments (Optional - just circles for now)
    doc.circle(50, 50, 10).fill('#CC0000');
    doc.circle(doc.page.width - 50, 50, 10).fill('#CC0000');
    doc.circle(50, doc.page.height - 50, 10).fill('#CC0000');
    doc.circle(doc.page.width - 50, doc.page.height - 50, 10).fill('#CC0000');

    // Title
    doc.fontSize(40).font('Helvetica-Bold').fillColor('#333333')
       .text('CERTIFICATE OF APPRECIATION', 0, 150, { align: 'center' });

    // Subtitle
    doc.fontSize(20).font('Helvetica').fillColor('#666666')
       .text('This certificate is proudly presented to', 0, 220, { align: 'center' });

    // DONOR NAME (The Star of the Show) 🌟
    doc.fontSize(45).font('Helvetica-Bold').fillColor('#CC0000')
       .text(donor.fullName, 0, 270, { align: 'center' });

    // Body Text
    doc.fontSize(18).fillColor('#333333')
       .text('For their selfless blood donation at', 0, 350, { align: 'center' });
    
    doc.fontSize(25).font('Helvetica-Bold')
       .text(camp.campName, 0, 380, { align: 'center' });

    // Date & Organizer
    const dateStr = new Date(camp.date).toLocaleDateString();
    
    doc.fontSize(15).font('Helvetica').fillColor('#555555')
       .text(`Date: ${dateStr}`, 100, 480);
       
    doc.text(`Organizer: ${camp.organizerName}`, doc.page.width - 300, 480);

    // Signature Line
    doc.moveTo(100, 470).lineTo(300, 470).strokeColor('#333333').lineWidth(1).stroke();
    doc.moveTo(doc.page.width - 300, 470).lineTo(doc.page.width - 100, 470).stroke();

    // Footer
    doc.fontSize(10).fillColor('#999999')
       .text('Generated digitally by Donorly - Every Donation Digitally Remembered.', 0, 530, { align: 'center' });

    // ================= END DESIGN =================

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating certificate" });
  }
};