#!/usr/bin/env node

import { execSync } from "child_process";
import readline from "readline";
import fs from "fs";
import path from "path";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const packages = ["core", "router"];

function getPackageVersion(pkgName) {
    const pkgPath = path.join(process.cwd(), "packages", pkgName, "package.json");
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    return pkgJson.version;
}

function updateVersion(pkgName, versionType) {
    console.log(`\nUpdating ${pkgName} version...`);
    try {
        execSync(`pnpm version:${pkgName} ${versionType}`, { stdio: "inherit" });
        return true;
    } catch (error) {
        console.error(`Error updating version for ${pkgName}:`, error.message);
        return false;
    }
}

function buildPackages() {
    console.log("\nBuilding all packages...");
    try {
        execSync("pnpm build", { stdio: "inherit" });
        return true;
    } catch (error) {
        console.error("Error building packages:", error.message);
        return false;
    }
}

function publishPackage(pkgName) {
    console.log(`\nPublishing ${pkgName}...`);
    try {
        execSync(`pnpm publish:${pkgName}`, { stdio: "inherit" });
        return true;
    } catch (error) {
        console.error(`Error publishing ${pkgName}:`, error.message);
        return false;
    }
}

function displayCurrentVersions() {
    console.log("\nCurrent package versions:");
    for (const pkg of packages) {
        console.log(`- ${pkg}: v${getPackageVersion(pkg)}`);
    }
}

async function promptUser(question) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            resolve(answer.trim());
        });
    });
}

async function main() {
    console.log("=== keepalive-for-react Package Publisher ===");
    displayCurrentVersions();

    const publishAll = await promptUser("\nDo you want to publish all packages? (y/n): ");

    if (publishAll.toLowerCase() === "y") {
        const versionType = await promptUser("Version update type (patch/minor/major): ");

        if (!["patch", "minor", "major"].includes(versionType)) {
            console.error("Invalid version type. Use patch, minor, or major.");
            rl.close();
            return;
        }

        for (const pkg of packages) {
            updateVersion(pkg, versionType);
        }

        if (!buildPackages()) {
            rl.close();
            return;
        }

        const confirmPublish = await promptUser("Ready to publish? This will publish to npm registry (y/n): ");

        if (confirmPublish.toLowerCase() === "y") {
            for (const pkg of packages) {
                publishPackage(pkg);
            }
            console.log("\n✅ All packages published successfully!");
        } else {
            console.log("\nPublish canceled.");
        }
    } else {
        const packagesToPublish = [];

        for (const pkg of packages) {
            const shouldPublish = await promptUser(`Publish ${pkg}? (y/n): `);
            if (shouldPublish.toLowerCase() === "y") {
                packagesToPublish.push(pkg);

                const versionType = await promptUser(`Version update for ${pkg} (patch/minor/major): `);
                if (!["patch", "minor", "major"].includes(versionType)) {
                    console.error("Invalid version type. Using patch as default.");
                    updateVersion(pkg, "patch");
                } else {
                    updateVersion(pkg, versionType);
                }
            }
        }

        if (packagesToPublish.length === 0) {
            console.log("No packages selected for publishing.");
            rl.close();
            return;
        }

        if (!buildPackages()) {
            rl.close();
            return;
        }

        const confirmPublish = await promptUser("Ready to publish selected packages? (y/n): ");

        if (confirmPublish.toLowerCase() === "y") {
            for (const pkg of packagesToPublish) {
                publishPackage(pkg);
            }
            console.log("\n✅ Selected packages published successfully!");
        } else {
            console.log("\nPublish canceled.");
        }
    }

    rl.close();
}

main().catch(error => {
    console.error("Error:", error);
    rl.close();
});
