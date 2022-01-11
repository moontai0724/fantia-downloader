import FileSystem from "fs";
import Path from "path";
import Axios from "axios";

export default class Downloader {
  baseDirectory = process.env.DOWNLOAD_PATH;
  constructor(baseDirectoryName) {
    baseDirectoryName = baseDirectoryName.replaceIllegalPathCharacters();
    this.createDirectory(baseDirectoryName);
    this.baseDirectory = Path.resolve(this.baseDirectory, baseDirectoryName);
  }

  createDirectory(directoryName, parentDirectory = "") {
    directoryName = directoryName.replaceIllegalPathCharacters();
    parentDirectory = parentDirectory.replaceIllegalPathCharacters();
    console.log("Create directory: ", directoryName, " in ", Path.resolve(this.baseDirectory, parentDirectory));
    let path = Path.resolve(this.baseDirectory, parentDirectory, directoryName);
    if (FileSystem.existsSync(path)) return;

    FileSystem.mkdirSync(path, { recursive: true });
  }

  async download(url, filename, directoryName = "") {
    filename = filename.replaceIllegalPathCharacters();
    directoryName = directoryName.replaceIllegalPathCharacters();

    const response = await Axios({
      method: "GET",
      url: url,
      responseType: "stream",
      headers: {
        Cookie: `_session_id=${process.env.SESSION_ID}`,
      },
    });
    const extension = Path.extname(new URL(response.data.responseUrl).pathname);
    const path = Path.resolve(this.baseDirectory, directoryName, filename + extension);
    if (FileSystem.existsSync(path)) {
      const fileStat = FileSystem.statSync(path);
      if (fileStat.size == response.headers["content-length"]) {
        console.log(`${filename}${extension} already downloaded, skipped.`);
        return;
      }
    }

    const writer = FileSystem.createWriteStream(path);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", (...messages) => {
        console.log(`${filename}${extension} downloaded.`);
        resolve(messages);
      });
      writer.on("error", (...messages) => {
        console.log(`${filename}${extension} failed to download!`, messages);
        reject(messages);
      });
    });
  }
}
