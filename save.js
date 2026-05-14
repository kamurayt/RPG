const SAVE_KEY="hackRpgSplit_v1";

function saveGame(){
  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify(player)
  );
}

function loadGame(){
  return JSON.parse(
    localStorage.getItem(SAVE_KEY)
  );
}
