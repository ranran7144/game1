const MAX_FLOOR = 50;

const state = {
  floor: 1,
  gold: 0,
  inBattle: false,
  townPlace: "gate",
  activeMemberIndex: 0,
  enemies: [],
  party: [
    { name: "アルス", job: "勇者", level: 1, hp: 34, maxHp: 34, mp: 8, maxMp: 8, atk: 8, def: 4, exp: 0, weapon: "銅の剣", armor: "旅人の服", weaponAtk: 0, armorDef: 0 },
    { name: "ガロン", job: "戦士", level: 1, hp: 42, maxHp: 42, mp: 0, maxMp: 0, atk: 10, def: 6, exp: 0, weapon: "こんぼう", armor: "革の鎧", weaponAtk: 0, armorDef: 0 },
    { name: "ミリア", job: "僧侶", level: 1, hp: 28, maxHp: 28, mp: 14, maxMp: 14, atk: 5, def: 3, exp: 0, weapon: "樫の杖", armor: "布のローブ", weaponAtk: 0, armorDef: 0 },
    { name: "セネカ", job: "魔法使い", level: 1, hp: 24, maxHp: 24, mp: 18, maxMp: 18, atk: 4, def: 2, exp: 0, weapon: "短い杖", armor: "魔法のローブ", weaponAtk: 0, armorDef: 0 }
  ]
};

const monsters = [
  { name: "スライム", hp: 12, atk: 5, def: 1, exp: 4, gold: 3 },
  { name: "こうもり", hp: 15, atk: 6, def: 2, exp: 6, gold: 5 },
  { name: "ゴブリン", hp: 22, atk: 8, def: 3, exp: 9, gold: 8 },
  { name: "まどうし", hp: 26, atk: 10, def: 2, exp: 14, gold: 13 },
  { name: "塔の番人", hp: 42, atk: 14, def: 5, exp: 25, gold: 24 }
];

const shopItems = [
  { name: "鉄の剣", type: "weapon", price: 60, atk: 4, def: 0 },
  { name: "鋼の剣", type: "weapon", price: 160, atk: 8, def: 0 },
  { name: "鉄の鎧", type: "armor", price: 80, atk: 0, def: 4 },
  { name: "鋼の鎧", type: "armor", price: 180, atk: 0, def: 8 }
];

const els = {
  locationName: document.querySelector("#locationName"),
  towerProgress: document.querySelector("#towerProgress"),
  travelActions: document.querySelector("#travelActions"),
  statusBtn: document.querySelector("#statusBtn"),
  closeStatusBtn: document.querySelector("#closeStatusBtn"),
  statusDialog: document.querySelector("#statusDialog"),
  statusContent: document.querySelector("#statusContent"),
  party: document.querySelector("#party"),
  battleTitle: document.querySelector("#battleTitle"),
  gold: document.querySelector("#gold"),
  enemyArea: document.querySelector("#enemyArea"),
  commandArea: document.querySelector("#commandArea"),
  log: document.querySelector("#log")
};

els.statusBtn.addEventListener("click", openStatus);
els.closeStatusBtn.addEventListener("click", () => els.statusDialog.close());

function moveFloor(direction) {
  if (state.inBattle) return;

  const nextFloor = state.floor + direction;
  if (nextFloor < 0 || nextFloor > MAX_FLOOR) return;

  state.floor = nextFloor;
  state.townPlace = "gate";

  if (state.floor === 0) {
    state.enemies = [];
    fullHeal();
    addLog("街に戻った。宿で休み、全員のHPとMPが全回復した。");
    render();
    return;
  }

  addLog(`${state.floor}階へ${direction > 0 ? "登った" : "降りた"}。`);

  if (state.floor === MAX_FLOOR) {
    startBattle(true);
  } else if (direction > 0 && Math.random() < encounterRate()) {
    startBattle(false);
  } else {
    render();
  }
}

function enterDungeon() {
  if (state.inBattle) return;
  state.floor = 1;
  state.townPlace = "gate";
  state.enemies = [];
  addLog("街を出て、塔の1階へ向かった。");
  render();
}

