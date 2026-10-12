import allisonAvatar from "./Paylux/ui/b37c9.svg";
import andrewAvatar from "./Paylux/ui/8c48f.svg";
import barbaraAvatar from "./Paylux/ui/37c33.svg";
import benjaminAvatar from "./Paylux/ui/ee93e.svg";
import brianAvatar from "./Paylux/ui/230a4.svg";
import "./styles/paylux-showcase.scss";

const contacts = {
  allison: { name: "Allison Anderson", email: "AAnderson@gmail.com", avatar: allisonAvatar },
  andrew: { name: "Andrew Adams", email: "AAdams@gmail.com", avatar: andrewAvatar },
  barbara: { name: "Barbara Baker", email: "Baker@gmail.com", avatar: barbaraAvatar },
  benjamin: { name: "Benjamin Brooks", email: "Brooks@gmail.com", avatar: benjaminAvatar },
  brian: { name: "Brian Brown", email: "Brown@gmail.com", avatar: brianAvatar },
};
type ContactKey = keyof typeof contacts;
const themes = { arc: "Arc", mono: "Mono", pulse: "Pulse", mint: "Mint", prism: "Prism", tide: "Tide" };
type ThemeKey = keyof typeof themes;
const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** Interactive, local-only previews of the Figma screens. */
export const initPayluxShowcase = (root: HTMLElement, signal: AbortSignal): void => {
  const form = root.querySelector<HTMLFormElement>("[data-transfer-form]");
  if (!form) return;
  const amount = form.elements.namedItem("amount") as HTMLInputElement;
  const note = form.elements.namedItem("note") as HTMLInputElement;
  const contactButtons = root.querySelectorAll<HTMLButtonElement>("button[data-contact]");
  const receipt = root.querySelector<HTMLElement>(".px-live-receipt")!;
  const submit = form.querySelector<HTMLButtonElement>("[type=submit]")!;
  const picker = root.querySelector<HTMLElement>("[data-contact-picker]")!;
  const pickerOpener = root.querySelector<HTMLButtonElement>("button[data-add-contact]")!;
  let selectedContact: ContactKey = "barbara";
  let submitted = false;
  const reducedMotion = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const setText = (selector: string, value: string): void => {
    root.querySelectorAll(selector).forEach((element) => { element.textContent = value; });
  };
  const devices = root.querySelectorAll<HTMLElement>(".px-device");
  const sizeDevices = (): void => devices.forEach((device) => {
    device.style.setProperty("--px-ui-scale", String(device.clientWidth / 390));
  });
  sizeDevices();
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(sizeDevices);
    devices.forEach((device) => observer.observe(device));
    signal.addEventListener("abort", () => observer.disconnect(), { once: true });
  } else window.addEventListener("resize", sizeDevices, { signal });
  const showDevice = (name: string): void => {
    const selectors: Record<string, string> = { contacts: ".px-contact-device", transfer: ".px-transfer-device", receipts: ".px-receipt-device", wallet: ".px-wallet-device" };
    const selector = selectors[name];
    if (!selector) return;
    const device = root.querySelector<HTMLElement>(selector)!;
    device.scrollIntoView({ behavior: reducedMotion() ? "instant" : "smooth", block: "nearest", inline: "center" });
    device.querySelector<HTMLElement>("button, input")?.focus({ preventScroll: true });
  };
  root.querySelectorAll<HTMLButtonElement>("button[data-preview-screen]").forEach((button) => {
    button.addEventListener("click", () => showDevice(button.dataset.previewScreen!), { signal });
  });
  const resetReceipt = (): void => {
    submitted = false;
    receipt.dataset.receiptState = "ready";
    submit.textContent = "Continue";
    setText("[data-transfer-status]", "");
  };
  const closePicker = (restoreFocus = true): void => {
    picker.hidden = true;
    pickerOpener.setAttribute("aria-expanded", "false");
    if (restoreFocus) pickerOpener.focus({ preventScroll: true });
  };
  const selectContact = (key: ContactKey): void => {
    selectedContact = key;
    const contact = contacts[key];
    contactButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.contact === key)));
    setText("[data-recipient-name], [data-story-recipient]", contact.name);
    setText("[data-recipient-email]", contact.email);
    const avatar = root.querySelector<HTMLImageElement>("[data-recipient-avatar]")!;
    avatar.src = contact.avatar;
    avatar.style.transform = key === "barbara" ? "none" : "scale(1.2)";
    avatar.style.transformOrigin = "top left";
    resetReceipt();
    if (!picker.hidden) closePicker();
  };
  contactButtons.forEach((button) => button.addEventListener("click", () => {
    const key = button.dataset.contact as ContactKey;
    if (Object.hasOwn(contacts, key)) selectContact(key);
  }, { signal }));
  pickerOpener.setAttribute("aria-expanded", "false");
  pickerOpener.addEventListener("click", () => {
    picker.hidden = false;
    pickerOpener.setAttribute("aria-expanded", "true");
    picker.querySelector<HTMLButtonElement>("[data-close-picker]")!.focus({ preventScroll: true });
  }, { signal });
  picker.querySelector<HTMLButtonElement>("[data-close-picker]")!.addEventListener("click", () => closePicker(), { signal });
  picker.addEventListener("keydown", (event) => { if (event.key === "Escape") closePicker(); }, { signal });
  const updateDraft = (): void => {
    resetReceipt();
    setText("[data-story-amount]", amount.validity.valid ? dollars.format(amount.valueAsNumber) : "—");
    setText("[data-story-note]", note.value.trim() || "For you");
  };
  amount.addEventListener("input", updateDraft, { signal });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity() || submitted) return;
    submitted = true;
    setText("[data-receipt-name]", contacts[selectedContact].name);
    setText("[data-receipt-amount]", dollars.format(amount.valueAsNumber).replace("$", ""));
    setText("[data-receipt-note]", `Demo payment · ${note.value.trim() || "For you"}`);
    receipt.dataset.receiptState = "complete";
    submit.textContent = "Done";
    setText("[data-transfer-status]", "Demo transfer complete");
    if (window.matchMedia("(max-width: 760px)").matches) showDevice("receipts");
  }, { signal });
  root.querySelector<HTMLButtonElement>("[data-start-transfer]")!.addEventListener("click", () => {
    form.reset(); selectContact("barbara"); updateDraft(); showDevice("transfer"); amount.select();
  }, { signal });
  const receiptMenu = root.querySelector<HTMLButtonElement>("[data-receipt-menu]")!;
  receiptMenu.addEventListener("click", () => {
    const open = receiptMenu.getAttribute("aria-expanded") !== "true";
    receiptMenu.setAttribute("aria-expanded", String(open));
    root.querySelectorAll<HTMLDetailsElement>(".px-ui-receipt-details").forEach((detail) => { detail.open = open; });
  }, { signal });
  const more = root.querySelector<HTMLButtonElement>("[data-view-transactions]")!;
  more.addEventListener("click", () => {
    const expanded = more.getAttribute("aria-expanded") !== "true";
    more.setAttribute("aria-expanded", String(expanded)); more.textContent = expanded ? "back to top" : "view more";
    const list = root.querySelector<HTMLElement>(".px-ui-transaction-scroll")!;
    list.scrollTo({ top: expanded ? list.scrollHeight - list.clientHeight : 0, behavior: reducedMotion() ? "instant" : "smooth" });
  }, { signal });
  const themeButtons = root.querySelectorAll<HTMLButtonElement>("[data-card-theme]");
  const preview = root.querySelector<HTMLElement>("[data-card-preview]")!;
  themeButtons.forEach((button) => button.addEventListener("click", () => {
    const theme = button.dataset.cardTheme as ThemeKey;
    if (!Object.hasOwn(themes, theme)) return;
    preview.dataset.theme = theme;
    preview.setAttribute("aria-label", `${themes[theme]} card preview, balance $43,768.50`);
    preview.querySelector(".px-card-bottom > span")!.textContent = themes[theme];
    setText("[data-card-selection]", themes[theme]);
    themeButtons.forEach((item) => item.setAttribute("aria-pressed", String(item.dataset.cardTheme === theme)));
  }, { signal }));
};
