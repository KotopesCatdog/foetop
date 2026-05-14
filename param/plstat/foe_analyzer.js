// =========================================================
// ================  ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==================
// =========================================================

let perTileMode = false; // режим "на клетку"
let inventoryMode = 0;   // 0=все, 1=только инвентарь, 2=без инвентаря
let averageMode = false;  // режим "среднее"
let lastList = [];       // исходный список зданий
let lastGrouped = [];    // сгруппированные здания

let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");


// =========================================================
// ===================== DOM READY ==========================
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    uploadArea.onclick = ()=>fileInput.click();
    fileInput.onchange = ()=>loadFile(fileInput.files[0]);

    // --- вкладки ---
    document.querySelectorAll('.tab-btn').forEach(btn=>{
        btn.onclick=()=>{
            document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
        };
    });

    // --- поиск по имени ---
    document.getElementById("searchInput")?.addEventListener("input", function() {
        document.querySelectorAll("tbody tr").forEach(tr => syncRowVisibility(tr));
        updateBattleAverages();
    });

    // --- переключатель "на клетку" ---
    document.getElementById("togglePerTile").addEventListener("click", function(){
        perTileMode = !perTileMode;
//        this.textContent = perTileMode ? "На клетку: вкл" : "На клетку: выкл";
this.textContent = perTileMode 
    ? (window._i18nT?.plstat_btn_per_tile_on || "На клетку: вкл")
    : (window._i18nT?.plstat_btn_per_tile_off || "На клетку: выкл");


this.classList.toggle("active", perTileMode);



        // пересборка таблиц
        fillAllBuildings(lastGrouped);
        fillBattle(lastList);

        enableSorting('buildingsTable');
        enableSorting('battleTable');

        applyInventoryFilter();
    });

    // --- переключатель "инвентарь" ---
    document.getElementById("toggleInventory").addEventListener("click", function(){
        inventoryMode = (inventoryMode + 1) % 3;
        const labels = ["Инвентарь: все", "Инвентарь: только", "Инвентарь: нет"];
        this.textContent = labels[inventoryMode];
        this.classList.toggle("active", inventoryMode !== 0);
        applyInventoryFilter();
    });

    // --- переключатель "среднее" ---
    document.getElementById("toggleAverage").addEventListener("click", function(){
        averageMode = !averageMode;
        this.textContent = averageMode ? "Среднее: вкл" : "Среднее: выкл";
        this.classList.toggle("active", averageMode);
        updateBattleAverages();
    });




// =========================================================
// ===================== FAVORITES ==========================
// =========================================================

