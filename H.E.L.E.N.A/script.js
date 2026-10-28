const LIGHT_YEAR_KM = 9.4607e12;
const $ = (selector) => document.querySelector(selector);
const numberPL = (value, digits = 2) => new Intl.NumberFormat('pl-PL', { maximumFractionDigits: digits }).format(value);
function compactPL(value) {
  if (!Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  if (abs >= 1e15) return `${numberPL(value / 1e15, 2)} biliarda`;
  if (abs >= 1e12) return `${numberPL(value / 1e12, 2)} bln`;
  if (abs >= 1e9) return `${numberPL(value / 1e9, 2)} mld`;
  if (abs >= 1e6) return `${numberPL(value / 1e6, 2)} mln`;
  return numberPL(value, 2);
}
function calculateDistance() {
  const field = $('#distance');
  const ly = Number(field.value);
  if (field.value.trim() === '' || !Number.isFinite(ly) || ly < 0) {
    field.setAttribute('aria-invalid', 'true');
    field.focus();
    $('#lightYearsResult').innerHTML = 'Podaj poprawną <small>wartość ≥ 0</small>';
    $('#kmResult').textContent = '—';
    $('#travelResult').textContent = '—';
    return;
  }
  field.removeAttribute('aria-invalid');
  $('#lightYearsResult').innerHTML = `${numberPL(ly, 4)} <small>lat</small>`;
  $('#kmResult').innerHTML = `${compactPL(ly * LIGHT_YEAR_KM)} <small>km</small>`;
  const years = ly * LIGHT_YEAR_KM / 100000 / (60 * 60 * 24 * 365.25);
  $('#travelResult').textContent = years < 1 ? `${numberPL(years * 365.25, 1)} dni` : `~${compactPL(years)} lat`;
}
$('#calculate').addEventListener('click', calculateDistance);
$('#distance').addEventListener('keydown', (event) => { if (event.key === 'Enter') calculateDistance(); });
document.querySelectorAll('[data-distance]').forEach((button) => button.addEventListener('click', () => {
  $('#distance').value = button.dataset.distance;
  calculateDistance();
}));
const modal = $('#factModal');
function openModal(text) {
  $('#modalText').textContent = text;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  $('#closeModal').focus();
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
document.querySelectorAll('[data-fact]').forEach((button) => button.addEventListener('click', () => openModal(button.dataset.fact)));
$('#closeModal').addEventListener('click', closeModal);
$('#modalOkay').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
let scanTimeout;
$('#scanButton').addEventListener('click', () => {
  const button = $('#scanButton');
  const scanner = $('.scanner');
  const status = $('#scanStatus');
  const readout = $('#scanReadout');
  clearTimeout(scanTimeout);
  if (scanner.classList.contains('scanning')) {
    scanner.classList.remove('scanning');
    status.classList.remove('scanning');
    status.innerHTML = '<span class="status-dot"></span> SKANOWANIE ZATRZYMANE';
    readout.textContent = 'SCAN INTERRUPTED';
    button.innerHTML = '▶ URUCHOM SKANER';
    return;
  }
  scanner.classList.add('scanning');
  status.classList.add('scanning');
  status.textContent = 'SKANOWANIE PASMA — ANALIZA…';
  readout.textContent = 'SEARCHING…';
  button.innerHTML = '■ ZATRZYMAJ SKANER';
  scanTimeout = setTimeout(() => {
    if (!scanner.classList.contains('scanning')) return;
    status.textContent = 'ANOMALIA WYKRYTA — SYGNAŁ NIEZNANEGO POCHODZENIA';
    readout.textContent = 'ANOMALY // SIMULATION';
  }, 3500);
});
calculateDistance();
