# LinkedIn Automation Bot

A Node.js-based LinkedIn automation bot that generates and posts professional content using Google Gemini AI and Puppeteer browser automation.

## Features

- 🤖 **AI-Powered Content Generation**: Uses Google Gemini AI to generate engaging LinkedIn posts
- 📅 **Automated Scheduling**: GitHub Actions workflow for daily automated posting
- 📊 **Content History Tracking**: Prevents duplicate topics and maintains posting history
- 🔒 **Secure Credentials**: Environment variable-based credential management
- 🌍 **GitHub Actions Integration**: Automated CI/CD pipeline for seamless deployment

## Project Structure

```
linkedin-bot/
├── .github/workflows/main.yml    # GitHub Actions workflow
├── .gitignore                    # Git ignore rules
├── .env.example                  # Environment variables template
├── data.json                     # Topics and posting history
├── generator.js                  # AI post generation logic
├── poster.js                     # LinkedIn automation script
├── package.json                  # Node.js dependencies
└── README.md                     # This file
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- A LinkedIn account (preferably a dedicated one for automation)
- Google Gemini AI API key
- GitHub repository (for automation)

### 2. Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   LINKEDIN_EMAIL=your_linkedin_email@example.com
   LINKEDIN_PASSWORD=your_linkedin_password
   ```

### 3. Local Installation

```bash
# Install dependencies
npm install

# Generate a post (requires GEMINI_API_KEY)
npm run generate

# Post to LinkedIn (requires LINKEDIN_EMAIL and LINKEDIN_PASSWORD)
npm run post

# Run both generate and post
npm start
```

### 4. GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret" and add:
   - `GEMINI_API_KEY`: Your Gemini AI API key
   - `LINKEDIN_EMAIL`: Your LinkedIn email
   - `LINKEDIN_PASSWORD`: Your LinkedIn password

### 5. Enable GitHub Actions

1. The workflow is configured in `.github/workflows/main.yml`
2. It runs daily at 9 AM UTC
3. Can be triggered manually from the Actions tab

## Usage

### Manual Execution

```bash
# Generate and post in one command
npm start

# Or run steps individually
npm run generate  # Generate content using AI
npm run post      # Post to LinkedIn
```

### Automated Execution

The bot runs automatically via GitHub Actions:
- **Schedule**: Daily at 9 AM UTC
- **Manual Trigger**: Available in GitHub Actions tab
- **Push Trigger**: Runs on main branch pushes

## Configuration

### Topics Management

Edit `data.json` to customize:
- `topics`: Array of LinkedIn post topics
- `settings`: Post generation preferences
  - `postLength`: Min/max character limits
  - `tone`: Professional tone settings
  - `maxHistoryLength`: History tracking limit

### Post Settings

```json
{
  "settings": {
    "maxHistoryLength": 50,
    "postLength": {
      "min": 1300,
      "max": 1500
    },
    "tone": "professional",
    "includeHashtags": true,
    "maxHashtags": 5
  }
}
```

## Security Considerations

- ⚠️ **Use a dedicated LinkedIn account** for automation
- 🔐 **Never commit sensitive credentials** to version control
- 🔒 **Enable 2FA** on your LinkedIn account
- 📝 **Review posts** before automation in production
- 🌍 **Comply with LinkedIn's Terms of Service**

## Dependencies

- **@google/generative-ai**: Gemini AI integration
- **puppeteer**: LinkedIn browser automation
- **dotenv**: Environment variable management

## API Keys Setup

### Google Gemini AI
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to GitHub secrets as `GEMINI_API_KEY`

### LinkedIn Account
1. Use a dedicated account for automation
2. Enable 2FA (manual intervention may be required)
3. Store credentials securely in GitHub secrets

## Troubleshooting

### Common Issues

1. **2FA Required**: Manual intervention needed for LinkedIn login
2. **API Rate Limits**: Gemini AI has usage limits
3. **LinkedIn Detection**: Account may be flagged for automation
4. **Missing Dependencies**: Run `npm install` again

### Logs and Debugging

- Check GitHub Actions logs for automation issues
- Review console output for local execution
- Monitor LinkedIn account for automation detection

## Development

### Adding New Features

1. Edit respective JavaScript files
2. Update `package.json` if adding dependencies
3. Test locally before pushing
4. Update this README if needed

### Testing

```bash
# Test post generation only
npm run generate

# Test LinkedIn login (will not post)
# Edit poster.js to skip actual posting for testing
```

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Disclaimer

This tool is for educational and personal use only. Users are responsible for complying with LinkedIn's Terms of Service and applicable laws. The developers are not liable for any misuse of this automation tool.