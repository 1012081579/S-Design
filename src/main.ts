import commerceFlowImage from "./commerceFlow.png";
import lineGiftImage from "./lineGift.png";
import oneStoneImage from "./onestone.png";
import payluxImage from "./paylux.png";
import pipeLinerImage from "./pipeLiner.png";
import religioImage from "./religio.png";
import sjaImage from "./SJA.png";
import vvlImage from "./VVL.png";
import {
  applyRandomHover,
  getRandomPaletteColor,
  readHoverColors,
  setupRandomSelectionColor,
  setupReveal,
} from "./ui";

const SELECTORS = {
  brand: ".brand",
  newTags: "#new-tags",
  completedTags: "#done-tags",
  courseGrid: "#course-grid",
  categoryList: "#category-list",
  profilePanel: "#profile-panel",
  profileOpen: ".profile-open-trigger",
  profileLaunch: ".profile-launch-trigger",
  profileToggle: ".profile-toggle",
  profileStickerToggle: ".profile-sticker-toggle",
  profileDetail: "#profile-detail",
  profileUserCopy: ".profile-user-section p",
} as const;

const FILTER_TYPES = {
  projectCategory: "project-category",
  archiveNo: "archive-no",
} as const;

const FILTER_TOKEN_SELECTOR = "[data-filter-type][data-filter-value]";
const ARCHIVE_NO_TONE = "light";
const PROFILE_OPEN_FOCUS_DELAY = 940;
const PROFILE_CLOSE_DURATION = 1180;
const PROFILE_COLOR_SWEEP_DELAY = 1320;
const PROFILE_COLOR_SWEEP_STEP = 130;
const SCRAMBLE_DURATION = 300;
const SCRAMBLE_UPDATE_INTERVAL = 48;
const SCRAMBLE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&+*/<>?";

const ACTIVATION_KEYS = new Set(["Enter", " "]);

type AttributeValue = string | number | boolean | null | undefined;
type FilterType = (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];
type Tone =
  | "cyan"
  | "gold"
  | "green"
  | "lavender"
  | "light"
  | "lime"
  | "neutral"
  | "orange"
  | "pink"
  | "yellow";
type CourseVariant = "brain" | "extra" | "strategy";

type ProjectTag = {
  label: string;
  tone: Tone;
};

type CourseTag = {
  label: string;
  tone?: Tone;
  type?: "text";
};

type Course = {
  count: string;
  label: string;
  title: readonly [string, string];
  tags: readonly CourseTag[];
  href?: string;
  image?: string;
  icon?: string;
  variant: CourseVariant;
};

type Category = {
  mark: string;
  name: string;
  detail: string;
};

type AppData = {
  newTags: readonly ProjectTag[];
  completedTags: readonly string[];
  courses: readonly Course[];
  categories: readonly Category[];
};

type ActiveFilter = {
  type: FilterType;
  value: string;
};

type ElementOptions = {
  className?: string;
  textContent?: string;
  attributes?: Record<string, AttributeValue>;
};

type AppElements = {
  brand: HTMLAnchorElement;
  newTags: HTMLElement;
  completedTags: HTMLElement;
  courseGrid: HTMLElement;
  categoryList: HTMLUListElement;
  profilePanel: HTMLElement;
  profileOpen: HTMLButtonElement;
  profileLaunch: HTMLButtonElement;
  profileToggle: HTMLButtonElement;
  profileStickerToggle: HTMLButtonElement;
  profileDetail: HTMLElement;
  profileUserCopy: HTMLParagraphElement;
};

type ProfileControlKey =
  | "profileLaunch"
  | "profileOpen"
  | "profileStickerToggle"
  | "profileToggle";

const PROFILE_CONTROL_KEYS = [
  "profileOpen",
  "profileLaunch",
  "profileToggle",
  "profileStickerToggle",
] as const satisfies readonly ProfileControlKey[];

