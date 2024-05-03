const express = require("express");
const fs = require("fs").promises;
const fss = require("fs");
const { VK, API, Upload } = require("vk-io");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const asyncHandler = require("express-async-handler");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const token1 = "token1";
const token2 = "token2";
let api;
let apiAudio;
let uploader;
let uploadApi;

let userId;
let albumId;

let audioIds;
let allGroups;
let allPhotos;

process.on("uncaughtException", (err) => {
  console.error("Необработанная ошибка:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Отклоненное обещание:", promise, "Причина:", reason);
});

app.get(
  "/login",
  asyncHandler(async (req, res) => {
    if (!token1 || !token2) {
      return res
        .status(400)
        .json({ error: "Необходимо предоставить оба токена" });
    }

    res.json({ message: "Регистрация прошла успешно" });
    api = new VK({ token: token1 });
    apiAudio = new VK({ token: token2 });
    uploader = new API({ token: token1 });
    uploadApi = new Upload({ api: uploader });
  })
);

app.get(
  "/connect",
  asyncHandler(async (req, res) => {
    userId = await api.api.account.getProfileInfo().then((r) => r.id);
    albumId = await getAlbumId(userId);
    console.log(albumId);
    res.status(200).json({ success: "u're connected" });
  })
);

async function getAlbumId(userId) {
  const albumsData = await api.api.photos.getAlbums({ owner_id: userId });
  if (albumsData.items.every((album) => album.title !== "declipedpromo")) {
    const newAlbum = await api.api.photos.createAlbum({
      owner_id: userId,
      privacy_view: "only_me",
      title: "declipedpromo",
    });
    return newAlbum.id;
  } else {
    const existingAlbum = albumsData.items.find(
      (album) => album.title === "declipedpromo"
    );
    return existingAlbum.id;
  }
}

app.use(express.static("images"));

app.get("/api/photos", async (req, res) => {
  try {
    const photos = [];
    const baseDir = path.join(__dirname, "images");

    // Асинхронно получаем список всех директорий и файлов в базовой директории
    const items = await fs.readdir(baseDir, { withFileTypes: true });

    // Фильтруем только директории
    const directories = items
      .filter((item) => item.isDirectory())
      .map((dir) => dir.name);

    // Перебираем все директории и ищем в них файлы
    for (const dir of directories) {
      const dirPath = path.join(baseDir, dir);
      const dirPhotos = await fs.readdir(dirPath);

      // Добавляем найденные файлы в массив photos
      dirPhotos.forEach((photo) => photos.push(`${dir}/${photo}`));
    }

    res.json({ photos });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get(
  "/audio",
  asyncHandler(async (req, res) => {
    const { count } = req.query;
    if (!count) {
      return res.status(400).json({ error: "Parameter 'count' is required" });
    }
    const audio = await apiAudio.api.audio.get({ owner_id: userId, count });
    audioIds = audio.items.map((item) => item.id);
    console.log(audioIds);
    res.status(200).json(audio);
  })
);

app.get(
  "/groups",
  asyncHandler(async (req, res) => {
    allGroups = await getGroups();
    res.status(200).json(allGroups);
  })
);

async function getGroups() {
  const groups = [];
  const text = fss.readFileSync("./data/groups.txt", "utf-8").split("\r\n");
  text.forEach((link) => {
    groups.push(link.slice(15));
  });

  const groupInfo = await api.api.groups.getById({
    group_ids: groups.toString(),
  });

  return groupInfo.groups.map((group) => ({
    id: -group.id,
    name: group.name,
    pic: group.photo_50,
  }));
}

app.get(
  "/post",
  asyncHandler(async (req, res) => {
    try {
      const imagesFolder = path.join(__dirname, "images");
      const filesInfoArray = await getFilesInfo(imagesFolder);
      const results = await Promise.all(
        filesInfoArray.map(async (files, index) => savePhotos(index, files))
      );
      allPhotos = Object.assign({}, ...results);
      await makePost();
      res.status(200).json({ success: "Все посты сделаны" });
    } catch (error) {
      console.error("Произошла ошибка: ", error);
      res
        .status(200)
        .json({ error: "Все запостилось, были закрытые предложки" });
    }
  })
);

async function makePost() {
  let postCount = 0;
  for (const group of allGroups) {
    try {
      const photoKeys = Object.keys(allPhotos);
      if (postCount >= photoKeys.length) {
        postCount = 0;
      }
      const key = photoKeys[postCount];
      const photoAttachments = allPhotos[key]
        .map((id) => `photo${userId}_${id}`)
        .join(",");
      const audioAttachments = audioIds
        .map((id) => `audio${userId}_${id}`)
        .join(",");
      const attachmentsString = [photoAttachments, audioAttachments]
        .filter((part) => part)
        .join(",");
      await api.api.wall.post({
        from_group: 1,
        owner_id: group.id,
        attachments: attachmentsString,
      });
      postCount++;
    } catch (error) {
      console.error(
        `Ошибка при попытке отправить пост в группу ${group.id}:`,
        error
      );
      continue; // Продолжаем цикл даже если возникает ошибка
    }
  }
}

// async function makePost() {
//   let postCount = 0;
//   for (const group of allGroups) {
//     const photoKeys = Object.keys(allPhotos);
//     if (postCount >= photoKeys.length) {
//       postCount = 0;
//     }
//     const key = photoKeys[postCount];
//     const photoAttachments = allPhotos[key]
//       .map((id) => `photo${userId}_${id}`)
//       .join(",");
//     const audioAttachments = audioIds
//       .map((id) => `audio${userId}_${id}`)
//       .join(",");
//     const attachmentsString = [photoAttachments, audioAttachments]
//       .filter((part) => part)
//       .join(",");
//     await api.api.wall.post({
//       from_group: 1,
//       owner_id: group.id,
//       attachments: attachmentsString,
//     });
//     postCount++;
//   }
// }

async function savePhotos(folderNumber, filesArray) {
  const folderKey = "folder" + folderNumber;
  const uploadPromises = filesArray.map((file) => {
    return uploadApi.photoAlbum({
      album_id: albumId,
      source: { values: [{ value: file.value }] },
    });
  });
  const uploadResults = await Promise.all(uploadPromises);
  const attachmentIds = uploadResults.map((result) => result[0].id);
  const photoObject = {};
  photoObject[folderKey] = attachmentIds;
  return photoObject;
}

async function getFilesInfo(folderPath) {
  const files = await fs.readdir(folderPath);
  const fileInfoPromises = files.map(async (file) => {
    const filePath = path.join(folderPath, file);
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      return getFilesInfo(filePath);
    } else {
      const value = path.relative(__dirname, filePath).replace(/\\/g, "/");
      return {
        value: `./${value}`,
        size: stats.size,
        createdAt: stats.birthtime,
      };
    }
  });
  return Promise.all(fileInfoPromises);
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Что-то пошло не так..." });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
