import puppeteer from "puppeteer-core";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ["--window-size=1920,1080"],
  });
  const p = await b.newPage();
  await p.setViewport({ width: 1920, height: 1080 });
  await p.goto("http://localhost:3100", { waitUntil: "networkidle2", timeout: 90_000 });
  await sleep(5000);
  const step1 = await p.evaluate(() => {
    const btn = [...document.querySelectorAll<HTMLElement>("header button")].find((x) => x.textContent?.trim() === "Copilot");
    btn?.click();
    return { copilotBtn: !!btn };
  });
  await sleep(1500);
  const step2 = await p.evaluate(() => {
    const chips = [...document.querySelectorAll<HTMLElement>("button")].filter((x) => x.textContent?.includes("Why is Seloo critical?"));
    chips[0]?.click();
    return { chips: chips.length };
  });
  await sleep(20000);
  const state = await p.evaluate(() => {
    const scroller = document.querySelector(".fixed .overflow-y-auto");
    return {
      scrollerFound: !!scroller,
      children: scroller?.children.length,
      text: (scroller as HTMLElement)?.innerText?.slice(0, 300),
    };
  });
  console.log(JSON.stringify({ step1, step2, state }, null, 1));
  await b.close();
})();
