import fs from "fs";
import path from "path";

async function main() {
  const dataRoot = path.resolve(__dirname, "../src/data");

  const argv = process.argv.slice(2);
  const argMap: Record<string, string | boolean> = {};

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i] ?? "";
    if (a === "--help" || a === "-h") {
      argMap.help = true;
      break;
    }

    if (a === "--list" || a === "-l") {
      argMap.list = true;
      continue;
    }

    if (a.startsWith("--collection=")) {
      const [, value] = a.split("=");
      if (value) {
        argMap.collection = value;
      }
      continue;
    }

    if (a === "--collection" || a === "-c") {
      const next = argv[i + 1];
      if (typeof next === "string") {
        argMap.collection = next;
        i++;
      }
      continue;
    }
  }

  if (argMap.help) {
    console.log(`Usage: node scripts/validate-content.ts [--list|-l] [--collection|-c <name>]`);
    console.log(`  --list, -l         List detected data collections with index modules.`);
    console.log(`  --collection, -c   Validate only the specified collection name.`);
    console.log(`  --help, -h         Show this help message.`);
    return;
  }

  if (!fs.existsSync(dataRoot)) {
    console.log("No data directory found. Nothing to validate.");
    return;
  }

  let children = fs.readdirSync(dataRoot).filter((name) => {
    try {
      return fs.statSync(path.join(dataRoot, name)).isDirectory();
    } catch {
      return false;
    }
  });

  // If user provided a specific collection, limit to it
  if (argMap.collection) {
    const col = String(argMap.collection);
    children = children.filter((c) => c === col);
    if (children.length === 0) {
      console.error(`Collection not found: ${col}`);
      process.exit(2);
    }
  }

  let total = 0;
  const results: Record<string, number> = {};

  for (const child of children) {
    const childDir = path.join(dataRoot, child);
    const indexCandidates = ["index.ts", "index.tsx", "index.js", "index.mjs", "index.json"];
    const hasIndex = indexCandidates.some((c) => fs.existsSync(path.join(childDir, c)));

    if (!hasIndex) {
      // Nothing to validate in this folder yet
      console.log(`Skipping ${child} — no index module found.`);
      continue;
    }

    const modPath = `../src/data/${child}`;
    try {
      // dynamic import: each data module should run its own validation
      // (for example, `src/data/projects/index.ts` validates projects)
      // If validation fails, the import will throw and we should propagate the error.
      const mod = await import(modPath);

      // Inspect exported bindings for arrays (e.g., `projects`)
      let countForChild = 0;
      for (const val of Object.values(mod)) {
        if (Array.isArray(val)) {
          countForChild += val.length;
        }
      }

      results[child] = countForChild;
      total += countForChild;
    } catch (err) {
      // Re-throw validation errors so the script exits non-zero
      // and surfaces the content validation details.
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    }
  }

  // Summary output
  for (const [k, v] of Object.entries(results)) {
    console.log(`${k}: ${v} item(s)`);
  }

  console.log(`Content validation passed (${total} total item(s)).`);
}

main();
