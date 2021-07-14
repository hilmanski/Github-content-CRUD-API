require('dotenv').config()

const { Octokit } = require('@octokit/rest');

const fs = require('fs');
const github_access_token = process.env.github_access_token
const github_owner = process.env.github_owner
const github_repo = process.env.github_repo
const repo_dir = process.env.repo_dir
const admin_secret_code = process.env.admin_secret_code

const octokit = new Octokit({
  auth: github_access_token,
});

module.exports = async (req, res) => {
    if(req.method === 'GET') {
        //Single Content
        const file = req.query.file
        if(file !== undefined) {
            const rawContent = await getContent('/' + file)
            const content = readBase64(rawContent.content)
            
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
    let parsedBody = undefined
    if(req.body) {
        parsedBody = JSON.parse(req.body)
        if(verifySecretCode(parsedBody) == false)
            res.status(403).send({
                msg: 'secret code is not provided or wrong'
            })
    }

    //Temp solution for CORS
        //all become POST req, with _method=REALMETHOD as params
    if(req.method === 'POST') {
        let method = 'POST' 
        if (parsedBody._method !== undefined)
            method = parsedBody._method

        if(method === 'DELETE') {
            const data = await deleteContent(parsedBody)
            res.json(({
                body: data
            }))
        }

        const data = await postOrUpdateContent(parsedBody, method)
        res.json(({
            body: data
        }))
    }
}

const getContent = async(filename = '') => {
  let path = repo_dir + filename

  const {data} = await octokit.rest.repos.getContent({
    owner: github_owner, 
    repo: github_repo,
    path: path
  });

  return data
}

const postOrUpdateContent = async(body, method) => {
    const filename = body.filename
    const originalContent = body.content

    const content = writeBase64(originalContent)
    const path = repo_dir + '/' + filename

    let params = {
        owner: github_owner, 
        repo: github_repo,
        path: path,
        message: `new content ${filename}`,
        content: content
    }

    if(method == 'PUT') {
        params.sha = body.sha
        params.message = `update content ${filename}`
    }

    const {data, error} = await octokit.rest.repos.createOrUpdateFileContents(
                        params
                    )
    console.log(error)
    return data
}

const deleteContent = async(body, method) => {
    const filename = body.filename
    const path = repo_dir + '/' + filename

    const {data, error} = await octokit.rest.repos.deleteFile({
                        owner: github_owner, 
                        repo: github_repo,
                        path: path,
                        message: `delete content ${filename}`,
                        sha: body.sha
                    })

    console.log(error)
    return data
}

function verifySecretCode(parsedBody) {
  if(parsedBody.secret_code == undefined)
    return false

  if(admin_secret_code != parsedBody.secret_code)
    return false

  return true
}

function readBase64(str) {
    return Buffer.from(str, 'base64').toString()
}

function writeBase64(str) {
    return Buffer.from(str).toString('base64')
}