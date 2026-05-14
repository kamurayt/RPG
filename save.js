const SAVE_KEY="RPG_SAVE_VER_1_0_0";

function saveGame(){

  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify(player)
  );
}

function loadGame(){

  const data=
    localStorage.getItem(SAVE_KEY);

  if(!data){
    return null;
  }

  try{

    return JSON.parse(data);

  }catch{

    return null;
  }
}
