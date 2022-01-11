# What is Fantia downloader?
[Fantia](https://fantia.jp), which is a platform to share photos and arts.  
This downloader is for those who wants to download all medias (both image and video) that created by specific creator.

# Requirements
- [Node.js Environment](https://nodejs.org)
- [Yarn Package Manager](https://classic.yarnpkg.com/en/docs/install/)

# Getting Started
To start download, following is steps:
1. Copy `.env.example` to `.env` and configure it well.
2. Run `yarn install` to install required packages.
3. Run `node .` to start program.
4. CLI will ask for first post id to start, enter first post id to start download automatically!

Note: Post ID can found in URL, for example, if URL is `https://fantia.jp/posts/123456`, then it should be `123456`.  
Note 2: There will have a cooldown between two post for avoid too many requests.

If you found that always display 0 asset to download, please make sure SESSION_ID is up-to-date (brand new).

# Environment Variables
## DOWNLOAD_PATH
Where downloaded files to save, both relative and absolute are acceptable.

## SESSION_ID
This value is used for access member only resources.

To get this value, please follow these steps:
1. Login to [Fantia](https://fantia.jp) with your browser.
2. Open `DevTools` in your browser, which usually can open by press F12.
3. Switch to `Network` tab in DevTools, you will see network requests.
4. Choose any request which is sent by POST method.
5. Switch to `Cookies` tab, which is a sub tab of `Network` tab.
6. You will find a cookie named `_session_id`, copy that value and paste here.

## DIRECTION
Avaliable options: `forward`, `backward`.

Forward, means it will go to **next** post after current post downloaded (To newer post).  
Backward, means it will go to **previous** post after current post downloaded (To older post).

# Known Issues

## Forbidden characters in name on windows (resolved, with side effect)

On windows, there are some characters are forbidden in a file or directory name, so I replaced them into `+` character.

Following characters will be replaced into `+` character: `/`, `\`, `?`, `%`, `*`, `:`, `|`, `"`, `<`, `>`.
