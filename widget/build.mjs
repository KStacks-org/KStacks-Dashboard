import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const options = {
  entryPoints: ["src/widget.ts"],
  outfile: "dist/kstacks-support-widget.js",
  bundle: true,
  format: "iife",
  target: "es2020",
  minify: !watch,
  sourcemap: watch,
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log("Watching widget/src/widget.ts...");
} else {
  await esbuild.build(options);
  console.log("Built widget/dist/kstacks-support-widget.js");
}
