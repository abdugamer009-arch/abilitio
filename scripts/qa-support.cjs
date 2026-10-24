// Development-only network fixtures. Never bundled into production.
const path = require("node:path");
const fs = require("node:fs/promises");
const { build } = require("esbuild");
async function fixtures() {
  await fs.mkdir("artifacts/qa", { recursive: true });
  const dest = path.resolve(`artifacts/qa/fixtures-${process.pid}.cjs`);
  await build({
    entryPoints: ["scripts/mobile-qa-data.ts"],
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile: dest,
  });
  delete require.cache[dest];
  const originalRandom = Math.random;
  let seed = 731;
  Math.random = () => (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  try {
    return require(dest).buildFixtures("en", "random");
  } finally {
    Math.random = originalRandom;
  }
}
async function install(
  context,
  data,
  { lang = "en", theme = "light", age = "teen_adult", guest = false, legacy = false } = {},
) {
  await context.addInitScript(
    ({ data, lang, theme, age, guest, legacy }) => {
      localStorage.setItem("abilitio_lang", lang);
      localStorage.setItem("abilitio-theme", theme);
      window.__qa = {
        data,
        age,
        guest,
        user: { id: "qa-owner", email: "qa@example.invalid" },
        members: legacy
          ? [
              {
                id: "33333333-3333-4333-8333-333333333333",
                name: "Technology",
                slug: "software-engineering",
                consented_at: null,
              },
            ]
          : [],
        calls: [],
        history: [
          { ...data.results[age], id: "11111111-1111-4111-8111-111111111111" },
          {
            ...data.results[age],
            id: "22222222-2222-4222-8222-222222222222",
            created_at: "2026-10-13T00:00:00Z",
            cognitive_score: 3,
          },
        ],
      };
    },
    { data, lang, theme, age, guest, legacy },
  );
  await context.route("**/src/lib/auth-context.tsx*", async (route) => {
    const res = await route.fetch();
    await route.fulfill({
      response: res,
      body: (await res.text()).replace(
        "return useContext(Ctx);",
        "const original=useContext(Ctx); return original.loading?original:{...original,user:window.__qa.guest&&!sessionStorage.getItem('qa.recovery-session')?null:window.__qa.user,loading:false};",
      ),
    });
  });
  await context.route("**/src/integrations/supabase/client.ts*", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `
 export const isSupabaseConfigured=true;
 const q=window.__qa;
 function query(table){let one=false,filters={}; const chain=new Proxy({}, {get(_,key){
 if(key==='then')return (done)=>{let rows=table==='career_assessment_results'?q.history:table==='profiles'?[{id:'qa-owner',name:'QA',surname:'Fixture'}]:[];
 if(filters.id)rows=rows.filter(r=>r.id===filters.id);
 done({data:one?rows[0]??null:rows,error:null,count:rows.length});};
 return (...args)=>{if(key==='single'||key==='maybeSingle')one=true;if(key==='eq')filters[args[0]]=args[1];return chain;};
 }});return chain;}
 export const supabase={from:query,auth:{onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),getSession:async()=>({data:{session:null}}),signOut:async()=>({error:null}),updateUser:async({password})=>{if(!sessionStorage.getItem('qa.recovery-session'))return {error:new Error('Recovery session expired')};if(password.length<8)return {error:new Error('Password too short')};sessionStorage.setItem('qa.mock-updated','yes');sessionStorage.setItem('qa.mock-used','yes');return {error:null};}},channel:()=>({on(){return this},subscribe(){return this},unsubscribe(){}}),removeChannel(){},storage:{from:()=>({createSignedUrl:async()=>({data:null,error:null})})}};
 `,
    }),
  );
  // AuthProvider now imports the lightweight configuration gate directly.
  // Keep that gate consistent with this test's intercepted account SDK.
  await context.route("**/src/integrations/supabase/config.ts*", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: "export const isSupabaseConfigured=true;",
    }),
  );
  await context.route("**/src/lib/assessment/career.functions.ts*", async (route) => {
    const res = await route.fetch();
    let body = await res.text();
    const replacements = {
      startProfileSessions: "window.__qa.data.sessions",
      submitCareerAssessment: '(window.__qa.calls.push("submit"),window.__qa.history[0])',
      getMyCareerResult:
        "(args?.data?.resultId?window.__qa.history.find(r=>r.id===args.data.resultId):window.__qa.history[0])",
      getCareerDirectory:
        "window.__qa.data.results.teen_adult.career_matches.map(c=>({key:c.key,name:c.name,category:c.category}))",
    };
    for (const [name, value] of Object.entries(replacements))
      body = body.replace(
        new RegExp("export const " + name + " = [\\s\\S]*?;(?=\\n)", "g"),
        "export const " + name + " = async (args) => " + value + ";",
      );
    await route.fulfill({ response: res, body });
  });
  await context.route("**/src/lib/roadmap/tasks.functions.ts*", async (route) => {
    const res = await route.fetch();
    let body = await res.text();
    body = body
      .replace(
        /export const loadTaskJournal = [\s\S]*?;(?=\n)/g,
        "export const loadTaskJournal = async()=>({});",
      )
      .replace(
        /export const saveTaskJournal = [\s\S]*?;(?=\n)/g,
        "export const saveTaskJournal = async()=>{};",
      );
    await route.fulfill({ response: res, body });
  });
  await context.route("**/src/lib/abbi/abbi.functions.ts*", async (route) => {
    const res = await route.fetch();
    await route.fulfill({
      response: res,
      body: (await res.text()).replace(
        /export const generateAbbiMessage = [\s\S]*?;(?=\n)/g,
        "export const generateAbbiMessage=async(args)=>({reply:window.__qa.data.abbiReplies[args.data.lang]});",
      ),
    });
  });
  await context.route("**/src/lib/community/community.functions.ts*", async (route) => {
    const res = await route.fetch();
    let body = await res.text();
    const replacements = {
      getMyCommunities: "({communities:window.__qa.members,isAdmin:false})",
      getCommunityChoice:
        '({suggested:{id:"33333333-3333-4333-8333-333333333333",name:"Technology",slug:"software-engineering"},memberships:window.__qa.members})',
      joinCommunity:
        '(window.__qa.members=[{id:"33333333-3333-4333-8333-333333333333",name:"Technology",slug:"software-engineering",consented_at:"2026-10-15T00:00:00Z"}],null)',
      leaveCommunity: "(window.__qa.members=[],null)",
    };
    for (const [name, value] of Object.entries(replacements))
      body = body.replace(
        new RegExp("export const " + name + " = [\\s\\S]*?;(?=\\n)", "g"),
        "export const " + name + " = async () => " + value + ";",
      );
    await route.fulfill({ response: res, body });
  });
}
function errors(page) {
  const list = [];
  page.on("pageerror", (e) => list.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") list.push(m.text());
  });
  page.on("requestfailed", (r) => {
    list.push(r.url() + " " + r.failure()?.errorText);
  });
  page.on("response", (r) => {
    if (r.status() >= 400) list.push(r.url() + " HTTP " + r.status());
  });
  return list;
}
module.exports = { fixtures, install, errors };
