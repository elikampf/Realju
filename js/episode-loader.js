// Episode Loader - Handles dynamic loading and rendering of podcast episodes
// Imports all podcast data and provides rendering functions

// Note: Import statements will be handled by the HTML script tags for now
// Since we're using vanilla JavaScript without a bundler

// ============================================
// PODCAST SERIES CONFIGURATION
// ============================================

const PODCAST_SERIES = {
    'dating': {
        type: 'complete_short', // Show all episodes
        cover: '/Images/podcast-cover-full.png',
        spotify: 'https://open.spotify.com/show/2hCOZGVEIEJM5gvdAKPLaU',
        apple: 'https://podcasts.apple.com/us/podcast/dating/id1750872872',
        youtube: 'https://www.youtube.com/playlist?list=PLiZU2rL9HnBVlN-qtyCiW7GbDsU7bewtN'
    },
    'shmeiras-einayim': {
        type: 'complete_short', // Complete series, show all
        cover: '/Images/shemiras-einyim-cover.png',
        spotify: 'https://open.spotify.com/show/SHMEIRA_EINAYIM_ID',
        apple: 'https://podcasts.apple.com/us/podcast/shmeiras-einayim/idXXXXXXX',
        youtube: 'https://www.youtube.com/playlist?list=SHMEIRA_PLAYLIST'
    },
    'shemiras-halashon': {
        type: 'monster_series', // 150+ episodes - special handling
        cover: '/Images/shmeiras-halashon.png',
        spotify: 'https://open.spotify.com/show/SHEMIRAS_HALASHON_ID',
        apple: 'https://podcasts.apple.com/us/podcast/shemiras-halashon/idXXXXXXX',
        youtube: 'https://www.youtube.com/playlist?list=SHEMIRAS_PLAYLIST'
    },
    'shabbos-malkesa': {
        type: 'medium_active', // ~50 episodes, load 10 at a time
        cover: '/Images/shabbos-malkesa-cover.png',
        spotify: 'https://open.spotify.com/show/SHABBOS_MALKESA_ID',
        apple: 'https://podcasts.apple.com/us/podcast/shabbos-malkesa/idXXXXXXX',
        youtube: 'https://www.youtube.com/playlist?list=SHABBOS_PLAYLIST'
    },
    'shalom-bayis': {
        type: 'complete_short', // Complete series
        cover: '/Images/shalom-bayis-cover.png',
        spotify: 'https://open.spotify.com/show/SHALOM_BAYIS_ID',
        apple: 'https://podcasts.apple.com/us/podcast/shalom-bayis/idXXXXXXX',
        youtube: 'https://www.youtube.com/playlist?list=SHALOM_PLAYLIST'
    },
    'mesilas-yesharim': {
        type: 'medium_active', // Weekly series, ~50 episodes
        cover: '/Images/mesilas-yesharim-cover.png',
        spotify: 'https://open.spotify.com/show/MESILAS_YESHARIM_ID',
        apple: 'https://podcasts.apple.com/us/podcast/mesilas-yesharim/idXXXXXXX',
        youtube: 'https://www.youtube.com/playlist?list=MESILAS_PLAYLIST'
    },
    'shalom-bayis-hebrew': {
        type: 'complete_short', // Complete series
        cover: '/Images/shalom-bayis-heb.png',
        spotify: 'https://open.spotify.com/show/SHALOM_BAYIS_HEB_ID',
        apple: 'https://podcasts.apple.com/us/podcast/shalom-bayis-hebrew/idXXXXXXX',
        youtube: 'https://www.youtube.com/playlist?list=SHALOM_HEB_PLAYLIST'
    }
};

// ============================================
// EPISODE RENDERING FUNCTIONS
// ============================================

class EpisodeLoader {
    constructor() {
        this.currentSeries = null;
        this.displayedEpisodes = 0;
        this.episodesPerLoad = 10;
        this.podcastData = null;
    }
    
    // Initialize episode loading for a specific series
    async initializeSeries(seriesSlug) {
        console.log('Episode loader: Initializing series', { seriesSlug });
        this.currentSeries = PODCAST_SERIES[seriesSlug];
        
        if (!this.currentSeries) {
            console.error(`Series not found: ${seriesSlug}`);
            return;
        }
        
        console.log('Episode loader: Series config found', { seriesType: this.currentSeries.type });
        
        // Load podcast data dynamically
        await this.loadPodcastData(seriesSlug);
        this.loadEpisodes();
    }
    
