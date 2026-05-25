import { seedCategories } from "./categories.seed.js";

async function run() {
	await seedCategories();
	console.log("All seeds done");
	process.exit();
}

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
