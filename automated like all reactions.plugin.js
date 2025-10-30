/**
 * @name Automated Like All Reactions
 * @author B0NX
 * @description Automatically adds all other reactions to a message after you click one. Can continuously like previous posts.
 * @version 2.3.0
 */

module.exports = (() => {
    // Configuration object for the plugin metadata.
    const config = {
        info: {
            name: "Automated Like All Reactions",
            authors: [{ name: "B0NX", discord_id: "", github_username: "B0NX" }],
            version: "2.3.0",
            description: "Automatically adds all other reactions to a message after you click one. Can continuously like previous posts."
        },
        changelog: [
            {
                title: "V2.3.0 - Continuous Liking Mode",
                type: "added",
                items: [
                    "Added a new continuous liking mode. After liking reactions on one post, the plugin will automatically scroll up and continue to the next one.",
                    "The continuous process can be stopped at any time by pressing the Backspace key.",
                    "Added toast notifications for starting and stopping the continuous mode."
                ]
            },
            {
                title: "V2.2.0 - User Feedback & Refinements",
                type: "improved",
                items: [
                    "Added a toast notification to provide feedback when the plugin is triggered.",
                    "Rewrote the click-handling logic to use modern async/await for better code clarity."
                ]
            }
        ],
        main: "index.js"
    };

    // This function is returned if the ZeresPluginLibrary is not found.
    return !global.ZeresPluginLibrary ? class {
        constructor() { this._config = config; }
        getName() { return config.info.name; }
        getAuthor() { return config.info.authors.map(a => a.name).join(", "); }
        getDescription() { return config.info.description; }
        getVersion() { return config.info.version; }
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() { }
        stop() { }
    } : (([Plugin, Api]) => {
        const { Toasts } = Api;

        return class AutomatedLikeAllReactions extends Plugin {
            constructor() {
                super();
                this.isLikingContinuously = false;
                this.onClick = this.onClick.bind(this);
                this.onKeyDown = this.onKeyDown.bind(this);
            }

            onStart() {
                document.addEventListener("click", this.onClick, { capture: true });
                document.addEventListener("keydown", this.onKeyDown, { capture: true });
            }

            async likeAllReactionsOnMessage(message) {
                if (!message || message.dataset.likeAllInProgress === "true") return;
                message.dataset.likeAllInProgress = "true";

                const reactionsToClick = Array.from(message.querySelectorAll('[role="button"][aria-label*="reaction"]'))
                    .filter(r => r.getAttribute('aria-pressed') !== 'true');

                if (reactionsToClick.length > 0) {
                    Toasts.info(`Liking ${reactionsToClick.length} reaction(s) on a message.`);
                }

                for (const r of reactionsToClick) {
                    // Check if the process has been stopped by the user.
                    if (!this.isLikingContinuously) break;
                    r.click();
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                delete message.dataset.likeAllInProgress;
            }

            async startContinuousLiking(startMessage) {
                this.isLikingContinuously = true;
                Toasts.info("Continuous liking started. Press Backspace to stop.");

                const scroller = startMessage.closest('main [class*="scroller_"]');
                if (!scroller) {
                    Toasts.error("Could not find the chat scroller element.");
                    this.isLikingContinuously = false;
                    return;
                }

                let currentMessage = startMessage;

                while (this.isLikingContinuously) {
                    if (!document.body.contains(currentMessage)) {
                        Toasts.warn("Lost track of the current message, stopping continuous liking.");
                        break;
                    }

                    await this.likeAllReactionsOnMessage(currentMessage);
                    if (!this.isLikingContinuously) break;

                    let previousMessage = currentMessage.previousElementSibling;
                    while (previousMessage && !previousMessage.matches('[role="article"]')) {
                        previousMessage = previousMessage.previousElementSibling;
                    }

                    if (previousMessage) {
                        currentMessage = previousMessage;
                        currentMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        await new Promise(r => setTimeout(r, 1000));
                    } else {
                        const oldScrollHeight = scroller.scrollHeight;
                        scroller.scrollTop = 0;
                        await new Promise(r => setTimeout(r, 2000)); 

                        if (scroller.scrollHeight === oldScrollHeight) {
                            Toasts.success("Reached the beginning of the channel.");
                            break; 
                        }
                        
                        currentMessage = scroller.querySelector('[role="article"]');
                        if (!currentMessage) break;
                    }
                }

                if (this.isLikingContinuously) {
                    Toasts.success("Finished liking all available messages.");
                }
                this.isLikingContinuously = false;
            }
            
            onClick(e) {
                if (this.isLikingContinuously) return;

                const reaction = e.target.closest('[role="button"][aria-label*="reaction"]');
                if (!reaction) return;

                const message = reaction.closest('[role="article"]');
                if (!message || message.dataset.likeAllInProgress) return;

                if (reaction.getAttribute('aria-pressed') === 'true') {
                    return;
                }

                // Instead of just liking one message, start the continuous process.
                this.startContinuousLiking(message).catch(err => {
                    console.error(`[${config.info.name}] Error during continuous liking:`, err);
                    Toasts.error("An error occurred during continuous liking. See console for details.");
                    this.isLikingContinuously = false;
                });
            }

            onKeyDown(e) {
                if (e.key === 'Backspace' && this.isLikingContinuously) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.isLikingContinuously = false;
                    Toasts.info("Stopped liking all reactions.");
                }
            }

            onStop() {
                document.removeEventListener("click", this.onClick, { capture: true });
                document.removeEventListener("keydown", this.onKeyDown, { capture: true });
                this.isLikingContinuously = false;
            }
        };
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
