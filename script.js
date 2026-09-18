const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const filters = document.querySelectorAll('.filter');
const articles = document.querySelectorAll('.article-row');

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const selected = button.dataset.filter;
    articles.forEach((article) => {
      article.hidden = selected !== 'all' && article.dataset.category !== selected;
    });
  });
});

const galleryDialog = document.querySelector('.gallery-dialog');
const galleryImage = galleryDialog.querySelector('.gallery-stage img');
const galleryTitle = galleryDialog.querySelector('#gallery-title');
const galleryCounter = galleryDialog.querySelector('#gallery-counter');
const galleryClose = galleryDialog.querySelector('.gallery-close');
const galleryPrev = galleryDialog.querySelector('.gallery-prev');
const galleryNext = galleryDialog.querySelector('.gallery-next');

const makeGallery = (folder, prefix, total) => Array.from({ length: total }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  const extension = folder === 'huffpost' && number === '20' ? 'jpg' : 'webp';
  return `assets/logros/${folder}/${prefix}-${number}.${extension}`;
});

const galleries = {
  huffpost: {
    title: 'Logros en El HuffPost',
    images: makeGallery('huffpost', 'huffpost', 24)
  },
  business: {
    title: 'Logros en Business Insider',
    images: makeGallery('business-insider', 'business-insider', 23)
  }
};

let activeGallery = null;
let activeImage = 0;

function renderGalleryImage() {
  const gallery = galleries[activeGallery];
  galleryImage.src = gallery.images[activeImage];
  galleryImage.alt = `${gallery.title}, prueba ${activeImage + 1} de ${gallery.images.length}`;
  galleryTitle.textContent = gallery.title;
  galleryCounter.textContent = `${activeImage + 1} de ${gallery.images.length}`;
}

function moveGallery(step) {
  const total = galleries[activeGallery].images.length;
  activeImage = (activeImage + step + total) % total;
  renderGalleryImage();
}

document.querySelectorAll('.gallery-launch').forEach((button) => {
  button.addEventListener('click', () => {
    activeGallery = button.dataset.gallery;
    activeImage = 0;
    renderGalleryImage();
    galleryDialog.showModal();
  });
});

galleryPrev.addEventListener('click', () => moveGallery(-1));
galleryNext.addEventListener('click', () => moveGallery(1));
galleryClose.addEventListener('click', () => galleryDialog.close());
galleryDialog.addEventListener('click', (event) => {
  if (event.target === galleryDialog) galleryDialog.close();
});
galleryDialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') moveGallery(-1);
  if (event.key === 'ArrowRight') moveGallery(1);
});

document.querySelector('#year').textContent = new Date().getFullYear();
