const TOWERS = [
  { name: "初めの塔", floors: 30, enemyRows: ["front"] },
  { name: "2番目の塔", floors: 20, enemyRows: ["front"] },
  { name: "影の塔", floors: 20, enemyRows: ["front", "back"] }
];
const TOTAL_FLOORS = TOWERS.reduce((sum, tower) => sum + tower.floors, 0);
const MAX_ROW_SIZE = 3;
const MAX_MEMBER_COUNT = 40;
const SAVE_KEY_PREFIX = "ai-jrpg-save-v1-slot";
const SAVE_SLOT_COUNT = 10;
const BGM_SETTING_KEY = "ai-jrpg-bgm-volume";
const BGM_DEFAULT_LEVEL = 5;
const BGM_MAX_LEVEL = 10;
const BGM_TRACKS = {
  policy: { name: "街", src: "audio/bgm/town.mp3" },
  dungeon: { name: "探索", src: "audio/bgm/dungeon.mp3" },
  battle: { name: "戦闘", src: "audio/bgm/dungeon.mp3" },
  event: { name: "イベント", src: "audio/bgm/event.mp3" }
};
const PHASE_LABELS = {
  policy: "内政",
  dungeon: "探索",
  event: "イベント"
};

const state = {
  turn: 1,
  phase: "policy",
  towerIndex: 0,
  floor: 1,
  clearedFloor: 0,
  gold: 0,
  policyPoints: 0,
  inBattle: false,
  townPlace: "gate",
  activeMemberIndex: 0,
  activeActor: null,
  actionQueue: [],
  enemies: [],
  members: startingMembers.map((member) => ({ ...member })),
  formation: {
    front: [],
    back: []
  },
  party: [],
  reserveMembers: recruitableMembers.map((member) => ({ ...member }))
};
state.formation.front = state.members.filter((member) => member.positionType !== "後衛").slice(0, MAX_ROW_SIZE);
state.formation.back = state.members.filter((member) => member.positionType !== "前衛" && !state.formation.front.includes(member)).slice(0, MAX_ROW_SIZE);
syncPartyFromFormation();

const els = {
  locationName: document.querySelector("#locationName"),
  towerProgress: document.querySelector("#towerProgress"),
  travelActions: document.querySelector("#travelActions"),
  statusBtn: document.querySelector("#statusBtn"),
  formationBtn: document.querySelector("#formationBtn"),
  saveBtn: document.querySelector("#saveBtn"),
  loadBtn: document.querySelector("#loadBtn"),
  bgmBtn: document.querySelector("#bgmBtn"),
  partyTitle: document.querySelector("#partyTitle"),
  closeStatusBtn: document.querySelector("#closeStatusBtn"),
  closeFormationBtn: document.querySelector("#closeFormationBtn"),
  statusDialog: document.querySelector("#statusDialog"),
  formationDialog: document.querySelector("#formationDialog"),
  statusContent: document.querySelector("#statusContent"),
  formationContent: document.querySelector("#formationContent"),
  party: document.querySelector("#party"),
  battleTitle: document.querySelector("#battleTitle"),
  gold: document.querySelector("#gold"),
  enemyArea: document.querySelector("#enemyArea"),
  commandArea: document.querySelector("#commandArea"),
  log: document.querySelector("#log")
};

els.statusBtn.addEventListener("click", openStatus);
els.closeStatusBtn.addEventListener("click", () => els.statusDialog.close());
els.formationBtn.addEventListener("click", openFormation);
els.closeFormationBtn.addEventListener("click", () => els.formationDialog.close());
els.saveBtn.addEventListener("click", openSaveSlots);
els.loadBtn.addEventListener("click", openLoadSlots);
els.bgmBtn.addEventListener("click", toggleBgm);

const bgmAudio = new Audio();
bgmAudio.loop = true;
let bgmLevel = Number(localStorage.getItem(BGM_SETTING_KEY));
if (!Number.isInteger(bgmLevel) || bgmLevel < 0 || bgmLevel > BGM_MAX_LEVEL) {
  bgmLevel = localStorage.getItem("ai-jrpg-bgm-enabled") === "on" ? BGM_DEFAULT_LEVEL : 0;
}
let missingBgmLogged = false;
bgmAudio.addEventListener("error", () => {
  if (missingBgmLogged) return;
  missingBgmLogged = true;
  addLog("BGMファイルが見つかりません。audio/bgm/ に魔王魂の音源を置いてください。");
});

function renderSprite(patternName, paletteName) {
  const pattern = spritePatterns[patternName] || spritePatterns.勇者;
  const palette = spritePalettes[paletteName];
  const width = pattern[0].length;
  const height = pattern.length;
  const pixels = pattern.flatMap((row, y) =>
    [...row].map((key, x) => {
      const color = palette[key];
      return color ? `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"></rect>` : "";
    })
  ).join("");

  return `
    <svg class="pixel-icon ${paletteName}-sprite" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" aria-hidden="true" shape-rendering="crispEdges">
      ${pixels}
    </svg>
  `;
}

function currentTower() {
  return TOWERS[state.towerIndex];
}

function currentTotalFloor() {
  return TOWERS.slice(0, state.towerIndex).reduce((sum, tower) => sum + tower.floors, 0) + state.floor;
}

function isFinalTowerFloor() {
  return state.towerIndex === TOWERS.length - 1 && state.floor === currentTower().floors;
}

function openTowerSelect() {
  if (state.inBattle || state.phase !== "policy") return;
  state.townPlace = "tower";
  render();
}

function startDungeonExploration(towerIndex) {
  if (state.inBattle || state.phase !== "policy" || !isTowerUnlocked(towerIndex)) return;
  state.towerIndex = towerIndex;
  state.floor = 1;
  state.phase = "dungeon";
  state.townPlace = "gate";
  state.enemies = [];
  addLog(`第${state.turn}ターンの探索を始めた。${currentTower().name}1階から登る。`);
  render();
}

function isTowerUnlocked(towerIndex) {
  if (towerIndex === 0) return true;
  const requiredClearedFloor = TOWERS.slice(0, towerIndex).reduce((sum, tower) => sum + tower.floors, 0);
  return state.clearedFloor >= requiredClearedFloor;
}

