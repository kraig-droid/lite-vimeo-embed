## Lite Vimeo Embed
## Background
This is a fork of https://github.com/paulirish/lite-youtube-embed updated for Vimeo. My updates are based on https://github.com/luwes/lite-vimeo-embed (which was also a fork of lite-youtube-embed.)
Many thanks to [**Paul Irish**](https://github.com/paulirish), [**Wesley Luyten**](https://github.com/luwes), and the other contributors to their repos.
## Notes
**Limitations**:
- Thumbnail image: I removed luwes' old code to lookup the thumbnail as it was no longer working. There is a PR to his repo to get it working again, but it's not something I currently need. (I'm using [Wagtail CMS, embeds](https://docs.wagtail.org/en/stable/advanced_topics/embeds.html#id1) which provides a cached embed lookup including thumbnail.) See https://github.com/luwes/lite-vimeo-embed/issues/13 if you need the thumbnail lookup.

**Effects when clicked**: 
- adds a Vimeo-specific <iframe...> as a child to <lite-vimeo...> with a param of autoplay=1
- loads the Vimeo player API to allow, for instance, pausing the video using JavaScript ([ref](https://developer.vimeo.com/player/sdk))

**Installing**:
```
npm i github:kraig-droid/lite-vimeo-embed#v1.0.1
```

**Importing**: Here's how I do it:

-**JS**:
```
import "lite-vimeo-embed/src/lite-vimeo-embed";
```

-**SCSS**:
```
@import "node_modules/lite-vimeo-embed/src/lite-vimeo-embed";
```

**Usage**:
```
<lite-vimeo videoid="154373242" style="background-image: url('https://i.vimeocdn.com/video/554912674-5b4fc6c5c9041034676a60ecf1cc987c8a79e35ddb4352782efaa7f1cf96f107-d_640');">
	<div class="ltv-playbtn"></div>
</lite-vimeo>
```
or just
```
<lite-vimeo videoid="154373242"></<lite-vimeo>
```
