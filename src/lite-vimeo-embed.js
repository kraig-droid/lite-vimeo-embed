class LiteVimeoEmbed extends HTMLElement {
    connectedCallback() {
        // Gotta encode the untrusted value
        // https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#rule-2---attribute-escape-before-inserting-untrusted-data-into-html-common-attributes
        this.videoId = encodeURIComponent(this.getAttribute('videoid'));

        let playBtnEl = this.querySelector('.lvim-playbtn');
        // A label for the button takes priority over a [playlabel] attribute on the custom-element
        this.playLabel = (playBtnEl && playBtnEl.textContent.trim()) || this.getAttribute('playlabel') || 'Play';

        // Set up play button, and its visually hidden label
        if (!playBtnEl) {
            playBtnEl = document.createElement('button');
            playBtnEl.type = 'button';
            playBtnEl.classList.add('lvim-playbtn');
            this.append(playBtnEl);
        }
        if (!playBtnEl.textContent) {
            const playBtnLabelEl = document.createElement('span');
            playBtnLabelEl.className = 'lvim-visually-hidden';
            playBtnLabelEl.textContent = this.playLabel;
            playBtnEl.append(playBtnLabelEl);
        }
        playBtnEl.removeAttribute('href');

        // On hover (or tap), warm up the TCP connections we're (likely) about to use.
        this.addEventListener('pointerover', LiteVimeoEmbed.warmConnections, {once: true});

        // Once the user clicks, add the real iframe and drop our play button
        // TODO: In the future we could be like amp-youtube and silently swap in the iframe during idle time
        //   We'd want to only do this for in-viewport or near-viewport ones: https://github.com/ampproject/amphtml/pull/5003
        this.addEventListener('click', this.addIframe);
    }

    /**
     * Add a <link rel={preload | preconnect} ...> to the head
     */
    static addPrefetch(kind, url, as) {
        const linkEl = document.createElement('link');
        linkEl.rel = kind;
        linkEl.href = url;
        if (as) {
            linkEl.as = as;
        }
        document.head.append(linkEl);
    }

    /**
     * Begin pre-connecting to warm up the iframe load
     * Since the embed's network requests load within its iframe,
     *   preload/prefetch'ing them outside the iframe will only cause double-downloads.
     * So, the best we can do is warm up a few connections to origins that are in the critical path.
     *
     * Maybe `<link rel=preload as=document>` would work, but it's unsupported: http://crbug.com/593267
     * But TBH, I don't think it'll happen soon with Site Isolation and split caches adding serious complexity.
     */
    static warmConnections() {
        if (LiteVimeoEmbed.preconnected) return;

        LiteVimeoEmbed.addPrefetch('preconnect', 'https://player.vimeo.com');
        // Images
        LiteVimeoEmbed.addPrefetch('preconnect', 'https://i.vimeocdn.com');
        // Files .js, .css
        // LiteVimeoEmbed.addPrefetch('preconnect', 'https://f.vimeocdn.com');
        // Metrics
        // LiteVimeoEmbed.addPrefetch('preconnect', 'https://fresnel.vimeocdn.com');

        LiteVimeoEmbed.preconnected = true;
    }

    async addIframe(){
        if (this.classList.contains('lvim-activated')) return;
        this.classList.add('lvim-activated');

        const params = new URLSearchParams(this.getAttribute('params') || []);
        params.append('autoplay', '1');
        params.append('playsinline', '1');

        // if (this.needsvimeoApiForAutoplay) {
        //     return this.addVimeoPlayerIframe(params);
        // }

        const iframeEl = document.createElement('iframe');
        iframeEl.width = 640;
        iframeEl.height = 360;
        // No encoding necessary as [title] is safe. https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#:~:text=Safe%20HTML%20Attributes%20include
        iframeEl.title = this.playLabel;
        iframeEl.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
        iframeEl.allowFullscreen = true;
        // AFAIK, the encoding here isn't necessary for XSS, but we'll do it only because this is a URL
        // https://stackoverflow.com/q/64959723/89484
        iframeEl.src = `https://player.vimeo.com/video/${this.videoId}?autoplay=1`;
        this.append(iframeEl);

        // Set focus for a11y
        iframeEl.focus();
    }
}
// Register custom element
customElements.define('lite-vimeo', LiteVimeoEmbed);
