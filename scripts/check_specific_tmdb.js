#!/usr/bin/env node
const axios = require('axios');
const apiKey = process.env.TMDB_API_KEY;
if(!apiKey){ console.error('Set TMDB_API_KEY in env'); process.exit(1); }

const targets = [
  {title: 'The Legend of Haolan', year: 2019, candidates: ['The Legend of Haolan','The Legend of Hao Lan','Hao Lan','Haolan']},
  {title: 'My Supernatural Power Boyfriend', year: 2021, candidates: ['My Supernatural Power Boyfriend','Supernatural Power Boyfriend','My Supernatural Power Boyfriend 2021']},
  {title: 'Legend of Yunxi', year: 2018, candidates: ['Legend of Yunxi','The Legend of Yunxi','Yunxi']},
  {title: 'The Legend of the Nine-Tailed Fox', year: 2022, candidates: ['The Legend of the Nine-Tailed Fox','Nine-Tailed Fox','Legend of the Nine-Tailed Fox']},
  {title: 'Ashes of Love 2', year: 2024, candidates: ['Ashes of Love 2','Ashes of Love season 2','Ashes of Love']},
  {title: 'Love Between Blossoms', year: 2022, candidates: ['Love Between Blossoms','Love Between Blossoms 2022','Love Between the Blossoms','Between Blossoms']},
  {title: 'Daughter of the Emperor', year: 2023, candidates: ['Daughter of the Emperor','Daughter of an Emperor','The Daughter of the Emperor']}
];

async function search(q, year){
  const enc = encodeURIComponent(q);
  const tvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${enc}${year?`&first_air_date_year=${year}`:''}`;
  const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${enc}${year?`&year=${year}`:''}`;
  try{
    const [tvRes, movieRes] = await Promise.all([
      axios.get(tvUrl).catch(()=>({data:{results:[]}})),
      axios.get(movieUrl).catch(()=>({data:{results:[]}}))
    ]);
    const results = [];
    if(tvRes.data && tvRes.data.results) results.push(...tvRes.data.results.map(r=>({...r, media:'tv'})));
    if(movieRes.data && movieRes.data.results) results.push(...movieRes.data.results.map(r=>({...r, media:'movie'})));
    return results.slice(0,5);
  }catch(e){ return []; }
}

(async()=>{
  for(const t of targets){
    console.log('\n=== ' + t.title + (t.year? ' ('+t.year+')':'') + ' ===');
    for(const c of t.candidates){
      const res = await search(c, t.year);
      if(res.length===0) continue;
      console.log('\nCandidate: ' + c);
      res.forEach(r=> console.log(` - [${r.media}] ${r.name||r.title} | id:${r.id} | poster:${r.poster_path||'NONE'} | date:${r.first_air_date||r.release_date||'N/A'}`));
      await new Promise(r=>setTimeout(r,250));
    }
  }
})();
