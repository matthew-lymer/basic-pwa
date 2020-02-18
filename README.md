A sample PWA.

It's a little different to others I found, mainly to resolve issues with consistency of being able to update and alert the user to available updates!

To apply an update, you have to change "version-x.xx" in all instances (multiple), so a Find/Replace all technique should be used. This version is also used as a query string on cached files to ensure their old versions aren't maintained (SW is meant to resolve this - but when updating regularly, updates were often ignored by my app). This way of doing it ensures it applies the update without fail, and it also gives you a popup to prompt updating (without having to close and reopen the app all the time!)

*Note that this does not work well when hosted from GutHub pages (the caching and delay in applying an update can result in app updates being ignored)