const DATA = {
  newTags: [
    { label: "U", tone: "yellow" },
    { label: "P", tone: "lavender" },
    { label: "B", tone: "pink" },
    { label: "V", tone: "green" },
    { label: "X", tone: "gold" },
    { label: "S", tone: "lime" },
  ],
  completedTags: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  courses: [
    {
      count: "1",
      label: "Work",
      title: ["Paylux", "UIUX"],
      tags: [{ label: "U" }, { label: "1" }],
      href: "Paylux.html",
      image: payluxImage,
      variant: "strategy",
    },
    {
      count: "2",
      label: "Work",
      title: ["SJA", "EXP"],
      tags: [{ label: "X" }, { label: "1" }],
      href: "SJA.html",
      image: sjaImage,
      variant: "brain",
    },
    {
      count: "3",
      label: "Work",
      title: ["Religio", "Graphic"],
      tags: [{ label: "B" }, { label: "1" }],
      href: "Religio.html",
      image: religioImage,
      variant: "extra",
    },
    {
      count: "4",
      label: "Work",
      title: ["VVL", "VI"],
      tags: [{ label: "V" }, { label: "1" }],
      image: vvlImage,
      variant: "brain",
    },
    {
      count: "5",
      label: "Work",
      title: ["One Stone", "Brand"],
      tags: [{ label: "V" }, { label: "2" }],
      image: oneStoneImage,
      variant: "extra",
    },
    {
      count: "6",
      label: "Work",
      title: ["CF", "System"],
      tags: [{ label: "S" }, { label: "1" }],
      image: commerceFlowImage,
      variant: "brain",
    },
    {
      count: "7",
      label: "Work",
      title: ["Line Gift", "UIUX"],
      tags: [{ label: "U" }, { label: "2" }],
      image: lineGiftImage,
      variant: "extra",
    },
    {
      count: "8",
      label: "Work",
      title: ["Pipeliner", "Product"],
      tags: [{ label: "P" }, { label: "1" }],
      image: pipeLinerImage,
      variant: "brain",
    },
  ],
  categories: [
    {
      mark: "S",
      name: "System",
      detail: "Design is not decoration. It is the creation of systems that organize complexity into clarity.",
    },
    {
      mark: "U",
      name: "Uniform",
      detail: "Consistency builds trust. A uniform structure allows experiences to feel seamless and intuitive.",
    },
    {
      mark: "Z",
      name: "Zero",
      detail: "Remove the unnecessary. Zero noise, zero friction, zero visual excess.",
    },
    {
      mark: "I",
      name: "Interval",
      detail: "Good design lives in spacing, rhythm, and timing \u2014 the intervals between elements define the experience.",
    },
    {
      mark: "Y",
      name: "Yield",
      detail: "Design should produce outcomes. Every interaction must yield meaning, efficiency, or emotion.",
    },
    {
      mark: "U",
      name: "Utility",
      detail: "Aesthetic without function is incomplete. Utility transforms visuals into usable experiences.",
    },
    {
      mark: "E",
      name: "Edge",
      detail: "Innovation happens at the edge \u2014 between technology, culture, and human behavior.",
    },
  ],
} as const satisfies AppData;

const PROJECT_CATEGORY_TONES: readonly Tone[] = DATA.newTags.map(({ tone }) => tone);
const PROJECT_CATEGORY_TONE_BY_LABEL: ReadonlyMap<string, Tone> = new Map(
  DATA.newTags.map(({ label, tone }) => [label, tone]),
);

const getStableToneIndex = (label: string): number => (
  Array.from(label).reduce((total, character) => total + character.charCodeAt(0), 0)
  % PROJECT_CATEGORY_TONES.length
);

const getProjectCategoryTone = (label: string): Tone => (
  PROJECT_CATEGORY_TONE_BY_LABEL.get(label)
  ?? PROJECT_CATEGORY_TONES[getStableToneIndex(label)]
  ?? "neutral"
);