function climbDungeonFloor() {
  if (state.inBattle || state.phase !== "dungeon") return;
  if (state.clearedFloor >= TOTAL_FLOORS) {
    addLog("すべての塔は踏破済みだ。街へ帰ろう。");
    render();
    return;
  }
  state.enemies = [];
  addLog(`${currentTower().name}${state.floor}階へ登った。`);
  startBattle(state.floor === currentTower().floors);
}

function returnFromDungeon() {
  if (state.inBattle || state.phase !== "dungeon") return;
  state.phase = "event";
  state.enemies = [];
  addLog("街へ帰還した。探索ターンを終え、イベントターンへ進む。");
  render();
}

function openShop() {
  if (state.inBattle || state.phase !== "policy") return;
  state.townPlace = "shop";
  addLog("武器防具屋に入った。");
  render();
}

function returnTownGate() {
  if (state.inBattle || state.phase !== "policy") return;
  state.townPlace = "gate";
  render();
}

function finishEventTurn() {
  if (state.inBattle || state.phase !== "event") return;

  const joined = recruitMembers("イベント");
  if (joined === 0) {
    resolveEvent();
  }

  state.turn += 1;
  startPolicyTurn();
  render();
}

function startPolicyTurn() {
  state.phase = "policy";
  state.townPlace = "gate";
  fullHeal();
  recruitMembers("内政");

  const gainedPoints = totalPolicyPower();
  state.policyPoints += gainedPoints;
  addLog(`第${state.turn}ターン内政開始。内政Pが${gainedPoints}増えた。`);
}

function upgradeEquipment(kind, memberIndex) {
  const member = state.party[memberIndex];
  if (!member) return;

  const gradeKey = kind === "weapon" ? "weaponGrade" : "armorGrade";
  const bonusKey = kind === "weapon" ? "weaponAtk" : "armorDef";
  const statKey = kind === "weapon" ? "atk" : "def";
  const baseKey = kind === "weapon" ? "weaponBase" : "armorBase";
  const equipKey = kind;
  const currentGrade = member[gradeKey] || 0;
  const nextGrade = equipmentGrades[currentGrade + 1];

  if (!nextGrade) {
    addLog(`${member.name}の${kind === "weapon" ? "武器" : "防具"}はこれ以上強化できない。`);
    render();
    return;
  }
  if (state.gold < nextGrade.price) {
    addLog("ゴールドが足りない。");
    render();
    return;
  }

  const nextBonus = kind === "weapon" ? nextGrade.atk : nextGrade.def;
  state.gold -= nextGrade.price;
  member[statKey] = member[statKey] - member[bonusKey] + nextBonus;
  member[bonusKey] = nextBonus;
  member[gradeKey] = currentGrade + 1;
  member[equipKey] = `${nextGrade.name}の${member[baseKey]}`;

  addLog(`${member.name}の${kind === "weapon" ? "武器" : "防具"}を${nextGrade.name}製に強化した。`);
  render();
}

function fullHeal() {
  state.members.forEach((member) => {
    member.hp = member.maxHp;
    member.mp = member.maxMp;
  });
}

function totalPolicyPower() {
  return state.members.reduce((sum, member) => sum + (member.policy || 0), 0);
}

function syncPartyFromFormation() {
  state.party = [...state.formation.front, ...state.formation.back];
  normalizeAttackRanges(state.party);
}

function canPlaceInRow(member, row) {
  return member.positionType === "両方" || (row === "front" ? member.positionType === "前衛" : member.positionType === "後衛");
}

function getMemberRow(member) {
  if (state.formation.front.includes(member)) return "front";
  if (state.formation.back.includes(member)) return "back";
  return null;
}

function attackRange(actor) {
  const range = Number(actor?.range);
  return Number.isFinite(range) ? range : defaultAttackRange(actor);
}

function defaultAttackRange(actor) {
  if (!actor) return 1;
  if (actor.name === "天塔竜") return 3;

  const templates = [...startingMembers, ...recruitableMembers, ...monsters];
  const template = templates.find((entry) => entry.name === actor.name)
    || templates.find((entry) => entry.job && entry.job === actor.job);
  return Number(template?.range) || 1;
}

function normalizeAttackRanges(actors) {
  actors.forEach((actor) => {
    if (!Number.isFinite(Number(actor.range))) {
      actor.range = defaultAttackRange(actor);
    }
  });
}

function livingActorsInRow(actors, row, rowOf) {
  return actors.filter((actor) => actor.hp > 0 && rowOf(actor) === row);
}

function canTargetByRange(attacker, attackerRow, target, defenders, rowOfTarget) {
  const range = attackRange(attacker);
  if (range >= 3) return true;

  const targetRow = rowOfTarget(target) || "front";
  const hasFrontDefender = livingActorsInRow(defenders, "front", rowOfTarget).length > 0;

  if (range <= 1) {
    return attackerRow === "front" && (targetRow === "front" || !hasFrontDefender);
  }

  if (attackerRow === "front") return true;
  return targetRow === "front" || !hasFrontDefender;
}

function reachableTargets(attacker, attackerRow, defenders, rowOfTarget) {
  return defenders.filter((target) =>
    target.hp > 0 && canTargetByRange(attacker, attackerRow, target, defenders, rowOfTarget)
  );
}

function rowOfEnemy(enemy) {
  return enemy.row || "front";
}

function activePartyReachableEnemies(member) {
  return reachableTargets(member, getMemberRow(member), state.enemies, rowOfEnemy);
}

function placeMemberInFormation(member) {
  const preferredRows = member.positionType === "後衛" ? ["back"] : member.positionType === "前衛" ? ["front"] : ["front", "back"];
  for (const row of preferredRows) {
    if (state.formation[row].length < MAX_ROW_SIZE) {
      state.formation[row].push(member);
      syncPartyFromFormation();
      return row;
    }
  }
  return null;
}

function startBattle(isBoss) {
  state.inBattle = true;
  if (els.statusDialog.open) els.statusDialog.close();
  state.enemies = createEnemies(isBoss);
  addLog(isBoss ? "最上階の主が立ちはだかった！" : "魔物があらわれた！");
  startActionRound();
  advanceBattleTurn();
  render();
}

