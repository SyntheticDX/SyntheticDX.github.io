$(document).ready(function() {
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


    let cachedLinks = null;

    // Function to fetch links
    function fetchLinks() {
        return fetch('./linklist.json').then(res => res.json());
    }

    // Function to render links
    function renderLinks(data) {
        const linkRows = data.map(post => {
            const link2 = post.linkContent[5].length === 0 ? '' : `<td class="link2"><a class="pagelink" href="${post.linkContent[5]}">${post.linkContent[6]}</a></td>`;
            return `
                <tr id="listitem">
                    <td class="linkWeight">${post.linkContent[1]}</td>
                    <td class="linkYear">${post.linkContent[0]}</td>
                    <td class="linkDescription">${post.linkContent[2]}</td>
                    <td class="link1"><a class="pagelink" href="${post.linkContent[3]}">${post.linkContent[4]}</a></td>
                    ${link2}
                    <td id="linkExtra">${post.linkContent[7]}</td>
                </tr>
            `;
        }).join('');
        linkContainer.append(linkRows);
        linkContainer.data('linksLoaded', true);
        window.location.hash = 'pagelinks';
        bindSortingFunction();
    }

    // Function to fetch and render links if necessary
    function fetchAndRenderLinks() {
        if (!linkContainer.data('linksLoaded')) {
            if (cachedLinks) {
                renderLinks(cachedLinks);
            } else {
                fetchLinks().then(data => {
                    cachedLinks = data;
                    renderLinks(data);
                }).catch(err => {
                    console.error('Error fetching links:', err);
                });
            }
        }
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
    function sortTable(n) {
        var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        rows = linkContainer[0].rows;
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
    function bindSortingFunction() {
        $('.commlinks th').on('click', function() {
            var index = $(this).index();
            sortTable(index);
        });
    }


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
        trigger.popover({ html: true, content: () => content.html() });
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

    // Event listener for clicks on nav elements with a link to #pagetimeline
    navClanlist.on('click', 'a[href="#pagetimeline"]', function(event) {
        event.preventDefault();
        window.location = '#pagetimeline';
    });

    // Add event listener for clicks on popover content
    body.on('mousedown', '.popover', function(e) {
        console.log("clicked inside popover");
        e.preventDefault();
    });

    // Scroll to the popover content if it's far outside the viewport
    $(document).on('shown.bs.popover', '[data-style=mypops]', function() {
        var popoverTopOffset = $('.popover').offset().top;
        $('html, body').animate({
            scrollTop: popoverTopOffset
        }, 200);
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

    // Function to count all non-repeating IDs of pidPlusName[0] in the currently selected filter view
    function countNonRepeatingIDs(data) {
        let ids = [];
        data.forEach(post => {
            post.members.forEach(member => {
                member.membergroup.forEach(group => {
                    if (!ids.includes(group.pidPlusName[0])) {
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
                    if (background.backgroundStory[1] !== '') {
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

                // Construct the HTML for the matches cell
                matchesCellHTML = otherMatches.concat(discussedMatches).map(match => {
                    if (match.match[1] !== '') {
                        return `<span data-toggle="tooltip" data-html="true" data-placement="auto bottom" title="${match.match[4]}\n${match.match[5]}"><div class='match${match.match[6]}'>${post.tag[1]}${post.tag[2]}${post.tag[3]} vs <a href="#${match.match[1]}" onclick="document.getElementById('${match.match[1]}').focus()">${match.match[2]}</a><span class='match${match.match[3]}'>${match.match[3]}</span></div></span>`;
                    }
                    return '';
                }).join('');
            }

            // Check if the 'news' array is not empty
            if (post.news.length > 0) {
                // Construct the HTML for the news cell
                newsCellHTML = post.news.map(news => {
                    if (news.article[1] !== '') {
                        return `<div id="${news.article[5]}" data-toggle="tooltip" data-placement="auto top" title="${news.article[0]}" class="clanNewsArt" data-date="${news.article[1]}"><div id="newsdate">${news.article[1]}</div><div id="newstitle">${news.article[2]}</div><div id="newsbody">${news.article[4]}</div><div id="newsauthor">- ${news.article[3]}</div></div>`;
                    }
                    return '';
                }).join('');
            }

            // Construct HTML for each clan row
            html += `
                <tr class="clan_addedrows" tabindex="0" id="${post.id[0]}">
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
                    ${matchesCellHTML ? `<td id="clan_scroll_matches"><div class="memberCountWrapper">(${calculateTotalMatches(post['matches'])})</div>${matchesCellHTML}</td>` : '<td id="clan_scroll_matches"></td>'}
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

        // Initialize tooltips for forum links
        $('[data-toggle="tooltip"]').tooltip();
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

        // Listen for changes in the filter select element
        $('#filterSelect').change(function() {
            const filterValue = $(this).val();
            filterData(data, filterValue);
        });

        // Add event listener for sorting by number of matches
        $('#item-matches').click(function() {
            // Sort data based on the total number of matches in descending order
            data.sort(function(a, b) {
                // Calculate the total number of matches for each post
                const totalMatchesA = calculateTotalMatches(a.matches);
                const totalMatchesB = calculateTotalMatches(b.matches);
                
                // Compare the total number of matches
                return totalMatchesB - totalMatchesA;
            });
            
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

    // Scroll back up when any div, .clan_addedrows, or #longread loses focus
    $('body').on('blur', 'div, .clan_addedrows, #longread', debounce(function() {
        var padding = 200; // Adjust this value to set the desired padding
        var scrollPosition = $(this).offset().top - padding;
        $('html, body').animate({
            scrollTop: scrollPosition
        }, 200);
    }, 250)); // Debounce for 250 milliseconds


    /* *********************** TOOLTIPS ******************************************************************************************************************** */


    // Initialize tooltips for elements with the data-toggle="tooltip" attribute
    $('[data-toggle="tooltip"]').tooltip();


    /***********/

});