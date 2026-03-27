import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import * as fs from 'fs';

const doc = new Document({
    sections: [{
        properties: {},
        children: [
            new Paragraph({
                text: "{title}",
                heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Date: ",
                        bold: true,
                    }),
                    new TextRun("{date}"),
                ],
            }),
            new Paragraph({
                children: [
                    new TextRun({
                        text: "Attendees: ",
                        bold: true,
                    }),
                    new TextRun("{attendees}"),
                ],
            }),
            new Paragraph({
                text: "Executive Summary",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 },
            }),
            new Paragraph({
                text: "{summary}",
            }),
            new Paragraph({
                text: "Action Items",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 },
            }),
            new Paragraph({
                text: "{actions}",
            }),
            new Paragraph({
                text: "Decisions",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400 },
            }),
            new Paragraph({
                text: "{decisions}",
            }),
        ],
    }],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("public/sample_template.docx", buffer);
    console.log("Sample template created at public/sample_template.docx");
});
