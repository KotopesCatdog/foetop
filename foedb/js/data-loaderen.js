// === GLOBAL VARIABLES ===
let currentJsonUrl = '/building.json';  // Current URL
let dataLoadDate = null;  // Server file date

// === UPDATE SERVER FILE DATE FUNCTION ===
function updateServerFileDate() {
    const dateElement = document.getElementById('serverFileDate');
    if (dateElement && dataLoadDate) {
        const formattedDate = dataLoadDate.toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        dateElement.textContent = `📅 Database update date: ${formattedDate}`;
        dateElement.style.color = '#ffd700';
        dateElement.style.fontSize = '11px';
        dateElement.style.textAlign = 'center';
        dateElement.style.marginBottom = '10px';
    }
}

// === SWITCH JSON ===
async function switchJson(url) {
    currentJsonUrl = url;
    const statusMsg = document.getElementById('statusMsg');
    statusMsg.textContent = "Switching database...";
    statusMsg.style.color = '#ffd700';
    
    // Clear current data
    window.allBuildings = [];
    document.getElementById('resultsGrid').innerHTML = '';
    document.getElementById('searchInput').disabled = true;
    document.getElementById('searchInput').value = '';
    
    // Load new data
    await loadData();
    
    statusMsg.textContent = `Database switched`;
    setTimeout(() => {
        statusMsg.style.color = '#c5c6c7';
    }, 2000);
}

// === LOAD DATA ===
async function loadData() {
    console.log(`🚀 Starting data load from: ${currentJsonUrl}`);
    const statusMsg = document.getElementById('statusMsg');
    statusMsg.textContent = "Loading configuration...";
    
    await loadBasketConfig();
    statusMsg.textContent = "Connecting to server...";
    
    try {
        // Get file date
        const headResponse = await fetch(currentJsonUrl, { method: 'HEAD' });
        const lastModified = headResponse.headers.get('Last-Modified');
        if (lastModified) {
            dataLoadDate = new Date(lastModified);
        } else {
            dataLoadDate = new Date();
        }
        updateServerFileDate();
        
        // Load data
        const response = await fetch(currentJsonUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const rawData = await response.json();
        console.log("✅ JSON received. Type:", Array.isArray(rawData) ? "Array" : "Object");
        
        statusMsg.textContent = "Analyzing data...";
        setTimeout(() => {
            try {
                const entities = Array.isArray(rawData) ? rawData : Object.values(rawData);
                window.allBuildings = [];
                let errorCount = 0, successCount = 0, buildingsWithAllyRooms = 0;
                
                console.log("⚙️ Processing buildings...");
                entities.forEach((metaData, index) => {
                    if (!metaData || !metaData.id || !metaData.name) return;
                    try {
                        let mockData = { id: 0, cityentity_id: metaData.id, state: {}, bonus: metaData.bonus || null };
                        let era = null;
                        const building = window.CityBuildings.createBuilding(metaData, era, mockData);
                        if (building) {
                            window.allBuildings.push(building);
                            successCount++;
                            if (building.allyRooms) buildingsWithAllyRooms++;
                        } else { errorCount++; }
                        if (index < 3) console.log(`🏢 #${index}:`, metaData.name, "-> Era:", building ? building.baseEra : "FAIL");
                    } catch (buildError) {
                        console.error("❌ Building error:", metaData.id, buildError);
                        errorCount++;
                    }
                });
                
                console.log(`✅ Done. Success: ${successCount}, Errors: ${errorCount}, With ally rooms: ${buildingsWithAllyRooms}`);
                
                if (window.allBuildings.length === 0) {
                    statusMsg.textContent = `Error: Found 0 buildings.`;
                    statusMsg.style.color = '#ff6b6b';
                    document.getElementById('resultsGrid').innerHTML = '<div class="no-results" style="color:#ff6b6b">Buildings not loaded. See console (F12).</div>';
                } else {
                    statusMsg.textContent = `Done. Found: ${window.allBuildings.length}.`;
                    statusMsg.style.color = '#c5c6c7';
                    document.getElementById('searchInput').disabled = false;
                    document.getElementById('searchInput').focus();
                    document.getElementById('resultsGrid').innerHTML = '';
                    loadBasket();
                }
            } catch (parseError) {
                console.error("💥 Critical error:", parseError);
                statusMsg.textContent = `Processing error.`;
                statusMsg.style.color = '#ff6b6b';
            }
        }, 50);
    } catch (error) {
        console.error('🔥 Load error:', error);
        const statusMsg = document.getElementById('statusMsg');
        statusMsg.textContent = `JSON load error.`;
        statusMsg.style.color = '#ff6b6b';
    }
}

// === GET BUILDING DATA FOR ERA ===
function getBuildingDataForEra(building, era) {
    return {
        population: window.CityBuildings.setPopulation(building.rawMeta, building.rawData, era),
        happiness: window.CityBuildings.setHappiness(building.rawMeta, building.rawData, era),
        boosts: window.CityBuildings.setBuildingBoosts(building.rawMeta, building.rawData, era),
        production: window.CityBuildings.setAllProductions(building.rawMeta, building.rawData, era)
    };
}