function createEnemies(isBoss) {
  const rows = enemyRowsForCurrentTower();
  if (isBoss) {
    const bossName = isFinalTowerFloor() ? "天塔竜" : "塔の番人";
    const bossStats = isFinalTowerFloor()
      ? { name: bossName, range: 3, hp: 170, atk: 22, def: 8, agi: 8, exp: 180, gold: 250 }
      : { name: bossName, range: 1, hp: 95, atk: 17, def: 6, agi: 5, exp: 80, gold: 90 };
    return [makeEnemy(bossStats, "front")];
  }

  const maxEnemies = rows.length * MAX_ROW_SIZE;
  const maxRoll = rows.length > 1 ? maxEnemies : (currentTotalFloor() > 12 ? 3 : 2);
  const count = Math.min(maxEnemies, 1 + Math.floor(Math.random() * maxRoll));
  return Array.from({ length: count }, (_, enemySlot) => {
    const index = Math.min(monsters.length - 1, Math.floor(currentTotalFloor() / 10) + Math.floor(Math.random() * 2));
    const row = rows[Math.min(rows.length - 1, Math.floor(enemySlot / MAX_ROW_SIZE))] || "front";
    return makeEnemy(monsters[index], row);
  });
}

function enemyRowsForCurrentTower() {
  return currentTower().enemyRows || ["front", "back"];
}

function makeEnemy(template, row = "front") {
  const scale = 1 + Math.floor(currentTotalFloor() / 8) * 0.18;
  const maxHp = Math.round(template.hp * scale);
  return {
    ...template,
    row,
    range: attackRange(template),
    maxHp,
    hp: maxHp,
    atk: Math.round(template.atk * scale),
    def: Math.round(template.def * scale),
    agi: Math.max(1, Math.round(template.agi * scale))
  };
}

function performAction(kind, targetIndex) {
  if (!state.inBattle || state.activeActor?.type !== "party") return;

  const member = state.activeActor.actor;
  if (!member || member.hp <= 0) return;

  const reachableEnemies = activePartyReachableEnemies(member);
  const target = Number.isInteger(targetIndex)
    ? state.enemies[targetIndex]
    : reachableEnemies[0];
  if ((kind === "attack" || kind === "spell") && (!target || target.hp <= 0)) {
    addLog("攻撃する相手を選べない。");
    render();
    return;
  }
  if ((kind === "attack" || kind === "spell") && !reachableEnemies.includes(target)) {
    addLog(`${member.name}の射程では届かない。`);
    render();
    return;
  }

  if (kind === "attack") {
    const damage = calculateDamage(member.atk, target.def);
    target.hp = Math.max(0, target.hp - damage);
    addLog(`${member.name}の攻撃。${target.name}に${damage}ダメージ。`);
  }

  if (kind === "heal") {
    if (member.mp < 4) {
      addLog(`${member.name}はMPが足りない。`);
    } else {
      member.mp -= 4;
      const ally = mostWoundedAlly();
      const amount = 18 + member.level * 3;
      ally.hp = Math.min(ally.maxHp, ally.hp + amount);
      addLog(`${member.name}はヒールを唱えた。${ally.name}のHPが${amount}回復。`);
    }
  }

  if (kind === "spell") {
    if (member.mp < 5) {
      addLog(`${member.name}はMPが足りない。`);
    } else {
      member.mp -= 5;
      const damage = 18 + member.level * 4 + Math.floor(Math.random() * 6);
      target.hp = Math.max(0, target.hp - damage);
      addLog(`${member.name}はファイアを唱えた。${target.name}に${damage}ダメージ。`);
    }
  }

  if (allEnemiesDefeated()) {
    winBattle();
    return;
  }

  advanceBattleTurn();
  render();
}

function startActionRound() {
  state.actionQueue = [
    ...state.party.filter((member) => member.hp > 0).map((member) => makeActionEntry("party", member)),
    ...state.enemies.filter((enemy) => enemy.hp > 0).map((enemy) => makeActionEntry("enemy", enemy))
  ].sort((a, b) => b.order - a.order);
  addLog("敏捷順の行動順が決まった。");
}

function makeActionEntry(type, actor) {
  return {
    type,
    actor,
    order: actor.agi * (0.8 + Math.random() * 0.4)
  };
}

function advanceBattleTurn() {
  while (state.inBattle) {
    if (allEnemiesDefeated()) {
      winBattle();
      return;
    }
    if (state.party.every((member) => member.hp <= 0)) {
      loseBattle();
      return;
    }
    if (state.actionQueue.length === 0) {
      startActionRound();
    }

    const entry = state.actionQueue.shift();
    if (!entry || !canActorAct(entry)) continue;

    state.activeActor = entry;
    if (entry.type === "party") {
      state.activeMemberIndex = state.party.indexOf(entry.actor);
      return;
    }

    enemyAct(entry.actor);
  }
}

function canActorAct(entry) {
  if (entry.actor.hp <= 0) return false;
  if (entry.type === "party") return state.party.includes(entry.actor);
  return state.enemies.includes(entry.actor);
}

function enemyAct(enemy) {
  const targets = reachableTargets(enemy, rowOfEnemy(enemy), state.party, getMemberRow);
  if (targets.length === 0) {
    addLog(`${enemy.name}は射程内に攻撃できる相手がいない。`);
    return;
  }

  const target = targets[Math.floor(Math.random() * targets.length)];
  const damage = calculateDamage(enemy.atk, target.def);
  target.hp = Math.max(0, target.hp - damage);
  addLog(`${enemy.name}の攻撃。${target.name}に${damage}ダメージ。`);
}

function calculateDamage(atk, def) {
  return Math.max(1, atk - Math.floor(def / 2) + Math.floor(Math.random() * 5));
}

function nextLivingPartyIndex(start) {
  for (let offset = 0; offset < state.party.length; offset += 1) {
    const index = (start + offset) % state.party.length;
    if (state.party[index].hp > 0) return index;
  }
  return -1;
}

function mostWoundedAlly() {
  return state.party
    .filter((member) => member.hp > 0)
    .sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))[0];
}

function allEnemiesDefeated() {
  return state.enemies.every((enemy) => enemy.hp <= 0);
}