const getCourseTagTone = ({ label, tone }: CourseTag, index = 0): Tone | typeof ARCHIVE_NO_TONE => {
  if (index === 0) {
    return getProjectCategoryTone(label);
  }

  if (index === 1) {
    return ARCHIVE_NO_TONE;
  }

  return tone ?? "neutral";
};

const getCourseProjectCategory = ({ tags }: Course): string => tags[0]?.label ?? "";
const getCourseArchiveNo = ({ tags }: Course): string => tags[1]?.label ?? "";

const courseMatchesFilter = (course: Course, filter: ActiveFilter | null): boolean => {
  if (!filter) {
    return true;
  }

  const filterValueByType = {
    [FILTER_TYPES.projectCategory]: getCourseProjectCategory(course),
    [FILTER_TYPES.archiveNo]: getCourseArchiveNo(course),
  } satisfies Record<FilterType, string>;

  return filterValueByType[filter.type] === filter.value;
};

const queryRequired = <T extends Element>(
  selector: string,
  scope: ParentNode = document,
): T => {
  const element = scope.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }

  return element;
};

const setAttributes = <T extends Element>(
  element: T,
  attributes: Record<string, AttributeValue> = {},
): T => {
  Object.entries(attributes).forEach(([name, value]) => {
    if (value !== null && value !== undefined) {
      element.setAttribute(name, String(value));
    }
  });

  return element;
};

const createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: ElementOptions = {},
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tagName);
  const { className, textContent, attributes } = options;

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  return setAttributes(element, attributes);
};

const renderList = <T>(
  host: Element,
  items: readonly T[],
  createItem: (item: T, index: number) => Node,
): void => {
  const fragment = document.createDocumentFragment();

  items.forEach((item, index) => {
    fragment.appendChild(createItem(item, index));
  });

  host.replaceChildren(fragment);
};

const createToken = (
  label: string,
  className = "",
  attributes: Record<string, AttributeValue> = {},
): HTMLButtonElement => (
  createElement("button", {
    className: `token ${className}`.trim(),
    textContent: label,
    attributes: {
      type: "button",
      "aria-pressed": "false",
      ...attributes,
    },
  })
);

const createCourseStat = ({ count, label }: Course): HTMLDivElement => {
  const stat = createElement("div", { className: "course-stat" });
  const statMain = createElement("span", { className: "stat-main", textContent: count });
  const statSub = createElement("span", { className: "stat-sub", textContent: "/12" });
  const statLabel = createElement("span", { className: "stat-label", textContent: label });

  stat.append(statMain, statSub, statLabel);
  return stat;
};

const createCourseTitle = ([primary, secondary]: Course["title"]): HTMLHeadingElement => {
  const title = createElement("h2");
  const titleMuted = createElement("span", { textContent: secondary });

  title.append(primary, titleMuted);
  return title;
};

const createCourseTag = (tag: CourseTag, index = 0): HTMLSpanElement => (
  createElement("span", {
    className: tag.type === "text" ? "small-number" : `mini-token ${getCourseTagTone(tag, index)}`,
    textContent: tag.label,
  })
);

const createCourseCard = (course: Course, index = 0): HTMLElement => {
  const card = createElement(course.href ? "a" : "article", {
    className: `course-card course-card-${course.variant}`,
    attributes: {
      ...(course.href
        ? {
          href: course.href,
          "aria-label": `Open ${course.title[0]} project detail`,
        }
        : {}),
      style: `--card-index: ${index};`,
      "data-reveal": "home-card",
    },
  });
  const tags = createElement("div", { className: "course-tags" });
  const icon = course.image
    ? createElement("img", {
      className: "silhouette course-image",
      attributes: {
        src: course.image,
        alt: "",
        "aria-hidden": "true",
      },
    })
    : createElement("div", {
      className: `silhouette ${course.icon ?? ""}`.trim(),
      attributes: { "aria-hidden": "true" },
    });

  renderList(tags, course.tags, createCourseTag);
  card.append(createCourseStat(course), createCourseTitle(course.title), tags, icon);

  return card;
};

