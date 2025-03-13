import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Add these lines to define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


/**
 * Fetches the latest data pack version from Minecraft Wiki and saves it to a file
 * @returns {Promise<{value: string, range: string}[]>} The fetched data pack version
 */
async function fetchDataPackVersion(skipCache = false) {
    // The path to the cache file
    const cachePath = path.join(__dirname, '..', 'cache', 'datapack-version.txt');

    // Check if the cache file exists
    if (!skipCache) {
        try {
            const cachedVersion = await fs.readFile(cachePath, 'utf-8');
            return cachedVersion;
        } catch (error) {
            // The cache file doesn't exist, so we'll fetch the version from the wiki
        }
    } 

    try {
        // Fetch the Minecraft Wiki page
        const response = await fetch('https://minecraft.wiki/w/Data_pack');
        const html = await response.text();

        // Load the HTML into cheerio
        const $ = cheerio.load(html);

        // Find the version information
        // This selector might need adjustment based on the wiki's HTML structure
        const tableDatapacks = $(".wikitable").eq(0);
        const versions = []

        // interate throught every rows
        tableDatapacks.find("tr").each((i, el) => {
            // skip the first row
            if (i === 0) return;
        
            // skip the last one
            if (i === tableDatapacks.find("tr").length - 1) return;

            // get the version number
            const versionValue = $(el).find("td").eq(0).text().trim();
            const versionRange = $(el).find("td").eq(1).text().trim();
            versions.push({
                value: versionValue,
                range: versionRange
            });
        });
        
        // Save the version to a file
        await fs.writeFile(path.join(__dirname, '../versions.json'), JSON.stringify(versions, null, 2));
        
        return versions;
    } catch (error) {
        console.error('Error fetching data pack version:', error);
        throw error;
    }
}

export { fetchDataPackVersion };