function winBattle() {
  const exp = state.enemies.reduce((sum, enemy) => sum + enemy.exp, 0);
  const gold = state.enemies.reduce((sum, enemy) => sum + enemy.gold, 0);
  state.gold += gold;
  state.inBattle = false;
  state.activeActor = null;
  state.actionQueue = [];
  state.enemies = [];
  state.clearedFloor = Math.max(state.clearedFloor, currentTotalFloor());

  addLog(`勝利！ 経験値${exp}、${gold}Gを手に入れた。`);
  state.party.forEach((member) => gainExp(member, exp));

  if (isFinalTowerFloor()) {
    addLog("2番目の塔を踏破した。すべての塔に静けさが戻った。");
  } else if (state.floor === currentTower().floors) {
    const clearedTowerName = currentTower().name;
    const nextTower = TOWERS[state.towerIndex + 1];
    addLog(`${clearedTowerName}を踏破した。次は${nextTower.name}へ向かえる。`);
  } else {
    state.floor += 1;
    addLog(`${currentTower().name}${state.floor}階へ進めるようになった。帰るまでは探索ターンが続く。`);
    render();
    return;
  }

  state.phase = "event";
  state.townPlace = "gate";
  addLog("探索ターンを終え、イベントターンへ進む。");
  render();
}

function recruitMembers(source) {
  let joined = 0;
  while (state.members.length < MAX_MEMBER_COUNT) {
    const recruitIndex = state.reserveMembers.findIndex((member) => member.joinFloor <= state.clearedFloor);
    if (recruitIndex === -1) return joined;

    const [member] = state.reserveMembers.splice(recruitIndex, 1);
    const joinFloor = member.joinFloor;
    delete member.joinFloor;
    prepareRecruit(member);
    state.members.push(member);
    placeMemberInFormation(member);
    joined += 1;
    addLog(`${source}ターン。${joinFloor}階の縁で${member.name}が仲間になった！`);
  }
  return joined;
}

function prepareRecruit(member) {
  member.level = 1;
  member.exp = 0;
  member.hp = member.maxHp;
  member.mp = member.maxMp;
}

function gainExp(member, exp) {
  if (member.hp <= 0) member.hp = 1;
  member.exp += exp;

  while (member.exp >= member.level * 22) {
    member.exp -= member.level * 22;
    member.level += 1;
    const growth = member.growth || DEFAULT_GROWTH;
    member.maxHp += rollGrowth(growth.hp);
    member.maxMp += rollGrowth(growth.mp);
    member.atk += rollGrowth(growth.atk);
    member.def += rollGrowth(growth.def);
    member.agi += rollGrowth(growth.agi);
    addLog(`${member.name}はレベル${member.level}に上がった！`);
  }
}

function rollGrowth(value) {
  if (Array.isArray(value)) {
    const [min, max] = value;
    return min + Math.floor(Math.random() * (max - min + 1));
  }
  return value || 0;
}

function loseBattle() {
  const lostGold = Math.ceil(state.gold / 2);
  state.gold = Math.floor(state.gold / 2);
  state.inBattle = false;
  state.activeActor = null;
  state.actionQueue = [];
  state.phase = "event";
  state.townPlace = "gate";
  state.enemies = [];
  addLog(`全滅した。所持Gを${lostGold}G失い、イベントターンへ移行した。`);
  render();
}

function resolveEvent() {
  const event = Math.floor(Math.random() * 3);
  if (event === 0) {
    const foundGold = 15 + currentTotalFloor() * 2;
    state.gold += foundGold;
    addLog(`イベントターン。商隊の護衛を手伝い、${foundGold}Gを得た。`);
    return;
  }
  if (event === 1) {
    state.party.forEach((member) => {
      member.hp = Math.min(member.maxHp, member.hp + 8 + currentTotalFloor());
    });
    addLog("イベントターン。旅の治療師に出会い、全員のHPが少し回復した。");
    return;
  }
  addLog("イベントターン。街道は静かだった。次の探索に備える。");
}

function openStatus() {
  if (state.inBattle) return;
  renderStatus();
  els.statusDialog.showModal();
}

function openFormation() {
  renderFormation();
  els.formationDialog.showModal();
}

function removeFromFormation(memberIndex) {
  const member = state.members[memberIndex];
  if (!member) return;

  const row = getMemberRow(member);
  if (!row) return;
  if (state.inBattle && state.activeActor?.type === "party" && state.activeActor.actor === member) {
    addLog(`${member.name}は行動中なので編成から外せない。`);
    renderFormation();
    return;
  }
  if (state.party.length <= 1) {
    addLog("編成には最低1人が必要だ。");
    renderFormation();
    return;
  }

  state.formation[row] = state.formation[row].filter((ally) => ally !== member);
  syncPartyFromFormation();
  addLog(`${member.name}を編成から外した。`);
  normalizeActiveMember();
  render();
  renderFormation();
}

function moveMemberToBench(memberIndex) {
  removeFromFormation(memberIndex);
}

function placeFormationMember(memberIndex, row) {
  const member = state.members[memberIndex];
  if (!member) return;

  if (!canPlaceInRow(member, row)) {
    addLog(`${member.name}は${row === "front" ? "前衛" : "後衛"}に配置できない。`);
    renderFormation();
    return;
  }
  if (state.formation[row].length >= MAX_ROW_SIZE) {
    addLog(`${row === "front" ? "前衛" : "後衛"}は最大${MAX_ROW_SIZE}人までだ。`);
    renderFormation();
    return;
  }

  const currentRow = getMemberRow(member);
  if (currentRow) {
    state.formation[currentRow] = state.formation[currentRow].filter((ally) => ally !== member);
  }
  state.formation[row].push(member);
  syncPartyFromFormation();
  addLog(`${member.name}を${row === "front" ? "前衛" : "後衛"}に配置した。`);
  normalizeActiveMember();
  render();
  renderFormation();
}

function handleFormationDrop(memberIndex, target) {
  if (target === "bench") {
    moveMemberToBench(memberIndex);
    return;
  }
  placeFormationMember(memberIndex, target);
}