const setFilterTokenState = (
  { newTags, completedTags }: AppElements,
  activeFilter: ActiveFilter | null,
): void => {
  [newTags, completedTags].forEach((host) => {
    host.querySelectorAll<HTMLElement>(FILTER_TOKEN_SELECTOR).forEach((token) => {
      const isActive = Boolean(
        activeFilter
        && token.dataset.filterType === activeFilter.type
        && token.dataset.filterValue === activeFilter.value,
      );

      token.classList.toggle("is-active", isActive);
      token.setAttribute("aria-pressed", String(isActive));
    });
  });
};

const renderFilteredCourses = (
  elements: AppElements,
  activeFilter: ActiveFilter | null,
): void => {
  const courses = DATA.courses.filter((course) => courseMatchesFilter(course, activeFilter));

  elements.courseGrid.classList.add("is-filtering");
  renderList(elements.courseGrid, courses, createCourseCard);
  applyRandomHover(elements.courseGrid);
  setupReveal(elements.courseGrid);
};

const setupCourseFilters = (elements: AppElements): void => {
  let activeFilter: ActiveFilter | null = null;

  const applyFilter = (nextFilter: ActiveFilter | null) => {
    activeFilter = nextFilter;
    renderFilteredCourses(elements, activeFilter);
    setFilterTokenState(elements, activeFilter);
  };

  const handleFilterClick = (event: MouseEvent) => {
    const token = event.target instanceof Element
      ? event.target.closest<HTMLElement>(FILTER_TOKEN_SELECTOR)
      : null;

    if (!token || (!elements.newTags.contains(token) && !elements.completedTags.contains(token))) {
      return;
    }

    const type = token.dataset.filterType as FilterType | undefined;
    const value = token.dataset.filterValue;

    if (!type || !value) {
      return;
    }

    const nextFilter = { type, value };
    const isSameFilter = Boolean(
      activeFilter
      && activeFilter.type === nextFilter.type
      && activeFilter.value === nextFilter.value,
    );

    applyFilter(isSameFilter ? null : nextFilter);
  };

  elements.newTags.addEventListener("click", handleFilterClick);
  elements.completedTags.addEventListener("click", handleFilterClick);
};

const closeCategoryItems = (host: HTMLElement): void => {
  host.querySelectorAll<HTMLLIElement>("li").forEach((item) => {
    item.classList.remove("is-open");
    item.setAttribute("aria-expanded", "false");
  });
};

const toggleCategoryItem = (host: HTMLElement, activeItem: HTMLLIElement): void => {
  const isOpen = activeItem.classList.contains("is-open");

  closeCategoryItems(host);

  if (!isOpen) {
    activeItem.classList.add("is-open");
    activeItem.setAttribute("aria-expanded", "true");
  }
};

const createCategoryItem = (category: Category, host: HTMLUListElement): HTMLLIElement => {
  const item = createElement("li", {
    attributes: {
      tabindex: "0",
      role: "button",
      "aria-expanded": "false",
    },
  });
  const mark = createElement("span", {
    className: "category-mark",
    textContent: category.mark,
  });
  const name = createElement("span", {
    className: "category-name",
    textContent: category.name,
  });
  const detail = createElement("p", {
    className: "category-detail",
    textContent: category.detail,
  });

  item.append(mark, name, detail);
  item.addEventListener("click", () => toggleCategoryItem(host, item));
  item.addEventListener("keydown", (event) => {
    if (ACTIVATION_KEYS.has(event.key)) {
      event.preventDefault();
      toggleCategoryItem(host, item);
    }
  });

  return item;
};

const scrambleAnimations = new WeakMap<HTMLElement, number>();