function openShop() {
  if (state.inBattle || state.floor !== 0) return;
  state.townPlace = "shop";
  addLog("武器防具屋に入った。");
  render();
}

function returnTownGate() {
  if (state.inBattle || state.floor !== 0) return;
  state.townPlace = "gate";
  render();
}

function buyItem(itemIndex, memberIndex) {
  const item = shopItems[itemIndex];
  const member = state.party[memberIndex];
  if (!item || !member || state.gold < item.price) {
    addLog("ゴールドが足りない。");
    render();
    return;
  }

  state.gold -= item.price;
  if (item.type === "weapon") {
    member.atk = member.atk - member.weaponAtk + item.atk;
    member.weaponAtk = item.atk;
    member.weapon = item.name;
  } else {
    member.def = member.def - member.armorDef + item.def;
    member.armorDef = item.def;
    member.armor = item.name;
  }

  addLog(`${member.name}は${item.name}を装備した。`);
  render();
}

function fullHeal() {
  state.party.forEach((member) => {
    member.hp = member.maxHp;
    member.mp = member.maxMp;
  });
}

function encounterRate() {
  return Math.min(0.48, 0.18 + state.floor * 0.004);
}

function startBattle(isBoss) {
  state.inBattle = true;
  if (els.statusDialog.open) els.statusDialog.close();
  state.activeMemberIndex = nextLivingPartyIndex(0);
  state.enemies = createEnemies(isBoss);
  addLog(isBoss ? "最上階の主が立ちはだかった！" : "魔物があらわれた！");
  render();
}

function createEnemies(isBoss) {
  if (isBoss) {
    return [makeEnemy({ name: "天塔竜", hp: 170, atk: 22, def: 8, exp: 180, gold: 250 })];
  }

  const count = Math.min(3, 1 + Math.floor(Math.random() * (state.floor > 12 ? 3 : 2)));
  return Array.from({ length: count }, () => {
    const index = Math.min(monsters.length - 1, Math.floor(state.floor / 10) + Math.floor(Math.random() * 2));
    return makeEnemy(monsters[index]);
  });
}

function makeEnemy(template) {
  const scale = 1 + Math.floor(state.floor / 8) * 0.18;
  const maxHp = Math.round(template.hp * scale);
  return {
    ...template,
    maxHp,
    hp: maxHp,
    atk: Math.round(template.atk * scale),
    def: Math.round(template.def * scale)
  };
}

function performAction(kind, targetIndex) {
  if (!state.inBattle) return;

  const member = state.party[state.activeMemberIndex];
  if (!member || member.hp <= 0) return;

  const target = Number.isInteger(targetIndex)
    ? state.enemies[targetIndex]
    : state.enemies.find((enemy) => enemy.hp > 0);
  if ((kind === "attack" || kind === "spell") && (!target || target.hp <= 0)) {
    addLog("攻撃する相手を選べない。");
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
      addLog(`${member.name}はホイミを唱えた。${ally.name}のHPが${amount}回復。`);
    }
  }

  if (kind === "spell") {
    if (member.mp < 5) {
      addLog(`${member.name}はMPが足りない。`);
    } else {
      member.mp -= 5;
      const damage = 18 + member.level * 4 + Math.floor(Math.random() * 6);
      target.hp = Math.max(0, target.hp - damage);
      addLog(`${member.name}はメラを唱えた。${target.name}に${damage}ダメージ。`);
    }
  }

  if (allEnemiesDefeated()) {
    winBattle();
    return;
  }

  state.activeMemberIndex = nextLivingPartyIndex(state.activeMemberIndex + 1);
  if (state.activeMemberIndex === -1) {
    loseBattle();
    return;
  }

  if (state.activeMemberIndex === 0) {
    enemiesAct();
    state.activeMemberIndex = nextLivingPartyIndex(0);
  }

  render();
}