function normalizeActiveMember() {
  if (state.party.length === 0) return;
  if (state.activeMemberIndex >= state.party.length) {
    state.activeMemberIndex = 0;
  }
  if (state.inBattle && state.party[state.activeMemberIndex]?.hp <= 0) {
    const nextIndex = nextLivingPartyIndex(0);
    if (nextIndex === -1) {
      loseBattle();
      return;
    }
    state.activeMemberIndex = nextIndex;
  }
  if (state.inBattle && state.activeActor?.type === "party" && !state.party.includes(state.activeActor.actor)) {
    state.activeActor = null;
    advanceBattleTurn();
  }
}

function addLog(message) {
  const line = document.createElement("p");
  line.textContent = message;
  els.log.prepend(line);
}

function currentBgmTrack() {
  if (state.inBattle) return BGM_TRACKS.battle;
  return BGM_TRACKS[state.phase] || BGM_TRACKS.policy;
}

function toggleBgm() {
  bgmLevel = (bgmLevel + 1) % (BGM_MAX_LEVEL + 1);
  localStorage.setItem(BGM_SETTING_KEY, String(bgmLevel));
  updateBgm();
}

function updateBgm() {
  els.bgmBtn.textContent = `BGM ${bgmLevel}`;
  bgmAudio.volume = bgmLevel / BGM_MAX_LEVEL;
  if (bgmLevel === 0) {
    bgmAudio.pause();
    return;
  }

  const track = currentBgmTrack();
  if (!bgmAudio.src.endsWith(track.src)) {
    bgmAudio.src = track.src;
  }
  bgmAudio.play().catch(() => {
    els.bgmBtn.textContent = `BGM ${bgmLevel} START`;
  });
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function memberIndex(member) {
  return state.members.indexOf(member);
}

function serializeActionEntry(entry) {
  if (!entry) return null;
  const index = entry.type === "party" ? memberIndex(entry.actor) : state.enemies.indexOf(entry.actor);
  if (index < 0) return null;
  return { type: entry.type, index, order: entry.order };
}

function deserializeActionEntry(entry) {
  if (!entry) return null;
  const actor = entry.type === "party" ? state.members[entry.index] : state.enemies[entry.index];
  if (!actor) return null;
  return { type: entry.type, actor, order: entry.order };
}

function canSaveGame() {
  return state.phase === "policy" && !state.inBattle;
}

function saveSlotKey(slot) {
  return `${SAVE_KEY_PREFIX}-${slot}`;
}

function readSaveSlot(slot) {
  const rawSave = localStorage.getItem(saveSlotKey(slot));
  if (!rawSave) return null;
  try {
    return JSON.parse(rawSave);
  } catch (error) {
    return null;
  }
}

function buildSavePayload(slot) {
  return {
    version: 1,
    slot,
    savedAt: new Date().toLocaleString("ja-JP"),
    summary: `第${state.turn}T ${PHASE_LABELS[state.phase]} / ${state.gold}G / 仲間${state.members.length}人`,
    turn: state.turn,
    phase: state.phase,
    towerIndex: state.towerIndex,
    floor: state.floor,
    clearedFloor: state.clearedFloor,
    gold: state.gold,
    policyPoints: state.policyPoints,
    inBattle: state.inBattle,
    townPlace: state.townPlace,
    activeMemberIndex: state.activeMemberIndex,
    activeActor: serializeActionEntry(state.activeActor),
    actionQueue: state.actionQueue.map(serializeActionEntry).filter(Boolean),
    enemies: cloneData(state.enemies),
    members: cloneData(state.members),
    reserveMembers: cloneData(state.reserveMembers),
    formation: {
      front: state.formation.front.map(memberIndex).filter((index) => index >= 0),
      back: state.formation.back.map(memberIndex).filter((index) => index >= 0)
    },
    logs: [...els.log.querySelectorAll("p")].slice(0, 40).map((line) => line.textContent)
  };
}

function applySavePayload(payload) {
  if (!payload || payload.version !== 1) throw new Error("Unsupported save data");

  state.turn = payload.turn;
  state.phase = payload.phase;
  state.towerIndex = payload.towerIndex;
  state.floor = payload.floor;
  state.clearedFloor = payload.clearedFloor;
  state.gold = payload.gold;
  state.policyPoints = payload.policyPoints;
  state.inBattle = payload.inBattle;
  state.townPlace = payload.townPlace;
  state.activeMemberIndex = payload.activeMemberIndex || 0;
  state.members = cloneData(payload.members || []);
  state.reserveMembers = cloneData(payload.reserveMembers || []);
  state.enemies = cloneData(payload.enemies || []);
  normalizeAttackRanges(state.members);
  normalizeAttackRanges(state.reserveMembers);
  normalizeAttackRanges(state.enemies);
  state.formation.front = (payload.formation?.front || [])
    .map((index) => state.members[index])
    .filter(Boolean)
    .slice(0, MAX_ROW_SIZE);
  state.formation.back = (payload.formation?.back || [])
    .map((index) => state.members[index])
    .filter(Boolean)
    .slice(0, MAX_ROW_SIZE);
  syncPartyFromFormation();
  state.actionQueue = (payload.actionQueue || []).map(deserializeActionEntry).filter(Boolean);
  state.activeActor = deserializeActionEntry(payload.activeActor);
  if (state.inBattle && !state.activeActor) {
    advanceBattleTurn();
  }
  normalizeActiveMember();

  els.log.innerHTML = "";
  (payload.logs || []).slice().reverse().forEach(addLog);
}

function openSaveSlots() {
  if (!canSaveGame()) {
    addLog("セーブは内政ターンの街でだけできます。");
    return;
  }
  renderSaveSlots("save");
}

function openLoadSlots() {
  renderSaveSlots("load");
}

function renderSaveSlots(mode) {
  els.battleTitle.textContent = mode === "save" ? "セーブ" : "ロード";
  els.enemyArea.innerHTML = Array.from({ length: SAVE_SLOT_COUNT }, (_, index) => {
    const slot = index + 1;
    const payload = readSaveSlot(slot);
    const disabled = mode === "load" && !payload;
    return `
      <article class="enemy-card save-slot-card">
        <div class="name-line"><span>スロット ${slot}</span><span>${payload ? payload.savedAt : "空き"}</span></div>
        <div class="stat-line">${payload ? payload.summary : "保存データなし"}</div>
        <div class="shop-buyers">
          <button type="button" data-save-slot="${slot}" data-save-mode="${mode}" ${disabled ? "disabled" : ""}>
            ${mode === "save" ? "ここにセーブ" : "ロード"}
          </button>
        </div>
      </article>
    `;
  }).join("");
  els.commandArea.innerHTML = `<button type="button" data-save-cancel>戻る</button>`;
  els.enemyArea.querySelectorAll("[data-save-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      const slot = Number(button.dataset.saveSlot);
      if (button.dataset.saveMode === "save") saveGame(slot);
      if (button.dataset.saveMode === "load") loadGame(slot);
    });
  });
  els.commandArea.querySelector("[data-save-cancel]").addEventListener("click", render);
}

