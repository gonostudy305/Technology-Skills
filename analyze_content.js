const fs = require("fs");
const path = require("path");

const slugs = ["data_warehouse", "deeplearning", "internet_devices", "git_visualizer", "release_software"];
const contentDir = "content";

slugs.forEach(slug => {
    const filePath = path.join(contentDir, slug + ".html");
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
        const scriptTags = content.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi) || [];
        
        let scriptSrcCount = 0;
        let inlineScriptCount = 0;
        let firstInlineHasTailwindConfig = false;
        let hasChart = false;
        let firstInlineFound = false;

        scriptTags.forEach(tag => {
            const hasSrc = /src\s*=\s*['"]/.test(tag);
            if (hasSrc) {
                scriptSrcCount++;
            } else {
                inlineScriptCount++;
                const innerContent = tag.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/i, "$1");
                if (!firstInlineFound) {
                    firstInlineHasTailwindConfig = innerContent.includes("tailwind.config");
                    firstInlineFound = true;
                }
            }
            if (tag.includes("Chart(") || tag.includes("new Chart")) {
                hasChart = true;
            }
        });

        console.log("Slug: " + slug);
        console.log("- Script tags: " + scriptTags.length);
        console.log("- Script src: " + scriptSrcCount);
        console.log("- Inline scripts: " + inlineScriptCount);
        console.log("- First inline has tailwind.config: " + firstInlineHasTailwindConfig);
        console.log("- Contains Chart: " + hasChart);
        console.log("");
    } else {
        console.log("Slug: " + slug + " - File not found\n");
    }
});
