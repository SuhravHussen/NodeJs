#This is Raw node js project without any external library

I have done user crud operation , authentication , used file system as data base, taking input from user to check their given website up or down then sending notification via twilio.

### user creating api

```bash
http://localhost:3000/user
```

```sh
method : POST
userModel: {
    "firstName":"Name",
    "lastName":"Name",
    "phone":"01234567541" // must be 11 character,"password":"12345678",
    "tosAgreement":"true"
    }
```

### get user data api

```bash
http://localhost:3000/user?phone=01234567541
```

```sh
method : GET
// must give auth token in headers as token
```

### user updating api

```bash
http://localhost:3000/user
```

```sh
method : PUT
userModel: {
    "firstName":"Name",
    "lastName":"Name",
    "phone":"01234567541" //can not update mobile phone and must give it
    ,"password":"12345678",
    }
// must give auth token in headers as token
```

### user deleting api

```bash
http://localhost:3000/user?phone=01234567541
```

```sh
method : DELETE
// must give auth token in headers as token
```

### explore code to get more api , like token crud , check crud , twilio sms sending
