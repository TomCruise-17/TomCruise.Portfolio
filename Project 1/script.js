const slider = document.querySelector('.slider');
const list = document.querySelector('.list');
const thumbnail = document.querySelector('.thumbnail');
const next = document.querySelector('#next');
const prev = document.querySelector('#prev');

//Autoplay slider
let runAutoPlay = setTimeout(() => {
  next.click();
}, 8000);

next.addEventListener('click', () => {
  initSlider('next');
});

prev.addEventListener('click', () => {
  initSlider('prev');
});

const initSlider = (type) => {
  const sliderItems = list.querySelectorAll('.item');
  const thumbnailItems = thumbnail.querySelectorAll('.item');

  if (type === 'next') {
    list.appendChild(sliderItems[0]);
    thumbnail.appendChild(thumbnailItems[0]);
    slider.classList.add('next');
  } else {
    const lastItemPosition = sliderItems.length - 1;
    list.prepend(sliderItems[lastItemPosition]);
    thumbnail.prepend(thumbnailItems[lastItemPosition]);
    slider.classList.add('prev');
  }

  setTimeout(() => {
    slider.classList.remove('next');
    slider.classList.remove('prev');
  }, 2000);

  clearTimeout(runAutoPlay);
  runAutoPlay = setTimeout(() => {
    next.click();
  }, 8000);
};

// Daftar link biografi sesuai urutan thumbnail
const bioLinks = [
  'yuji.html',
  'gojo.html',
  'megumi.html',
  'levi.html',
  'mikasa.html'
];

// Event click pada setiap thumbnail
document.querySelectorAll('.thumbnail .item').forEach((item, idx) => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => {
    window.location.href = bioLinks[idx];
  });
});