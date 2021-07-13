## Github Repo Content CRUD
CRUD API for a folder's content in a github repo  
Using [octokit package](https://octokit.github.io/)   
This Nodejs Syntax using [vercel's serverless function](https://vercel.com/docs/serverless-functions/introduction)


## Use Case
It's a headless CRUD for your content in a repository  

Use case:  
you want to manage your files through your custom "Admin" UI.
But setting up Auth(register/login) on a simple app for just one user (you as an admin) is just too much.  
By using netlify or Vercel in this case, we can protect our site, with using .env params that only we know (like your password) and have a CRUD API for our repo contents.

## Set Up
Copy pas .env.example to .env  
Host it on Vercel
For local server(run: vercel dev)

## API List
GET: http://localhost:3000/api/repo  

GET: http://localhost:3000/api/repo?file=your-file.md  

POST: http://localhost:3000/api/repo  
```
params: filename, content, secret_code
```

PUT: http://localhost:3000/api/repo  
```
params: filename, content, sha(original file), secret_code
```

DELETE: http://localhost:3000/api/repo  
```
params: filename, sha(original file), secret_code
```

## Todo/Plan
- [X] CRUD API
- [X] Password .env protected
- [ ] Validation