import html2canvas from "html2canvas";
import jsPDF from "jspdf";
export async function generateWorkPDF(element: HTMLElement, fileName: string) {
  if (!element) {
    console.error("PDF element not found");
    return;
  }
  element.style.opacity = "1";
  const canvas = await html2canvas(element, {
    scale: 1.2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });
  const imgData = canvas.toDataURL("image/jpeg", 1.0);
  const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  if (!imgHeight || !imgWidth || isNaN(imgHeight)) {
    console.error("Invalid image size", { imgWidth, imgHeight });
    return;
  }
  pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
  const blob = pdf.output("blob");
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}