function saveGame(slot) {
  if (!canSaveGame()) {
    addLog("セーブは内政ターンの街でだけできます。");
    return;
  }
  try {
    localStorage.setItem(saveSlotKey(slot), JSON.stringify(buildSavePayload(slot)));
    addLog(`スロット${slot}にセーブしました。`);
    renderSaveSlots("save");
  } catch (error) {
    addLog("セーブに失敗しました。");
  }
}

function loadGame(slot) {
  const payload = readSaveSlot(slot);
  if (!payload) {
    addLog(`スロット${slot}にセーブデータがありません。`);
    return;
  }

  try {
    applySavePayload(payload);
    addLog(`スロット${slot}からロードしました。`);
    if (els.statusDialog.open) renderStatus();
    if (els.formationDialog.open) renderFormation();
    render();
  } catch (error) {
    addLog("ロードに失敗しました。");
  }
}

function render() {
  els.locationName.textContent = `第${state.turn}T ${PHASE_LABELS[state.phase]}`;
  els.towerProgress.style.height = `${Math.max(2, (state.clearedFloor / TOTAL_FLOORS) * 100)}%`;
  els.gold.textContent = `${state.gold} G / 内政P ${state.policyPoints}`;
  els.statusBtn.disabled = state.inBattle;
  els.saveBtn.disabled = !canSaveGame();
  els.partyTitle.textContent = `前衛${state.formation.front.length} / 後衛${state.formation.back.length} / 仲間${state.members.length}人`;

  renderTravelActions();
  renderParty();
  renderBattleWithEnemyRows();
  if (els.statusDialog.open) renderStatus();
  if (els.formationDialog.open) renderFormation();
  updateBgm();
}

function renderTravelActions() {
  if (state.inBattle) {
    els.travelActions.innerHTML = `
      <button type="button" disabled>探索中</button>
      <button type="button" disabled>戦闘中</button>
    `;
    return;
  }

  if (state.phase === "policy") {
    els.travelActions.innerHTML = `
      <button type="button" data-town="tower">探索へ</button>
      <button type="button" data-town="shop">武器防具屋</button>
    `;
    els.travelActions.querySelector('[data-town="tower"]').addEventListener("click", openTowerSelect);
    els.travelActions.querySelector('[data-town="shop"]').addEventListener("click", openShop);
    return;
  }

  if (state.phase === "event") {
    els.travelActions.innerHTML = `
      <button type="button" data-event="finish">イベント処理</button>
      <button type="button" disabled>次は内政</button>
    `;
    els.travelActions.querySelector('[data-event="finish"]').addEventListener("click", finishEventTurn);
    return;
  }

  els.travelActions.innerHTML = `
    <button type="button" data-dungeon="climb" ${state.clearedFloor >= TOTAL_FLOORS ? "disabled" : ""}>登る</button>
    <button type="button" data-dungeon="return">帰る</button>
  `;
  els.travelActions.querySelector('[data-dungeon="climb"]').addEventListener("click", climbDungeonFloor);
  els.travelActions.querySelector('[data-dungeon="return"]').addEventListener("click", returnFromDungeon);
}

function renderParty() {
  els.party.innerHTML = `
    ${renderPartyRow("前衛", state.formation.front)}
    ${renderPartyRow("後衛", state.formation.back)}
  `;
}

function renderPartyRow(label, members) {
  return `
    <section class="party-row">
      <div class="party-row-title">${label}</div>
      <div class="party-row-grid">
        ${members.map(renderPartyMemberCard).join("") || `<div class="empty-slot">空き</div>`}
      </div>
    </section>
  `;
}

function renderPartyMemberCard(member) {
    const active = state.inBattle && state.activeActor?.type === "party" && state.activeActor.actor === member;
    return `
      <article class="member-card ${member.hp <= 0 ? "defeated" : ""} ${active ? "acting" : ""}">
        <div class="name-line">
          <span class="name-with-icon">${renderSprite(member.job, "hero")}<span>${member.name}</span></span>
          <span>Lv ${member.level}</span>
        </div>
        <div class="stat-line">HP ${member.hp}/${member.maxHp} / 射程 ${attackRange(member)}</div>
        <div class="stat-line">MP ${member.mp}/${member.maxMp}</div>
      </article>
    `;
}

function renderBattle() {
  if (state.phase === "policy") {
    renderTown();
    return;
  }

  if (state.phase === "event") {
    renderEvent();
    return;
  }

  els.battleTitle.textContent = state.inBattle ? "戦闘中" : "探索中";
  const member = state.activeActor?.type === "party" ? state.activeActor.actor : null;
  const canHeal = state.inBattle && member && (member.job === "僧侶" || member.job === "勇者");
  const canSpell = state.inBattle && member && (member.job === "魔法使い" || member.job === "勇者");

  els.enemyArea.innerHTML = state.enemies.length === 0
    ? `<div class="enemy-card town-card">
        <div class="name-line"><span>${currentTower().name}${state.floor}階</span><span>探索中</span></div>
        <div class="stat-line">登ると戦闘が始まる。帰るを選ぶまで、ダンジョン探索ターンは続く。</div>
      </div>`
    : state.enemies.map((enemy, enemyIndex) => {
      return `
        <article class="enemy-card ${enemy.hp <= 0 ? "defeated" : ""}">
          <div class="name-line">
            <span class="name-with-icon">${renderSprite(enemy.name, "monster")}<span>${enemy.name}</span></span>
            <span>${enemy.hp > 0 ? "敵" : "撃破"}</span>
          </div>
          <div class="stat-line">HP ${enemy.hp}/${enemy.maxHp} / 射程 ${attackRange(enemy)} / 敏捷 ${enemy.agi}</div>
          ${state.inBattle && enemy.hp > 0 ? `
            <div class="enemy-actions">
              <button type="button" data-target-action="attack" data-enemy="${enemyIndex}" ${member && activePartyReachableEnemies(member).includes(enemy) ? "" : "disabled"}>攻撃</button>
              <button type="button" data-target-action="spell" data-enemy="${enemyIndex}" ${canSpell && activePartyReachableEnemies(member).includes(enemy) ? "" : "disabled"}>魔法</button>
            </div>
          ` : ""}
        </article>
      `;
    }).join("");

  if (!state.inBattle) {
    els.commandArea.innerHTML = "";
    return;
  }

  els.commandArea.innerHTML = `
    <button type="button" data-action="heal" ${canHeal ? "" : "disabled"}>回復</button>
  `;

  els.commandArea.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => performAction(button.dataset.action));
  });
  els.enemyArea.querySelectorAll("button[data-target-action]").forEach((button) => {
    button.addEventListener("click", () => {
      performAction(button.dataset.targetAction, Number(button.dataset.enemy));
    });
  });
}

