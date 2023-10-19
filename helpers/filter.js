const obg = { favorite: "false" };

const favorite = obg ? { favorite: obg } : {};
console.log(favorite);
