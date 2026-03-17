#!/usr/bin/env node

/**
 * Extract graph data from Quartz vault
 * Reads ~/Projects/kenya-history/content and builds node/edge structure
 * 
 * Usage: node scripts/extract-graph.js > data/hero-graph.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../content');

// Primary categories (7 as per spec)
const PRIMARY_CATEGORIES = [
  'Presidencies',
  'Elections',
  'Corruption',
  'Colonial Kenya',
  'Political Movements',
  'Kikuyu',
  'Luo',
];

// Color mapping
const COLORS = {
  center: '#006B3F',    // Kenya green
  primary: '#006B3F',   // Kenyan green
  secondary: '#BB0000', // Kenyan red
};

/**
 * Extract wikilinks from markdown content
 * Matches [[Link]] and [[Link|Display Text]]
 */
function extractWikilinks(content) {
  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const links = [];
  let match;
  
  while ((match = wikiLinkRegex.exec(content)) !== null) {
    const linkText = match[1].trim();
    // Extract filename from link (remove anchor if present)
    const filename = linkText.split('#')[0].trim();
    if (filename && filename.length > 0) {
      links.push(filename);
    }
  }
  
  return [...new Set(links)]; // deduplicate
}

/**
 * Find markdown file by slug/title
 */
function findFileBySlug(slug) {
  const searchDirs = [CONTENT_DIR];
  const visited = new Set();
  
  function search(dir) {
    if (visited.has(dir)) return null;
    visited.add(dir);
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const result = search(fullPath);
          if (result) return result;
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const baseName = path.basename(entry.name, '.md');
          if (baseName.toLowerCase() === slug.toLowerCase() ||
              baseName.replace(/\s+/g, '-').toLowerCase() === slug.replace(/\s+/g, '-').toLowerCase()) {
            return fullPath;
          }
        }
      }
    } catch (err) {
      // ignore
    }
    
    return null;
  }
  
  return search(CONTENT_DIR);
}

/**
 * Get category from file path
 */
function getCategoryFromPath(filePath) {
  const relative = path.relative(CONTENT_DIR, filePath);
  const parts = relative.split(path.sep);
  return parts.length > 1 ? parts[0] : 'Other';
}

/**
 * Extract all markdown files and their metadata
 */
function extractAllFiles() {
  const files = {};
  
  function walkDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          walkDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const { data: frontmatter } = matter(content);
            const slug = path.basename(fullPath, '.md');
            const category = getCategoryFromPath(fullPath);
            
            files[slug] = {
              slug,
              title: frontmatter.title || slug,
              path: fullPath,
              category,
              links: extractWikilinks(content),
            };
          } catch (err) {
            // skip files that can't be parsed
          }
        }
      }
    } catch (err) {
      // ignore permission errors
    }
  }
  
  walkDir(CONTENT_DIR);
  return files;
}

/**
 * Build graph with Kenya as center
 * Primary nodes = 7 major categories
 * Secondary nodes = articles within those categories
 */
function buildGraph(files) {
  const nodes = [];
  const links = [];
  const nodeMap = new Map();
  
  // Add Kenya as center node
  const kenyaNode = {
    id: 'Kenya',
    label: 'Kenya',
    type: 'center',
    category: 'center',
    color: COLORS.center,
    size: 30,
  };
  nodes.push(kenyaNode);
  nodeMap.set('Kenya', kenyaNode);
  
  // Add primary category nodes
  const primaryNodes = {};
  PRIMARY_CATEGORIES.forEach((cat) => {
    const node = {
      id: cat,
      label: cat,
      type: 'primary',
      category: cat,
      color: COLORS.primary,
      size: 18,
    };
    nodes.push(node);
    primaryNodes[cat] = node;
    nodeMap.set(cat, node);
    
    // Link primary to Kenya
    links.push({
      source: 'Kenya',
      target: cat,
      type: 'primary',
      strength: 0.5,
    });
  });
  
  // Add secondary nodes (articles in primary categories)
  const addedSecondary = new Set();
  let secondaryCount = 0;
  
  PRIMARY_CATEGORIES.forEach((primaryCat) => {
    const articlesInCat = Object.values(files)
      .filter(f => f.category === primaryCat)
      .slice(0, 12); // limit to ~12 per category
    
    articlesInCat.forEach((file) => {
      if (!addedSecondary.has(file.slug) && secondaryCount < 100) {
        const node = {
          id: file.slug,
          label: file.title,
          type: 'secondary',
          category: primaryCat,
          color: COLORS.secondary,
          size: 8,
        };
        nodes.push(node);
        nodeMap.set(file.slug, node);
        addedSecondary.add(file.slug);
        secondaryCount++;
        
        // Link secondary to primary
        links.push({
          source: primaryCat,
          target: file.slug,
          type: 'secondary',
          strength: 0.3,
        });
      }
    });
  });
  
  // Add cross-category links from wikilinks
  Object.values(files).forEach((file) => {
    if (!nodeMap.has(file.slug)) return;
    
    file.links.forEach((linkedSlug) => {
      if (nodeMap.has(linkedSlug) && linkedSlug !== file.slug) {
        // Check if link already exists
        const linkExists = links.some(
          l => (l.source === file.slug && l.target === linkedSlug) ||
               (l.source === linkedSlug && l.target === file.slug)
        );
        
        if (!linkExists) {
          links.push({
            source: file.slug,
            target: linkedSlug,
            type: 'cross',
            strength: 0.1,
          });
        }
      }
    });
  });
  
  return { nodes, links };
}

/**
 * Main
 */
function main() {
  console.error('Extracting graph data...');
  
  const files = extractAllFiles();
  console.error(`Found ${Object.keys(files).length} files`);
  
  const graph = buildGraph(files);
  console.error(`Generated ${graph.nodes.length} nodes and ${graph.links.length} links`);
  
  // Output JSON to stdout
  const output = {
    version: '1.0',
    generated: new Date().toISOString(),
    stats: {
      totalNodes: graph.nodes.length,
      totalLinks: graph.links.length,
      centerNode: 'Kenya',
      primaryCategories: PRIMARY_CATEGORIES.length,
    },
    nodes: graph.nodes,
    links: graph.links,
  };
  
  console.log(JSON.stringify(output, null, 2));
}

main();
