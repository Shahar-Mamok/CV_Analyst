
// We use dynamic imports to ensure the main application loads immediately.
// The libraries are only fetched when the user actually uploads a file.

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await extractTextFromPdf(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      fileName.endsWith('.docx')
    ) {
      return await extractTextFromDocx(file);
    } else {
      throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
    }
  } catch (error) {
    console.error("File parsing error:", error);
    throw new Error(`Failed to read file: ${(error as Error).message}`);
  }
};

const extractTextFromPdf = async (file: File): Promise<string> => {
  // Dynamically import pdfjs-dist
  const pdfjsModule = await import('pdfjs-dist');
  
  // Handle different export structures
  const pdfjs = pdfjsModule.default || pdfjsModule;
  
  // Locate GlobalWorkerOptions
  const workerConfig = pdfjs.GlobalWorkerOptions || pdfjsModule.GlobalWorkerOptions;
  
  if (workerConfig) {
    // Use unpkg to serve the raw worker script. esm.sh can sometimes wrap it causing worker failure.
    workerConfig.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
  }

  const getDocument = pdfjs.getDocument || pdfjsModule.getDocument;
  
  if (!getDocument) {
      throw new Error("PDF.js library loaded but getDocument is missing.");
  }

  const arrayBuffer = await file.arrayBuffer();
  
  // Converting to Uint8Array is often more robust for PDF.js
  const loadingTask = getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      // @ts-ignore
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText.trim();
};

const extractTextFromDocx = async (file: File): Promise<string> => {
  // Dynamically import mammoth only when needed
  const mammothModule = await import('mammoth');
  // Handle potential default export differences
  const mammoth = mammothModule.default || mammothModule;

  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
};
