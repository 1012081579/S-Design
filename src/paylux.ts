/** Interactive research chapters, mounted for direct visits and Swup navigation. */
import { initPayluxShowcase } from "./paylux-showcase";

let controller: AbortController | undefined;
let curveObserver: ResizeObserver | undefined;
let ageTooltipObserver: ResizeObserver | undefined;

export const destroyPayluxResearch = (): void => {
  controller?.abort();
  curveObserver?.disconnect();
  ageTooltipObserver?.disconnect();
  controller = undefined;
  curveObserver = undefined;
  ageTooltipObserver = undefined;
};

const journeyInsights = [
  {
    pain: "Account setup is complex, leaving users unsure about safety and reliability.",
    opportunity: "Guide users step by step and explain security measures clearly.",
  },
  {
    pain: "Limited guidance and long transaction waits make asset management frustrating.",
    opportunity: "Show balances and history at a glance, with clear progress feedback.",
  },
  {
    pain: "Repeated payment verification interrupts the transfer flow.",
    opportunity: "Clarify verification steps, the recipient, the amount, and the completion status.",
  },
  {
    pain: "Fund transfers take too many steps, with settings and actions scattered across screens.",
    opportunity: "Bring transfers and password management together, with clear confirmation when actions are complete.",
  },
] as const;

// Positions follow the supplied visual curve; no invented survey percentages.
const ageGroups = [
  { x: 109, y: 188, caption: "Ages 18–22 · An emerging audience" },
  { x: 241, y: 55, caption: "Ages 22–26 · Our core audience" },
  { x: 362, y: 204, caption: "Ages 26–30 · Managing everyday finances" },
  { x: 468, y: 246, caption: "Ages 30–34 · Seeking simplicity and efficiency" },
] as const;

