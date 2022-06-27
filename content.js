const getPDF = async () => {
  const srcs = [...document.querySelectorAll('#slide-container img.slide-image')]
    .map(img=>img.srcset.split(',').pop().trim().split(' ')[0]);
  const msg = {title:document.title,srcs:srcs};
  const {data} = await new Promise(resolve => chrome.runtime.sendMessage(msg, resolve));
  const url = URL.createObjectURL(await fetch(data).then(r=>r.blob()));
  return url;
}

const wrapper = document.querySelector('.slideshow-download-button-wrapper');
if (wrapper) {
  wrapper.innerHTML = wrapper.innerHTML;
  console.log(wrapper);
  wrapper.querySelector('button').addEventListener('click', e=>{
    e.currentTarget.disable=true;
    getPDF().then(open).then(_=>e.currentTarget.disable=false);
  });
}
