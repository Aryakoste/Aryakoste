const fs = require('fs');
const axios = require('axios');

const token = process.env.MY_GITHUB_TOKEN;
const username = 'Aryakoste'; 

async function fetchPRs() {
  const result = await axios.get(`https://api.github.com/search/issues?q=type:pr+author:${username}`, {
    headers: {
      Authorization: `token ${token}`
    }
  });
  return result.data.items;
}

async function updateReadme() {
  const prs = await fetchPRs();
  const prList = prs.map(pr => `- [${pr.title}](${pr.html_url})`).join('\n');

  const readmeContent = `# My PRs\n\n${prList}\n`;
  fs.writeFileSync('README.md', readmeContent);
}

updateReadme();
