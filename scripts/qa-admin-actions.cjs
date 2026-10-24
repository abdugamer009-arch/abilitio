const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { fixtures, install } = require("./qa-support.cjs");

async function runAdminActions(origin = "http://127.0.0.1:8105") {
  const browser = await chromium.launch();
  await fs.mkdir("artifacts/full-qa/admin", { recursive: true });
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      await install(context, await fixtures());
      await context.addInitScript(() => {
        window.__qa.user = { id: "test-founder", email: "test-founder@example.invalid" };
        window.__qa.failBan = true;
        window.__qa.adminUser = {
          id: "test-student",
          name: "test-student",
          surname: "",
          email: "test-student@example.invalid",
          is_banned: false,
          created_at: "2026-10-24T00:00:00Z",
          age_group: null,
          has_assessment: false,
        };
      });
      await context.route("**/src/lib/admin/admin.functions.ts*", async (route) => {
        const response = await route.fetch();
        let body = await response.text();
        const replacements = {
          checkIsAdmin: "({isAdmin:true,email:window.__qa.user.email})",
          getAdminUsers: "[{...window.__qa.adminUser}]",
          getAdminAnalytics:
            "({totalUsers:1,completedAssessments:0,newUsersThisWeek:1,newUsersThisMonth:1,dau:1,wau:1,mau:1,mostActiveCommunity:null,popularCareers:[],popularMbti:[],weeklySignups:[]})",
          adminSetBan:
            '(()=>{if(window.__qa.failBan)throw new Error("TEST unavailable moderation API");window.__qa.adminUser.is_banned=args.data.banned;})()',
        };
        for (const [name, value] of Object.entries(replacements)) {
          body = body.replace(
            new RegExp("export const " + name + " = [\\s\\S]*?;(?=\\n)", "g"),
            "export const " + name + " = async(args)=>(" + value + ");",
          );
        }
        await route.fulfill({ response, body });
      });
      await context.route("**/src/lib/assessment/picture-stats.functions.ts*", (route) =>
        route.fulfill({
          contentType: "text/javascript",
          body: "export const getPictureQuestionStats=async()=>({students:0,questions:[],pairs:[]});",
        }),
      );
      const page = await context.newPage();
      const uncaught = [];
      page.on("pageerror", (e) => uncaught.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error") console.log("BROWSER", m.text());
      });
      await page.goto(origin + "/admin", { waitUntil: "networkidle" });
      try {
        await page
          .getByRole("heading", { name: "Admin Dashboard", exact: true })
          .waitFor({ timeout: 10000 });
      } catch (error) {
        console.log(await page.locator("body").innerText(), uncaught);
        throw error;
      }
      await page.getByRole("button", { name: "Ban", exact: true }).click();
      await page.waitForTimeout(100);
      await page.screenshot({ path: `artifacts/full-qa/admin/failed-ban-${width}.png` });
      assert.deepEqual(uncaught, [], "Failed moderation action escaped as an unhandled rejection");
      await page.getByText("Something went wrong", { exact: true }).waitFor();
      assert.equal(await page.getByRole("button", { name: "Ban", exact: true }).isEnabled(), true);
      await page.evaluate(() => {
        window.__qa.failBan = false;
      });
      await page.getByRole("button", { name: "Ban", exact: true }).click();
      await page.getByRole("button", { name: "Unban", exact: true }).waitFor();
      await page.getByRole("button", { name: "Unban", exact: true }).click();
      await page.getByRole("button", { name: "Ban", exact: true }).waitFor();
      await page
        .getByPlaceholder("Search by name or email", { exact: true })
        .fill("no-such-test-user");
      await page.getByText("No users found.", { exact: true }).waitFor();
      await context.unrouteAll({ behavior: "wait" });
      await context.close();
      console.log(
        `Admin action failure/retry/ban/unban/search passed ${width}px (disposable fixture only)`,
      );
    }
  } finally {
    await browser.close();
  }
}
module.exports = { runAdminActions };
if (require.main === module)
  runAdminActions(process.env.QA_ORIGIN).catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
