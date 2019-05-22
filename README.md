# Dailies Server

Download media and post to Instagram using Siri Shortcuts & a web server.

## Usage

1. Create a local server:
    ```javascript
    const DailiesServer = require('@lejeunerenard/dailies-server')
    const DailiesDB = require('@lejeunerenard/dailies-db-json')
    
    const server = new DailiesServer(new DailiesDB())
    server.run()
    ```
2. Get the [Siri
Shortcut](https://www.icloud.com/shortcuts/bdb2d20f0d47440fbc1779385ceb0da9).
3. Configure the shortcut.

    1. Setup URL for the server.  
        This is usually a local ip address with a port of `8000`.
    2. Select a photo album to store your media.
    3. Enter your default hashtags to be placed in the clipboard so you can past
       them in your Instagram post.

## Why

When you take on a daily practice you need to remove as much friction from your
process as possible to help ensure you keep up that practice. For visual artists
or influencers, posting to Instagram everyday means downloading the image and
caption to your phone which can take a while. Airdrop is a great way to get
files from your computer to your phone, but it takes to long and you might not
have a Mac in the first place. Enter Dailies Server.

## References

- [@lejeunerenard/dailies-db-json](https://github.com/lejeunerenard/dailies-db-json)