function renderBattleWithEnemyRows() {
  if (state.phase === "policy") {
    renderTown();
    return;
  }

  if (state.phase === "event") {
    renderEvent();
    return;
  }

  els.battleTitle.textContent = state.inBattle ? "戦闘中" : "探索中";
  const member = state.activeActor?.type === "party" ? state.activeActor.actor : null;
  const canHeal = state.inBattle && member && (member.job === "僧侶" || member.job === "勇者");
  const canSpell = state.inBattle && member && (member.job === "魔法使い" || member.job === "勇者");

  els.enemyArea.innerHTML = state.enemies.length === 0
    ? `<div class="enemy-card town-card">
        <div class="name-line"><span>${currentTower().name}${state.floor}階</span><span>探索中</span></div>
        <div class="stat-line">登ると戦闘が始まる。帰るを選ぶまで、ダンジョン探索ターンは続く。</div>
      </div>`
    : renderEnemyRows(canSpell);

  if (!state.inBattle) {
    els.commandArea.innerHTML = "";
    return;
  }

  els.commandArea.innerHTML = `
    <button type="button" data-action="heal" ${canHeal ? "" : "disabled"}>回復</button>
  `;

  els.commandArea.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => performAction(button.dataset.action));
  });
  els.enemyArea.querySelectorAll("button[data-target-action]").forEach((button) => {
    button.addEventListener("click", () => {
      performAction(button.dataset.targetAction, Number(button.dataset.enemy));
    });
  });
}

function renderEnemyRows(canSpell) {
  return `
    <section class="enemy-formation">
      ${renderEnemyRow("前列", "front", canSpell)}
      ${renderEnemyRow("後列", "back", canSpell)}
    </section>
  `;
}

function renderEnemyRow(label, row, canSpell) {
  const enemies = state.enemies
    .map((enemy, enemyIndex) => ({ enemy, enemyIndex }))
    .filter((entry) => (entry.enemy.row || "front") === row);
  if (enemies.length === 0 && row === "back") return "";

  return `
    <section class="enemy-row">
      <div class="party-row-title">${label}</div>
      <div class="enemy-row-grid">
        ${enemies.map(({ enemy, enemyIndex }) => renderEnemyCard(enemy, enemyIndex, canSpell)).join("") || `<div class="empty-slot">空き</div>`}
      </div>
    </section>
  `;
}

function renderEnemyCard(enemy, enemyIndex, canSpell) {
  const member = state.activeActor?.type === "party" ? state.activeActor.actor : null;
  const canReach = member && activePartyReachableEnemies(member).includes(enemy);
  return `
    <article class="enemy-card ${enemy.hp <= 0 ? "defeated" : ""}">
      <div class="name-line">
        <span class="name-with-icon">${renderSprite(enemy.name, "monster")}<span>${enemy.name}</span></span>
        <span>${enemy.hp > 0 ? "敵" : "撃破"}</span>
      </div>
      <div class="stat-line">HP ${enemy.hp}/${enemy.maxHp} / 射程 ${attackRange(enemy)} / 敏捷 ${enemy.agi}</div>
      ${state.inBattle && enemy.hp > 0 ? `
        <div class="enemy-actions">
          <button type="button" data-target-action="attack" data-enemy="${enemyIndex}" ${canReach ? "" : "disabled"}>攻撃</button>
          <button type="button" data-target-action="spell" data-enemy="${enemyIndex}" ${canSpell && canReach ? "" : "disabled"}>魔法</button>
        </div>
      ` : ""}
    </article>
  `;
}

function renderTown() {
  els.battleTitle.textContent = state.townPlace === "shop" ? "内政: 武器防具屋" : state.townPlace === "tower" ? "探索先選択" : "内政ターン";
  els.enemyArea.innerHTML = state.townPlace === "shop"
    ? state.party.map((member, memberIndex) => {
      const nextWeapon = equipmentGrades[(member.weaponGrade || 0) + 1];
      const nextArmor = equipmentGrades[(member.armorGrade || 0) + 1];
      return `
      <article class="enemy-card">
        <div class="name-line"><span>${member.name}</span><span>装備強化</span></div>
        <div class="stat-line">武器 ${member.weapon} / 防具 ${member.armor}</div>
        <div class="shop-buyers">
          <button type="button" data-upgrade="weapon" data-member="${memberIndex}" ${nextWeapon ? "" : "disabled"}>
            武器 ${nextWeapon ? `${nextWeapon.name}製 ${nextWeapon.price}G` : "最大"}
          </button>
          <button type="button" data-upgrade="armor" data-member="${memberIndex}" ${nextArmor ? "" : "disabled"}>
            防具 ${nextArmor ? `${nextArmor.name}製 ${nextArmor.price}G` : "最大"}
          </button>
        </div>
      </article>
    `;
    }).join("")
    : state.townPlace === "tower"
    ? TOWERS.map((tower, towerIndex) => isTowerUnlocked(towerIndex) ? `
      <article class="enemy-card">
        <div class="name-line"><span>${tower.name}</span><span>${tower.floors}階</span></div>
        <div class="stat-line">1階から探索を開始する。</div>
        <div class="shop-buyers">
          <button type="button" data-tower="${towerIndex}">探索する</button>
        </div>
      </article>
    ` : "").join("")
    : `<div class="enemy-card town-card">街で次の探索に備える。武器防具を強化するか、探索へ出発できる。</div>`;

  els.commandArea.innerHTML = state.townPlace === "shop" || state.townPlace === "tower"
    ? `<button type="button" data-town="gate">街へ戻る</button>`
    : "";

  els.enemyArea.querySelectorAll("[data-upgrade]").forEach((button) => {
    button.addEventListener("click", () => upgradeEquipment(button.dataset.upgrade, Number(button.dataset.member)));
  });
  els.enemyArea.querySelectorAll("[data-tower]").forEach((button) => {
    button.addEventListener("click", () => startDungeonExploration(Number(button.dataset.tower)));
  });
  const backButton = els.commandArea.querySelector('[data-town="gate"]');
  if (backButton) backButton.addEventListener("click", returnTownGate);
}

