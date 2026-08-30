const categories = [
  { key: 'qb', label: 'Quarterback', default: 30 },
  { key: 'defense', label: 'Defense', default: 25 },
  { key: 'coaching', label: 'Coaching', default: 20 },
  { key: 'oline', label: 'Offensive line', default: 15 },
  { key: 'skill', label: 'Skill positions', default: 10 }
];

const ranks = {
  coaching:['San Francisco 49ers','Los Angeles Rams','Chicago Bears','Los Angeles Chargers','Kansas City Chiefs','Seattle Seahawks','Jacksonville Jaguars','Minnesota Vikings','Denver Broncos','Houston Texans','Green Bay Packers','Indianapolis Colts','New York Giants','Philadelphia Eagles','Detroit Lions','New England Patriots','Baltimore Ravens','Dallas Cowboys','New Orleans Saints','Carolina Panthers','Washington Commanders','Tampa Bay Buccaneers','Las Vegas Raiders','Atlanta Falcons','Buffalo Bills','Miami Dolphins','Pittsburgh Steelers','Arizona Cardinals','Cleveland Browns','Tennessee Titans','Cincinnati Bengals','New York Jets'],
  oline:['Denver Broncos','Tampa Bay Buccaneers','Indianapolis Colts','Los Angeles Chargers','Philadelphia Eagles','Buffalo Bills','Chicago Bears','Kansas City Chiefs','San Francisco 49ers','Los Angeles Rams','Atlanta Falcons','Dallas Cowboys','Minnesota Vikings','New Orleans Saints','Baltimore Ravens','Seattle Seahawks','Detroit Lions','Pittsburgh Steelers','New York Giants','Cincinnati Bengals','New England Patriots','Las Vegas Raiders','New York Jets','Arizona Cardinals','Houston Texans','Miami Dolphins','Carolina Panthers','Green Bay Packers','Washington Commanders','Jacksonville Jaguars','Tennessee Titans','Cleveland Browns'],
  skill:['Los Angeles Rams','Detroit Lions','Minnesota Vikings','Dallas Cowboys','Cincinnati Bengals','Atlanta Falcons','Arizona Cardinals','San Francisco 49ers','New England Patriots','Philadelphia Eagles','Chicago Bears','Green Bay Packers','Jacksonville Jaguars','Seattle Seahawks','Buffalo Bills','Tampa Bay Buccaneers','Denver Broncos','Indianapolis Colts','Pittsburgh Steelers','Washington Commanders','Los Angeles Chargers','Baltimore Ravens','Kansas City Chiefs','Houston Texans','New York Jets','Las Vegas Raiders','New Orleans Saints','Carolina Panthers','New York Giants','Tennessee Titans','Cleveland Browns','Miami Dolphins'],
  qb:['Buffalo Bills','Kansas City Chiefs','Cincinnati Bengals','Baltimore Ravens','Green Bay Packers','New England Patriots','Dallas Cowboys','Los Angeles Rams','Los Angeles Chargers','San Francisco 49ers','Jacksonville Jaguars','Tampa Bay Buccaneers','Chicago Bears','Washington Commanders','Philadelphia Eagles','Houston Texans','Minnesota Vikings','Detroit Lions','Seattle Seahawks','Denver Broncos','New York Jets','Las Vegas Raiders','Tennessee Titans','New Orleans Saints','New York Giants','Miami Dolphins','Carolina Panthers','Indianapolis Colts','Atlanta Falcons','Pittsburgh Steelers','Arizona Cardinals','Cleveland Browns'],
  defense:['Houston Texans','Seattle Seahawks','Philadelphia Eagles','Baltimore Ravens','Los Angeles Rams','Pittsburgh Steelers','New England Patriots','Kansas City Chiefs','Denver Broncos','Minnesota Vikings','Tampa Bay Buccaneers','Detroit Lions','Jacksonville Jaguars','New Orleans Saints','Chicago Bears','Dallas Cowboys','New York Giants','New York Jets','San Francisco 49ers','Los Angeles Chargers','Tennessee Titans','Indianapolis Colts','Green Bay Packers','Buffalo Bills','Cincinnati Bengals','Cleveland Browns','Washington Commanders','Arizona Cardinals','Carolina Panthers','Atlanta Falcons','Las Vegas Raiders','Miami Dolphins']
};