    // Load podcast data from the appropriate JS file
    async loadPodcastData(seriesSlug) {
        try {
            // Map series slug to JS file name
            const dataFiles = {
                'dating': 'dating',
                'shmeiras-einayim': 'shmiras_einayim',
                'shemiras-halashon': 'shemiras_halashon_daily',
                'shabbos-malkesa': 'shabbos_malkesa',
                'shalom-bayis': 'shalom_bayis',
                'mesilas-yesharim': 'mesilas_yesharim',
                'shalom-bayis-hebrew': 'shalom_bayis_hebrew'
            };
            
            const fileName = dataFiles[seriesSlug];
            if (!fileName) {
                throw new Error(`No data file for series: ${seriesSlug}`);
            }
            
            // Check if data is already loaded globally
            const dataVariableNames = {
                'dating': 'dating_data',
                'shmeiras-einayim': 'shmiras_einayim_data',
                'shemiras-halashon': 'shemiras_halashon_daily_data',
                'shabbos-malkesa': 'shabbos_malkesa_data',
                'shalom-bayis': 'shalom_bayis_data',
                'mesilas-yesharim': 'mesilas_yesharim_data',
                'shalom-bayis-hebrew': 'shalom_bayis_hebrew_data'
            };
            
            const dataVarName = dataVariableNames[seriesSlug];
            console.log('Episode loader: Looking for data variable', { seriesSlug, dataVarName, found: !!window[dataVarName] });
            
            if (window[dataVarName]) {
                this.podcastData = window[dataVarName];
                console.log('Episode loader: Data loaded successfully', { title: this.podcastData.title, episodeCount: this.podcastData.episodes?.length });
            } else {
                console.warn(`Podcast data not found for ${seriesSlug}. Please ensure the JS file is loaded.`);
                // For now, create a placeholder
                this.podcastData = {
                    title: 'Loading...',
                    episodes: []
                };
            }
        } catch (error) {
            console.error('Error loading podcast data:', error);
            this.podcastData = {
                title: 'Error Loading Series',
                episodes: []
            };
        }
    }
    
    // Main episode loading logic
    loadEpisodes() {
        console.log('Episode loader: Loading episodes', { 
            hasContainer: !!document.getElementById('episodes-container'),
            hasPodcastData: !!this.podcastData,
            podcastDataTitle: this.podcastData?.title,
            episodeCount: this.podcastData?.episodes?.length
        });
        
        const container = document.getElementById('episodes-container');
        if (!container || !this.podcastData) {
            console.log('Episode loader: Container or podcast data not found', { container: !!container, podcastData: !!this.podcastData });
            return;
        }
        
        const { type } = this.currentSeries;
        const episodes = this.podcastData.episodes || [];
        
        console.log('Episode loader: Loading episodes', { 
            seriesType: type, 
            episodeCount: episodes.length, 
            seriesTitle: this.podcastData.title 
        });
        
        switch (type) {
            case 'complete_short':
                this.renderAllEpisodes(episodes, container);
                break;
                
            case 'monster_series':
                this.renderMonsterSeries(episodes, container);
                break;
                
            case 'medium_active':
                this.renderMediumSeries(episodes, container);
                break;
        }
    }
    
    // Render all episodes (for complete short series)
    renderAllEpisodes(episodes, container) {
        container.innerHTML = `
            <div class="episodes-header">
                <h2>All Episodes</h2>
                <p class="episode-count">${episodes.length} episodes</p>
            </div>
        `;
        
        episodes.forEach(episode => {
            container.appendChild(this.createEpisodeCard(episode, true));
        });
    }
    
    // Render monster series (150+ episodes - special handling)
    renderMonsterSeries(episodes, container) {
        const latestEpisode = episodes[episodes.length - 1];
        const recentEpisodes = episodes.slice(-5);
        
        container.innerHTML = `
            <div class="monster-series-header">
                <h2>Latest Episode</h2>
                <p class="series-info">This series has ${episodes.length}+ episodes covering daily speech ethics</p>
            </div>
        `;
        
        // Latest episode with full player
        if (latestEpisode) {
            const latestCard = this.createEpisodeCard(latestEpisode, true);
            latestCard.classList.add('featured-episode');
            container.appendChild(latestCard);
        }
        
        // Spotify link for all episodes
        const allEpisodesBtn = document.createElement('div');
        allEpisodesBtn.className = 'all-episodes-cta';
        allEpisodesBtn.innerHTML = `
            <a href="${this.currentSeries.spotify}" target="_blank" class="btn btn-primary btn-large">
                Listen to All ${episodes.length}+ Episodes on Spotify
            </a>
        `;
        container.appendChild(allEpisodesBtn);
        
        // Recent episodes as teasers
        if (recentEpisodes.length > 1) {
            const recentSection = document.createElement('div');
            recentSection.className = 'recent-episodes';
            recentSection.innerHTML = '<h3>Recent Episodes</h3>';
            
            recentEpisodes.slice(0, -1).forEach(episode => {
                recentSection.appendChild(this.createEpisodeCard(episode, false));
            });
            
            container.appendChild(recentSection);
        }
        
        // Add search functionality
        this.addSearchFunctionality(episodes, container);
    }
    
