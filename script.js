document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');
  const mainContent = document.getElementById('main-content');
  const audio = document.getElementById('bg-audio');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeIcon = document.getElementById('volumeIcon');
  const volumeControl = document.getElementById('volumeControl');

  // Hide main content initially
  mainContent.style.display = 'none';

  // Prepare splash fade-in (avoid flicker)
  splash.style.opacity = '0';
  splash.style.display = 'flex';
  splash.style.transition = 'opacity 0.6s ease';

  // Fade in splash smoothly after a short delay
  setTimeout(() => {
    splash.style.opacity = '1';
  }, 200);

  // Initialize audio defaults
  audio.volume = 1;
  volumeSlider.value = 1;

  // Splash click → hide splash, show main content, play music
  splash.addEventListener('click', () => {
    splash.style.transition = 'opacity 0.5s ease';
    splash.style.opacity = '0';

    setTimeout(() => {
      splash.style.display = 'none';
      mainContent.style.display = 'block';

      audio.muted = false;
      audio.play().catch(e => {
        console.log('Audio play failed:', e);
      });
    }, 500);
  });

  // Volume slider control
  volumeSlider.addEventListener('input', () => {
    const volume = parseFloat(volumeSlider.value);
    audio.volume = volume;

    if (volume === 0) {
      audio.muted = true;
      volumeIcon.className = "bi bi-volume-mute-fill";
    } else {
      audio.muted = false;
      volumeIcon.className = volume < 0.4 ? "bi bi-volume-down-fill" : "bi bi-volume-up-fill";
    }
  });

  // Volume icon toggle + expansion
  volumeIcon.addEventListener('click', (e) => {
    e.stopPropagation();

    if (!volumeControl.classList.contains('expanded')) {
      volumeControl.classList.add('expanded');
      return;
    }

    if (audio.muted || audio.volume === 0) {
      audio.muted = false;
      audio.volume = 1;
      volumeSlider.value = 1;
      volumeIcon.className = "bi bi-volume-up-fill";
    } else {
      audio.muted = true;
      volumeSlider.value = 0;
      volumeIcon.className = "bi bi-volume-mute-fill";
    }
  });

  // Auto-collapse volume control
  let collapseTimeout;
  volumeControl.addEventListener('click', (e) => {
    if (e.target === volumeIcon || e.target.tagName === 'INPUT') return;

    volumeControl.classList.toggle('expanded');

    clearTimeout(collapseTimeout);
    if (volumeControl.classList.contains('expanded')) {
      collapseTimeout = setTimeout(() => {
        volumeControl.classList.remove('expanded');
      }, 5000);
    }
  });

  // Collapse when clicking outside
  document.addEventListener('click', (e) => {
    if (volumeControl.classList.contains('expanded') && !volumeControl.contains(e.target)) {
      volumeControl.classList.remove('expanded');
    }
  });
});
