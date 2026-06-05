// MASTER QUOTE COLLECTION
const MASTER_QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "Get busy living or get busy dying.", author: "Stephen King" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Everything you’ve ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", author: "Vince Lombardi" },
  { text: "If you are working on something that you really care about, you don’t have to be pushed.", author: "Steve Jobs" },
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Try not to become a person of success, but rather a person of value.", author: "Albert Einstein" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "We generate fears while we sit. We overcome them by action.", author: "Dr. Henry Link" },
  { text: "Little progress each day adds up to big results.", author: "Satya Nani" },
  { text: "The sun himself is weak when he first rises, and gathers strength and courage as the day gets on.", author: "Charles Dickens" },
  { text: "You define your own life. Don’t let other people write your script.", author: "Oprah Winfrey" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Whatever you are, be a good one.", author: "Abraham Lincoln" },
  { text: "It always seems impossible until it’s done.", author: "Nelson Mandela" },
  { text: "Don’t limit your challenges. Challenge your limits.", author: "Anonymous" },
  { text: "Success is liking yourself, liking what you do, and liking how you do it.", author: "Maya Angelou" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Make each day your masterpiece.", author: "John Wooden" }
];

let currentQuoteObj = { text: "", author: "" };

const quoteTextEl = document.getElementById('quoteText');
const authorTextEl = document.getElementById('authorText');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const shareBtn = document.getElementById('shareQuoteBtn');
const cardEl = document.getElementById('quoteCard');

function displayQuote(quote) {
  if (!quote || !quote.text) {
    quoteTextEl.innerHTML = "“Rise above the storm and you will find the sunshine.”";
    authorTextEl.innerHTML = '<i class="fas fa-feather-alt"></i> Mario Fernandes';
    return;
  }
  quoteTextEl.innerHTML = `“${quote.text}”`;
  authorTextEl.innerHTML = `<i class="fas fa-feather-alt"></i> ${quote.author || "Anonymous"}`;
  currentQuoteObj = { text: quote.text, author: quote.author || "Anonymous" };

  cardEl.style.transform = 'scale(1)';
  setTimeout(() => { cardEl.style.transform = ''; }, 100);
}

function getRandomLocalQuote() {
  const randomIndex = Math.floor(Math.random() * MASTER_QUOTES.length);
  return { ...MASTER_QUOTES[randomIndex] };
}

async function fetchQuoteFromAPI() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const response = await fetch('https://api.quotable.io/random', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return { text: data.content, author: data.author };
  } catch (error) {
    console.log("API fetch failed → using local quote");
    return null;
  }
}

let isLoading = false;

async function updateQuoteWithBackend() {
  if (isLoading) return;
  isLoading = true;
  cardEl.classList.add('loading');
  const originalBtnText = newQuoteBtn.innerHTML;
  newQuoteBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Loading...';
  newQuoteBtn.disabled = true;

  let newQuote = await fetchQuoteFromAPI();
  if (!newQuote) newQuote = getRandomLocalQuote();
  if (!newQuote.text) newQuote = { text: "Believe in the magic within you.", author: "Inspiration" };

  displayQuote(newQuote);

  newQuoteBtn.innerHTML = originalBtnText;
  newQuoteBtn.disabled = false;
  cardEl.classList.remove('loading');
  isLoading = false;
}

function shareCurrentQuote() {
  const shareMessage = `“${currentQuoteObj.text}” — ${currentQuoteObj.author}`;
  
  if (navigator.share) {
    navigator.share({ title: '✨ Inspiring Quote', text: shareMessage, url: window.location.href });
  } else {
    navigator.clipboard.writeText(shareMessage).then(() => {
      showToastMessage('📋 Quote copied to clipboard!');
    }).catch(() => alert('Could not copy quote.'));
  }
}

function showToastMessage(msg) {
  const toast = document.createElement('div');
  toast.innerText = msg;
  toast.style.cssText = `
    position:fixed; bottom:25px; left:50%; transform:translateX(-50%);
    background:rgba(0,0,0,0.7); color:#fff; padding:10px 20px; border-radius:50px;
    font-weight:500; font-size:0.9rem; z-index:9999; backdrop-filter:blur(8px);
  `;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 2200);
}

newQuoteBtn.addEventListener('click', updateQuoteWithBackend);
shareBtn.addEventListener('click', shareCurrentQuote);
cardEl.addEventListener('dblclick', updateQuoteWithBackend);

window.addEventListener('DOMContentLoaded', () => {
  updateQuoteWithBackend();
  cardEl.style.animation = 'gentlePop 0.45s ease-out';
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyN') updateQuoteWithBackend();
});