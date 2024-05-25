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
  const readmePath = 'README.md';
  const readmeContent = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf-8') : '';

  const startMarker = '<!-- START PRS -->';
  const endMarker = '<!-- END PRS -->';
  const regex = new RegExp(`${startMarker}[\\s\\S]*${endMarker}`, 'g');
  const cleanedReadmeContent = readmeContent.replace(regex, '');

  const prs = await fetchPRs();
  const prList = prs.map(pr => `- [${pr.title}](${pr.html_url})`).join('\n');

  const newContent = `${cleanedReadmeContent}\n\n${startMarker}\n## My Pull Requests\n\n${prList}\n${endMarker}\n`;

  fs.writeFileSync(readmePath, newContent);
}

updateReadme();
