##Github Repo Content CRUD
Manipulate content of a repo  
Using [octokit package](https://octokit.github.io/)   
This Nodejs Syntax using [vercel's serverless function](https://vercel.com/docs/serverless-functions/introduction)


##Use Case
It's a headless CRUD for your content in a repository  

Use case: 
you want to manage your files through your custom "Admin" UI.
But setting up Auth(register/login) on a simple app for just one user (you as an admin) is just too much.
Using netlify or Vercel in this case, we can protect our site, with using .env params that only we know (like your password)

##API List
GET: http://localhost:3000/api/repo  

GET: http://localhost:3000/api/repo?file=your-file.md  

POST: http://localhost:3000/api/repo  
```
params: filename, content
```

PUT: http://localhost:3000/api/repo  
```
params: filename, content, sha(original file)
```

DELETE: http://localhost:3000/api/repo  
```
params: filename, sha(original file)
```

## Todo/Plan
- [X] CRUD API
- [ ] Validation