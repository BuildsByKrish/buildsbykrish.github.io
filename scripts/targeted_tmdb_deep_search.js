#!/usr/bin/env node
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const apiKey = process.env.TMDB_API_KEY;
if (!apiKey) {
  console.error('Set TMDB_API_KEY in environment before running this script.');
  process.exit(1);
}

const targets = [
  {title: 'My Supernatural Power Boyfriend', year: 2021},
  {title: 'Legend of Yunxi', year: 2018},
  {title: 'The Legend of the Nine-Tailed Fox', year: 2022},
  {title: 'Ashes of Love 2', year: 2024},
  {title: 'Love Between Blossoms', year: 2022},
  {title: 'Daughter of the Emperor', year: 2023}
];

function genCandidates(title) {
  const t = (title||'').trim();
  const set = new Set();
  function add(s){ if(s && s.trim()) set.add(s.trim()); }
  add(t);
  add(t.replace(/\s*\([^)]*\)/g, ''));
  add(t.replace(/\s*[-,\/]?\s*\d{4}\s*$/g, ''));
  add(t.replace(/\b[Ss]eason\s*\d+\b/g, ''));
  add(t.replace(/\bS\d+\b/g, ''));
  add(t.replace(/["'“”‘’\[\]]/g, ''));
  if (t.toLowerCase().startsWith('the ')) add(t.substring(4));
  if (t.toLowerCase().startsWith('legend of ')) add(t.substring('legend of '.length));
  // try splitting on spaces and trying 2-4 word windows
  const words = t.replace(/[\(\)\[\]]/g,'').split(/\s+/).filter(Boolean);
  for (let len=2; len<=Math.min(4, words.length); len++){
    for (let i=0;i+len<=words.length;i++){
      add(words.slice(i,i+len).join(' '));
    }
  }
  // replace numeric suffix with 'season N'
  add(t.replace(/\s+(\d+)$/,' season $1'));
  // try join separated like 'Yunxi' -> 'Yun Xi' and vice versa
  add(t.replace(/([a-z])([A-Z])/g,'$1 $2'));
  add(t.replace(/\s+/g,' '));
  // common alternates dictionary small
  const alts = {
    'yunxi':'yun xi',
    'haolan':'hao lan',
    'nine-tailed fox':'nine tailed fox',
    'ashes of love 2':'ashes of love season 2'
  };
  Object.keys(alts).forEach(k=>{
    if(t.toLowerCase().includes(k)) add(t.toLowerCase().replace(k, alts[k]));
  });
  return Array.from(set);
}

async function searchMulti(q, year){
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(q)}${year?`&year=${encodeURIComponent(year)}`:''}`;
  try{
    const res = await axios.get(url, { timeout: 10000 });
    return res.data && res.data.results ? res.data.results.slice(0,8) : [];
  }catch(e){ return []; }
}

(async()=>{
  for (const t of targets) {
    console.log('\n=== ' + t.title + (t.year ? ' ('+t.year+')' : '') + ' ===');
    const candidates = genCandidates(t.title);
    const seenIds = new Set();
    for (const cand of candidates) {
      console.log('\n-- Candidate: ' + cand);
      const results = await searchMulti(cand, t.year);
      if (!results || results.length===0) { console.log('  (no results)'); continue; }
      for (const r of results) {
        if (seenIds.has(r.id+'|'+(r.media_type||r.media_type))) continue;
        seenIds.add(r.id+'|'+(r.media_type||r.media_type));
        console.log(`  - [${r.media_type||r.media_type||'?'}] ${r.name||r.title||''} | id:${r.id} | poster:${r.poster_path||'NONE'} | date:${r.first_air_date||r.release_date||'N/A'} | original:${r.original_name||r.original_title||'N/A'}`);
      }
      await new Promise(r=>setTimeout(r,300));
    }
  }
})();
