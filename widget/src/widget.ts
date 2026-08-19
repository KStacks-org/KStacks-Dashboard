/**
 * KStack "report a problem" widget.
 *
 * Embedded on a KStack service site with one line:
 *
 *   <script src="https://dashboard.kstacks.org/widget.js" data-service="kindex" defer></script>
 *
 * Self-contained on purpose: no framework, no external CSS, everything
 * (including its own dark KStack-branded styling) lives inside a shadow
 * root, so it can drop into any host page — React, plain HTML, whatever
 * that service happens to run — without colliding with that page's styles
 * or being knocked off-brand by them.
 *
 * `data-api` overrides the API origin (useful for local development); by
 * default it is derived from this very script's own `src`, so a service
 * that just points at the hosted widget needs no other configuration.
 * `data-lang` is "en" (default) or "ar".
 */

type Lang = "en" | "ar";

type SenderType = "REPORTER" | "STAFF";

type SupportMessage = {
  id: string;
  senderType: SenderType;
  asOrg: boolean;
  body: string;
  createdAt: string;
  staff: { id: string; displayName: string } | null;
};

type SupportConversation = {
  id: string;
  token: string;
  status: "OPEN" | "CLOSED";
  reporterName: string;
  messages: SupportMessage[];
};

type Strings = {
  launcher: string;
  title: string;
  subtitle: string;
  name: string;
  email: string;
  section: string;
  message: string;
  send: string;
  sending: string;
  reply: string;
  close: string;
  resolvedNotice: string;
  newReport: string;
  you: string;
  team: string;
  error: string;
  required: string;
};

const STRINGS: Record<Lang, Strings> = {
  en: {
    launcher: "Report a problem",
    title: "Report a problem",
    subtitle: "Tell us what went wrong — a real person on the team will reply here.",
    name: "Your name",
    email: "Your email",
    section: "Which part of the page? (optional)",
    message: "What went wrong?",
    send: "Send report",
    sending: "Sending…",
    reply: "Write a reply…",
    close: "Close",
    resolvedNotice: "This report has been marked resolved. Thanks for letting us know!",
    newReport: "Report another problem",
    you: "You",
    team: "KStack Team",
    error: "Something went wrong. Please try again.",
    required: "Please fill in every field.",
  },
  ar: {
    launcher: "الإبلاغ عن مشكلة",
    title: "الإبلاغ عن مشكلة",
    subtitle: "أخبرنا بالمشكلة — أحد أعضاء الفريق بيرد عليك هنا.",
    name: "اسمك",
    email: "بريدك الإلكتروني",
    section: "أي قسم بالصفحة؟ (اختياري)",
    message: "وش المشكلة؟",
    send: "إرسال البلاغ",
    sending: "جاري الإرسال…",
    reply: "اكتب رد…",
    close: "إغلاق",
    resolvedNotice: "تم حل هذا البلاغ. شكراً لتبليغك!",
    newReport: "الإبلاغ عن مشكلة أخرى",
    you: "أنت",
    team: "فريق KStack",
    error: "صار خطأ، حاول مرة ثانية.",
    required: "عبّي كل الحقول.",
  },
};

const STORAGE_PREFIX = "kstacks_support_token:";