function renderEvent() {
  els.battleTitle.textContent = "イベントターン";
  els.enemyArea.innerHTML = `
    <div class="enemy-card town-card">
      <div class="name-line"><span>${currentTower().name}${state.floor}階の探索後</span><span>イベント</span></div>
      <div class="stat-line">イベントを処理すると、この1ターンが終わり、次の内政ターンへ進む。</div>
    </div>
  `;
  els.commandArea.innerHTML = `
    <button type="button" data-event="finish">イベント処理</button>
  `;
  els.commandArea.querySelector('[data-event="finish"]').addEventListener("click", finishEventTurn);
}

function renderStatus() {
  els.statusContent.innerHTML = `
    <table class="status-table">
      <thead>
        <tr>
          <th>名前</th>
          <th>職業</th>
          <th>Lv</th>
          <th>HP</th>
          <th>MP</th>
          <th>配置</th>
          <th>射程</th>
          <th>攻撃</th>
          <th>守備</th>
          <th>敏捷</th>
          <th>内政</th>
          <th>経験値</th>
        </tr>
      </thead>
      <tbody>
        ${state.members.map((member) => `
          <tr>
            <td>${member.name}</td>
            <td>${member.job}</td>
            <td>${member.level}</td>
            <td>${member.hp}/${member.maxHp}</td>
            <td>${member.mp}/${member.maxMp}</td>
            <td>${member.positionType}</td>
            <td>${attackRange(member)}</td>
            <td>${member.atk}</td>
            <td>${member.def}</td>
            <td>${member.agi}</td>
            <td>${member.policy}</td>
            <td>${member.exp}/${member.level * 22}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderFormation() {
  els.formationContent.innerHTML = `
    <section class="formation-party-panel">
      <div class="formation-panel-title">編成中</div>
      ${renderFormationPartyRow("前衛", "front", state.formation.front)}
      ${renderFormationPartyRow("後衛", "back", state.formation.back)}
    </section>
    ${renderFormationBench(state.members.filter((member) => !getMemberRow(member)))}
  `;

  els.formationContent.querySelectorAll("[data-drag-member]").forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.dataset.dragMember);
      event.dataTransfer.effectAllowed = "move";
    });
  });
  els.formationContent.querySelectorAll("[data-drop-zone]").forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => {
      zone.classList.remove("drag-over");
    });
    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      zone.classList.remove("drag-over");
      handleFormationDrop(Number(event.dataTransfer.getData("text/plain")), zone.dataset.dropZone);
    });
  });
}

function renderFormationPartyRow(label, zone, members) {
  return `
    <section class="party-row formation-drop-row" data-drop-zone="${zone}">
      <div class="party-row-title">${label}</div>
      <div class="party-row-grid">
        ${members.map(renderFormationMemberCard).join("") || `<div class="empty-slot">空き</div>`}
      </div>
    </section>
  `;
}

function renderFormationMemberCard(member) {
  const memberIndex = state.members.indexOf(member);
  const active = state.inBattle && state.activeActor?.type === "party" && state.activeActor.actor === member;
  return `
    <article class="member-card ${member.hp <= 0 ? "defeated" : ""} ${active ? "acting" : ""}" draggable="true" data-drag-member="${memberIndex}">
      <div class="name-line">
        <span class="name-with-icon">${renderSprite(member.job, "hero")}<span>${member.name}</span></span>
        <span>Lv ${member.level}</span>
      </div>
      <div class="stat-line">HP ${member.hp}/${member.maxHp} / 射程 ${attackRange(member)}</div>
      <div class="stat-line">MP ${member.mp}/${member.maxMp}</div>
    </article>
  `;
}

function renderFormationBench(members) {
  return `
    <section class="formation-zone bench-zone" data-drop-zone="bench">
      <div class="formation-zone-title">待機</div>
      <table class="formation-table">
        <thead>
          <tr>
            <th>名前</th>
            <th>HP/最大HP</th>
            <th>配置</th>
            <th>射程</th>
            <th>攻撃力</th>
            <th>守備力</th>
            <th>敏捷</th>
          </tr>
        </thead>
        <tbody>
          ${members.map((member) => renderFormationRow(member, state.members.indexOf(member), "bench")).join("") || `
            <tr>
              <td colspan="7" class="empty-table-cell">空き</td>
            </tr>
          `}
        </tbody>
      </table>
    </section>
  `;
}

function renderFormationRow(member, memberIndex, zone) {
    const row = getMemberRow(member);
    const inParty = Boolean(row);
    return `
      <tr class="${inParty ? "in-party" : ""}" draggable="true" data-drag-member="${memberIndex}">
        <td><span class="name-with-icon">${renderSprite(member.job, "hero")}<span>${member.name}</span></span></td>
        <td>${member.hp}/${member.maxHp}</td>
        <td>${member.positionType}</td>
        <td>${attackRange(member)}</td>
        <td>${member.atk}</td>
        <td>${member.def}</td>
        <td>${member.agi}</td>
      </tr>
    `;
}

addLog("初めの塔と2番目の塔に挑む。探索では帰るまでダンジョンに留まれる。");
startPolicyTurn();
render();
