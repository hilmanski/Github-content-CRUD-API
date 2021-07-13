require('dotenv').config()

const { Octokit } = require('@octokit/rest');

const fs = require('fs');
const ACCESS_TOKEN = process.env.ACCESS_TOKEN
const GITHUB_OWNER = process.env.GITHUB_OWNER
const GITHUB_REPO = process.env.GITHUB_REPO
const committer_author = process.env.Author
const committer_email = process.env.Email
const root_content = process.env.root_dir

const octokit = new Octokit({
  auth: ACCESS_TOKEN,
});

module.exports = async (req, res) => {

    if(req.method === 'GET') {
        //Single Content
        const file = req.query.file
        if(file !== undefined) {
            const rawContent = await getContent('/' + file)
            const content = Buffer.from(rawContent.content, 'base64').toString()
            res.json({
                body: content
            });
        }

        //All Content
        const files = await getContent()
        res.json({
            body: files
        });
    }

    //Admin Middleware
    let body = undefined
    if(req.body) {
        body = JSON.parse(req.body)
        if(verifySecretCode(body.secret_code) == false)
            res.status(403).send({
                msg: 'secret code not provided or wrong'
            })
    }

    if(req.method === 'POST' || req.method === 'PUT') {
        const data = await postOrUpdateContent(body, req.method)
        res.json(({
            body: data
        }))
    } 

    if(req.method === 'DELETE') {
        const data = await deleteContent(body)
        res.json(({
            body: data
        }))
    }
};

const getContent = async(filename = '') => {
  let path = root_content + filename

  const {data} = await octokit.rest.repos.getContent({
    owner: GITHUB_OWNER, 
    repo: GITHUB_REPO,
    path: path
  });

  return data
}

const postOrUpdateContent = async(body, method) => {
    const filename = body.filename
    const originalContent = body.content

    const content = Buffer.from(originalContent).toString('base64')
    const path = root_content + '/' + filename

    let params = {
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: path,
        message: `new content ${filename}`,
        content: content
    }

    if(method == 'PUT') {
        params.sha = body.sha
        params.message = `update content ${filename}`
    }

    const {data} = await octokit.rest.repos.createOrUpdateFileContents(
                        params
                    )

    return data
}

const deleteContent = async(body, method) => {
    const filename = body.filename
    const path = root_content + '/' + filename

    const {data} = await octokit.rest.repos.deleteFile({
                        owner: GITHUB_OWNER,
                        repo: GITHUB_REPO,
                        path: path,
                        message: `delete content ${filename}`,
                        sha: body.sha
                    })

    return data
}

function verifySecretCode(secret_code) {
  if(process.env.SECRET_CODE != secret_code)
    return false

  return true
}