const easeOutCubic = (value: number): number => 1 - (1 - value) ** 3;

const getRandomScrambleCharacter = (): string => (
  SCRAMBLE_CHARACTERS[Math.floor(Math.random() * SCRAMBLE_CHARACTERS.length)] ?? ""
);

const createScrambledText = (target: string, revealedCount = 0): string => (
  Array.from(target, (character, index) => (
    index < revealedCount ? character : getRandomScrambleCharacter()
  )).join("")
);

const shouldRevealScrambleWord = (element: HTMLElement): boolean => (
  element.matches(":hover") || document.activeElement === element
);

const animateScrambleWord = (element: HTMLElement, shouldReveal: boolean): void => {
  const target = element.dataset.text || element.textContent?.trim() || "";
  const animationId = (scrambleAnimations.get(element) ?? 0) + 1;
  const startedAt = performance.now();
  let lastRenderedStep = -1;

  if (!shouldReveal) {
    element.style.setProperty("--scramble-idle-color", getRandomPaletteColor(readHoverColors()));
  }

  scrambleAnimations.set(element, animationId);
  element.classList.toggle("is-revealed", shouldReveal);

  const tick = (now: number) => {
    if (scrambleAnimations.get(element) !== animationId) {
      return;
    }

    const progress = Math.min((now - startedAt) / SCRAMBLE_DURATION, 1);
    const eased = easeOutCubic(progress);
    const revealedCount = shouldReveal
      ? Math.floor(eased * target.length)
      : Math.floor((1 - eased) * target.length);
    const renderStep = Math.floor((now - startedAt) / SCRAMBLE_UPDATE_INTERVAL);

    if (renderStep !== lastRenderedStep || progress >= 1) {
      element.textContent = createScrambledText(target, revealedCount);
      lastRenderedStep = renderStep;
    }

    if (progress < 1) {
      window.requestAnimationFrame(tick);
      return;
    }

    element.textContent = shouldReveal ? target : createScrambledText(target);
  };

  window.requestAnimationFrame(tick);
};

const setupScrambleWords = (scope: ParentNode = document): void => {
  const colors = readHoverColors();

  scope.querySelectorAll<HTMLElement>(".profile-scramble-word").forEach((element) => {
    const target = element.dataset.text || element.textContent?.trim() || "";

    element.dataset.text = target;
    element.style.setProperty("--scramble-idle-color", getRandomPaletteColor(colors));
    element.textContent = createScrambledText(target);

    element.addEventListener("mouseenter", () => animateScrambleWord(element, true));
    element.addEventListener("focus", () => animateScrambleWord(element, true));
    element.addEventListener("mouseleave", () => {
      if (!shouldRevealScrambleWord(element)) {
        animateScrambleWord(element, false);
      }
    });
    element.addEventListener("blur", () => {
      window.setTimeout(() => {
        if (!shouldRevealScrambleWord(element)) {
          animateScrambleWord(element, false);
        }
      }, 0);
    });
  });
};

const profileColorSweepTimers = new WeakMap<HTMLElement, number[]>();

const clearProfileColorSweep = (element: HTMLElement): void => {
  (profileColorSweepTimers.get(element) ?? []).forEach((timer) => {
    window.clearTimeout(timer);
    window.clearInterval(timer);
  });
  profileColorSweepTimers.set(element, []);
};

const resetProfileColorSweep = (element: HTMLElement): void => {
  clearProfileColorSweep(element);
  element.querySelectorAll<HTMLElement>(".profile-color-letter").forEach((letter) => {
    letter.classList.remove("is-colored");
    letter.style.removeProperty("--profile-letter-color");
  });
};

const setupProfileColorSweep = (element: HTMLElement): void => {
  const text = element.textContent?.replace(/\s+/g, " ").trim() ?? "";
  const fragment = document.createDocumentFragment();

  Array.from(text).forEach((character) => {
    if (/[A-Za-z]/.test(character)) {
      fragment.appendChild(createElement("span", {
        className: "profile-color-letter",
        textContent: character,
      }));
      return;
    }

    fragment.appendChild(document.createTextNode(character));
  });

  element.replaceChildren(fragment);
};