const WIDGET_CSS = `
  :host { all: initial; }
  * { box-sizing: border-box; font-family: 'Alexandria', 'Segoe UI', system-ui, sans-serif; }
  .launcher {
    position: fixed; bottom: 20px; inset-inline-end: 20px; z-index: 2147483000;
    display: flex; align-items: center; gap: 8px;
    background: #15BB81; color: #05130d; border: none; border-radius: 10px;
    padding: 12px 16px; font-size: 14px; font-weight: 600; cursor: pointer;
    box-shadow: 0 6px 20px rgba(0,0,0,0.35);
  }
  .launcher:hover { background: #12a370; }
  .launcher svg { width: 18px; height: 18px; flex-shrink: 0; }
  .panel {
    position: fixed; bottom: 20px; inset-inline-end: 20px; z-index: 2147483000;
    width: min(360px, calc(100vw - 32px)); max-height: min(560px, calc(100vh - 40px));
    background: #151616; color: #ffffff; border: 1px solid #2a2b2b; border-radius: 12px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden;
  }
  .panel[hidden], .launcher[hidden] { display: none; }
  .header {
    display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;
    padding: 14px 16px; border-bottom: 1px solid #2a2b2b;
  }
  .header h2 { margin: 0; font-size: 15px; font-weight: 700; }
  .header p { margin: 2px 0 0; font-size: 12px; color: #a3a3a3; }
  .close-btn {
    background: none; border: none; color: #a3a3a3; cursor: pointer; padding: 2px;
    line-height: 0; border-radius: 6px;
  }
  .close-btn:hover { color: #ffffff; background: #232424; }
  .body { padding: 14px 16px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 10px; }
  label { font-size: 12px; color: #c7c7c7; display: block; margin-bottom: 4px; }
  input, textarea {
    width: 100%; background: #0f1010; border: 1px solid #2a2b2b; border-radius: 8px;
    color: #ffffff; padding: 8px 10px; font-size: 13px; resize: vertical;
  }
  input:focus, textarea:focus { outline: 2px solid #15BB81; outline-offset: 1px; }
  textarea { min-height: 64px; }
  .field { display: flex; flex-direction: column; }
  .hp { position: absolute; opacity: 0; height: 0; width: 0; pointer-events: none; }
  .submit {
    background: #15BB81; color: #05130d; border: none; border-radius: 8px; font-weight: 600;
    font-size: 13px; padding: 9px 12px; cursor: pointer;
  }
  .submit:disabled { opacity: 0.6; cursor: default; }
  .submit:hover:not(:disabled) { background: #12a370; }
  .error-text { color: #ff8a8a; font-size: 12px; }
  .banner { background: #1e1f1f; border-radius: 8px; padding: 8px 10px; font-size: 12px; color: #c7c7c7; }
  .messages { display: flex; flex-direction: column; gap: 8px; }
  .msg { max-width: 85%; padding: 8px 10px; border-radius: 10px; font-size: 13px; line-height: 1.4; }
  .msg .who { font-size: 11px; font-weight: 700; margin-bottom: 2px; opacity: 0.8; }
  .msg.reporter { align-self: flex-end; background: #15BB81; color: #05130d; border-end-end-radius: 2px; }
  .msg.staff { align-self: flex-start; background: #232424; color: #ffffff; border-end-start-radius: 2px; }
  .compose { display: flex; gap: 6px; padding: 12px 16px; border-top: 1px solid #2a2b2b; }
  .compose textarea { min-height: 40px; max-height: 100px; }
`;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> & { text?: string } = {},
  children: Node[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  const { text, ...rest } = props;
  Object.assign(node, rest);
  if (text !== undefined) node.textContent = text;
  for (const child of children) node.appendChild(child);
  return node;
}

