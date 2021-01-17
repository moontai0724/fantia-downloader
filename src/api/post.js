import Axios from "axios";
import Downloader from "../downloader.js";

export default class Post {
  id;
  title;
  data;
  constructor(postId) {
    this.id = postId;
  }

  async getInformation() {
    console.log("Fetching information for", this.id);
    if (!this.data)
      await Axios.request({
        method: "GET",
        url: `https://fantia.jp/api/v1/posts/${this.id}`,
        headers: {
          Cookie: `_session_id=${process.env.SESSION_ID}`,
        },
      }).then(response => {
        this.data = response.data.post;
        this.title = this.data.title;
      });

    return Promise.resolve(this.data);
  }

  async getContents() {
    let postInfo = await this.getInformation();
    return postInfo.post_contents;
  }

  async getImages() {
    let contents = await this.getContents();
    let images = await Promise.all(contents.map(this.contentImageConverter));
    return images.flat();
  }

  async contentImageConverter(content) {
    if (!content.post_content_photos)
      return Promise.resolve([]);

    let images = content.post_content_photos.map(photo => ({
      type: "image",
      id: photo.id,
      title: content.title,
      filename: "",
      url: photo.url.original,
    }));

    return Promise.resolve(images);
  }

  async getVideos() {
    let content = await this.getContents();
    let videos = await Promise.all(content.map(this.contentVideoConverter));
    return videos.flat();
  }

  async contentVideoConverter(content) {
    if (!content.download_uri)
      return Promise.resolve([]);

    return Promise.resolve({
      type: "video",
      id: content.id,
      title: content.title,
      filename: content.filename,
      url: "https://fantia.jp" + content.download_uri,
    });
  }

  async getMedias() {
    return Promise.resolve({
      images: await this.getImages(),
      videos: await this.getVideos(),
    });
  }

  async save() {
    await this.getInformation();
    let downloader = new Downloader(`${this.id}-${this.title}`);
    console.log("Downloader created for:", `${this.id}-${this.title}`);

    if (this.data.thumb)
      await downloader.download(this.data.thumb.original, `${this.id}-cover.jpg`).then(result => console.log(`cover.jpg downloaded.`));

    let images = await this.getImages();
    console.log(`Total ${images.length} images to download.`);
    await Promise.all(images.map(async image => {
      return await downloader.download(image.url, `${image.id}.jpg`).then(result => console.log(`${image.id}.jpg downloaded.`));
    }));

    let videos = await this.getVideos();
    console.log(`Total ${videos.length} videos to download.`);
    await Promise.all(videos.map(async video => {
      return await downloader.download(video.url, `${video.id}.mp4`).then(result => console.log(`${video.id}.mp4 downloaded.`));
    }));

    console.log("Download success.");
  }
}
