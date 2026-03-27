import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

export async function generateDocx(templateFile: File, data: Record<string, any>) {
  try {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          const zip = new PizZip(content as string);
          const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
          });

          // Render the document (replace placeholders)
          doc.render(data);

          const out = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          });

          // Output the document using file-saver
          saveAs(out, `Meeting_Minutes_${new Date().toISOString().split('T')[0]}.docx`);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = reject;
      reader.readAsArrayBuffer(templateFile);
    });
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
}

/**
 * Intelligent parser to extract structured data from ChatGPT paste.
 * This looks for common headers like "Title:", "Summary:", "Action Items:", etc.
 */
export function parseChatGPTContent(text: string): Record<string, any> {
  const data: Record<string, any> = {
    title: 'Meeting Minutes',
    date: new Date().toLocaleDateString(),
    attendees: '',
    summary: '',
    actions: '',
    decisions: '',
    content: text
  };

  // 1. First, attempt to match specific patterns for our standard keys
  // Very robust regex for labels like "Record by: Name" or "Record by	Name"
  const sections = [
    { key: 'title', patterns: [/^Title\s*[:\s\t]+(.*)/im, /^Subject\s*[:\s\t]+(.*)/im] },
    { key: 'date', patterns: [/^Date\s*[:\s\t]+(.*)/im] },
    { key: 'time', patterns: [/^Time\s*[:\s\t]+(.*)/im] },
    { key: 'venue', patterns: [/^Venue\s*[:\s\t]+(.*)/im, /^Location\s*[:\s\t]+(.*)/im] },
    { key: 'attendees', patterns: [/^Attendees\s*[:\s\t]+(.*)/im, /^Participants\s*[:\s\t]+(.*)/im, /^Participant\s*[:\s\t]+(.*)/im] },
    { key: 'recorded_by', patterns: [/^Record\s+by\s*[:\s\t]+(.*)/im, /^Recorded\s+by\s*[:\s\t]+(.*)/im] },
    { key: 'prepared_by', patterns: [/^Prepared\s+by\s*[:\s\t]+(.*)/im] },
    { key: 'summary', patterns: [/Summary\s*[:\s\t]+([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i] },
    { key: 'actions', patterns: [/Action Items\s*[:\s\t]+([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i, /Next Steps\s*[:\s\t]+([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i] },
    { key: 'decisions', patterns: [/Decisions\s*[:\s\t]+([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i] },
  ];

  sections.forEach(({ key, patterns }) => {
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        data[key] = match[1].trim();
        break; 
      }
    }
  });

  // 2. NEW: Support ANY custom tag using "Key: Value" format
  // We updated the regex to allow spaces in keys (e.g. "Record by: Name")
  const lines = text.split('\n');
  const customData: Record<string, any> = {};

  lines.forEach(line => {
    const customMatch = line.match(/^([\w\s]+)\s*:\s*(.*)$/);
    if (customMatch) {
      const key = customMatch[1].toLowerCase().trim().replace(/\s+/g, '_');
      const value = customMatch[2].trim();
      customData[key] = value;
    }
  });

  // Merge custom data into main data
  Object.keys(customData).forEach(key => {
    if (!data[key] || (key !== 'title' && key !== 'date')) {
      data[key] = customData[key];
    }
  });

  // 3. TABLE MAGIC: Extract rows for the {#notes} loop
  const notesRows: any[] = [];
  const followUpRows: any[] = [];

  // Robust parsing for the "Meeting Notes" section provided by the user
  if (text.includes('Meeting Notes')) {
    const lines = text.split('\n');
    let inNotes = false;
    let inFollowUp = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.includes('Meeting Notes') && !trimmed.includes('Agenda Item')) {
        inNotes = true;
        inFollowUp = false;
        return;
      }
      if (trimmed.includes('Follow-Up Task') && !trimmed.includes('Point Person')) {
        inNotes = false;
        inFollowUp = true;
        return;
      }

      // Parse Meeting Notes Rows
      if (inNotes && !trimmed.includes('Agenda Item')) {
        // Look for tab-separated or multi-space separated columns
        const parts = trimmed.split(/\t| {2,}/);
        if (parts.length >= 3) {
          notesRows.push({
            item: parts[0]?.trim(),
            discussion: parts[1]?.trim(),
            person: parts[2]?.trim(),
            action: parts[3]?.trim() || ''
          });
        }
      }

      // Parse Follow-Up Task Rows
      if (inFollowUp && !trimmed.includes('Follow-Up Task')) {
        const parts = trimmed.split(/\t| {2,}/);
        if (parts.length >= 2) {
          followUpRows.push({
            task: parts[0]?.trim(),
            person: parts[1]?.trim(),
            notes: parts[2]?.trim() || ''
          });
        }
      }
    });
  }
  
  // Fallback to old regex if no rows found
  if (notesRows.length === 0) {
    const notesSection = text.match(/Notes\s*:\s*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
    if (notesSection && notesSection[1]) {
      const rowMatches = notesSection[1].matchAll(/\d+\.\s*Agenda\s*:\s*\[(.*?)\],\s*Discussion\s*:\s*\[(.*?)\],\s*Person\s*:\s*\[(.*?)\],\s*Action\s*:\s*\[(.*?)\]/gi);
      for (const match of rowMatches) {
        notesRows.push({
          item: match[1],
          discussion: match[2],
          person: match[3],
          action: match[4]
        });
      }
    }
  }

  data.notes = notesRows;
  data.task = followUpRows; // Match user's {#task} tag
  data.tasks = followUpRows; // Keep plural as fallback

  // 4. AGENDA MAGIC: Extract and clean the agenda section
  let agendaText = '';
  const agendaSection = text.match(/Agenda\s*\n+([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
  if (agendaSection && agendaSection[1]) {
    // Filter out rows that contain headers like "No." or "Agenda Item"
    const agendaLines = agendaSection[1].split('\n')
      .filter(line => !line.match(/No\.\s*Agenda Item/i) && line.trim().length > 0)
      .map(line => {
        let trimmed = line.trim().replace(/\t/g, ' ');
        // If it starts with a number but no dot, add the dot (e.g. "1 Benchmarking" -> "1. Benchmarking")
        if (trimmed.match(/^\d+\s+[A-Z]/)) {
          trimmed = trimmed.replace(/^(\d+)\s+/, '$1. ');
        }
        return trimmed;
      });
    
    agendaText = agendaLines.join('\n');
  }
  data.agenda = agendaText;

  // 5. Fallback for summary
  if (!data.summary && text.length > 50) {
    data.summary = text.split('\n\n')[0];
  }

  return data;
}