const animateProfileColorSweep = (element: HTMLElement): void => {
  const colors = readHoverColors();
  const letters = Array.from(element.querySelectorAll<HTMLElement>(".profile-color-letter"));
  const timers: number[] = [];
  let letterIndex = 0;
  let activeLetter: HTMLElement | null = null;

  resetProfileColorSweep(element);

  if (!letters.length) {
    return;
  }

  const clearActiveLetter = () => {
    if (!activeLetter) {
      return;
    }

    activeLetter.classList.remove("is-colored");
    activeLetter.style.removeProperty("--profile-letter-color");
    activeLetter = null;
  };

  const lightNextLetter = () => {
    clearActiveLetter();

    if (letterIndex >= letters.length) {
      letterIndex = 0;
      return;
    }

    activeLetter = letters[letterIndex] ?? null;
    activeLetter?.style.setProperty("--profile-letter-color", getRandomPaletteColor(colors));
    activeLetter?.classList.add("is-colored");
    letterIndex += 1;
  };

  lightNextLetter();
  timers.push(window.setInterval(lightNextLetter, PROFILE_COLOR_SWEEP_STEP));
  profileColorSweepTimers.set(element, timers);
};

let profileCloseFocusTimer: number | undefined;
let profileReturnTimer: number | undefined;
let profileColorSweepStartTimer: number | undefined;

const clearProfileTimers = (): void => {
  [profileCloseFocusTimer, profileReturnTimer, profileColorSweepStartTimer].forEach((timer) => {
    if (timer !== undefined) {
      window.clearTimeout(timer);
    }
  });

  profileCloseFocusTimer = undefined;
  profileReturnTimer = undefined;
  profileColorSweepStartTimer = undefined;
};

const setProfileControlState = (elements: AppElements, isOpen: boolean): void => {
  PROFILE_CONTROL_KEYS.forEach((key) => {
    elements[key].setAttribute("aria-expanded", String(isOpen));
  });
};

const setProfileDetailState = (elements: AppElements, isOpen: boolean): void => {
  elements.profilePanel.classList.toggle("is-profile-open", isOpen);
  document.body.classList.toggle("profile-detail-open", isOpen);
  setProfileControlState(elements, isOpen);
  elements.profileDetail.setAttribute("aria-hidden", String(!isOpen));
};

const isProfileDetailOpen = ({ profilePanel }: AppElements): boolean => (
  profilePanel.classList.contains("is-profile-open")
);

const isProfileDetailClosing = ({ profilePanel }: AppElements): boolean => (
  profilePanel.classList.contains("is-profile-closing")
);

const openProfileDetail = (elements: AppElements): void => {
  clearProfileTimers();
  elements.profilePanel.classList.remove("is-profile-closing");
  document.body.classList.remove("profile-detail-closing");
  setProfileDetailState(elements, true);
  setupReveal(elements.profileDetail);

  profileCloseFocusTimer = window.setTimeout(() => {
    elements.profileToggle.focus({ preventScroll: true });
  }, PROFILE_OPEN_FOCUS_DELAY);
  profileColorSweepStartTimer = window.setTimeout(() => {
    animateProfileColorSweep(elements.profileUserCopy);
  }, PROFILE_COLOR_SWEEP_DELAY);
};

