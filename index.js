import { default as Dotenv } from "dotenv";
import { default as Entrypoint } from "./src/entrypoint.js";
import Post from "./src/api/post.js";

// Initialize .env file to process.env
Dotenv.config();

(async function start(postId) {
  if (!postId)
    await Entrypoint();
  else
    process.env.post = postId;

  console.log("\n\n");
  console.log(`===== Start download post, id: ${process.env.post} =====`);
  console.log("\n\n");

  let post = new Post(process.env.post);
  await post.save();

  let random = getRandom(3, 8);
  console.log(`Cooldown for ${random} seconds to next post.`);

  let direction = getDirection();
  if (direction == 2)
    return;

  if (!post.data.links[direction ? "next" : "previous"]) {
    console.log("Download completed, no more posts.");
    return;
  }

  setTimeout(() => {
    console.log("Continue to next post, id: ", post.data.links[direction ? "next" : "previous"].id);
    start(post.data.links[direction ? "next" : "previous"].id);
  }, random * 1000);
})();

function getRandom(min, max) {
  return Math.floor(Math.random() * max) + min;
};

function getDirection() {
  if (process.env.DIRECTION == "forward")
    return 1;
  else if (process.env.DIRECTION == "backward")
    return 0;
  else if (process.env.DIRECTION == "once")
    return 2;
  else
    throw new Error("DIRECTION (which is an variable in `.env` file) must be `forward` or `backward`!");
}