function enemiesAct() {
  state.enemies.filter((enemy) => enemy.hp > 0).forEach((enemy) => {
    const targets = state.party.filter((member) => member.hp > 0);
    if (targets.length === 0) return;

    const target = targets[Math.floor(Math.random() * targets.length)];
    const damage = calculateDamage(enemy.atk, target.def);
    target.hp = Math.max(0, target.hp - damage);
    addLog(`${enemy.name}の攻撃。${target.name}に${damage}ダメージ。`);
  });

  if (state.party.every((member) => member.hp <= 0)) {
    loseBattle();
  }
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
  state.enemies = [];

  addLog(`勝利！ 経験値${exp}、${gold}Gを手に入れた。`);
  state.party.forEach((member) => gainExp(member, exp));

  if (state.floor === MAX_FLOOR) {
    addLog("50階を踏破した。塔の頂に静けさが戻った。");
  }

  render();
}

function gainExp(member, exp) {
  if (member.hp <= 0) member.hp = 1;
  member.exp += exp;

  while (member.exp >= member.level * 22) {
    member.exp -= member.level * 22;
    member.level += 1;
    member.maxHp += 5 + Math.floor(Math.random() * 4);
    member.maxMp += member.maxMp > 0 ? 3 : 0;
    member.atk += 2;
    member.def += 1;
    member.hp = member.maxHp;
    member.mp = member.maxMp;
    addLog(`${member.name}はレベル${member.level}に上がった！`);
  }
}

function loseBattle() {
  state.inBattle = false;
  state.floor = 0;
  state.townPlace = "gate";
  state.enemies = [];
  fullHeal();
  addLog("全滅した。街へ運ばれ、宿で全回復した。");
  render();
}

function openStatus() {
  if (state.inBattle) return;
  renderStatus();
  els.statusDialog.showModal();
}

function addLog(message) {
  const line = document.createElement("p");
  line.textContent = message;
  els.log.prepend(line);
}

function render() {
  els.locationName.textContent = state.floor === 0 ? "街" : `${state.floor}階`;
  els.towerProgress.style.height = `${Math.max(2, (state.floor / MAX_FLOOR) * 100)}%`;
  els.gold.textContent = `${state.gold} G`;
  els.statusBtn.disabled = state.inBattle;

  renderTravelActions();
  renderParty();
  renderBattle();
  if (els.statusDialog.open) renderStatus();
}

function renderTravelActions() {
  if (state.inBattle) {
    els.travelActions.innerHTML = `
      <button type="button" disabled>登る</button>
      <button type="button" disabled>降りる</button>
    `;
    return;
  }

  if (state.floor === 0) {
    els.travelActions.innerHTML = `
      <button type="button" data-town="dungeon">ダンジョンへ</button>
      <button type="button" data-town="shop">武器防具屋</button>
    `;
    els.travelActions.querySelector('[data-town="dungeon"]').addEventListener("click", enterDungeon);
    els.travelActions.querySelector('[data-town="shop"]').addEventListener("click", openShop);
    return;
  }

  els.travelActions.innerHTML = `
    <button type="button" data-move="1" ${state.floor >= MAX_FLOOR ? "disabled" : ""}>登る</button>
    <button type="button" data-move="-1">降りる</button>
  `;
  els.travelActions.querySelectorAll("[data-move]").forEach((button) => {
    button.addEventListener("click", () => moveFloor(Number(button.dataset.move)));
  });
}

function renderParty() {
  els.party.innerHTML = state.party.map((member, index) => {
    const hpRate = (member.hp / member.maxHp) * 100;
    const mpRate = member.maxMp === 0 ? 0 : (member.mp / member.maxMp) * 100;
    const active = state.inBattle && index === state.activeMemberIndex ? " 行動中" : "";
    return `
      <article class="member-card ${member.hp <= 0 ? "defeated" : ""}">
        <div class="name-line"><span>${member.name}</span><span>Lv ${member.level}</span></div>
        <div class="stat-line">${member.job}${active}</div>
        <div class="stat-line">HP ${member.hp}/${member.maxHp}</div>
        <div class="bar"><span style="width:${hpRate}%"></span></div>
        <div class="stat-line">MP ${member.mp}/${member.maxMp}</div>
        <div class="bar mp"><span style="width:${mpRate}%"></span></div>
      </article>
    `;
  }).join("");
}

