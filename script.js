const coverScreen = document.getElementById('coverScreen');
const bookScreen = document.getElementById('bookScreen');
const openCoverBtn = document.getElementById('openCoverBtn');

const leaves = Array.from(document.querySelectorAll('.leaf')).slice(0, 4); // leaf0..leaf3 are flippable
const total = leaves.length; // 4

let current = 0; // number of leaves flipped so far

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicator = document.getElementById('pageIndicator');

const labels = ['p. 01–02', 'p. 03–04', 'p. 05–06', 'p. 07–08', 'p. 09–10'];

function updateUI() {
  nextBtn.disabled = current === total;
  indicator.textContent = labels[current] || '';
}

function openCover() {
  coverScreen.classList.add('hidden');
  bookScreen.classList.remove('hidden');
  updateUI();
}

function nextPage() {
  if (current >= total) return;
  const leaf = leaves[current];
  const idx = current;

  // Keep this leaf's z-index high until the flip finishes, so it stays
  // visibly on top (covering the next leaf) for the whole turn instead of
  // instantly exposing the next leaf the moment the click happens.
  leaf.classList.add('flipped');
  leaf.addEventListener('transitionend', function onDone(e) {
    if (e.propertyName !== 'transform') return;
    leaf.removeEventListener('transitionend', onDone);
    // Skip if the user flipped back before this forward flip finished.
    if (leaf.classList.contains('flipped')) {
      leaf.style.zIndex = idx - total - 1;
    }
  });

  current++;
  updateUI();
}

function prevPage() {
  if (current <= 0) {
    bookScreen.classList.add('hidden');
    coverScreen.classList.remove('hidden');
    return;
  }
  current--;
  const leaf = leaves[current];
  leaf.style.zIndex = total - current;
  leaf.classList.remove('flipped');
  updateUI();
}

openCoverBtn.addEventListener('click', openCover);

leaves.forEach((leaf) => {
  leaf.querySelector('.front').addEventListener('click', nextPage);
  leaf.querySelector('.back').addEventListener('click', prevPage);
});

nextBtn.addEventListener('click', nextPage);
prevBtn.addEventListener('click', prevPage);

document.addEventListener('keydown', (e) => {
  if (bookScreen.classList.contains('hidden')) return;
  if (e.key === 'ArrowRight') nextPage();
  if (e.key === 'ArrowLeft') prevPage();
});

updateUI();
