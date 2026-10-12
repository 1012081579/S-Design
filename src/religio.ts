import { applyRandomHover, setupRandomSelectionColor, setupReveal } from "./ui";

const DETAIL_HOVER_TARGETS = [
  "a:not(.profile-contact-card):not(.paylux-research a)",
  "button:not(.paylux-research button)",
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
    progressFrame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

    document.documentElement.style.setProperty(
      "--detail-progress",
      String(clamp(progress, 0, 1)),
    );
  };

  const scheduleProgress = () => {
    if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
  };

  updateProgress();
  window.addEventListener("scroll", scheduleProgress, {
    passive: true,
    signal: scrollProgressController.signal,
  });
  window.addEventListener("resize", scheduleProgress, {
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

    videos.add(video);

    if (!("IntersectionObserver" in window)) {
      playVideo();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playVideo();
        } else {
          video.pause();
        }
      });
    }, { rootMargin: "240px" });

    videoObservers.push(observer);
    observer.observe(video);
  });
};

let scrollProgressController: AbortController | undefined;
let progressFrame = 0;
const videoObservers: IntersectionObserver[] = [];
const videos = new Set<HTMLVideoElement>();

export const destroyReligioPage = (): void => {
  scrollProgressController?.abort();
  cancelAnimationFrame(progressFrame);
  progressFrame = 0;
  videoObservers.splice(0).forEach((observer) => observer.disconnect());
  videos.forEach((video) => video.pause());
  videos.clear();
  document.documentElement.style.removeProperty("--detail-progress");
};

export const initReligioPage = (): void => {
  destroyReligioPage();
  setupRandomSelectionColor();
  applyRandomHover(document, DETAIL_HOVER_TARGETS);
  setupScrollProgress();
  setupReveal();
  setupAutoplayVideos();
};
