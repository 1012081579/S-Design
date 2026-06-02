import { applyRandomHover, setupRandomSelectionColor, setupReveal } from "./ui";

const DETAIL_HOVER_TARGETS = [
  "a:not(.profile-contact-card)",
  "button",
  ".religio-chip",
  ".religio-panel",
  ".religio-step",
] as const;

const clamp = (value: number, min: number, max: number): number => (
  Math.min(max, Math.max(min, value))
);

const setupScrollProgress = (): void => {
  scrollProgressController?.abort();
  scrollProgressController = new AbortController();

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

    document.documentElement.style.setProperty(
      "--detail-progress",
      `${clamp(progress, 0, 1) * 100}%`,
    );
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, {
    passive: true,
    signal: scrollProgressController.signal,
  });
  window.addEventListener("resize", updateProgress, {
    signal: scrollProgressController.signal,
  });
};

const setupAutoplayVideos = (): void => {
  document.querySelectorAll<HTMLVideoElement>("video[autoplay]").forEach((video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;

    const playVideo = () => {
      void video.play().catch(() => undefined);
    };

    playVideo();
    window.addEventListener("load", playVideo, { once: true });

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playVideo();
        }
      });
    }, { rootMargin: "240px" });

    observer.observe(video);
  });
};

let scrollProgressController: AbortController | undefined;

export const initReligioPage = (): void => {
  setupRandomSelectionColor();
  applyRandomHover(document, DETAIL_HOVER_TARGETS);
  setupScrollProgress();
  setupReveal();
  setupAutoplayVideos();
};
