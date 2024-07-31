const fs = require("fs");
const axios = require("axios");
const path = require("path");
const data = require("./characters.json");

const downloadImage = async (url, filepath) => {
  const response = await axios({
    url,
    responseType: "stream",
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on("finish", resolve)
      .on("error", reject);
  });
};

const downloadAllImages = async () => {
  for (const character of data) {
    const { name, images } = character;
    const characterDir = path.join(__dirname, "images", name);
    fs.mkdirSync(characterDir, { recursive: true });

    for (const imageUrl of images) {
      const filename = path.basename(imageUrl);
      const filepath = path.join(characterDir, filename);
      try {
        await downloadImage(imageUrl, filepath);
        console.log(`Imagem de ${name} baixada com sucesso: ${filepath}`);
      } catch (error) {
        console.error(`Erro ao baixar imagem de ${name}: ${imageUrl}`);
      }
    }
  }
};

downloadAllImages();
