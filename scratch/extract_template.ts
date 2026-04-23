import * as fs from 'fs';
import * as mammoth from 'mammoth';

const docPath = 'public/sample_template.docx';

if (fs.existsSync(docPath)) {
    mammoth.convertToHtml({path: docPath})
        .then(function(result) {
            const html = result.value; // The generated HTML
            fs.writeFileSync('scratch/template_structure.html', html);
            console.log('Template structure saved to scratch/template_structure.html');
        })
        .catch(function(err) {
            console.error(err);
        });
} else {
    console.error('Template not found at ' + docPath);
}
