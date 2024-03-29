## Github Repo Content CRUD
CRUD API for a folder's content in a github repo  
Think of it as your barebone headless CMS

Using [octokit package](https://octokit.github.io/)   
This Nodejs Syntax using [vercel's serverless function](https://vercel.com/docs/serverless-functions/introduction)


## Use Case
It's a headless CRUD API for your content in a repository  

Use case:  
You want to manage your files through your custom "Admin" UI.

But setting up Auth(register/login) on a simple app for just one user (you as an admin) is just too much.  

This code will protect sensitive route by using .env params that only we know (like your password). It's located in .env[admin_secret_code=]

## Set Up
Copy paste .env.example to .env  
Host it on Vercel (Since it's using vercel's function syntax, you can tweak it based on your serverless provider)
For local server(run: vercel dev)

## API List
//All content lists
GET: http://localhost:3000/api/repo  

//single content 
GET: http://localhost:3000/api/repo?file=your-file.md  

//New content  
POST: http://localhost:3000/api/repo  
```
params: filename, content, secret_code
```
  
//Update content  
PUT: http://localhost:3000/api/repo  
```
params: filename, content, sha(original file), secret_code
```

//Delete content
DELETE: http://localhost:3000/api/repo  
```
params: filename, sha(original file), secret_code
```

## Todo/Plan
- [X] CRUD API
- [X] Password .env protected
- [ ] Validation
