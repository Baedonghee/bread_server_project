# 먹빵 서버!!

## 사용기술

- [nodejs](https://nodejs.org/ko/)
- [express](https://expressjs.com/ko/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [multer](https://github.com/expressjs/multer)
- [swagger](https://swagger.io/)
- [date-fns](https://date-fns.org/)
- [axios](https://github.com/axios/axios)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [mysql](https://github.com/mysqljs/mysql)
- [typescript](https://www.typescriptlang.org/)
- [typeorm](https://typeorm.io/)
- [validator](https://github.com/validatorjs/validator.js)

## Installation

[Node.js](https://nodejs.org/) v10 이상 가능합니다.

git clone 후 dependencies와 devDependencies를 설치하고 서버를 시작합니다.
```
cd bread_server
npm i
npm start
```
## Setting

### .env
DB_HOST=DB_HOST
DB_USER=DB_USER
DB_PASSWORD=DB_PASSWORD
JWT_ADMIN_KEY=JWT_ADMIN_KEY
JWT_USER_KEY=JWT_USER_KEY

env 파일을 루트 폴더에 생성합니다.

### src/config
- admin_private.key
- admin_public.key
- aws.json
- user_private.key
- user_public.key

## Swagger
- http://localhost:3000/api-admin-docs 어드민 swagger 주소
- http://localhost:3000/api-service-docs 서비스 swagger 주소
- ERD 링크(https://dbdiagram.io/d/5f7fdc5b3a78976d7b76f4cb)


## License

MIT
