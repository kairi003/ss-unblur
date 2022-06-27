importScripts('pdfmake/pdfmake.min.js', 'pdfmake/vfs_fonts.js');
console.log(123);

const toDataUrl = blob => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = e => resolve(reader.result);
  reader.onerror = e => reject(e);
  reader.readAsDataURL(blob);
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  Promise.all(msg.srcs.map(s => fetch(s).then(r => r.blob())))
    .then(async bb => {
      const imgs = await Promise.all(bb.map(toDataUrl));
      const {width, height} = await createImageBitmap(bb[0]);
      const dd = {
        info: msg.info,
        pageSize: {width, height},
        pageMargins: [0, 0, 0, 0],
        content: imgs.map(image => ({ image }))
      };
      return pdfMake.createPdf(dd).getDataUrl();
    })
    .then(data => sendResponse({ data }));
  return true;
});
