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
    const path = Path.resolve(this.baseDirectory, directoryName, filename);
    if (FileSystem.existsSync(path)) return;

    const writer = FileSystem.createWriteStream(path);

    const response = await Axios({
      method: "GET",
      url: url,
      responseType: "stream",
      headers: {
        Cookie: `_session_id=${process.env.SESSION_ID}`,
      },
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }
}
