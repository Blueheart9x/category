const lively = require("../index.js"),
      {modules, system, vm, l2lConnect} = lively;

var tests = [
  {
    name: "load module",
    async run() {
      let {foo} = await modules.module("test-resources/some-module.js").load();
      foo();
    }
  },

  {
    name: "load package",
    async run() {
      let p = await modules.registerPackage("test-resources/some-package")
      console.log(p.name);
      let loaded = await modules.importPackage("test-resources/some-package")
      console.log(loaded);
    }
  },

  {
    name: "list loaded modules and packages",
    async run() {
      console.log(`Loaded packages:\n  ${modules.getPackages().map(ea => ea.name).join("\n  ")}`);
      console.log(`Loaded modules:\n  ${modules.loadedModules().join("\n  ")}`);
    }
  },
  
  {
    name: "vm.runEval",
    async run() {
      let {value, isError} = await vm.runEval(`somePackageExport + 2`, {targetModule: "some-package/index.js"});
      console.log(`Eval result: ${isError} / ${value}`);
    }
  },
  
  {
    name: "system.runEval",
    async run() {
      let {value, isError} = await system.runEval(`somePackageExport + 2`, {targetModule: "some-package/index.js"});
      console.log(`Eval result: ${isError} / ${value}`);
    }
  },

  {
    name: "l2l connect",
    async run() {
      let client = await l2lConnect(`http://localhost:9011/lively-socket.io`, 500);
      console.log("[l2l] online");
    }
  }

]

async function runTests() {
  let errored = [];
  for (let {name, run} of tests) {
    console.log(`[test] >>> "${name}"`)
    try { await run(); } catch (err) {
      errored.push(name);
      console.error(`Test ${name} failed: ${err.stack}`);
    }
    console.log(`[test] <<< "${name}"`)
  }
  if (errored.length) {
    console.error(`${errored.length} tests failed:\n${errored.join("\n")}`);
    process.exit(1);
  }
  console.log("All tests passed");
  process.exit(0);
}

runTests();
