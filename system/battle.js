// ユニット生成
function createUnit(name, stats){
  return {
    name,
    hp: stats.vitality * 10,
    maxHp: stats.vitality * 10,
    stats,
    buffs: [],
    debuffs: [],
    status: [],
    hate: 0
  };
}

// ヘイト
function addHate(unit, value){
  unit.hate += value;
  if(unit.hate < 0) unit.hate = 0;
}

// ターゲット
function getTargetByHate(units){
  return units.reduce((a,b)=> a.hate > b.hate ? a : b);
}

// ダメージ
function calcDamage(attacker, target, skill){

  const atk = skill.type==="物理"
    ? attacker.stats.physical * 2
    : attacker.stats.magic * 2;

  const def = target.stats.endurance * 2;

  let dmg = atk * skill.power - def;

  if(dmg < 1) dmg = 1;

  return Math.floor(dmg);
}

// 効果適用
function applyEffect(attacker, target, skill){

  const e = skill.effectData;
  let logs = [];

  if(e.type==="damage"){

    let dmg = calcDamage(attacker, target, skill);
    target.hp -= dmg;

    logs.push(`${target.name}に${dmg}ダメージ`);

    addHate(attacker, dmg * 0.5);

    if(e.extra){
      e.extra.forEach(x=>{

        if(x.chance && Math.random()*100 > x.chance) return;

        if(x.type==="burn"){
          target.status.push({type:"burn", duration:x.duration});
          logs.push(`🔥火傷`);
        }

        if(x.type==="defDown"){
          target.debuffs.push(x);
          logs.push(`🟣防御低下`);
        }

        if(x.type==="multiHit"){
          for(let i=0;i<x.hits;i++){
            let extra = Math.floor(dmg * 0.5);
            target.hp -= extra;
            logs.push(`⚡追撃 ${extra}`);
          }
        }

      });
    }
  }

  if(e.type==="heal"){
    target.hp += e.value;
    if(target.hp > target.maxHp) target.hp = target.maxHp;

    logs.push(`${target.name}回復 ${e.value}`);

    addHate(attacker, e.value * 0.3);
  }

  return logs;
}