function toggleFavorite(entityId) {
    const i = favorites.indexOf(entityId);
    if (i >= 0) favorites.splice(i, 1);
    else favorites.push(entityId);

    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function updateFavoriteVisual(entityId) {
    document.querySelectorAll(`.fav[data-id="${entityId}"]`).forEach(cell => {
        const isFav = favorites.includes(entityId);

        cell.textContent = isFav ? "★" : "☆";
        cell.classList.toggle("active", isFav);

        const tr = cell.closest("tr");
        if (tr) tr.classList.toggle("favorite-row", isFav);
    });
}


// =========================================================
// ======================= ЗАГРУЗКА =========================
// =========================================================

function loadFile(file){
    const reader = new FileReader();

    reader.onload = ()=>{
        let json;
        try { json = JSON.parse(reader.result); }
        catch(e){ alert("Ошибка JSON"); return; }

        if (!json.buildings || !Array.isArray(json.buildings)){
            alert("Нет массива buildings");
            return;
        }

        loadBuildings(json.buildings);
    };

    reader.readAsText(file);
}

function loadBuildings(list){
    lastList = list;

    const grouped = groupBuildings(list);
    lastGrouped = grouped;

    fillAllBuildings(grouped);
    fillBattle(list);

    enableSorting('buildingsTable');
    enableSorting('battleTable');

    applyInventoryFilter();
}


// =========================================================
// ===================== GROUPING ===========================
// =========================================================

function groupBuildings(list){
    const map = new Map();

    list.forEach(b=>{
        const key = b.name + "||" + b.eraName;

        if(!map.has(key)){
            map.set(key, { ...b, count: 1 });
        } else {
            map.get(key).count++;
        }
    });

    return [...map.values()];
}


// =========================================================
// ======================= PRODUCTION =======================
// =========================================================

function extractProduction(b){
    let fp = 0, prev = 0, age = 0, next = 0;

    (b.production || []).forEach(p => {

        // 1) Прямые ресурсы
        if (p.type === "resources" && p.resources) {
            for (let k in p.resources) {

                if (k === "strategy_points") fp += p.resources[k];

                if (k.includes("goods") && k.includes("previous")) prev += p.resources[k];
                if (k.includes("goods") && k.includes("all"))      age += p.resources[k];
                if (k.includes("goods") && k.includes("next"))     next += p.resources[k];
            }
        }

        // 2) genericReward
        if (p.type === "genericReward" && p.resources) {
            const r = p.resources;

            if (r.type === "goods") {
                if (r.subType.includes("previous")) prev += r.amount || 0;
                if (r.subType.includes("age"))      age += r.amount || 0;
                if (r.subType.includes("next"))     next += r.amount || 0;
            }

            if (r.type === "strategy_points") fp += r.amount || 0;
        }

        // 3) random
        if (p.type === "random" && Array.isArray(p.resources)) {
            p.resources.forEach(r => {
                if (r.subType === "random_good_of_previous_age") prev += r.amount || 0;
                if (r.subType === "random_good_of_age")          age += r.amount || 0;
                if (r.subType === "random_good_of_next_age")     next += r.amount || 0;
            });
        }
    });

    return { fp, prev, age, next };
}


// =========================================================
// =================== VALUE PER TILE =======================
// =========================================================

function calcCoef(b) {
    if (!b.size) return 1;

    const w = b.size.width;
    const h = b.size.length;
    const area = w * h;

    if (!b.needsStreet) return area;

    const s = Math.min(w, h);
    return area + s / 2;
}

function perTile(b, value){
    if (!perTileMode) return value;
    const coef = calcCoef(b);
    return coef ? +(value / coef).toFixed(1) : value;
}

function nz(v){ return v ? v : ''; }


// =========================================================
// ===================== TABLE: ALL =========================
// =========================================================

function fillAllBuildings(list){
    const tb = document.querySelector('#buildingsTable tbody');
    tb.innerHTML = "";

    const frag = document.createDocumentFragment();

    list.forEach(b=>{
        const prod = extractProduction(b);
        const size = b.size ? (b.size.width+"×"+b.size.length) : "";
        const inv = (b.id===0) ? "✔" : "";

        const isFav = favorites.includes(b.entityId);
        const fav = isFav ? "★" : "☆";

        const tr = document.createElement("tr");
        tr.dataset.name = (b.name||"").toLowerCase();
        if(isFav) tr.classList.add("favorite-row");

        tr.innerHTML = `
            <td class="fav ${isFav?"active":""}" data-id="${b.entityId}">${fav}</td>
            <td>${inv}</td>
            <td>${b.name}</td>
            <td>${b.count}</td>
            <td>${size}</td>
            <td>${b.eraName}</td>

            <td>${nz(perTile(b, b.population||0))}</td>

            <td>${nz(perTile(b, prod.fp))}</td>
            <td>${nz(perTile(b, prod.prev))}</td>
            <td>${nz(perTile(b, prod.age))}</td>
            <td>${nz(perTile(b, prod.next))}</td>
        `;

        tr.querySelector(".fav").onclick = (e)=>{
            e.stopPropagation();
            toggleFavorite(b.entityId);
            updateFavoriteVisual(b.entityId);
        };

        frag.appendChild(tr);
    });

    tb.appendChild(frag);
}


// =========================================================
// ====================== BATTLE ============================
// =========================================================

function extractBattle(b){
    let r = {
        ra_all:0, ra_bg:0, ra_ge:0, ra_gr:0,
        rd_all:0, rd_bg:0, rd_ge:0, rd_gr:0,
        ba_all:0, ba_bg:0, ba_ge:0, ba_gr:0,
        bd_all:0, bd_bg:0, bd_ge:0, bd_gr:0
    };

    if(!b.boosts) return r;

    for(const boost of b.boosts){
        const v = boost.value||0;
        const f = boost.feature||"all";
        const types = Array.isArray(boost.type)?boost.type:[boost.type];

        for(const t of types){
            let p="";
            if(t==="att_boost_attacker") p="ra_";
            if(t==="def_boost_attacker") p="rd_";
            if(t==="att_boost_defender") p="ba_";
            if(t==="def_boost_defender") p="bd_";
            if(!p) continue;

            let s="all";
            if(f==="battleground")      s="bg";
            if(f==="guild_expedition")  s="ge";
            if(f==="guild_raids")       s="gr";

            r[p+s] += v;
        }
    }

    return r;
}

function fillBattle(list){

    // группировка как в основной таблице
    let grouped = {};

    list.forEach(b=>{
        const size = b.size ? (b.size.width+"x"+b.size.length) : "";
        const key = b.name + "_" + b.eraName + "_" + size;

        if(!grouped[key]){
            grouped[key] = { ...b, count:1 };
        } else {
            grouped[key].count++;
        }
    });

    list = Object.values(grouped);
    const tb = document.querySelector('#battleTable tbody');
    tb.innerHTML = "";

    const frag = document.createDocumentFragment();

    list.forEach(b=>{
        const x = extractBattle(b);
        const inv = (b.id===0) ? "✔" : "";

        const isFav = favorites.includes(b.entityId);
        const fav = isFav ? "★" : "☆";

        const tr = document.createElement("tr");
        tr.dataset.name = (b.name||"").toLowerCase();
        if(isFav) tr.classList.add("favorite-row");

        tr.innerHTML = `
            <td class="fav ${isFav?"active":""}" data-id="${b.entityId}">${fav}</td>
            <td>${inv}</td>
            <td>${b.name}</td>
            <td>${b.count||1}</td>

           <td>${nz(perTile(b, x.ra_all))}</td>
          <td>${nz(perTile(b, x.rd_all))}</td>
          <td>${nz(perTile(b, x.ba_all))}</td>
          <td>${nz(perTile(b, x.bd_all))}</td>
            <td>${nz(perTile(b, x.ra_bg))}</td>
            <td>${nz(perTile(b, x.rd_bg))}</td>
            <td>${nz(perTile(b, x.ba_bg))}</td>
            <td>${nz(perTile(b, x.bd_bg))}</td>
            
            <td>${nz(perTile(b, x.ra_gr))}</td>
            <td>${nz(perTile(b, x.rd_gr))}</td>
            <td>${nz(perTile(b, x.ba_gr))}</td>
            <td>${nz(perTile(b, x.bd_gr))}</td>
            
            <td>${nz(perTile(b, x.ra_ge))}</td>
            <td>${nz(perTile(b, x.rd_ge))}</td>
            <td>${nz(perTile(b, x.ba_ge))}</td>
            <td>${nz(perTile(b, x.bd_ge))}</td>
            
        `;

        tr.querySelector(".fav").onclick = (e)=>{
            e.stopPropagation();
            toggleFavorite(b.entityId);
            updateFavoriteVisual(b.entityId);
        };

        frag.appendChild(tr);
    });

    tb.appendChild(frag);
    updateBattleAverages();
}


// =========================================================
// ==================== AVERAGES ============================
// =========================================================

function updateBattleAverages(){
    const table = document.getElementById('battleTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // удаляем старую строку средних
    thead.querySelector('.avg-row')?.remove();

    // убираем подсветку
    tbody.querySelectorAll('.above-avg').forEach(el => el.classList.remove('above-avg'));

    if (!averageMode) return;

    const rows = [...tbody.querySelectorAll('tr')].filter(tr => tr.style.display !== 'none');
    if (rows.length === 0) return;

    const numCols = rows[0].children.length;
    const startCol = 4; // колонки правее "К-во"

    // суммы и количество ненулевых по колонкам
    const sums = new Array(numCols).fill(0);
    const counts = new Array(numCols).fill(0);
    for (const row of rows) {
        for (let i = startCol; i < numCols; i++) {
            const val = parseFloat(row.children[i].textContent) || 0;
            if (val !== 0) {
                sums[i] += val;
                counts[i]++;
            }
        }
    }

    const avgs = sums.map((s, i) => counts[i] ? s / counts[i] : 0);

    // строка средних в thead
    const avgTr = document.createElement('tr');
    avgTr.className = 'avg-row';
    for (let i = 0; i < numCols; i++) {
        const td = document.createElement('td');
        if (i === 2) td.textContent = 'Среднее';
        else if (i >= startCol) td.textContent = nz(+avgs[i].toFixed(1));
        avgTr.appendChild(td);
    }
    thead.appendChild(avgTr);

    // сдвигаем строку средних под заголовок для sticky
    const headerRow = thead.querySelector('tr:first-child');
    if (headerRow) {
        const hh = headerRow.offsetHeight;
        avgTr.querySelectorAll('td').forEach(td => td.style.top = hh + 'px');
    }

    // подсветка ячеек выше среднего
    for (const row of rows) {
        for (let i = startCol; i < numCols; i++) {
            const val = parseFloat(row.children[i].textContent) || 0;
            if (val > avgs[i] && avgs[i] > 0) {
                row.children[i].classList.add('above-avg');
            }
        }
    }
}


// =========================================================
// ===================== SORTING ============================
// =========================================================

function enableSorting(id){
    const table=document.getElementById(id);
    table.querySelectorAll("th").forEach((th,i)=>{
        th.onclick=()=>sortTable(table,i);
    });
}

function sortTable(table,col){
    const tb=table.querySelector("tbody");
    const rows=[...tb.querySelectorAll("tr")];

    let asc = table.dataset.sortCol==col && table.dataset.sortDir==="asc" ? false : true;
    table.dataset.sortCol=col;
    table.dataset.sortDir=asc?"asc":"desc";

    rows.sort((a,b)=>{
        let A=a.children[col].innerText.trim();
        let B=b.children[col].innerText.trim();

        let nA=Number(A), nB=Number(B);
        if(!isNaN(nA)&&!isNaN(nB)) return asc?nA-nB:nB-nA;

        return asc?A.localeCompare(B,'ru'):B.localeCompare(A,'ru');
    });

    rows.forEach(r=>tb.appendChild(r));
}


// =========================================================
// ================== INVENTORY FILTER =====================
// =========================================================

function applyInventoryFilter(){
    document.querySelectorAll("tbody tr").forEach(tr=>{
        const invCell = tr.children[1]; // вторая колонка — инвентарь
        const isInv = invCell && invCell.textContent.trim() === "✔";

        if(inventoryMode === 0){
            // не скрываем по инвентарю (но учитываем другие фильтры)
            tr.dataset.invHidden = "";
        } else if(inventoryMode === 1){
            // только инвентарь
            tr.dataset.invHidden = isInv ? "" : "1";
        } else {
            // без инвентаря
            tr.dataset.invHidden = isInv ? "1" : "";
        }

        syncRowVisibility(tr);
    });
    updateBattleAverages();
}

// Синхронизирует видимость строки с учётом всех фильтров
function syncRowVisibility(tr){
    const invHidden  = tr.dataset.invHidden === "1";
    const favHidden  = showFav && !favorites.includes(tr.querySelector(".fav")?.dataset.id);
    const searchVal  = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const searchHide = searchVal && !tr.dataset.name.includes(searchVal);

    tr.style.display = (invHidden || favHidden || searchHide) ? "none" : "";
}


// =========================================================
// ===================== FAVORITE FILTER ====================
// =========================================================

let showFav=false;

document.getElementById("favToggle")?.addEventListener("click", ()=>{
    showFav=!showFav;

    document.getElementById("favToggle").classList.toggle("active", showFav);

    document.querySelectorAll("tbody tr").forEach(tr => syncRowVisibility(tr));
    updateBattleAverages();
});
});