const closeProfileDetail = (
  elements: AppElements,
  returnFocusTarget: HTMLElement = elements.profileOpen,
): void => {
  clearProfileTimers();
  resetProfileColorSweep(elements.profileUserCopy);

  if (!isProfileDetailOpen(elements)) {
    return;
  }

  elements.profilePanel.classList.add("is-profile-closing");
  document.body.classList.add("profile-detail-closing");
  setProfileControlState(elements, false);
  elements.profileDetail.setAttribute("aria-hidden", "true");

  profileReturnTimer = window.setTimeout(() => {
    elements.profilePanel.classList.remove("is-profile-closing");
    document.body.classList.remove("profile-detail-closing");
    setProfileDetailState(elements, false);
    returnFocusTarget.focus({ preventScroll: true });
  }, PROFILE_CLOSE_DURATION);
};

const setupProfileDetail = (elements: AppElements): void => {
  const toggleProfileDetail = () => {
    if (isProfileDetailOpen(elements)) {
      closeProfileDetail(elements);
      return;
    }

    openProfileDetail(elements);
  };

  elements.profileOpen.addEventListener("click", toggleProfileDetail);
  elements.profileLaunch.addEventListener("click", () => {
    if (!isProfileDetailOpen(elements) && !isProfileDetailClosing(elements)) {
      openProfileDetail(elements);
    }
  });
  elements.profileToggle.addEventListener("click", toggleProfileDetail);
  elements.profileStickerToggle.addEventListener("click", toggleProfileDetail);
  elements.brand.addEventListener("click", (event) => {
    event.preventDefault();

    if (isProfileDetailOpen(elements) && !isProfileDetailClosing(elements)) {
      closeProfileDetail(elements, elements.brand);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isProfileDetailOpen(elements)) {
      closeProfileDetail(elements);
    }
  });
};

const getAppElements = (scope: ParentNode = document): AppElements => ({
  brand: queryRequired<HTMLAnchorElement>(SELECTORS.brand, scope),
  newTags: queryRequired<HTMLElement>(SELECTORS.newTags, scope),
  completedTags: queryRequired<HTMLElement>(SELECTORS.completedTags, scope),
  courseGrid: queryRequired<HTMLElement>(SELECTORS.courseGrid, scope),
  categoryList: queryRequired<HTMLUListElement>(SELECTORS.categoryList, scope),
  profilePanel: queryRequired<HTMLElement>(SELECTORS.profilePanel, scope),
  profileOpen: queryRequired<HTMLButtonElement>(SELECTORS.profileOpen, scope),
  profileLaunch: queryRequired<HTMLButtonElement>(SELECTORS.profileLaunch, scope),
  profileToggle: queryRequired<HTMLButtonElement>(SELECTORS.profileToggle, scope),
  profileStickerToggle: queryRequired<HTMLButtonElement>(SELECTORS.profileStickerToggle, scope),
  profileDetail: queryRequired<HTMLElement>(SELECTORS.profileDetail, scope),
  profileUserCopy: queryRequired<HTMLParagraphElement>(SELECTORS.profileUserCopy, scope),
});

const renderApp = (elements: AppElements): void => {
  renderList(elements.newTags, DATA.newTags, (tag) => (
    createToken(tag.label, tag.tone, {
      "aria-label": `Project category ${tag.label}`,
      "data-filter-type": FILTER_TYPES.projectCategory,
      "data-filter-value": tag.label,
    })
  ));
  renderList(elements.completedTags, DATA.completedTags, (label) => (
    createToken(label, "light", {
      "aria-label": `Archive number ${label}`,
      "data-filter-type": FILTER_TYPES.archiveNo,
      "data-filter-value": label,
    })
  ));
  renderList(elements.courseGrid, DATA.courses, createCourseCard);
  renderList(elements.categoryList, DATA.categories, (category) => (
    createCategoryItem(category, elements.categoryList)
  ));
};

export const initHomePage = (scope: ParentNode = document): void => {
  const elements = getAppElements(scope);

  renderApp(elements);
  setupCourseFilters(elements);
  setupProfileColorSweep(elements.profileUserCopy);
  setupProfileDetail(elements);
  setupScrambleWords(scope);
  setupRandomSelectionColor();
  applyRandomHover(scope);
  setupReveal(scope);
};
