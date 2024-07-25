$(document).ready(function() {

    /* ******************************************************************** *
        Note that this is coded by an AI (chatGPT 3 & 4),
        developer has zero clue on how to program anything, in any language,
        which would explain the things you see here.                        
    */


    // Cache frequently used jQuery objects
    var body = $('body');
    var navClanlist = $('.nav_clanlist');
    var linkContainer = $('.commlinks');
    var clan = $('.clans');
    var filteredCountElement = $('#filteredCount');
    var filteredPlayerCountElement = $('#filteredPlayerCount');

    // Set the hash to #pageclans when the page loads
    window.location.hash = 'pageclans';

    
    /* *********************** AUDIO ******************************************************************************************************************** */


    // Audio elements
    var linkSound = $("#toolsound")[0];
    var backgroundSound = new Howl({ src: ['./sound/backgroundaudio.wav'], autoplay: false, loop: true });
    var muteButton = $("#muteButton");

    // Function to stop background music
    function stopBackgroundMusic() {
        backgroundSound.stop();
    }

    // Function to play background music
    function playBackgroundMusic() {
        backgroundSound.play();
    }

    // Initial state of the mute button
    var isMuted = true;
    muteButton.text("🔊");

    // Event listener for link hover
    $("#nav_audio").on("mouseenter", function() {
        if (linkSound.paused) {
            linkSound.play();
        }
    });

    // Event listener for muting/unmuting background music
    muteButton.on("click", function() {
        if (isMuted) {
            playBackgroundMusic();
            muteButton.text("🔈");
        } else {
            stopBackgroundMusic();
            muteButton.text("🔊");
        }
        isMuted = !isMuted; // Toggle mute state
    });


    /* *********************** Construct Sidemenu ******************************************************************************************************************* */


    var container = $(window); // Use window as the scrollable container
    var sections = $('.chapter'); // Select all sections with class 'chapter'
    var menuLinks = $('.pageMenu a');
    var topPadding = 100; // Adjust the top detection padding
    var bottomPadding = 20; // Adjust the bottom detection padding

    container.scroll(function() {
        var scrollPosition = container.scrollTop();

        sections.each(function() {
            var top = $(this).offset().top - topPadding;
            var bottom = top + $(this).outerHeight() + bottomPadding;

            if (scrollPosition >= top && scrollPosition < bottom) {
                var id = $(this).attr('id');
                menuLinks.removeClass('active');
                menuLinks.filter('[href="#' + id + '"]').addClass('active');
            }
        });
    });

    // Smooth scrolling to section when clicking on menu links
    menuLinks.click(function(event) {
        event.preventDefault(); // Prevent the default behavior of anchor links

        var targetId = $(this).attr('href');
        var targetSection = $(targetId);
        if (targetSection.length) {
            var scrollTop = targetSection.offset().top;

            // For the last section, scroll a little deeper into the element
            if ($(this).is(':last-child')) {
                scrollTop += bottomPadding; // Adjust this value as needed
            }

            $('html, body').animate({
                scrollTop: scrollTop
            }, 100); // Adjust the duration as needed
        }
    });


    /* *********************** Construct STORIES ******************************************************************************************************************** */


    // Cache DOM selection for story content and navigation menu
    const storyContent = $('.storycontent');
    const navStoriesMenu = $('#nav_storiesmenu');
    let cachedStories = null;

    // Function to fetch stories
    function fetchStories() {
        return fetch('./stories.json').then(res => res.json());
    }

    // Function to render stories and navigation menu
    function renderStories(data) {
        const wrapper = $('<div id="storiesWrapper"></div>');
        const navLinks = []; // Array to store navigation links
        data.forEach(post => {
            // Generate HTML for story section
            const story = $(`
                <div id="decoratedHeader">
                    <div class="deco"><div class="lineRight"></div><div class="lineLeft"></div></div>
                    <div id="h3"><div class="storyauthor"><span id="${post.story[0]}">${post.story[1]}</span> - ${post.story[2]}</div></div>
                    <div class="deco"><div class="lineRight"></div><div class="lineLeft"></div></div>
                </div>
                <div id="chapter" tabindex="0">
                    <div id="storyheader">
                        <div id="storywrapper"><div id="storyavatar"><img src="./img/avatars/${post.story[3]}" alt="avatar of ${post.story[0]}"></div></div>
                        <div id="storywrapper">
                            <div id="storytitle">${post.story[6]}</div>
                            <div id="storysource">${post.story[4]}, on ${post.story[5]}</div>
                        </div>
                    </div>
                    <div id="quotecontainer">
                        <div id="longread" tabindex="0" style='min-height: 300px;'><div id="readmore">Click to read more</div><div style="margin: 15px">${post.story[7]}</div></div>
                    </div>
                </div>
            `);
            wrapper.append(story);

            // Generate HTML for navigation link
            const navLink = `<div><a href="#${post.story[0]}" class="story-link" data-id="${post.story[0]}">${post.story[1]}</a></div>`;
            navLinks.push(navLink);
        });

        // Append stories to story content
        storyContent.empty().append(wrapper);
        storyContent.data('storiesLoaded', true);

        // Append navigation links to navigation menu
        navStoriesMenu.empty().append(navLinks.join(' '));

        // Update URL hash
        window.location.hash = 'pagestories';
    }

    // Function to fetch and render stories if necessary
    function fetchAndRenderStories() {
        if (!storyContent.data('storiesLoaded')) {
            if (cachedStories) {
                renderStories(cachedStories);
            } else {
                fetchStories().then(data => {
                    cachedStories = data;
                    renderStories(data);
                }).catch(err => {
                    console.error('Error fetching stories:', err);
                });
            }
        }
    }

    // Function to check if #pagestories is in the URL
    function loadStoriesIfPageStoriesInURL() {
        if (window.location.hash === '#pagestories') {
            fetchAndRenderStories();
        }
    }

    // Check on initial load
    loadStoriesIfPageStoriesInURL();

    // Event listener for clicks on nav elements with a link to #pagestories
    navClanlist.on('click', 'a[href="#pagestories"]', function(event) {
        event.preventDefault();
        window.location.hash = 'pagestories';
    });

    // Listen for hashchange event to handle navigation with #pagestories in the URL
    window.addEventListener('hashchange', loadStoriesIfPageStoriesInURL);

    // Event listener for clicks on story links in navigation menu
    navStoriesMenu.on('click', '.story-link', function(event) {
        event.preventDefault();
        const targetId = $(this).data('id');
        const targetElement = $('#' + targetId);
        const paddingTop = 80; // Adjust this value to set the desired padding
        if (targetElement.length) {
            $('html, body').animate({
                scrollTop: targetElement.offset().top - paddingTop // Subtract the padding from the scroll position
            }, 200);
        }
    });


    /* *********************** Construct PATCHNOTES ******************************************************************************************************************** */


    // Cache DOM selections for patch note containers
    const patchnoteIon = $('.tablefooterinsertIon');
    const patchnoteCBP = $('.tablefooterinsertCBP');
    const patchnoteMTL = $('.tablefooterinsertMTL');

    // Function to fetch and render patch notes
    function fetchAndRenderPatchNotes() {
        fetch('./patchnoteslist.json')
            .then(res => res.json())
            .then(data => {
                data.forEach(post => {
                    const patchNotesIonHtml = post.patchNotesIon.map(p => p['patch']).join('<br /><div class="deco"><div class="lineRight"></div><div class="lineLeft"></div></div><br />');
                    const patchNotesCBPHtml = post.patchNotesCBP.map(p => p['patch']).join('<br /><div class="deco"><div class="lineRight"></div><div class="lineLeft"></div></div><br />');
                    const patchNotesMTLHtml = post.patchNotesMTL.map(p => p['patch']).join('<br /><div class="deco"><div class="lineRight"></div><div class="lineLeft"></div></div><br />');

                    patchnoteIon.append(`<div class='tablefooterinsertedElement' tabindex="0">${patchNotesIonHtml}</div>`);
                    patchnoteCBP.append(`<div class='tablefooterinsertedElement' tabindex="0">${patchNotesCBPHtml}</div>`);
                    patchnoteMTL.append(`<div class='tablefooterinsertedElement' tabindex="0">${patchNotesMTLHtml}</div>`);
                });
            })
            .catch(err => {
                console.error('Error fetching patch notes:', err);
            });
    }

    // Call the function to fetch and render patch notes
    fetchAndRenderPatchNotes();


    /* *********************** Construct LINKS ******************************************************************************************************************** */


    // Function to fetch links
    function fetchLinks() {
        return fetch('./linklist.json')
            .then(res => res.json())
            .then(data => data.filter(item => item.linkContent || item.threadContent)); // Filter out items without linkContent or threadContent
    }

    // Function to render web links
    function renderLinks(data) {
        const linkRows = data.filter(item => item.linkContent).map(post => {
            const linkContent = post.linkContent;
            const link2 = linkContent[5] ? `<td class="link2"><a class="pagelink" href="${linkContent[5]}">${linkContent[6]}</a></td>` : '<td class="link2"></td>';
            return `
                <tr id="listitem">
                    <td class="linkWeight">${linkContent[1]}</td>
                    <td class="linkYear">${linkContent[0]}</td>
                    <td class="linkDescription">${linkContent[2]}</td>
                    <td class="link1"><a class="pagelink" href="${linkContent[3]}">${linkContent[4]}</a></td>
                    ${link2}
                    <td id="linkExtra">${linkContent[7]}</td>
                </tr>
            `;
        }).join('');
        $('.commlinks').append(linkRows);
        linkContainer.data('linksLoaded', true);
        window.location.hash = 'pagelinks';
        bindSortingFunction();
    }

    // Function to render thread links
    function renderThreads(data) {
        const threadRows = data.filter(item => item.threadContent).map(post => {
            const threadContent = post.threadContent;
            // Render thread content here
            return `
                <tr id="listitem">
                    <td class="linkWeight">${threadContent[1]}</td>
                    <td class="linkYear">${threadContent[0]}</td>
                    <td class="linkDescription">${threadContent[2]}</td>
                    <td class="link1"><a class="pagelink" href="${threadContent[3]}">${threadContent[4]}</a></td>
                    ${link2}
                    <td id="linkExtra">${threadContent[7]}</td>
                </tr>
            `;
        }).join('');
        $('.threadlinks').append(threadRows);
        linkContainer.data('linksLoaded', true);
        window.location.hash = 'pagelinks';
        bindSortingFunction();
    }

    // Fetch and render links and threads
    function fetchAndRenderLinks() {
        fetchLinks()
            .then(data => {
                renderLinks(data);
                renderThreads(data);
            })
            .catch(err => {
                console.error('Error fetching links:', err);
            });
    }

    // Function to check if #pagelinks is in the URL
    function loadLinksIfPageLinksInURL() {
        if (window.location.hash === '#pagelinks') {
            fetchAndRenderLinks();
        }
    }

    // Check on initial load
    loadLinksIfPageLinksInURL();

    // Event listener for clicks on nav elements with a link to #pagelinks
    navClanlist.on('click', 'a[href="#pagelinks"]', function(event) {
        event.preventDefault();
        window.location.hash = 'pagelinks';
    });

    // Listen for hashchange event to handle navigation with #pagelinks in the URL
    window.addEventListener('hashchange', loadLinksIfPageLinksInURL);

    // Function to sort the table by column index
    function sortTable(tableClass, n) {
        var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        rows = $(`.${tableClass}`)[0].rows;
        switching = true;
        dir = "asc";
        while (switching) {
            switching = false;
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
            } else {
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }

    // Function to bind sorting function to the header elements
    function bindSortingFunction(tableClass) {
        $(`.${tableClass} th`).on('click', function() {
            var index = $(this).index();
            sortTable(tableClass, index);
        });
    }

    // Call bindSortingFunction for both commlinks and threadlinks tables
    bindSortingFunction('commlinks');
    bindSortingFunction('threadlinks');


/* *********************** Construct TIMELINE  ******************************************************************************************************************** */

    // Function to fetch and render data from archive.json
    function fetchAndRenderArchiveData() {
        return fetch('./archive.json')
            .then(res => res.json())
            .then((data) => {
                data.forEach(post => {
                    // Cache DOM selections for popover contents
                    var popoverContent = $(`#popover${post.popoverId}Content`);
                    popoverContent.append(post.content);
                    // Check if the popover content has already been inserted
                    if (!popoverContent.data('popoverInitialized')) {
                        initializePopover($(`#Pop${post.popoverId}`), popoverContent);
                        // Mark the popover content as initialized
                        popoverContent.data('popoverInitialized', true);
                    }
                });
            })
            .catch(err => {
                console.error('Error fetching archive data:', err);
            });
    }

    // Function to initialize popover for timeline elements
    function initializePopover(trigger, content) {
        trigger.popover({ html: true, content: () => content.html(), container: 'body' }); // Set container to 'body' to ensure the popover is not constrained by parent z-index
    }

    // Function to load data and initialize popovers when the page loads
    function loadPageData() {
        var archiveLoaded = $('#popoverSclanContent').data('archiveLoaded');
        if (!archiveLoaded) {
            fetchAndRenderArchiveData().then(() => {
                $('#popoverSclanContent').data('archiveLoaded', true);
            });
        }
    }

    // Load page data when the page loads
    loadPageData();

    // Function to calculate the highest z-index in the DOM
    function calculateHighestZIndex() {
        var elements = $('*');
        var maxZIndex = Math.max.apply(null, $.map(elements, function(element) {
            var zIndex = parseInt($(element).css('zIndex'));
            return isNaN(zIndex) ? 0 : zIndex;
        }));
        return maxZIndex;
    }

    // Function to set z-index for popover content
    function setPopoverZIndex() {
        var highestZIndex = calculateHighestZIndex();
        var popoverContent = $('.popover-content');
        var newZIndex = highestZIndex + 1; // Increase z-index by 1 to ensure popover content is on top
        popoverContent.css('z-index', newZIndex);
    }

    // Event listener for clicks on popover content
    $('body').on('mousedown', '.popover', function(e) {
        e.preventDefault();
        setPopoverZIndex(); // Update z-index when popover is clicked
    });

    // Call setPopoverZIndex initially to set z-index for existing popovers
    setPopoverZIndex();

    // Scroll to the popover content if it's far outside the viewport
    $(document).on('shown.bs.popover', '[data-style=mypops]', function() {
        var popoverTopOffset = $('.popover').offset().top;
        $('html, body').animate({
            scrollTop: popoverTopOffset
        }, 100);
    });


    /* *********************** Construct CLANS ************************************************************************************************************************ */


    // Function to calculate the total number of matches where match[6] is "isCertain"
    function calculateTotalMatches(matches) {
        let totalMatches = 0;
        matches.forEach(match => {
            if (match.match[6] === "isCertain") {
                totalMatches++;
            }
        });
        return totalMatches;
    }

    function calculateOpponentPercentage(matches) {
        const opponentResults = {}; // Store results for each unique opponent ID
    
        // Group matches by opponent ID
        const groupedMatches = matches.reduce((acc, match) => {
            if (match.match[6] === "isCertain") {
                const opponentID = match.match[1];
                if (!acc[opponentID]) {
                    acc[opponentID] = [];
                }
                acc[opponentID].push(match);
            }
            return acc;
        }, {});
    
        // Process each group of matches
        for (const [opponentID, group] of Object.entries(groupedMatches)) {
            let totalRatedMatches = 0;
            let winMatches = 0;
            let drawDisputedMatches = 0;
    
            // Count total, win, draw, and disputed matches for the current opponent ID
            group.forEach(match => {
                const matchResult = match.match[3];
                if (matchResult.includes("Win")) {
                    winMatches++;
                    totalRatedMatches++;
                } else if (matchResult.includes("Draw") || matchResult.includes("Disputed")) {
                    drawDisputedMatches++;
                    totalRatedMatches++;
                } else if (matchResult.includes("Loss")) {
                    totalRatedMatches++;
                }
            });
    
            // Calculate the win percentage for this opponent ID
            const winPercentage = totalRatedMatches > 0 ? ((2 * winMatches + drawDisputedMatches) / (2 * totalRatedMatches)) * 100 : 0;
    
            // Categorize the result based on the win percentage
            if (winPercentage > 50) {
                opponentResults[opponentID] = 'Win';
            } else if (winPercentage < 50) {
                opponentResults[opponentID] = 'Loss';
            } else {
                opponentResults[opponentID] = 'Draw';
            }
        }
    
        return opponentResults;
    }
    
    function calculateWinPercentage(finalResults) {
        let totalRatedMatches = 0; // Total count of matches with any status
        let winMatches = 0;
        let drawDisputedMatches = 0;
    
        // Count occurrences based on finalResults
        for (const result of Object.values(finalResults)) {
            if (result === 'Win') {
                winMatches++;
                totalRatedMatches++; // Increment totalRatedMatches for a Win
            } else if (result === 'Draw') {
                drawDisputedMatches++;
                totalRatedMatches++; // Increment totalRatedMatches for a Draw
            } else if (result === 'Loss') {
                totalRatedMatches++; // Increment totalRatedMatches for a Loss
            }
        }
    
        // Calculate the win percentage using the provided formula
        const winPercentage = totalRatedMatches > 0 ? ((2 * winMatches + drawDisputedMatches) / (2 * totalRatedMatches)) * 100 : 0;
    
        return winPercentage;
    }

    function calculateWinPercentageAll(matches) {
        let totalRatedMatches = 0; // Unique variable to count matches labeled as "Win", "Loss", "Draw", "Disputed"
        let winMatches = 0;
        let drawDisputedMatches = 0;
    
        // Count total, win, draw, and disputed matches
        matches.forEach(match => {
            if (match.match[6] === "isCertain") {
                const matchResult = match.match[3];
                if (matchResult.includes("Win")) {
                    winMatches++;
                    totalRatedMatches++; // Increment totalRatedMatches only for valid matches
                } else if (matchResult.includes("Draw") || matchResult.includes("Disputed")) {
                    drawDisputedMatches++;
                    totalRatedMatches++; // Increment totalRatedMatches only for valid matches
                } else if (matchResult.includes("Loss")) {
                    totalRatedMatches++; // Increment totalRatedMatches only for valid matches
                }
            }
        });
    
        // Calculate the win percentage using the provided formula
        const winPercentage = totalRatedMatches > 0 ? ((2 * winMatches + drawDisputedMatches) / (2 * totalRatedMatches)) * 100 : 0;
    
        return winPercentage;
    }

    function calculateWinPercentageByType(matches) {
        const types = [
            { name: 'ATDM', criteria: [/\bATDM\b|\batdm\b/i] },
            { name: 'CTDM', criteria: [/\bCTDM\b|\bctdm\b|\bCustom TDM\b/i] },
            { name: 'BTDM', criteria: [/\bBTDM\b|\bbtdm\b/i] },
            { name: 'Zero Aug', criteria: [/\b0a\b|\bs0a\b|\bstandard 0a|\bstandard zero-aug|\bzero aug\b|\bZero aug|\bzero-aug|\b0 Aug|\b0A\b/i] },
            { name: 'Mod', criteria: [/\bctf\b|\bmod\b|\bdxag\b|\brpg\b|\bcdx\b/i] }
        ];
    
        const results = {};
    
        types.forEach(type => {
            const filteredMatches = filterMatchesByType(matches, type.criteria);
            if (filteredMatches.length > 0) {
                results[type.name] = calculateWinPercentageAllWithColor(filteredMatches);
            }
        });
    
        return results;
    }
    
    function filterMatchesByType(matches, criteria) {
        return matches.filter(match => criteria.some(regex => regex.test(match.match[5])));
    }

    function calculateWinPercentageWithColor(matches) {
        const finalResults = calculateOpponentPercentage(matches);
        const winPercentage = calculateWinPercentage(finalResults);
        
        // Set the color based on percentile
        let color;
        if (winPercentage >= 66) {
            color = 'rgb(0, 161, 0)'; // Top 33% percentile
        } else if (winPercentage >= 33) {
            color = 'yellow'; // Middle 33% percentile
        } else {
            color = 'rgb(153, 5, 5)'; // Below 33% percentile or no results
        }
        
        // Return the win percentage with color formatting
        return `<span style="color: ${color};">${winPercentage.toFixed(2)}%</span>`;
    }

    function calculateWinPercentageAllWithColor(matches) {
        const winPercentage = calculateWinPercentageAll(matches);
    
        // Set the color based on percentile
        let color;
        if (winPercentage >= 66) {
            color = 'rgb(0, 161, 0)'; // Top 33% percentile
        } else if (winPercentage >= 33) {
            color = 'yellow'; // Middle 33% percentile
        } else {
            color = 'rgb(153, 5, 5)'; // Below 33% percentile or no results
        }
    
        // Return the win percentage with color formatting
        return `<span style="color: ${color};">${winPercentage.toFixed(2)}%</span>`;
    }

    function renderMatchStatistics(matches) {
        const overallWinPercentage = calculateWinPercentageWithColor(matches);
        const typePercentages = calculateWinPercentageByType(matches);
    
        let html = `<div>Relative strength compared to opponents<br /><br />Overall Rating: ${overallWinPercentage}</div>`;
    
        for (const [type, percentage] of Object.entries(typePercentages)) {
            html += `<div>${type} Rating: ${percentage}</div>`;
        }
    
        return html;
    }

    // Function to count all non-repeating IDs of pidPlusName[0] excluding "member"
    function countNonRepeatingIDs(data) {
        let ids = [];
        data.forEach(post => {
            post.members.forEach(member => {
                member.membergroup.forEach(group => {
                    if (group.pidPlusName[0] !== "member" && !ids.includes(group.pidPlusName[0])) {
                        ids.push(group.pidPlusName[0]);
                    }
                });
            });
        });
        return ids.length;
    }

    // Function to render clans
    function renderClans(data) {
        let html = ''; // Initialize HTML string

        // Loop through each JSON object
        data.forEach(post => {
            // Initialize empty strings for various cells
            let membersCellHTML = '';
            let members2CellHTML = '';
            let matchesCellHTML = '';
            let websiteCellHTML = '';
            let forumCellHTML = '';
            let backgroundCellHTML = '<td id="clan_scroll_background"><div></div></td>';
            let newsCellHTML = '';

            // Check if the 'websites' array is not empty
            if (post.websites.length > 0) {
                // Construct the HTML for the website cell
                websiteCellHTML = post.websites.map(website => {
                    if (website.website[1] !== '') {
                        return `<div class="clanurlWrapper" data-toggle="tooltip" data-placement="auto top" title="${website.website[0]}"><a href="${website.website[1]}" class="${website.website[2]}">📄</a></div>`;
                    }
                    return '';
                }).join('');
            }

            // Check if the 'forums' array is not empty
            if (post.forums.length > 0) {
                // Construct the HTML for the forum cell
                forumCellHTML = post.forums.map(forum => {
                    if (forum.forum[1] !== '') {
                        return `<div class="clanurlWrapper" data-toggle="tooltip" data-placement="auto top" title="${forum.forum[0]}"><a href="${forum.forum[1]}" class="${forum.forum[2]}">📝</a></div>`;
                    }
                    return '';
                }).join('');
            }

            // Check if the 'background' array is not empty and contains non-empty 'backgroundStory' arrays
            if (post.background.length > 0 && post.background.some(item => item.backgroundStory[3] !== '')) {
                // Construct the HTML for the background cell
                backgroundCellHTML = post.background.map(background => {
                    if (background.backgroundStory[3] !== '') {
                        return `<div class='clanBackground' data-toggle="tooltip" data-placement="auto top" title="${background.backgroundStory[0]}"><span class='clanAuthor'><a href='#${background.backgroundStory[1]}'>${background.backgroundStory[2]}</a></span><span class='clanStory'><q>${background.backgroundStory[3]}</q></span></div>`;
                    }
                    return '';
                }).join('');
                backgroundCellHTML = `<td id="clan_scroll_background">${backgroundCellHTML}</td>`;
            }

            // Function to calculate the total number of members in each membergroup
            function calculateTotalMembers(members) {
                let totalMembers = 0;
                members.forEach(member => {
                    member.membergroup.forEach(group => {
                        if (!group.membergroupLabel[0].includes("duplicate")) {
                            totalMembers += 1;
                        }
                    });
                });
                return totalMembers;
            }

            // Check if the 'members' array is not empty
            if (post.members.length > 0) {
                // Construct the HTML for the members cell
                membersCellHTML = post.members.map(member => {
                    // Extracting all pidPlusName[1] values from all membergroups
                    const memberGroupsHTML = member.membergroup.map(group => {
                        if (group.pidPlusName[1] !== undefined && group.pidPlusName[1] !== '') {
                            return `<div class="membergroupLabel"  data-toggle="tooltip" data-placement="auto top" title="${group.membergroupLabel[0]}">${group.membergroupLabel[1]}</div><div class="clanmember" data-toggle="tooltip" data-html="true" data-placement="auto top" title="<h1>${group.pidPlusName[1]}</h1><br />Aliases: ${group.aliases}<br /><br />Previous clans: ${group.pastClanIDs}<br /><br />Joined: ${group.membership[0]}<br />Quit: ${group.membership[1]}<br /><br />${group.membership[2]}<br /><br />Stats: ${group.stats[0]}<br /><br />${group.stats[1]}">${group.pidPlusName[1]}</div>`;
                        }
                        return '';
                    }).join('');
                    if (memberGroupsHTML !== '') {
                        return `<div class="membergroup">${memberGroupsHTML}</div>`;
                    }
                    return '';
                }).join('');
                membersCellHTML = `<div class="members"><div class="memberCountWrapper">(${calculateTotalMembers(post.members)})</div><div class="clanRoster">${membersCellHTML}</div></div>`;
            }

            // Check if the 'members_2' array is not empty
            if (post.hasOwnProperty('members_2') && post['members_2'].length > 0) {
                // Construct the HTML for the members_2 cell
                members2CellHTML = post.members_2.map(member => {
                    // Extracting all pidPlusName[1] values from all membergroups
                    const memberGroups2HTML = member.membergroup.map(group => {
                        if (group.pidPlusName[1] !== undefined && group.pidPlusName[1] !== '') {
                            return `<div class="membergroupLabel"  data-toggle="tooltip" data-placement="auto top" title="${group.membergroupLabel[0]}">${group.membergroupLabel[1]}</div><div class="clanmember" data-toggle="tooltip" data-html="true" data-placement="auto top" title="<h1>${group.pidPlusName[1]}</h1><br />Aliases: ${group.aliases}<br /><br />Previous clans: ${group.pastClanIDs}<br /><br />Joined: ${group.membership[0]}<br />Quit: ${group.membership[1]}<br /><br />${group.membership[2]}<br /><br />Stats: ${group.stats[0]}<br /><br />${group.stats[1]}">${group.pidPlusName[1]}</div>`;
                        }
                        return '';
                    }).join('');
                    if (memberGroups2HTML !== '') {
                        return `<div class="membergroup">${memberGroups2HTML}</div>`;
                    }
                    return '';
                }).join('');
                members2CellHTML = `<div class="members2"><div class="memberCountWrapper">(${calculateTotalMembers(post['members_2'])})</div><div class="membergroupLabel"></div><div class="clanRoster">${members2CellHTML}</div></div>`;
            }

            // Check if the 'matches' array is not empty
            if (post.matches.length > 0) {
                // Split matches into two arrays based on match[6] value
                const discussedMatches = [];
                const otherMatches = [];
                post.matches.forEach(match => {
                    if (match.match[1] !== '') {
                        if (match.match[6] === 'isDiscussed') {
                            discussedMatches.push(match);
                        } else {
                            otherMatches.push(match);
                        }
                    }
                });

                // Helper function to determine match type class
                const getMatchTypeClass = (matchString) => {
                    if (/\b0a\b|\bs0a\b|\bstandard 0a|\bstandard zero-aug|\bzero aug\b|\bZero aug|\bzero-aug|\b0 Aug|\b0A\b/i.test(matchString)) {
                        return 'matchtype0a';
                    } else if (/\bATDM\b|\batdm\b/i.test(matchString)) {
                        return 'matchtypeATDM';
                    } else if (/\bBTDM\b|\bbtdm\b/i.test(matchString)) {
                        return 'matchtypeBTDM';
                    } else if (/\bCTDM\b|\bctdm\b|\bCustom TDM\b/i.test(matchString)) {
                        return 'matchtypeCTDM';
                    } else if (/\bctf\b|\bmod\b|\bdxag\b|\brpg\b|\bcdx\b/i.test(matchString)) {
                        return 'matchtypeMod';
                    }
                    return '';
                };

                // Construct the HTML for the matches cell
                matchesCellHTML = otherMatches.concat(discussedMatches).map(match => {
                    if (match.match[1] !== '') {
                        const matchTypeClass = getMatchTypeClass(match.match[5]); // Determine the match type class
                        return `
                            <span data-matchid="${match.match[0]}" data-toggle="tooltip" data-html="true" data-placement="auto bottom" title="${match.match[4]}<br />${match.match[5]}">
                                <div class='match${match.match[6]}'>
                                    ${post.tag[1]}${post.tag[2]}${post.tag[3]} vs <a class="matchOpponent" href="#${match.match[0]}">${match.match[2]}</a>
                                    <span id='matchResult' class='match${match.match[3]}'>${match.match[3]}</span>
                                    ${matchTypeClass ? `<span class="${matchTypeClass}"></span>` : ''}
                                </div>
                            </span>
                        `;
                    }
                    return '';
                }).join('');
            }

            // Check if the 'news' array is not empty
            if (post.news.length > 0) {
                // Construct the HTML for the news cell
                newsCellHTML = post.news.map(news => {
                    if (news.article[4] !== '') {
                        return `<div id="${news.article[5]}" data-toggle="tooltip" data-placement="auto top" title="${news.article[0]}" class="clanNewsArt" data-date="${news.article[1]}"><div id="newsdate">${news.article[1]}</div><div id="newstitle">${news.article[2]}</div><div id="newsbody">${news.article[4]}</div><div id="newsauthor">- ${news.article[3]}</div></div>`;
                    }
                    return '';
                }).join('');
            }

            // Construct HTML for each clan row
            html += `
                <tr class="clan_addedrows" tabindex="0" data-id="${post.id}">
                    <td><div id="clan_sticky_tier"><div class="tier${post.tier[0]}">${post.tier[0]}</div><div class="tier${post.tier[1]}">${post.tier[1]}</div><div class="tier${post.tier[2]}">${post.tier[2]}</div></td>
                    <td><div id="clan_sticky_tag">${post.tag[1]}${post.tag[2]}${post.tag[3]}</div></td>
                    <td><div id="clan_sticky_name"><div id="${post.id}">${post.name} <span data-toggle="tooltip" data-placement="auto top" title="${post.flag[1]}">${post.flag[0]}</span></div></div></td>
                    <td><div id="clan_sticky_date">
                        ${post.date[1] ? `<div id="${post.date[0]}">B ${post.date[1]}</div>` : ''}
                        ${post.date[3] ? `<div id="${post.date[2]}">† ${post.date[3]}</div>` : ''}
                        ${post.date[5] ? `<div id="${post.date[4]}">R ${post.date[5]}</div>` : ''}
                        </div></td>
                    <td><div id="clan_sticky_founder">${post.founder.join(', ')}</div></td>
                    <td id="clan_scroll_members">${membersCellHTML}${members2CellHTML}</td>
                    ${matchesCellHTML ? `
                        <td id="clan_scroll_matches">
                            <div class="matchesCountWrapper">
                                (<span data-toggle="tooltip" data-placement="auto top" title="Number of confirmed matches <br /><br />(nb: records are very incomplete!)">${calculateTotalMatches(post['matches'])}</span>) 
                                <span data-toggle="tooltip" data-html="true" data-placement="auto top" title="${renderMatchStatistics(post['matches']).replace(/"/g, '&quot;')}">Clans ${calculateWinPercentageWithColor(post['matches'])}
                                (Matches ${calculateWinPercentageAllWithColor(post['matches'])}</span>)
                            </div>
                            ${matchesCellHTML}
                        </td>
                    ` : '<td id="clan_scroll_matches"></td>'}
                    ${websiteCellHTML ? `<td><div id="clan_sticky_site">${websiteCellHTML}</div></td>` : '<td><div id="clan_sticky_site"></div></td>'}
                    ${forumCellHTML ? `<td><div id="clan_sticky_site">${forumCellHTML}</div></td>` : '<td><div id="clan_sticky_site"></div></td>'}
                    <td id="clan_scroll_description"><span>${post.description}</span></td>
                    ${backgroundCellHTML}
                    <td><div id="clan_sticky_game">${post.gametype.join('<br /> ')}</div></td>
                    ${newsCellHTML ? `<td><div id="clan_scroll_news">${newsCellHTML}</div></td>` : '<td><div id="clan_scroll_news"></div></td>'}
                </tr>
            `;
        });

        // Set innerHTML of clan element
        clan.html(html);
        filteredCountElement.text(filteredCount); // Update filtered count element

        // Count non-repeating IDs and update DOM element
        const nonRepeatingIDsCount = countNonRepeatingIDs(data);
        filteredPlayerCountElement.text(nonRepeatingIDsCount);

        // Initialize tooltips for elements with the data-toggle="tooltip" attribute
        $('[data-toggle="tooltip"]').tooltip({
            // Set the html option to true to allow HTML content in the tooltip
            html: true,
        });
    }

    // Declare variables for filtered data and checkbox states
    let filteredData;
    let filteredCount = 0; // Initialize filtered count
    let showOnlyMultipleMembers = false;
    let showOnlyCertainMatches = false;

    // Function to render clans based on the checkbox state
    function renderClansBasedOnCheckbox() {
        let clansToRender = filteredData;

        // Filter based on checkbox state for multiple members
        if (showOnlyMultipleMembers) {
            clansToRender = clansToRender.filter(post => post.members.some(member => member.membergroup.length > 1));
        }

        // Filter based on checkbox state for certain matches
        if (showOnlyCertainMatches) {
            clansToRender = clansToRender.filter(post => post.matches.some(match => match.match.includes("isCertain")));
        }

        // Update filtered count
        filteredCount = clansToRender.length;

        // Render clans with the filtered data
        renderClans(clansToRender);
    }

    // Function to filter data based on selected value
    function filterData(data, filterValue) {
        if (filterValue === 'All') {
            filteredData = data;
        } else {
            filteredData = data.filter(post => post.gametype.includes(filterValue));
        }

        // Update filtered count and render clans based on checkbox states
        filteredCount = filteredData.length;
        renderClansBasedOnCheckbox();
    }

    // Fetch JSON data and render clans
    $.getJSON('./clanlist.json', function(data) {
        let ascendingOrderDate = true; // Variable to track current sort order for date
        let ascendingOrderTag = true; // Variable to track current sort order for tag
        let ascendingOrderName = true; // Variable to track current sort order for name
        let ascendingOrderFounders = true; // Variable to track current sort order for founder
        let sortByTotalMatches = true; // Define a flag variable to toggle between sorting by total matches and win percentage

        // Sort data based on the number of matches (initial sorting)
        data.sort(function(a, b) {
            // Calculate the total number of matches for each post
            const totalMatchesA = calculateTotalMatches(a.matches);
            const totalMatchesB = calculateTotalMatches(b.matches);
            
            // Compare the total number of matches
            return totalMatchesB - totalMatchesA;
        });

        // Render clans based on sorted data
        renderClans(data);

        // Add click event listener to anchor tags within marqueeMinibanners
        $('.marqueeMinibanners a').on('click', function(event) {
            // Prevent the default anchor behavior
            event.preventDefault();

            // Get the href attribute of the clicked link
            var href = $(this).attr('href');

            // Check if the href is an anchor link
            if (href.startsWith('#')) {
                // Extract the ID from the href (remove the leading '#')
                var id = href.substring(1);

                // Find the corresponding clan list row with the matching ID
                var $targetRow = $('.clan_addedrows[data-id="' + id + '"]');

                // Check if the target row exists
                if ($targetRow.length > 0) {
                    // Define padding for the top of the viewport
                    const paddingTop = 200;

                    // Scroll to the target row with padding
                    $('html, body').animate({
                        scrollTop: $targetRow.offset().top - paddingTop
                    }, 500, function() {
                        // Animation complete callback
                        // Create a border overlay div
                        const $borderOverlay = $('<div class="border-overlay"></div>').css({
                            position: 'absolute',
                            top: $targetRow.offset().top - 2, // Adjusted top position with a little padding
                            left: $targetRow.offset().left - 2, // Adjusted left position with a little padding
                            width: $targetRow.outerWidth() + 4, // Adjusted width to make the border wider
                            height: $targetRow.outerHeight() + 4, // Adjusted height to make the border wider
                            border: '2px solid red',
                            borderRadius: $targetRow.css('borderRadius'), // Match the border radius of the row
                            pointerEvents: 'none', // Allow clicking through the overlay
                            zIndex: 9999 // Ensure the overlay appears above other content
                        }).appendTo('body');

                        // Fade out the border overlay
                        $borderOverlay.fadeOut(2000, function() {
                            // Remove the overlay after fading out
                            $(this).remove();
                        });
                    });
                } else {
                    console.log('No matching row found for ID: ' + id);
                }
            }
        });

        // Listen for changes in the filter select element
        $('#filterSelect').change(function() {
            const filterValue = $(this).val();
            filterData(data, filterValue);
        });

        // Add event listener for sorting by number of matches
        $('#item-matches').click(function() {
            // Sort filtered data based on the sorting criteria
            filteredData.sort(function(a, b) {
                // Compute finalResults for each item
                const finalResultsA = calculateOpponentPercentage(a.matches);
                const finalResultsB = calculateOpponentPercentage(b.matches);

                // Calculate win percentage based on finalResults
                const winPercentageA = calculateWinPercentage(finalResultsA);
                const winPercentageB = calculateWinPercentage(finalResultsB);

                if (sortByTotalMatches) {
                    // Sort by total number of matches
                    const totalMatchesA = calculateTotalMatches(a.matches);
                    const totalMatchesB = calculateTotalMatches(b.matches);
                    return totalMatchesB - totalMatchesA;
                } else {
                    // Sort by win percentage
                    return winPercentageB - winPercentageA; // Sort by win percentage in descending order
                }
            });

            // Toggle the sorting criteria for the next click
            sortByTotalMatches = !sortByTotalMatches;

            // Re-render the clans with sorted data
            renderClansBasedOnCheckbox();
        });

        // Add event listener for sorting by rank
        $('#item-rank').click(function() {
            // Sort data based on the presence of 'S', 'A', 'B' in post.rank arrays
            filteredData.sort(function(a, b) {
                // Define a function to determine the sorting order based on ranks
                const getRankOrder = function(post) {
                    if (post.tier[2] !== '') return 0; // 'S' is present
                    if (post.tier[1] !== '') return 1; // 'A' is present
                    if (post.tier[0] !== '') return 2; // 'B' is present
                    return 3; // None of 'S', 'A', 'B' are present
                };

                // Get the rank order for each data point
                const rankOrderA = getRankOrder(a);
                const rankOrderB = getRankOrder(b);

                // Compare the rank orders
                return rankOrderA - rankOrderB;
            });
            // Re-render the clans with sorted data
            renderClansBasedOnCheckbox();
        });

        // Add event listener for sorting by tag
        $('#item-tag').click(function() {
            // Sort data based on the alphabetical value of post.tag[2]
            filteredData.sort(function(a, b) {
                // Handle empty data cases
                if (!a.tag[2] && !b.tag[2]) return 0;
                if (!a.tag[2]) return 1;
                if (!b.tag[2]) return -1;
                // Compare tag values based on ascending or descending order
                const comparison = ascendingOrderTag ? a.tag[2].localeCompare(b.tag[2]) : b.tag[2].localeCompare(a.tag[2]);
                return comparison;
            });
            // Toggle sort order for the next click
            ascendingOrderTag = !ascendingOrderTag;
            // Re-render the clans with sorted data
            renderClansBasedOnCheckbox();
        });

        // Add event listener for sorting by name
        $('#item-name').click(function() {
            // Sort data based on the alphabetical order of post.name
            filteredData.sort(function(a, b) {
                // Handle empty data cases
                if (!a.name && !b.name) return 0;
                if (!a.name) return 1;
                if (!b.name) return -1;
                // Compare name values based on ascending or descending order
                const comparison = a.name.localeCompare(b.name);
                return ascendingOrderName ? comparison : -comparison;
            });
            // Toggle sort order for the next click
            ascendingOrderName = !ascendingOrderName;
            // Re-render the clans with sorted data
            renderClansBasedOnCheckbox();
        });

        // Add event listener for sorting by date
        $('#item-time').click(function() {
            // Sort data based on the date value
            filteredData.sort(function(a, b) {
                // Handle empty data cases
                if (!a.date[1] && !b.date[1]) return 0;
                if (!a.date[1]) return 1;
                if (!b.date[1]) return -1;
                // Compare dates based on ascending or descending order
                const comparison = ascendingOrderDate ? new Date(a.date[1]) - new Date(b.date[1]) : new Date(b.date[1]) - new Date(a.date[1]);
                return comparison;
            });
            // Toggle sort order for the next click
            ascendingOrderDate = !ascendingOrderDate;
            // Re-render the clans with sorted data
            renderClansBasedOnCheckbox();
        });

        // Add event listener for sorting by founders
        $('#item-founders').click(function() {
            // Toggle sort order for the next click
            ascendingOrderFounders = !ascendingOrderFounders;

            // Sort data based on the founder's name
            filteredData.sort(function(a, b) {
                // Check if both founders are empty strings
                if (a.founder[0] === '' && b.founder[0] === '') return 0;
                // If only one founder is an empty string, place it at the bottom
                if (a.founder[0] === '') return 1;
                if (b.founder[0] === '') return -1;

                // Compare founder values alphabetically
                const comparison = a.founder[0].localeCompare(b.founder[0]);
                return ascendingOrderFounders ? comparison : -comparison; // Adjust comparison for ascending order
            });

            // Re-render the clans with sorted data based on checkbox filters
            renderClansBasedOnCheckbox();
        });

        // Add event listener for sorting by number of member groups
        $('#item-membersTxt').click(function() {
            // Sort data based on the number of member groups in descending order
            filteredData.sort(function(a, b) {
                // Calculate the number of member groups for each post
                const memberGroupsCountA = a.members.reduce(function(total, member) {
                    return total + member.membergroup.length;
                }, 0);
                const memberGroupsCountB = b.members.reduce(function(total, member) {
                    return total + member.membergroup.length;
                }, 0);
                
                // Compare the number of member groups
                return memberGroupsCountB - memberGroupsCountA;
            });
            
            // Re-render the clans with sorted data
            renderClansBasedOnCheckbox();
        });

        // Add event listener for checkbox to show only multiple members
        $('#toggleMembers').change(function(event) {
            showOnlyMultipleMembers = event.target.checked;
            renderClansBasedOnCheckbox();
        });

        // Add event listener for checkbox to show only certain matches
        $('#toggleMatches').change(function(event) {
            showOnlyCertainMatches = event.target.checked;
            renderClansBasedOnCheckbox();
        });

        // Initial filtering and rendering with all data
        filterData(data, 'All');

    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error fetching or parsing JSON:', errorThrown);
    });

    // Scroll to the other participant of the match, excluding certain elements
    $(document).on('click', '.matchOpponent', function(event) {
        event.preventDefault(); // Prevent default anchor behavior

        // Get the data-matchid attribute value from the clicked element
        const matchId = $(this).closest('[data-matchid]').data('matchid');
        const $clickedElement = $(this).closest('[data-matchid]');

        // Find the next row with the corresponding data-matchid attribute
        let $targetRow = $(`[data-matchid="${matchId}"]`).not($clickedElement);

        // If the clicked element is the last one, go to the first one
        if ($targetRow.length === 0) {
            $targetRow = $(`[data-matchid="${matchId}"]:first`);
        }

        // Scroll to the target row if found
        if ($targetRow.length > 0) {
            // Define padding for the top of the viewport
            const paddingTop = 500;

            // Scroll to the target row with padding
            $('html, body').animate({
                scrollTop: $targetRow.offset().top - paddingTop
            }, 200, function() {
                // Animation complete callback
                // Create a border overlay div
                const $borderOverlay = $('<div class="border-overlay"></div>').css({
                    position: 'absolute',
                    top: $targetRow.offset().top - 2, // Adjusted top position with a little padding
                    left: $targetRow.offset().left - 2, // Adjusted left position with a little padding
                    width: $targetRow.outerWidth() + 4, // Adjusted width to make the border wider
                    height: $targetRow.outerHeight() + 4, // Adjusted height to make the border wider
                    border: '2px solid red',
                    borderRadius: $targetRow.css('borderRadius'), // Match the border radius of the row
                    pointerEvents: 'none', // Allow clicking through the overlay
                    zIndex: 9999 // Ensure the overlay appears above other content
                }).appendTo('body');

                // Fade out the border overlay
                $borderOverlay.fadeOut(2000, function() {
                    // Remove the overlay after fading out
                    $(this).remove();
                });
            });
        }
    });

    // Event listener for checkbox #toggleSiteNews
    $('#toggleSiteNews').change(function() {
        if (!$(this).prop('checked')) {
            $('div[data-toggle="tooltip"]').filter(function() {
                return $(this).attr('id') === 'site';
            }).hide();
        } else {
            $('div[data-toggle="tooltip"]').filter(function() {
                return $(this).attr('id') === 'site';
            }).show();
        }
    });

    // Event listener for checkbox #toggleClanNews
    $('#toggleClanNews').change(function() {
        if (!$(this).prop('checked')) {
            $('div[data-toggle="tooltip"]').filter(function() {
                return $(this).attr('id') === 'clan';
            }).hide();
        } else {
            $('div[data-toggle="tooltip"]').filter(function() {
                return $(this).attr('id') === 'clan';
            }).show();
        }
    });

    // Event listener for checkbox #toggleMemberNews
    $('#toggleMemberNews').change(function() {
        if (!$(this).prop('checked')) {
            $('div[data-toggle="tooltip"]').filter(function() {
                return $(this).attr('id') === 'members';
            }).hide();
        } else {
            $('div[data-toggle="tooltip"]').filter(function() {
                return $(this).attr('id') === 'members';
            }).show();
        }
    });

    // Event listener for checkbox #toggleWarNews
    $('#toggleWarNews').change(function() {
        if (!$(this).prop('checked')) {
            $('div[data-toggle="tooltip"]').filter(function() {
                return $(this).attr('id') === 'wars';
            }).hide();
        } else {
            $('div[data-toggle="tooltip"]').filter(function() {
                return $(this).attr('id') === 'wars';
            }).show();
        }
    });

    // Event listener for checkbox #toggleCommunityNews
    $('#toggleCommunityNews').change(function() {
        if (!$(this).prop('checked')) {
            $('div[data-toggle="tooltip"]').filter(function() {
                return $(this).attr('id') === 'community';
            }).hide();
        } else {
            $('div[data-toggle="tooltip"]').filter(function() {
                return $(this).attr('id') === 'community';
            }).show();
        }
    });


    /* *********************** Construct Alphabet ************************************************************************************************************** */



    
    /* *********************** STATS *************************************************************************************************************************** */






    /* *********************** LONGREAD ************************************************************************************************************************ */


    // Debounce function
    function debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }

    /*
    // Scroll back up when any div, .clan_addedrows, or #longread loses focus
    $('body').on('blur', 'div:not(.matchOpponent), .clan_addedrows, #longread', debounce(function() {
        var padding = 200; // Adjust this value to set the desired padding
        var scrollPosition = $(this).offset().top - padding;
        $('html, body').animate({
            scrollTop: scrollPosition
        }, 200);
    }, 250)); // Debounce for 250 milliseconds
    */


    /* *********************** TOOLTIPS ******************************************************************************************************************** */

    
    // Hide tooltips when mouse button is released anywhere on the document
    $(document).on('mouseup', function() {
        $('[data-toggle="tooltip"]').tooltip('hide');
    });

    // Hide tooltips when certain elements are clicked
    $(document).on('click', 'a[data-toggle="tooltip"], input[data-toggle="tooltip"]', function() {
        $(this).tooltip('hide');
    });


    /***********/

});