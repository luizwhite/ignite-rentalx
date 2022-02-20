# Ignite RentX
Car rental API made with Node.js and TypeScript during Ignite NodeJS

## 🚀 Techs & Tools
→ [**Docker**](https://docs.docker.com/)

→ [**Node.js**](https://nodejs.org)

→ [**TypeScript**](https://www.typescriptlang.org/)

→ [**Swagger UI**](https://swagger.io/tools/swagger-ui/)

→ [**Jest**](https://jestjs.io/docs/getting-started)

## 🔨 Features
→ **Car Registration**

→ **Car Update**

→ **Car Listing**

→ **Car Image Registration**

→ **Car Rental Registration**

→ **Car Category Registration**

→ **Car Spec Registration**

→ **Car Return**

→ **Car Rent History**

→ **Password Recovery**

## 🔌️ Requirement Analysis
### Car Registration
**RF**
- should be able to register a new car.
- should be able to list all the created car specs.
  
**RN**
- should not be able to register a car with an existent license place.
- should be able to register a car available by default.
- should not be able to register a new car in case the user is not an administrator.

### Car Update
**RF**
- should be able to update car information.
- should be able to include/exclude one or more car specs.
- should be able to list all the updated car specs.

**RN**
- should not be able to update a car with an unregistered car id.
- should not be able to include a new car spec when duplicate.
- should not be able to change a car's license plate.
- should not be able to register a new car spec in case the user is not an administrator.

### Car Listing
**RF**
- should be able to list all available cars.
- should be able to list all available cars by category.
- should be able to list all available cars by brand.
- should be able to list all available cars by name.

**RN**
- should be able to list cars even for an unlogged in user.

### Car Image Registration
**RF**
- should be able to register a new car image.
- *should be able to list all image cars.

**RNF**
- use multer to upload files.

**RN**
- should be able to register more than one image per car.
- should not be able to register a new car image in case the user is not an administrator.

### Car Rental Registration
**RF**
- should be able to register a new car rental.

**RN**
- should be able to change the car availability when it is rented.
- should not be able to register a new car rental to a user with an active car rental.
- should not be able to register a new car rental for an already rented car.
- should not be able to rent a car expecting to return it before 24 hours of rental.

### Car Category Registration
**RF**
- should be able to create a new category.

**RN**
- should not be able to create a new category with a name that already exists.
- should not be able to create a new category in case the user is not an administrator.

### Car Category Listing
**RF**
- should be able to list all categories.

### Car Specification Registration
**RF**
- should be able to create a new specification.

**RN**
- should not be able to create a new specification with a name that already exists.

### Car Return
**RF**
- should be able to make a car return.

**RN**
- should be able to charge daily rate if returned with less than 24 hours.
- should be able to release the car when it is returned.
- should be able to release a user when the user returns a car.
- should be able to calculate the total rental amount when a car is returned.
- should be able to charge an additional rent amount if the return is late, based on the time delayed.
- should be able to add rental penalties to the total rental amount.

### Car Rent History
**RF**
- should be able to list all user rents.

**RN**
- should not be able to list rents if the user is not logged in.

### Password Recovery
**RF**
- should be able to a user reset his/her password informing his/her e-mail.

**RNF**
- password recovery link expires in 3 hours

**RN**
- should be able to send an e-mail with password recovery instructions.
- should not be able to send a password recovery e-mail to a non-existing user.
- should be able to generate a forgotten password refresh token.
- should be able to reset user password with the new password informed.
- should not be able to use an expired recovery password e-mail link.


## 🔗 Useful Configuration Guides Links
→ [**AWS EC2 - Connect to your Linux instance using SSH**](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html)

→ [**AWS EC2 - Manage user accounts on your Amazon Linux instance**](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/managing-users.html)

→ [**PM2/NGINX - How To Set Up a Node.js Application for Production on Ubuntu 20.04**](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04)

## 💻 Local Setup