const meta = {
  'Arizona Cardinals':['ARI','NFC','#97233f'],'Atlanta Falcons':['ATL','NFC','#a71930'],'Baltimore Ravens':['BAL','AFC','#241773'],'Buffalo Bills':['BUF','AFC','#00338d'],'Carolina Panthers':['CAR','NFC','#0085ca'],'Chicago Bears':['CHI','NFC','#0b162a'],'Cincinnati Bengals':['CIN','AFC','#fb4f14'],'Cleveland Browns':['CLE','AFC','#311d00'],'Dallas Cowboys':['DAL','NFC','#041e42'],'Denver Broncos':['DEN','AFC','#fb4f14'],'Detroit Lions':['DET','NFC','#0076b6'],'Green Bay Packers':['GB','NFC','#203731'],'Houston Texans':['HOU','AFC','#03202f'],'Indianapolis Colts':['IND','AFC','#002c5f'],'Jacksonville Jaguars':['JAX','AFC','#006778'],'Kansas City Chiefs':['KC','AFC','#e31837'],'Las Vegas Raiders':['LV','AFC','#111111'],'Los Angeles Chargers':['LAC','AFC','#0080c6'],'Los Angeles Rams':['LAR','NFC','#003594'],'Miami Dolphins':['MIA','AFC','#008e97'],'Minnesota Vikings':['MIN','NFC','#4f2683'],'New England Patriots':['NE','AFC','#002244'],'New Orleans Saints':['NO','NFC','#9f8958'],'New York Giants':['NYG','NFC','#0b2265'],'New York Jets':['NYJ','AFC','#125740'],'Philadelphia Eagles':['PHI','NFC','#004c54'],'Pittsburgh Steelers':['PIT','AFC','#101820'],'San Francisco 49ers':['SF','NFC','#aa0000'],'Seattle Seahawks':['SEA','NFC','#002244'],'Tampa Bay Buccaneers':['TB','NFC','#d50a0a'],'Tennessee Titans':['TEN','AFC','#0c2340'],'Washington Commanders':['WAS','NFC','#5a1414']
};

const teams = ranks.qb.map(name => ({ name, ...Object.fromEntries(categories.map(c => [c.key, ranks[c.key].indexOf(name) + 1])) }));
let weights = Object.fromEntries(categories.map(c => [c.key, c.default]));

const sliders = document.querySelector('#sliders');
const body = document.querySelector('#rankingsBody');
const search = document.querySelector('#searchInput');

function buildSliders(){
  sliders.innerHTML = categories.map(c => `<div class="slider-row"><div class="slider-meta"><label class="slider-name" for="${c.key}">${c.label}</label><output class="slider-value" id="${c.key}Out">${c.default}%</output></div><input class="slider-input" id="${c.key}" data-key="${c.key}" type="range" min="0" max="100" value="${weights[c.key]}" style="--fill:${weights[c.key]}%" aria-label="${c.label} weight"></div>`).join('');
  sliders.querySelectorAll('input').forEach(input => input.addEventListener('input', e => { weights[e.target.dataset.key] = +e.target.value; render(); }));
}

function normalized(){
  const sum = Object.values(weights).reduce((a,b)=>a+b,0);
  return Object.fromEntries(categories.map(c => [c.key, sum ? weights[c.key]/sum : .2]));
}

function render(){
  const norm = normalized();
  categories.forEach(c => {
    const input = document.querySelector(`#${c.key}`);
    input.value = weights[c.key]; input.style.setProperty('--fill', `${weights[c.key]}%`);
    document.querySelector(`#${c.key}Out`).textContent = `${Math.round(norm[c.key]*100)}%`;
  });
  document.querySelector('#activeWeight').textContent = Object.values(weights).some(Boolean) ? '100%' : '20% each';
  const query = search.value.trim().toLowerCase();
  const sorted = teams.map(t => ({...t, score: categories.reduce((sum,c)=>sum + norm[c.key] * ((33-t[c.key])/32) * 100,0)})).sort((a,b)=>b.score-a.score || a.name.localeCompare(b.name));
  body.innerHTML = sorted.map((t,i) => ({...t, overall:i+1})).filter(t=>t.name.toLowerCase().includes(query)).map(t => {
    const [abbr,conf,color] = meta[t.name];
    const tone = t.overall<=10?'var(--green)':t.overall<=22?'#9c7800':'var(--orange)';
    return `<tr><td class="rank-num">${t.overall}</td><td class="team-cell"><div class="team-wrap"><span class="team-badge" style="--team:${color}">${abbr}</span><span class="team-name">${t.name}<small class="conf">${conf}</small></span></div></td><td><div class="score-wrap"><span class="score-bar"><i style="--score:${t.score}%;--tone:${tone}"></i></span><span class="score" style="--tone:${tone}">${t.score.toFixed(1)}</span></div></td>${categories.map(c=>`<td><span class="rank-pill">${t[c.key]}</span></td>`).join('')}</tr>`;
  }).join('') || '<tr><td colspan="8" style="text-align:center;height:100px">No teams found.</td></tr>';
}

document.querySelector('#resetBtn').addEventListener('click',()=>{weights=Object.fromEntries(categories.map(c=>[c.key,c.default]));render()});
document.querySelectorAll('[data-preset]').forEach(btn=>btn.addEventListener('click',()=>{
  const presets={balanced:[20,20,20,20,20],offense:[40,10,15,20,15],trenches:[15,25,15,35,10]};
  const values=presets[btn.dataset.preset]; categories.forEach((c,i)=>weights[c.key]=values[i]); render();
}));
search.addEventListener('input',render);
buildSliders(); render();
