const header = document.querySelector('.nav');
addEventListener('scroll', () => header?.classList.toggle('compact', scrollY > 40), { passive: true });