function main() {
  const scriptEl = document.currentScript as HTMLScriptElement | null;
  if (!scriptEl) return;

  const serviceCodename = scriptEl.dataset.service;
  if (!serviceCodename) {
    console.error("[kstacks-support-widget] missing required data-service attribute");
    return;
  }

  const lang: Lang = scriptEl.dataset.lang === "ar" ? "ar" : "en";
  const dir = lang === "ar" ? "rtl" : "ltr";
  const t = STRINGS[lang];
  const apiBase = scriptEl.dataset.api ?? new URL(scriptEl.src, location.href).origin;
  const storageKey = STORAGE_PREFIX + serviceCodename;

  ensureFontLoaded();

  const host = el("div", { dir });
  const shadow = host.attachShadow({ mode: "open" });
  const style = el("style", { textContent: WIDGET_CSS });
  shadow.appendChild(style);
  document.body.appendChild(host);

  const launcher = el(
    "button",
    { className: "launcher", type: "button", ariaHasPopup: "dialog" },
    [svgFlag(), el("span", { text: t.launcher })],
  );
  const panel = el("div", {
    className: "panel",
    hidden: true,
    role: "dialog",
    ariaModal: "true",
    ariaLabel: t.title,
  });
  shadow.appendChild(launcher);
  shadow.appendChild(panel);

  let eventSource: EventSource | null = null;
  let open = false;

  function togglePanel(next: boolean) {
    open = next;
    panel.hidden = !open;
    launcher.hidden = open;
    if (open) void render();
    else if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
  }

  launcher.addEventListener("click", () => togglePanel(true));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) togglePanel(false);
  });

  async function render() {
    const token = localStorage.getItem(storageKey);
    if (!token) {
      renderForm();
      return;
    }
    try {
      const res = await fetch(`${apiBase}/api/public/support/conversations/${token}`);
      if (res.status === 404) {
        localStorage.removeItem(storageKey);
        renderForm();
        return;
      }
      const data = (await res.json()) as { conversation: SupportConversation };
      showConversation(data.conversation);
    } catch {
      renderForm();
    }
  }

  /**
   * A closed report is done, from the reporter's side — it does not sit
   * around waiting for them to reopen it. A new problem gets a new report,
   * with its own fresh name/email/description, not a continuation of a
   * thread staff already resolved.
   */
  function showConversation(conversation: SupportConversation) {
    if (conversation.status === "CLOSED") {
      localStorage.removeItem(storageKey);
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      renderClosedNotice();
      return;
    }
    renderThread(conversation);
    connectStream(conversation.token);
  }

  function connectStream(token: string) {
    if (eventSource) eventSource.close();
    eventSource = new EventSource(`${apiBase}/api/public/support/conversations/${token}/stream`);
    eventSource.onmessage = (event) => {
      const payload = JSON.parse(event.data) as { conversation: SupportConversation };
      if (payload.conversation) showConversation(payload.conversation);
    };
  }

  function renderForm(errorText?: string) {
    panel.replaceChildren();
    const nameInput = el("input", { type: "text", required: true, autocomplete: "name" });
    const emailInput = el("input", { type: "email", required: true, autocomplete: "email" });
    const sectionInput = el("input", { type: "text" });
    const messageInput = el("textarea", { required: true });
    const honeypot = el("input", { type: "text", className: "hp", tabIndex: -1, autocomplete: "off" });
    const submitBtn = el("button", { className: "submit", type: "submit", text: t.send });
    const errorEl = errorText ? el("p", { className: "error-text", text: errorText }) : null;

    const form = el(
      "form",
      {},
      [
        field(t.name, nameInput),
        field(t.email, emailInput),
        field(t.section, sectionInput),
        field(t.message, messageInput),
        honeypot,
        ...(errorEl ? [errorEl] : []),
        submitBtn,
      ],
    );
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = t.sending;
      try {
        const res = await fetch(`${apiBase}/api/public/support/conversations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceCodename,
            pageContext: sectionInput.value
              ? `${location.pathname} — ${sectionInput.value}`
              : location.pathname,
            reporterName: nameInput.value,
            reporterEmail: emailInput.value,
            body: messageInput.value,
            website: honeypot.value,
          }),
        });
        if (!res.ok) throw new Error("request failed");
        const data = (await res.json()) as { conversation: SupportConversation };
        localStorage.setItem(storageKey, data.conversation.token);
        showConversation(data.conversation);
      } catch {
        renderForm(t.error);
      }
    });

    panel.appendChild(
      el("div", { className: "header" }, [
        el("div", {}, [
          el("h2", { text: t.title }),
          el("p", { text: t.subtitle }),
        ]),
        closeButton(),
      ]),
    );
    panel.appendChild(el("div", { className: "body" }, [form]));
  }

  function renderThread(conversation: SupportConversation) {
    panel.replaceChildren();
    localStorage.setItem(storageKey, conversation.token);

    const body = el("div", { className: "body" });
    const list = el("div", { className: "messages" });
    for (const message of conversation.messages) {
      const isReporter = message.senderType === "REPORTER";
      const who = isReporter ? t.you : message.asOrg ? t.team : (message.staff?.displayName ?? t.team);
      list.appendChild(
        el("div", { className: `msg ${isReporter ? "reporter" : "staff"}` }, [
          el("div", { className: "who", text: who }),
          el("div", { text: message.body }),
        ]),
      );
    }
    body.appendChild(list);

    const composeInput = el("textarea", { placeholder: t.reply });
    const sendBtn = el("button", { className: "submit", type: "submit", text: t.send });
    const composeForm = el("form", { className: "compose" }, [composeInput, sendBtn]);
    composeForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const value = composeInput.value.trim();
      if (!value) return;
      sendBtn.disabled = true;
      try {
        const res = await fetch(
          `${apiBase}/api/public/support/conversations/${conversation.token}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body: value }),
          },
        );
        // 409 here means staff closed it a moment ago — treat it the same as
        // discovering that on load: acknowledge and offer a fresh report.
        if (res.status === 409) {
          showConversation({ ...conversation, status: "CLOSED" });
          return;
        }
        const data = (await res.json()) as { conversation: SupportConversation };
        composeInput.value = "";
        showConversation(data.conversation);
      } finally {
        sendBtn.disabled = false;
      }
    });

    panel.appendChild(
      el("div", { className: "header" }, [
        el("div", {}, [el("h2", { text: t.title })]),
        closeButton(),
      ]),
    );
    panel.appendChild(body);
    panel.appendChild(composeForm);
    body.scrollTop = body.scrollHeight;
  }

  function renderClosedNotice() {
    panel.replaceChildren();
    const newReportBtn = el("button", { className: "submit", type: "button", text: t.newReport });
    newReportBtn.addEventListener("click", () => renderForm());

    panel.appendChild(
      el("div", { className: "header" }, [el("div", {}, [el("h2", { text: t.title })]), closeButton()]),
    );
    panel.appendChild(
      el("div", { className: "body" }, [
        el("div", { className: "banner", text: t.resolvedNotice }),
        newReportBtn,
      ]),
    );
  }

  function closeButton() {
    const btn = el("button", { className: "close-btn", type: "button", ariaLabel: t.close }, [
      svgClose(),
    ]);
    btn.addEventListener("click", () => togglePanel(false));
    return btn;
  }

  function field(labelText: string, input: HTMLInputElement | HTMLTextAreaElement) {
    return el("div", { className: "field" }, [el("label", { text: labelText }), input]);
  }
}

function ensureFontLoaded() {
  if (document.querySelector('link[data-kstacks-support-font]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700&display=swap";
  link.setAttribute("data-kstacks-support-font", "true");
  document.head.appendChild(link);
}

function svgFlag(): SVGSVGElement {
  return svgFromPath(
    "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22V3",
  );
}

function svgClose(): SVGSVGElement {
  return svgFromPath("M18 6 6 18 M6 6l12 12");
}

function svgFromPath(d: string): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  svg.appendChild(path);
  return svg;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}