export const initPayluxResearch = (): void => {
  destroyPayluxResearch();
  const root = document.querySelector<HTMLElement>("[data-paylux-research]");
  if (!root) return;
  controller = new AbortController();
  const { signal } = controller;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const setText = (selector: string, value: string): void => {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  };

  const genderButtons = root.querySelectorAll<HTMLButtonElement>("[data-gender]");
  const genderNumber = root.querySelector("[data-gender-value]")!.firstChild!;
  let currentGenderValue = Number(genderNumber.textContent);
  let targetGenderValue = currentGenderValue;
  let genderFrame = 0;
  signal.addEventListener("abort", () => cancelAnimationFrame(genderFrame), { once: true });

  const animateGenderValue = (target: number): void => {
    if (target === targetGenderValue) return;
    targetGenderValue = target;
    cancelAnimationFrame(genderFrame);
    if (reducedMotion.matches) {
      currentGenderValue = target;
      genderNumber.textContent = String(target);
      return;
    }
    const from = currentGenderValue;
    const start = performance.now();
    const tick = (now: number): void => {
      const progress = Math.min((now - start) / 500, 1);
      const eased = 1 - (1 - progress) ** 3;
      currentGenderValue = Math.round(from + (target - from) * eased);
      genderNumber.textContent = String(currentGenderValue);
      if (progress < 1) genderFrame = requestAnimationFrame(tick);
    };
    genderFrame = requestAnimationFrame(tick);
  };

  const selectGender = (button?: HTMLButtonElement): void => {
    const female = button?.dataset.gender !== "male";
    const chart = root.querySelector<HTMLElement>(".px-gender")!;
    if (button) chart.dataset.selection = female ? "female" : "male";
    else delete chart.dataset.selection;
    genderButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    animateGenderValue(button ? (female ? 44 : 56) : 100);
    setText("[data-gender-name]", button ? (female ? "Women" : "Men") : "All users");
  };
  genderButtons.forEach((button) => {
    button.addEventListener("click", () => selectGender(button), { signal });
    button.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") selectGender(button);
    }, { signal });
    button.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "mouse") selectGender();
    }, { signal });
    button.addEventListener("pointercancel", () => selectGender(), { signal });
    button.addEventListener("focus", () => selectGender(button), { signal });
    button.addEventListener("blur", () => selectGender(), { signal });
  });

  const ageButtons = root.querySelectorAll<HTMLButtonElement>("[data-age]");
  const agePlot = root.querySelector<HTMLElement>(".px-age-plot")!;
  const ageTooltip = root.querySelector<HTMLElement>("[data-age-caption]")!;
  let activeAge = Number(root.querySelector<HTMLElement>('[data-age][aria-pressed="true"]')!.dataset.age);
  const positionAgeTooltip = (): void => {
    const width = agePlot.clientWidth;
    if (!width) return;
    const group = ageGroups[activeAge];
    const dotX = group.x / 500 * width;
    const dotY = group.y / 330 * agePlot.clientHeight;
    const half = ageTooltip.offsetWidth / 2;
    const left = Math.max(half + 8, Math.min(dotX, width - half - 8));
    const below = dotY - 16 < ageTooltip.offsetHeight;
    ageTooltip.dataset.placement = below ? "below" : "above";
    ageTooltip.style.setProperty("--px-tooltip-x", `${left}px`);
    ageTooltip.style.setProperty("--px-tooltip-y", `${dotY + (below ? 16 : -16)}px`);
    ageTooltip.style.setProperty("--px-tooltip-arrow", `${dotX - left + half}px`);
  };
  positionAgeTooltip();
  if (typeof ResizeObserver !== "undefined") {
    ageTooltipObserver = new ResizeObserver(positionAgeTooltip);
    ageTooltipObserver.observe(agePlot);
    ageTooltipObserver.observe(ageTooltip);
  } else {
    window.addEventListener("resize", positionAgeTooltip, { signal });
  }
  const selectAge = (button: HTMLButtonElement): void => {
    const group = ageGroups[Number(button.dataset.age)];
    if (!group) return;
    activeAge = Number(button.dataset.age);
    ageButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    const point = root.querySelector("[data-age-point]")!;
    point.setAttribute("cx", String(group.x));
    point.setAttribute("cy", String(group.y));
    setText("[data-age-caption]", group.caption);
    positionAgeTooltip();
  };
  ageButtons.forEach((button) => {
    button.addEventListener("click", () => selectAge(button), { signal });
    button.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") selectAge(button);
    }, { signal });
    button.addEventListener("focus", () => selectAge(button), { signal });
  });

  root.querySelectorAll<HTMLButtonElement>("[data-persona]").forEach((button) => {
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      const details = document.getElementById(button.getAttribute("aria-controls")!);
      if (details) details.hidden = !open;
      const name = button.dataset.persona === "misaki" ? "Misaki" : button.dataset.persona === "john" ? "John" : "Emily";
      button.setAttribute("aria-label", `${open ? "Close" : "Explore"} ${name}'s needs`);
    }, { signal });
  });

  const stepButtons = root.querySelectorAll<HTMLButtonElement>("[data-step]");
  const selectStep = (button: HTMLButtonElement): void => {
    const index = Number(button.dataset.step);
    const insight = journeyInsights[index];
    if (!insight) return;
    stepButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    root.style.setProperty("--px-step", String(index));
    setText("[data-step-pain]", insight.pain);
    setText("[data-step-opportunity]", insight.opportunity);
  };
  stepButtons.forEach((button, index) => {
    button.addEventListener("click", () => selectStep(button), { signal });
    button.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % stepButtons.length;
      else if (event.key === "ArrowLeft") next = (index + stepButtons.length - 1) % stepButtons.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = stepButtons.length - 1;
      else return;
      event.preventDefault();
      stepButtons[next].focus();
      selectStep(stepButtons[next]);
    }, { signal });
  });

  // Preserve the original Figma SVG dimensions and scale the shared coordinate space.
  const curve = root.querySelector<HTMLElement>(".px-emotion")!;
  const sizeCurve = (): void => {
    curve.style.setProperty("--px-curve-scale", String(curve.clientWidth / 1440.93));
  };
  sizeCurve();
  if (typeof ResizeObserver !== "undefined") {
    curveObserver = new ResizeObserver(sizeCurve);
    curveObserver.observe(curve);
  } else {
    window.addEventListener("resize", sizeCurve, { signal });
  }

  initPayluxShowcase(root, signal);
};