    // Render medium series (load 10 at a time)
    renderMediumSeries(episodes, container) {
        if (this.displayedEpisodes === 0) {
            container.innerHTML = `
                <div class="episodes-header">
                    <h2>Episodes</h2>
                    <p class="episode-count">Showing episodes 1-${Math.min(this.episodesPerLoad, episodes.length)} of ${episodes.length}</p>
                </div>
            `;
        }
        
        const startIndex = this.displayedEpisodes;
        const endIndex = Math.min(startIndex + this.episodesPerLoad, episodes.length);
        const episodesToShow = episodes.slice(startIndex, endIndex);
        
        episodesToShow.forEach(episode => {
            container.appendChild(this.createEpisodeCard(episode, true));
        });
        
        this.displayedEpisodes = endIndex;
        
        // Add load more button if there are more episodes
        if (endIndex < episodes.length) {
            this.addLoadMoreButton(episodes, container);
        }
    }
    
    // Create individual episode card
    createEpisodeCard(episode, includePlayer = true) {
        const card = document.createElement('div');
        card.className = 'episode-card';
        
        const thumbnail = episode.imageUrl || this.currentSeries.cover;
        const description = this.truncateDescription(episode.description, 150);
        const duration = this.formatDuration(episode.durationMinutes);
        const date = this.formatDate(episode.releaseDate);
        
        card.innerHTML = `
            <img src="${thumbnail}" alt="${episode.title}" class="episode-thumbnail" loading="lazy">
            
            <div class="episode-info">
                <h3>${episode.title}</h3>
                <p class="episode-description">${description}</p>
                <div class="episode-meta">
                    <span class="episode-date">${date}</span>
                    <span class="episode-duration">${duration}</span>
                </div>
            </div>
            
            <div class="episode-player">
                ${includePlayer ? `
                    <button class="play-button" aria-label="Play ${episode.title}">▶️</button>
                    <div class="spotify-embed">
                        <iframe 
                            src="${episode.embedUrl}?utm_source=generator&theme=0" 
                            width="100%" 
                            height="152" 
                            frameBorder="0" 
                            allowfullscreen="" 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy">
                        </iframe>
                    </div>
                ` : `
                    <a href="${episode.spotifyUrl}" target="_blank" class="btn btn-primary">
                        Listen on Spotify
                    </a>
                `}
            </div>
        `;
        
        return card;
    }
    
