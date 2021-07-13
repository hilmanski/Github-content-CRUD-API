require('dotenv').config()

const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.ACCESS_TOKEN,
});

module.exports = (req, res) => {

  const repo = octokit.rest.repos.get({
    'hilmanski', 'demo-hugo'
  });
  console.log(repo)

  res.json({
    body: req.body,
    query: req.query,
    cookies: req.cookies,
  });
};