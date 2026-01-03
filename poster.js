require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');

class LinkedInPoster {
    constructor() {
        this.browser = null;
        this.page = null;
        this.postFilePath = path.join(__dirname, 'generated-post.txt');
        this.cookies = null;
    }

    async loadCookies() {
        try {
            const cookiesEnv = process.env.LINKEDIN_COOKIES;
            if (!cookiesEnv) {
                console.log('No cookies provided in LINKEDIN_COOKIES environment variable');
                return false;
            }

            this.cookies = JSON.parse(cookiesEnv);
            console.log(`Loaded ${this.cookies.length} cookies from environment`);
            return true;
        } catch (error) {
            console.error('Error loading cookies:', error);
            return false;
        }
    }

    async initBrowser() {
        try {
            console.log('Launching browser...');
            
            // Configuration du navigateur avec variables d'environnement
            const browserConfig = {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu',
                    '--disable-software-rasterizer',
                    '--disable-extensions',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding',
                    '--disable-features=TranslateUI',
                    '--disable-ipc-flooding-protection'
                ]
            };
            
            // Utiliser les chemins Chrome configurés dans l'environnement
            if (process.env.CHROME_PATH) {
                browserConfig.executablePath = process.env.CHROME_PATH;
            } else if (process.env.PUPPETEER_EXECUTABLE_PATH) {
                browserConfig.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
            } else if (process.env.CHROME_BIN) {
                browserConfig.executablePath = process.env.CHROME_BIN;
            }
            
            this.browser = await puppeteer.launch(browserConfig);
            
            this.page = await this.browser.newPage();
            
            // Set viewport
            await this.page.setViewport({ width: 1200, height: 800 });
            
            // Set user agent
            await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            
            console.log('Browser launched successfully');
        } catch (error) {
            console.error('Error launching browser:', error);
            throw error;
        }
    }

    async authenticate() {
        try {
            // Try to use cookies first
            if (await this.loadCookies()) {
                console.log('Using cookies for authentication...');
                
                // Go to LinkedIn and set cookies
                await this.page.goto('https://www.linkedin.com/', { 
                    waitUntil: 'networkidle2',
                    timeout: 30000 
                });
                
                // Set cookies
                await this.page.setCookie(...this.cookies);
                console.log('Cookies loaded successfully');
                
                // Reload page to apply cookies
                await this.page.reload({ waitUntil: 'networkidle2' });
                
                // Check if we're authenticated
                try {
                    await this.page.waitForSelector('[data-test="global-nav"]', { timeout: 10000 });
                    console.log('Authentication successful with cookies');
                    return true;
                } catch (error) {
                    console.log('Cookies may be expired, falling back to login...');
                }
            }
            
            // Fallback to traditional login if cookies fail
            console.log('Falling back to traditional login...');
            await this.traditionalLogin();
            return true;
            
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }
    
    async traditionalLogin() {
        console.log('Navigating to LinkedIn...');
        await this.page.goto('https://www.linkedin.com/login', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });

        // Wait for login form
        await this.page.waitForSelector('#username', { timeout: 10000 });
        
        // Enter email
        await this.page.type('#username', process.env.LINKEDIN_EMAIL);
        console.log('Email entered');
        
        // Enter password
        await this.page.type('#password', process.env.LINKEDIN_PASSWORD);
        console.log('Password entered');
        
        // Click sign in button
        await this.page.click('[type="submit"]');
        console.log('Login button clicked');
        
        // Wait for navigation
        await this.page.waitForNavigation({ timeout: 30000 });
        
        // Check if we're on LinkedIn home page
        try {
            await this.page.waitForSelector('[data-test="global-nav"]', { timeout: 10000 });
            console.log('Login successful - reached LinkedIn home');
        } catch (error) {
            const currentUrl = this.page.url();
            if (currentUrl.includes('checkpoint')) {
                throw new Error('2FA_REQUIRED: Manual intervention needed');
            }
            throw new Error('Login failed - unexpected page');
        }
    }

    async createPost(postContent) {
        try {
            console.log('Creating new post...');
            
            // Navigate to LinkedIn home
            await this.page.goto('https://www.linkedin.com/feed/', { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });
            
            // Wait for the "Start a post" button
            await this.page.waitForSelector('[data-test="feed-item"]', { timeout: 10000 });
            
            // Look for the post creation area
            const postBoxSelector = await this.page.evaluate(() => {
                // Try multiple selectors for the post box
                const selectors = [
                    '[data-test="share-box-text"]',
                    '.share-box__text-editor',
                    '.feed-shared-texteditor',
                    '.share-box__content'
                ];
                
                for (const selector of selectors) {
                    const element = document.querySelector(selector);
                    if (element) return selector;
                }
                
                return null;
            });
            
            if (!postBoxSelector) {
                throw new Error('Could not find post creation area');
            }
            
            console.log(`Found post area with selector: ${postBoxSelector}`);
            
            // Click on the post area to activate it
            await this.page.click(postBoxSelector);
            await this.page.waitForTimeout(1000);
            
            // Find the text input area within the post box
            const textInputSelector = await this.page.evaluate((boxSelector) => {
                const box = document.querySelector(boxSelector);
                if (!box) return null;
                
                // Look for text input areas
                const inputSelectors = [
                    'div[contenteditable="true"]',
                    'textarea',
                    '.share-box-text__editor'
                ];
                
                for (const selector of inputSelectors) {
                    const element = box.querySelector(selector);
                    if (element) return selector;
                }
                
                return null;
            }, postBoxSelector);
            
            if (!textInputSelector) {
                throw new Error('Could not find text input area');
            }
            
            console.log(`Found text input with selector: ${textInputSelector}`);
            
            // Click on the text input and type the post
            await this.page.click(textInputSelector);
            await this.page.waitForTimeout(500);
            
            // Clear any existing content
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('A');
            await this.page.keyboard.up('Control');
            
            // Type the post content
            await this.page.type(textInputSelector, postContent);
            console.log('Post content entered');
            
            // Wait a moment for the content to be processed
            await this.page.waitForTimeout(2000);
            
            // Look for and click the Post button
            const postButtonSelector = await this.page.evaluate(() => {
                const selectors = [
                    '[data-test="share-button"]',
                    '.share-box__footer button[type="submit"]',
                    '.share-box__actions button[aria-label*="Post"]'
                ];
                
                for (const selector of selectors) {
                    const button = document.querySelector(selector);
                    if (button && !button.disabled && button.offsetParent !== null) {
                        return selector;
                    }
                }
                
                return null;
            });
            
            if (!postButtonSelector) {
                throw new Error('Could not find post button');
            }
            
            console.log(`Found post button with selector: ${postButtonSelector}`);
            
            // Click the post button
            await this.page.click(postButtonSelector);
            console.log('Post button clicked');
            
            // Wait for confirmation that post was created
            await this.page.waitForTimeout(3000);
            
            // Check if post was successful
            const currentUrl = this.page.url();
            if (!currentUrl.includes('feed') && !currentUrl.includes('feed/update')) {
                console.log('Post may have been created, URL changed to:', currentUrl);
            }
            
            console.log('Post published successfully!');
            return true;
            
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    async readGeneratedPost() {
        try {
            console.log('Reading generated post...');
            const postContent = await fs.readFile(this.postFilePath, 'utf8');
            return postContent.trim();
        } catch (error) {
            console.error('Error reading generated post:', error);
            throw error;
        }
    }

    async cleanup() {
        if (this.browser) {
            console.log('Closing browser...');
            await this.browser.close();
        }
    }

    async post() {
        let postContent;
        
        try {
            // Read the generated post
            postContent = await this.readGeneratedPost();
            console.log(`Post content length: ${postContent.length} characters`);
            
            // Initialize browser
            await this.initBrowser();
            
            // Authenticate to LinkedIn (cookies or login)
            await this.authenticate();
            
            // Create and publish the post
            await this.createPost(postContent);
            
            console.log('LinkedIn posting completed successfully!');
            return true;
            
        } catch (error) {
            console.error('Error in posting process:', error);
            
            if (error.message.includes('2FA_REQUIRED')) {
                console.log('⚠️  2FA is required. Please complete authentication manually and retry.');
            }
            
            throw error;
        } finally {
            await this.cleanup();
        }
    }
}

// Main execution
async function main() {
    try {
        // Check for authentication method
        const hasCookies = process.env.LINKEDIN_COOKIES;
        const hasCredentials = process.env.LINKEDIN_EMAIL && process.env.LINKEDIN_PASSWORD;
        
        if (!hasCookies && !hasCredentials) {
            throw new Error('Either LINKEDIN_COOKIES or both LINKEDIN_EMAIL and LINKEDIN_PASSWORD environment variables are required');
        }

        const poster = new LinkedInPoster();
        await poster.post();
        
    } catch (error) {
        console.error('Failed to post to LinkedIn:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = LinkedInPoster;