function renderBattle() {
  if (state.floor === 0) {
    renderTown();
    return;
  }

  els.battleTitle.textContent = state.inBattle ? "戦闘中" : "探索中";
  const member = state.party[state.activeMemberIndex];
  const canHeal = state.inBattle && (member.job === "僧侶" || member.job === "勇者");
  const canSpell = state.inBattle && (member.job === "魔法使い" || member.job === "勇者");

  els.enemyArea.innerHTML = state.enemies.length === 0
    ? `<div class="enemy-card">塔は静まり返っている。</div>`
    : state.enemies.map((enemy, enemyIndex) => {
      const hpRate = (enemy.hp / enemy.maxHp) * 100;
      return `
        <article class="enemy-card ${enemy.hp <= 0 ? "defeated" : ""}">
          <div class="name-line"><span>${enemy.name}</span><span>${enemy.hp > 0 ? "敵" : "撃破"}</span></div>
          <div class="stat-line">HP ${enemy.hp}/${enemy.maxHp}</div>
          <div class="bar"><span style="width:${hpRate}%"></span></div>
          ${state.inBattle && enemy.hp > 0 ? `
            <div class="enemy-actions">
              <button type="button" data-target-action="attack" data-enemy="${enemyIndex}">攻撃</button>
              <button type="button" data-target-action="spell" data-enemy="${enemyIndex}" ${canSpell ? "" : "disabled"}>魔法</button>
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

function renderTown() {
  els.battleTitle.textContent = state.townPlace === "shop" ? "武器防具屋" : "街";
  els.enemyArea.innerHTML = state.townPlace === "shop"
    ? shopItems.map((item, itemIndex) => `
      <article class="enemy-card">
        <div class="name-line"><span>${item.name}</span><span>${item.price} G</span></div>
        <div class="stat-line">${item.type === "weapon" ? `攻撃 +${item.atk}` : `守備 +${item.def}`}</div>
        <div class="shop-buyers">
          ${state.party.map((member, memberIndex) => `
            <button type="button" data-buy="${itemIndex}" data-member="${memberIndex}">${member.name}</button>
          `).join("")}
        </div>
      </article>
    `).join("")
    : `<div class="enemy-card town-card">街では体を休められる。ダンジョンへ向かうか、武器防具屋へ行ける。</div>`;

  els.commandArea.innerHTML = state.townPlace === "shop"
    ? `<button type="button" data-town="gate">街へ戻る</button>`
    : "";

  els.enemyArea.querySelectorAll("[data-buy]").forEach((button) => {
    button.addEventListener("click", () => buyItem(Number(button.dataset.buy), Number(button.dataset.member)));
  });
  const backButton = els.commandArea.querySelector('[data-town="gate"]');
  if (backButton) backButton.addEventListener("click", returnTownGate);
}

function renderStatus() {
  els.statusContent.innerHTML = state.party.map((member) => `
    <article class="status-card">
      <div class="name-line"><span>${member.name}</span><span>${member.job}</span></div>
      <div class="status-grid">
        <span>Lv</span><strong>${member.level}</strong>
        <span>HP</span><strong>${member.hp}/${member.maxHp}</strong>
        <span>MP</span><strong>${member.mp}/${member.maxMp}</strong>
        <span>攻撃</span><strong>${member.atk}</strong>
        <span>守備</span><strong>${member.def}</strong>
        <span>経験値</span><strong>${member.exp}/${member.level * 22}</strong>
        <span>武器</span><strong>${member.weapon}</strong>
        <span>防具</span><strong>${member.armor}</strong>
      </div>
    </article>
  `).join("");
}

addLog("50階の塔に挑む。降りれば街へ戻れる。");
render();
