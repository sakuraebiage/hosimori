// ===============================
// 🔷 ユニット生成
// ===============================
function createUnit(name, stats){
  return {
    name,
    hp: stats.vitality * 10,
    maxHp: stats.vitality * 10,
    stats,
    buffs: [],
    debuffs: [],
    status: [],
    hate: 0,
    speed: stats.agility
  };
}

// ===============================
// 🔷 ヘイト
// ===============================
function addHate(unit, value){
  unit.hate += value;
  if(unit.hate < 0) unit.hate = 0;
}

// ===============================
// 🔷 ターゲット選択
// ===============================
function getTargetByHate(units){
  return units.reduce((a,b)=> a.hate > b.hate ? a : b);
}

// ===============================
// 🔷 ダメージ計算
// ===============================
function calcDamage(attacker, target, skill){

  const atk = skill.type==="物理"
    ? attacker.stats.physical * 2
    : attacker.stats.magic * 2;

  const def = target.stats.endurance * 2;

  let dmg = atk * skill.power - def;

  if(dmg < 1) dmg = 1;

  return Math.floor(dmg);
}

// ===============================
// 🔷 効果適用
// ===============================
function applyEffect(attacker, target, skill){

  const e = skill.effectData;
  let logs = [];
  
  // 命中判定
let hit = attacker.stats.agility * 1.2 + attacker.stats.luck * 0.5;
let evade = target.stats.agility * 1.0;

if(Math.random()*100 > hit - evade){
  logs.push(`${target.name}にMISS！`);
  return logs;
}

  // ======================
  // 💥 ダメージ
  // ======================
  if(e.type==="damage"){
　　　if(e.type==="damage"){

  // 🔥 命中計算（ここ追加）
  let tA = attacker.stats;
  let tB = target.stats;

  let hit =
    tA.agility * 1.0 +
    tA.luck * 0.7 +
    tA.spirit * 0.5;

  let evade =
    tB.agility * 0.9 +
    tB.luck * 0.3;

  let finalHit = hit - evade;

  finalHit = Math.max(40, finalHit);
  finalHit = Math.min(95, finalHit);

  if(Math.random()*100 > finalHit){
    logs.push(`${target.name}にMISS！`);
    return logs;
  }

  // 👇ここから元のダメージ処理
  let dmg = calcDamage(attacker, target, skill);
  target.hp -= dmg;

  logs.push(`${target.name}に${dmg}ダメージ`);
    let dmg = calcDamage(attacker, target, skill);
    target.hp -= dmg;
    if(target.hp < 0) target.hp = 0;

    logs.push(`${attacker.name} → ${target.name} に ${dmg}ダメージ`);

    addHate(attacker, dmg * 0.5);

    if(e.extra){
      e.extra.forEach(x=>{

        if(x.chance && Math.random()*100 > x.chance) return;

        // 🔥 状態異常
        if(x.type==="burn"){
          target.status.push({type:"burn", duration:x.duration});
          logs.push(`🔥火傷付与`);
        }

        if(x.type==="freeze"){
          target.status.push({type:"freeze", duration:x.duration});
          logs.push(`❄凍結`);
        }

        // 🟣 デバフ
        if(x.type==="defDown"){
          target.debuffs.push(x);
          logs.push(`🟣防御低下`);
        }

        // ⚡ 追撃
        if(x.type==="multiHit"){
          for(let i=0;i<x.hits;i++){
            let extra = Math.floor(dmg * 0.3);
            target.hp -= extra;
            if(target.hp < 0) target.hp = 0;
            logs.push(`⚡追撃 ${extra}`);
          }
        }

      });
    }
  }

  // ======================
  // 💚 回復
  // ======================
  if(e.type==="heal"){

    const healPower = attacker.stats.spirit * 2;
    let heal = Math.floor(healPower * skill.power);

    target.hp += heal;
    if(target.hp > target.maxHp) target.hp = target.maxHp;

    logs.push(`${target.name} 回復 ${heal}`);

    addHate(attacker, heal * 0.3);
  }

  return logs;
}

// ===============================
// 🔷 状態異常処理（ターン終了時）
// ===============================
function applyStatusDamage(unit){

  let logs = [];

  unit.status.forEach(s=>{

    if(s.type==="burn"){
      let dmg = Math.floor(unit.maxHp * 0.05);
      unit.hp -= dmg;
      if(unit.hp < 0) unit.hp = 0;
      logs.push(`🔥${unit.name} 火傷ダメージ ${dmg}`);
    }

  });

  return logs;
}

// ===============================
// 🔷 ターン終了処理
// ===============================
function endTurn(unit){

  let logs = [];

  // 状態異常ダメージ
  logs.push(...applyStatusDamage(unit));

  // 継続ターン減少
  unit.status.forEach(s=> s.duration--);
  unit.buffs.forEach(b=> b.duration--);
  unit.debuffs.forEach(d=> d.duration--);

  // 消去
  unit.status = unit.status.filter(s=> s.duration > 0);
  unit.buffs = unit.buffs.filter(b=> b.duration > 0);
  unit.debuffs = unit.debuffs.filter(d=> d.duration > 0);

  return logs;
}

// ===============================
// 🔷 行動順（速度順）
// ===============================
function getTurnOrder(units){
  return [...units].sort((a,b)=> b.speed - a.speed);
}

// ===============================
// 🔷 生存判定
// ===============================
function isAlive(unit){
  return unit.hp > 0;
}

// ===============================
// 🔷 戦闘ループ（1ターン）
// ===============================
function runTurn(allies, enemies){

  let logs = [];

  const allUnits = [...allies, ...enemies].filter(isAlive);
  const order = getTurnOrder(allUnits);

  order.forEach(unit=>{

    if(!isAlive(unit)) return;

    const isAlly = allies.includes(unit);
    const targets = isAlly ? enemies : allies;

    const aliveTargets = targets.filter(isAlive);
    if(aliveTargets.length === 0) return;

    const target = getTargetByHate(aliveTargets);

    // 仮：通常攻撃スキル
    const skill = {
      type: unit.stats.physical > unit.stats.magic ? "物理" : "魔法",
      power: 1.0,
      effectData:{type:"damage"}
    };

    logs.push(...applyEffect(unit, target, skill));

    logs.push(...endTurn(unit));

  });

  return logs;
}