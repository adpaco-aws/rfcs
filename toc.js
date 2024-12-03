// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="intro.html">Introduction</a></li><li class="chapter-item expanded affix "><a href="0000-template.html">RFC Template</a></li><li class="chapter-item expanded affix "><li class="part-title">Cedar RFCs</li><li class="chapter-item expanded "><a href="0005-is-operator.html">0005-is-operator</a></li><li class="chapter-item expanded "><a href="0009-disallow-whitespace-in-entityuid.html">0009-disallow-whitespace-in-entityuid</a></li><li class="chapter-item expanded "><a href="0019-stricter-validation.html">0019-stricter-validation</a></li><li class="chapter-item expanded "><a href="0020-unique-record-keys.html">0020-unique-record-keys</a></li><li class="chapter-item expanded "><a href="0021-any-and-all-operators.html">0021-any-and-all-operators</a></li><li class="chapter-item expanded "><a href="0024-schema-syntax.html">0024-schema-syntax</a></li><li class="chapter-item expanded "><a href="0032-port-formalization-to-lean.html">0032-port-formalization-to-lean</a></li><li class="chapter-item expanded "><a href="0034-precomputed-entity-attributes.html">0034-precomputed-entity-attributes</a></li><li class="chapter-item expanded "><a href="0048-schema-annotations.html">0048-schema-annotations</a></li><li class="chapter-item expanded "><a href="0052-reserved-namespaces.html">0052-reserved-namespaces</a></li><li class="chapter-item expanded "><a href="0053-enum-entities.html">0053-enum-entities</a></li><li class="chapter-item expanded "><a href="0055-remove-unspecified.html">0055-remove-unspecified</a></li><li class="chapter-item expanded "><a href="0057-general-multiplication.html">0057-general-multiplication</a></li><li class="chapter-item expanded "><a href="0062-extended-has.html">0062-extended-has</a></li><li class="chapter-item expanded "><a href="0068-entity-tags.html">0068-entity-tags</a></li><li class="chapter-item expanded "><a href="0070-disallow-empty-namespace-shadowing.html">0070-disallow-empty-namespace-shadowing</a></li><li class="chapter-item expanded "><a href="0071-trailing-commas.html">0071-trailing-commas</a></li><li class="chapter-item expanded "><a href="0076-entity-slice-validation.html">0076-entity-slice-validation</a></li><li class="chapter-item expanded "><a href="0080-datetime-extension.html">0080-datetime-extension</a></li><li class="chapter-item expanded "><a href="0082-entity-tags.html">0082-entity-tags</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
