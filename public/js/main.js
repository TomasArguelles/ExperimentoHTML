// --- Estado del juego ---
    let coins = 0;
    let coinsPerSecond = 0;
    let upgradeCost = 10;

    // --- Referencias a la UI ---
    const coinsSpan = document.getElementById('coins');
    const cpsSpan = document.getElementById('cps');
    const upgradeCostSpan = document.getElementById('upgradeCost');
    const clickBtn = document.getElementById('clickBtn');
    const buyUpgradeBtn = document.getElementById('buyUpgradeBtn');
    const logDiv = document.getElementById('log');

    // --- Guardar / cargar partida ---
    function saveGame() {
      const data = {
        coins,
        coinsPerSecond,
        upgradeCost
      };
      localStorage.setItem('idleGameSave', JSON.stringify(data));
    }

    function loadGame() {
      const raw = localStorage.getItem('idleGameSave');
      if (!raw) return;
      try {
        const data = JSON.parse(raw);
        if (typeof data.coins === 'number') coins = data.coins;
        if (typeof data.coinsPerSecond === 'number') coinsPerSecond = data.coinsPerSecond;
        if (typeof data.upgradeCost === 'number') upgradeCost = data.upgradeCost;
      } catch (e) {
        console.error('Error cargando partida:', e);
      }
    }

    // --- Actualizar UI ---
    function updateUI() {
      coinsSpan.textContent = coins.toFixed(0);
      cpsSpan.textContent = coinsPerSecond.toFixed(1);
      upgradeCostSpan.textContent = upgradeCost.toFixed(0);
    }

    function addLog(message) {
      const time = new Date().toLocaleTimeString();
      const p = document.createElement('p');
      p.textContent = `[${time}] ${message}`;
      logDiv.prepend(p);
    }

    // --- Lógica de botones ---
    clickBtn.addEventListener('click', () => {
      coins += 1;
      updateUI();
      saveGame();
    });

    buyUpgradeBtn.addEventListener('click', () => {
      if (coins >= upgradeCost) {
        coins -= upgradeCost;
        coinsPerSecond += 1;
        upgradeCost = Math.round(upgradeCost * 1.5); // cada vez más caro
        updateUI();
        saveGame();
        addLog('Has comprado una mejora (+1 moneda/seg).');
      } else {
        addLog('No tienes suficientes monedas.');
      }
    });

    // --- Bucle idle (ganancia automática) ---
    function gameLoop() {
      coins += coinsPerSecond;
      updateUI();
      saveGame();
    }

    // --- Inicialización ---
    loadGame();
    updateUI();
    setInterval(gameLoop, 1000); // cada segundo
