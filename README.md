# Automated Like All Reactions
**By B0NX | Version 2.3.0**

A BetterDiscord plugin that automatically adds all other reactions to a message after you click one. Features a powerful **continuous mode** to automatically scroll up and like previous posts.

---

## 🚀 Features

* **Continuous Liking Mode:** Click *one* reaction on any message, and the plugin will automatically like all *other* reactions on that same message.
* **Auto-Scroll & Continue:** After finishing a message, the plugin automatically scrolls up to the previous message and repeats the process.
* **Channel-Wide Liking:** It will continue this process, loading older messages as it scrolls, until it reaches the very beginning of the channel.
* **Instant Stop:** You can stop the process at any time by simply pressing the `Backspace` key.
* **Smart Feedback:** Provides toast notifications to let you know when the process starts ("Continuous liking started..."), stops ("Stopped liking all reactions."), or finishes ("Reached the beginning of the channel.").

## 💡 How to Use

* **To Start:** Click any single reaction on a message that you haven't already pressed. The continuous liking process will begin automatically.
* **To Stop:** Press the `Backspace` key at any time. A toast notification will confirm that the process has been stopped.


## ⚙️ Installation

### 1. Prerequisite: ZeresPluginLibrary

This plugin requires the `ZeresPluginLibrary` to function.
* If you don't have it, the plugin will show a pop-up modal when you first enable it, with a button to download the library automatically.
* You can also download it manually from [its GitHub repository](https://github.com/rauenzi/BDPluginLibrary).

### 2. Plugin Installation
1.  Download the `AutomatedLikeAllReactions.plugin.js` file from the latest release.
2.  In Discord, go to `User Settings` > `Plugins` (under the "BetterDiscord" section).
3.  Click the `Open Plugins Folder` button.
4.  Drag the downloaded `.plugin.js` file into that folder.
5.  Go back to Discord and enable the "Automated Like All Reactions" plugin in your plugins list.

## Recent Changelog

### v2.3.0 - Continuous Liking Mode
* **Added:** A new continuous liking mode. After liking one post, the plugin automatically scrolls up and continues to the next one.
* **Added:** The continuous process can be stopped at any time by pressing the `Backspace` key.
* **Added:** Toast notifications for starting and stopping the continuous mode.

### v2.2.0 - User Feedback & Refinements
* **Improved:** Added a toast notification to provide feedback when the plugin is triggered.
* **Improved:** Rewrote the click-handling logic to use modern async/await for better code clarity.
