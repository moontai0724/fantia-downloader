import * as cli from "./cli.js";

export default function () {
  return new Promise(async (resolve, reject) => {
    let postId = await cli.ask("Please enter first post id: ").then(numberValidator).catch(reject);
    process.env.post = postId;
    resolve();
  });
}

function numberValidator(number) {
  if (!number)
    throw new Error("No value provided.");

  if (isNaN(number))
    throw new Error("Invalid value, given value is not a number.");

  return parseInt(number);
}
