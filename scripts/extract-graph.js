#!/usr/bin/env node

/**
 * Extract graph data from Quartz vault
 * Parses all .md files in content/ directory, extracts wikilinks, and builds node/edge structure
 * Output: JSON file with nodes and links for D3 force-simulation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../content');
// Save to a location outside public/ so it doesn't get wiped by Quartz build
const TEMP_DIR = '/tmp';
const TEMP_FILE = path.join(TEMP_DIR, 'hero-graph.json');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'hero-graph.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Categories/folders represent primary connections from Kenya
const PRIMARY_CONNECTIONS = [
  'Kikuyu',
  'Luo',
  'Luhya',
  'Kamba',
  'Kalenjin',
  'Maasai',
  'Kisii',
  'Meru',
  'Mijikenda',
  'Somali',
  'Swahili',
  'Architecture',
  'Colonial Kenya',
  'Elections',
  'Conservation',
  'Corruption',
  'Education',
  'Film',
  'Food',
  'Health',
  'Diaspora',
  'Labour',
];

// Kenya branding colors
const COLORS = {
  center: '#006B3F', // Kenyan green
  primary: '#BB0000', // Kenyan red
  secondary: '#84a59d', // Muted teal
};

// Extract wikilinks from markdown content
function extractWikilinks(content) {
  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const links = [];
  let match;
  
  while ((match = wikiLinkRegex.exec(content)) !== null) {
    const linkText = match[1].trim();
    if (linkText && linkText.length > 0) {
      links.push(linkText);
    }
  }
  
  return links;
}

// Get all markdown files recursively
function getAllMdFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip hidden directories
      if (!item.startsWith('.')) {
        files.push(...getAllMdFiles(fullPath));
      }
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Extract title from frontmatter or filename
function extractTitle(filePath, content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const titleMatch = frontmatterMatch[1].match(/title:\s*(.+)/);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
  }
  // Fallback to filename
  return path.basename(filePath, '.md');
}

// Get primary category from file path
function getPrimaryCategory(filePath) {
  const relativePath = path.relative(CONTENT_DIR, filePath);
  const parts = relativePath.split(path.sep);
  return parts.length > 0 ? parts[0] : null;
}

// Build node and edge structure with colors and sizes
function buildGraph() {
  const allFiles = getAllMdFiles(CONTENT_DIR);
  
  // Map to track unique nodes
  const nodesMap = new Map();
  const edgesMap = new Map();
  
  // Add Kenya as center node
  nodesMap.set('Kenya', {
    id: 'Kenya',
    label: 'Kenya',
    type: 'center',
    color: COLORS.center,
    size: 30,
    level: 0,
  });
  
  // Process each file
  for (const filePath of allFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const title = extractTitle(filePath, content);
      const primaryCategory = getPrimaryCategory(filePath);
      
      // Determine if this is a primary connection (top-level folder)
      const isPrimary = PRIMARY_CONNECTIONS.includes(primaryCategory);
      
      // Add node with color and size
      if (!nodesMap.has(title)) {
        nodesMap.set(title, {
          id: title,
          label: title,
          type: isPrimary ? 'primary' : 'secondary',
          color: isPrimary ? COLORS.primary : COLORS.secondary,
          size: isPrimary ? 18 : 10,
          category: primaryCategory,
          level: isPrimary ? 1 : 2,
        });
      }
      
      // Extract and process wikilinks
      const links = extractWikilinks(content);
      
      for (const link of links) {
        // Avoid self-links
        if (link === title) continue;
        
        // Determine edge type
        const sourceIsPrimary = PRIMARY_CONNECTIONS.includes(title);
        const targetIsPrimary = PRIMARY_CONNECTIONS.includes(link);
        const edgeType = sourceIsPrimary || targetIsPrimary ? 'primary' : 'secondary';
        
        // Create edge key
        const edgeKey = [title, link].sort().join('|');
        if (!edgesMap.has(edgeKey)) {
          edgesMap.set(edgeKey, {
            source: title,
            target: link,
            type: edgeType,
            strength: edgeType === 'primary' ? 0.6 : 0.3,
          });
        }
        
        // Ensure target node exists
        if (!nodesMap.has(link)) {
          const linkIsPrimary = PRIMARY_CONNECTIONS.includes(link);
          nodesMap.set(link, {
            id: link,
            label: link,
            type: linkIsPrimary ? 'primary' : 'secondary',
            color: linkIsPrimary ? COLORS.primary : COLORS.secondary,
            size: linkIsPrimary ? 18 : 10,
            category: primaryCategory,
            level: linkIsPrimary ? 1 : 2,
          });
        }
      }
    } catch (error) {
      console.error(`Error processing ${filePath}: ${error.message}`);
    }
  }
  
  // Add Kenya connections to primary categories
  for (const category of PRIMARY_CONNECTIONS) {
    if (nodesMap.has(category)) {
      const edgeKey = ['Kenya', category].sort().join('|');
      if (!edgesMap.has(edgeKey)) {
        edgesMap.set(edgeKey, {
          source: 'Kenya',
          target: category,
          type: 'primary',
          strength: 0.8,
        });
      }
    }
  }
  
  // Convert maps to arrays
  const nodes = Array.from(nodesMap.values());
  const links = Array.from(edgesMap.values());
  
  // Group nodes by level for stats
  const nodesByLevel = {
    center: nodes.filter(n => n.level === 0),
    primary: nodes.filter(n => n.level === 1),
    secondary: nodes.filter(n => n.level === 2),
  };
  
  return {
    nodes,
    links,
    nodesByLevel,
    stats: {
      totalNodes: nodes.length,
      centerNodes: nodesByLevel.center.length,
      primaryNodes: nodesByLevel.primary.length,
      secondaryNodes: nodesByLevel.secondary.length,
      totalLinks: links.length,
    },
  };
}

// Main execution
try {
  console.log(`Extracting graph data from ${CONTENT_DIR}...`);
  const graph = buildGraph();
  
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write JSON file
  const graphJson = JSON.stringify(graph, null, 2);
  fs.writeFileSync(OUTPUT_FILE, graphJson);
  
  // ALSO write as JavaScript module so it can be bundled
  const jsFile = path.join(__dirname, '../quartz/components/HeroGraphData.ts');
  const jsContent = `// Auto-generated graph data
export const heroGraphData = ${graphJson};
`;
  fs.writeFileSync(jsFile, jsContent);
  
  console.log(`Graph extracted successfully!`);
  console.log(`Stats:
  - Total nodes: ${graph.stats.totalNodes}
  - Center nodes: ${graph.stats.centerNodes}
  - Primary nodes: ${graph.stats.primaryNodes}
  - Secondary nodes: ${graph.stats.secondaryNodes}
  - Total links: ${graph.stats.totalLinks}
  `);
  console.log(`Output saved to: ${OUTPUT_FILE}`);
  console.log(`JS module saved to: ${jsFile}`);
  
} catch (error) {
  console.error('Error building graph:', error);
  process.exit(1);
}