    // Add search functionality for monster series
    addSearchFunctionality(episodes, container) {
        const searchSection = document.createElement('div');
        searchSection.className = 'episode-search';
        searchSection.innerHTML = `
            <div class="search-container">
                <h3>Search Episodes</h3>
                <input 
                    type="text" 
                    id="episode-search" 
                    placeholder="Search episode titles and descriptions..." 
                    class="search-input"
                >
                <div id="search-results" class="search-results"></div>
            </div>
        `;
        
        container.appendChild(searchSection);
        
        const searchInput = searchSection.querySelector('#episode-search');
        const searchResults = searchSection.querySelector('#search-results');
        
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value, episodes, searchResults);
            }, 300);
        });
    }
    
    // Perform episode search
    performSearch(query, episodes, resultsContainer) {
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }
        
        const results = episodes.filter(episode => 
            episode.title.toLowerCase().includes(query.toLowerCase()) ||
            episode.description.toLowerCase().includes(query.toLowerCase())
        );
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="no-results">No episodes found matching your search.</p>';
            return;
        }
        
        resultsContainer.innerHTML = `<h4>Search Results (${results.length})</h4>`;
        
        results.slice(0, 10).forEach(episode => {
            resultsContainer.appendChild(this.createEpisodeCard(episode, false));
        });
        
        if (results.length > 10) {
            resultsContainer.innerHTML += `<p class="more-results">Showing first 10 of ${results.length} results</p>`;
        }
    }
    
    // Add load more button for medium series
    addLoadMoreButton(episodes, container) {
        // Remove existing load more button
        const existingBtn = container.querySelector('.load-more-container');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        const loadMoreContainer = document.createElement('div');
        loadMoreContainer.className = 'load-more-container';
        loadMoreContainer.innerHTML = `
            <button class="btn btn-secondary btn-large load-more-btn">
                Load More Episodes
            </button>
        `;
        
        container.appendChild(loadMoreContainer);
        
        const loadMoreBtn = loadMoreContainer.querySelector('.load-more-btn');
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.textContent = 'Loading...';
            loadMoreBtn.disabled = true;
            
            setTimeout(() => {
                this.renderMediumSeries(episodes, container);
                
                // Update episode count
                const episodeCount = container.querySelector('.episode-count');
                if (episodeCount) {
                    episodeCount.textContent = `Showing episodes 1-${this.displayedEpisodes} of ${episodes.length}`;
                }
            }, 500);
        });
    }
    
    // Utility function to truncate description
    truncateDescription(description, maxLength) {
        if (description.length <= maxLength) return description;
        
        const truncated = description.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        
        return lastSpace > 0 ? 
            truncated.substring(0, lastSpace) + '...' : 
            truncated + '...';
    }
    
    // Format duration from minutes to mm:ss
    formatDuration(minutes) {
        const totalSeconds = Math.round(minutes * 60);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// ============================================
// HOMEPAGE SERIES RENDERING
// ============================================

class HomepageRenderer {
    static renderSeriesCards() {
        const seriesContainer = document.getElementById('series-container');
        if (!seriesContainer) return;
        
        const seriesData = [
            {
                slug: 'shmeiras-einayim',
                title: 'Shmeiras Einayim',
                tagline: 'Win the Battle That Happens Every Day',
                description: 'Practical daily strategies for maintaining spiritual focus in a challenging world',
                episodeCount: 'Complete Series'
            },
            {
                slug: 'shemiras-halashon',
                title: 'Shemiras Halashon',
                tagline: 'Master the Power of Your Words',
                description: 'When to speak, when to stay silent - navigate speech ethics in real life',
                episodeCount: '150+ Episodes'
            },
            {
                slug: 'shabbos-malkesa',
                title: 'Shabbos Malkesa',
                tagline: 'Your Weekly Audience with the King',
                description: 'Transform Shabbos from routine into the spiritual highlight of your week',
                episodeCount: 'Weekly Series'
            },
            {
                slug: 'dating',
                title: 'Dating',
                tagline: 'Find Your Bashert with Torah Wisdom',
                description: 'Complete guidance from self-preparation to engagement',
                episodeCount: '8 Episodes'
            },
            {
                slug: 'shalom-bayis',
                title: 'Shalom Bayis',
                tagline: 'From "Me" to "We" - The Complete Guide',
                description: 'Build real intimacy and partnership in Jewish marriage',
                episodeCount: 'Complete Series'
            },
            {
                slug: 'mesilas-yesharim',
                title: 'Mesilas Yesharim',
                tagline: 'Transform Knowledge into Reality',
                description: 'Systematic approach to spiritual growth that actually works',
                episodeCount: 'Weekly Series'
            },
            {
                slug: 'shalom-bayis-hebrew',
                title: 'שלום בית עברית',
                tagline: 'הביאו את השכינה לבית',
                description: 'בניית בית יהודי קדוש ומאושר',
                episodeCount: 'Complete Series'
            }
        ];
        
        seriesData.forEach(series => {
            const seriesConfig = PODCAST_SERIES[series.slug];
            if (seriesConfig) {
                const card = this.createSeriesCard(series, seriesConfig);
                seriesContainer.appendChild(card);
            }
        });
    }
    
    static createSeriesCard(series, config) {
        const card = document.createElement('div');
        card.className = 'series-card';
        
        card.innerHTML = `
            <img src="${config.cover}" alt="${series.title}" class="series-cover" loading="lazy">
            <div class="series-content">
                <h3 class="series-title">${series.title}</h3>
                <p class="series-tagline">${series.tagline}</p>
                <p class="series-description">${series.description}</p>
                <p class="episode-count">${series.episodeCount}</p>
                <a href="/podcasts/${series.slug}.html" class="btn btn-primary btn-full">
                    Listen Now
                </a>
            </div>
        `;
        
        return card;
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize based on page type
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    
    // Homepage series rendering
    if (path === '/' || path.includes('index.html')) {
        HomepageRenderer.renderSeriesCards();
    }
    
    // Individual podcast page
    const podcastMatch = path.match(/\/podcasts\/([^\/]+)(?:\.html)?$/);
    if (podcastMatch) {
        const seriesSlug = podcastMatch[1];
        console.log('Episode loader: Initializing series', { seriesSlug, path });
        const episodeLoader = new EpisodeLoader();
        episodeLoader.initializeSeries(seriesSlug);
    }
});

// Make classes available globally
window.EpisodeLoader = EpisodeLoader;
window.HomepageRenderer = HomepageRenderer;
window.PODCAST_SERIES = PODCAST_SERIES; 